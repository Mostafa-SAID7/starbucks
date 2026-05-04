import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "@/hooks";

export const Toaster = () => {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      theme={theme as "light" | "dark"}
      className="toast-glass"
      toastOptions={{
        classNames: {
          toast: "toast-glass",
          title: "text-gray-900 dark:text-white font-bold",
          description: "text-gray-600 dark:text-gray-400",
          actionButton: "bg-starbucks-green text-white hover:bg-starbucks-dark",
          cancelButton:
            "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700",
        },
        style: {
          background:
            theme === "dark"
              ? "rgba(15, 20, 25, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
          border:
            theme === "dark"
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(0, 0, 0, 0.1)",
          borderBottom: "none",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        },
        unstyled: false,
        duration: 3000,
      }}
      closeButton
      richColors
      visibleToasts={5}
      position="top-center"
    />
  );
};
