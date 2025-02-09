import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UploadingDialogProps {
  isUploading: boolean;
}

export function UploadingDialog({ isUploading }: UploadingDialogProps) {
  const [open, setOpen] = useState(isUploading);

  useEffect(() => {
    setOpen(isUploading);
  }, [isUploading]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='flex flex-col items-center justify-center gap-4 sm:max-w-[425px]'>
        <Loader2 className='h-8 w-8 animate-spin' />
        <p className='text-center text-sm text-muted-foreground'>
          Uploading your book...
        </p>
      </DialogContent>
    </Dialog>
  );
}
