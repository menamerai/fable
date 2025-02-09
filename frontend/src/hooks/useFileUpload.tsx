import { useMutation } from '@tanstack/react-query';

export function useFileUpload() {
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = (await response.json()) as {
        message: string;
        data: {
          id: string;
        };
      };

      // TODO loop until the file is ready
      const id = data.data.id;

      let completed = false;
      while (!completed) {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/selection/${id}`
        );
        const data = await response.json();
        if (data.error) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          continue;
        }
        completed = data.status === 'ready';
      }

      return id;
    },
  });

  return {
    upload: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    error: uploadMutation.error,
  };
}
