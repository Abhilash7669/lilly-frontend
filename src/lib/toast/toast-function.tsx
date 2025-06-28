import { toast } from "sonner";

export function successToast(title: string, description?: string): void {
  toast.success(title, {
    description: description,
    duration: 3400,
    style: {
      background: "var(--custom-success)",
      border: "1px var(--custom-success-border) solid",
      color: "var(--custom-toast-text)",
    },
  });
}

export function errorToast(title: string, description?: string): void {
  toast(title, {
    description: description,
    duration: 3400,
    style: {
      background: "var(--custom-error)",
      border: "1px var(--custom-error-border) solid",
      color: "var(--custom-toast-text)",
    },
  });
}
