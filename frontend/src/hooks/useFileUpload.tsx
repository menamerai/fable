import { useMutation } from '@tanstack/react-query';

export function useFileUpload() {
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
        const formData = new FormData();
        formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json() as {
        message: string;
        data: {
          id: string;
        };
      };

      // TODO loop until the file is ready
      const id = data.data.id;
      return id;

    },
  });

  return {
    upload: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    error: uploadMutation.error,
  };
}
