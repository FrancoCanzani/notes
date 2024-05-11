import { toast } from 'sonner';

export const copyToClipboard = async (value: string) => {
  try {
    if (!navigator.clipboard) {
      throw new Error("Browser doesnt't have support for native clipboard");
    }

    await navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard');
  } catch (error) {
    toast.error('Error copying to clipboard');
  }
};
