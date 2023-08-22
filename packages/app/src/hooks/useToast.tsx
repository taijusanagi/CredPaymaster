import { useState, useCallback } from "react";

type ToastOptions = {
  message: string;
  duration: number;
};

export function useToast() {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options);

    if (options.duration) {
      setTimeout(() => {
        setToast(null);
      }, options.duration);
    }
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}
