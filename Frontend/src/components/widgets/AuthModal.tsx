import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Button, Input } from "@/components/ui";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLanguage } from "@/hooks";
import { toast } from "sonner";
import { AuthModalProps } from "@/types/components";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const { login, register, isLoading, error, clearError } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    remember: false,
    terms: false,
  });

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      remember: false,
      terms: false,
    });
    clearError();
  }, [clearError]);

  const handleInputChange = useCallback(
    (field: string, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (error) clearError();
    },
    [error, clearError],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      try {
        if (mode === "login") {
          await login({
            email: formData.email,
            password: formData.password,
          });
          toast.success(t("common:auth.login_success"));
        } else {
          await register({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
          });
          toast.success(t("common:auth.register_success"));
        }
        onClose();
      } catch {
        // Error is handled by the auth store and displayed via error state
        toast.error(
          mode === "login" 
            ? t("common:auth.login_error") 
            : t("common:auth.register_error")
        );
      }
    },
    [mode, formData, login, register, onClose, t],
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-xl"
      title={
        mode === "login"
          ? t("common:auth.login_title")
          : t("common:auth.register_title")
      }
    >
      <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
        {/* Mode Toggle Tabs */}
        <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-2xl mb-10 relative">
          <motion.div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-zinc-700 rounded-xl shadow-sm"
            initial={false}
            animate={{
              x: mode === "login" ? "0%" : isRTL ? "-100%" : "100%",
            }}
            style={{ [isRTL ? "right" : "left"]: "4px" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setMode("login")}
            className={`relative z-10 flex-1 py-3 text-sm font-black uppercase tracking-widest transition-colors ${
              mode === "login" ? "text-starbucks-green" : "text-gray-500"
            }`}
          >
            {t("common:auth.login_title")}
          </button>
          <button
            onClick={() => setMode("register")}
            className={`relative z-10 flex-1 py-3 text-sm font-black uppercase tracking-widest transition-colors ${
              mode === "register" ? "text-starbucks-green" : "text-gray-500"
            }`}
          >
            {t("common:auth.register_title")}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <Input
                  type="email"
                  placeholder={t("common:auth.login_email")}
                  value={formData.email}
                  onChange={(e) =>
                    handleInputChange("email", e.target.value)
                  }
                  required
                  disabled={isLoading}
                />
                <Input
                  type="password"
                  placeholder={t("common:auth.login_password")}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                  disabled={isLoading}
                />
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      checked={formData.remember}
                      onChange={(e) =>
                        handleInputChange("remember", e.target.checked)
                      }
                      className="rounded border-gray-300 text-starbucks-green focus:ring-starbucks-green"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("common:auth.login_remember")}
                    </span>
                  </label>
                  
                  <button
                    type="button"
                    className="text-sm text-starbucks-green hover:underline"
                    disabled={isLoading}
                  >
                    {t("common:auth.login_forgot")}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder={t("common:auth.register_first_name")}
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                    disabled={isLoading}
                  />
                  <Input
                    type="text"
                    placeholder={t("common:auth.register_last_name")}
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <Input
                  type="email"
                  placeholder={t("common:auth.register_email")}
                  value={formData.email}
                  onChange={(e) =>
                    handleInputChange("email", e.target.value)
                  }
                  required
                  disabled={isLoading}
                />
                
                <Input
                  type="password"
                  placeholder={t("common:auth.register_password")}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                  disabled={isLoading}
                />
                
                <label className="flex items-start space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={formData.terms}
                    onChange={(e) =>
                      handleInputChange("terms", e.target.checked)
                    }
                    className="mt-1 rounded border-gray-300 text-starbucks-green focus:ring-starbucks-green"
                    required
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("common:auth.register_terms")}
                  </span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || (mode === "register" && !formData.terms)}
          >
            {isLoading
              ? t("common:loading")
              : mode === "login"
              ? t("common:auth.login_submit")
              : t("common:auth.register_submit")}
          </Button>

          {/* Mode Switch */}
          <div className="text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {mode === "login"
                ? t("common:auth.login_no_account")
                : t("common:auth.register_have_account")}
            </span>{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-starbucks-green hover:underline font-medium"
              disabled={isLoading}
            >
              {mode === "login"
                ? t("common:auth.register_title")
                : t("common:auth.login_title")}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
