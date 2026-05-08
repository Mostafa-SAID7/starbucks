import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Button, Input } from "@/components/ui";
import { useAuth } from "@/hooks/auth/useAuth";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t, i18n } = useTranslation();
  const { login, register, isLoading, error, clearError } = useAuth();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = lang === "ar";

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
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        if (mode === "login") {
          await login({
            email: formData.email,
            password: formData.password,
          });
          toast.success(t("auth:login_success"));
        } else {
          await register({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
          });
          toast.success(t("auth:register_success"));
        }
        onClose();
      } catch (error) {
        // Error is handled by the auth store and displayed via error state
        toast.error(
          mode === "login" 
            ? t("auth:login_error") 
            : t("auth:register_error")
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

        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder={t("common:auth.login_email")}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="h-14 rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:bg-white transition-all px-6"
                />
                <Input
                  type="password"
                  placeholder={t("common:auth.login_password")}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                  className="h-14 rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:bg-white transition-all px-6"
                />
              </div>

              <div className="flex items-center justify-between px-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="hidden peer"
                    checked={formData.remember}
                    onChange={(e) =>
                      handleInputChange("remember", e.target.checked)
                    }
                  />
                  <div className="h-5 w-5 rounded border-2 border-gray-200 peer-checked:border-starbucks-green peer-checked:bg-starbucks-green flex items-center justify-center transition-all">
                    <svg
                      className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-starbucks-dark dark:group-hover:text-white transition-colors">
                    {t("common:auth.login_remember")}
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm font-bold text-starbucks-green hover:underline decoration-2 underline-offset-4"
                >
                  {t("common:auth.login_forgot")}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-full text-lg font-black uppercase tracking-widest shadow-xl shadow-starbucks-green/20 hover:scale-[1.02] transition-all"
                loading={loading}
              >
                {t("common:auth.login_submit")}
              </Button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                {t("common:auth.login_no_account")}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-black text-starbucks-green hover:underline decoration-2 underline-offset-4"
                >
                  {t("common:auth.login_register")}
                </button>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder={t("common:auth.register_first_name")}
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  required
                  className="h-14 rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:bg-white transition-all px-6"
                />
                <Input
                  placeholder={t("common:auth.register_last_name")}
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  required
                  className="h-14 rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:bg-white transition-all px-6"
                />
              </div>
              <div className="relative">
                <Input
                  type="email"
                  placeholder={t("common:auth.register_email")}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="h-14 rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:bg-white transition-all px-6"
                />
              </div>
              <div className="relative">
                <Input
                  type="password"
                  placeholder={t("common:auth.register_password")}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                  className="h-14 rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:bg-white transition-all px-6"
                />
              </div>

              <div className="px-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="hidden peer"
                    checked={formData.terms}
                    onChange={(e) =>
                      handleInputChange("terms", e.target.checked)
                    }
                    required
                  />
                  <div className="mt-0.5 h-5 w-5 rounded border-2 border-gray-200 peer-checked:border-starbucks-green peer-checked:bg-starbucks-green flex items-center justify-center transition-all flex-shrink-0">
                    <svg
                      className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-starbucks-dark dark:group-hover:text-white transition-colors leading-relaxed">
                    {t("common:auth.register_terms")}
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-full text-lg font-black uppercase tracking-widest shadow-xl shadow-starbucks-green/20 hover:scale-[1.02] transition-all"
                loading={loading}
              >
                {t("common:auth.register_submit")}
              </Button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                {t("common:auth.register_have_account")}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-black text-starbucks-green hover:underline decoration-2 underline-offset-4"
                >
                  {t("common:auth.register_login")}
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
