import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

const DialogContext = createContext(null);

export const DialogProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const closeDialog = useCallback(() => setDialogState(null), []);

  // Keyboard handling (Esc closes, Enter confirms when appropriate)
  useEffect(() => {
    if (!dialogState) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (dialogState.type === "alert") {
          dialogState.resolve?.();
          closeDialog();
        } else {
          dialogState.resolve?.(null);
          closeDialog();
        }
      }
      if (e.key === "Enter") {
        if (dialogState.type === "prompt") {
          dialogState.resolve?.(inputValue.trim());
          closeDialog();
        } else if (dialogState.type === "confirm") {
          dialogState.resolve?.(true);
          closeDialog();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dialogState, closeDialog, inputValue]);

  const showAlert = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      setDialogState({
        type: "alert",
        title: options.title ?? "Notice",
        message,
        confirmText: options.confirmText ?? "OK",
        resolve,
      });
    });
  }, []);

  const showPrompt = useCallback((options) => {
    const {
      title = "Input",
      label = "",
      placeholder = "",
      defaultValue = "",
      confirmText = "Save",
      cancelText = "Cancel",
    } = options ?? {};
    return new Promise((resolve) => {
      setInputValue(defaultValue);
      setDialogState({
        type: "prompt",
        title,
        label,
        placeholder,
        confirmText,
        cancelText,
        resolve,
      });
    });
  }, []);

  const showSelect = useCallback((options) => {
    const {
      title = "Select",
      label = "",
      items = [],
      confirmText = "Select",
      cancelText = "Cancel",
    } = options ?? {};
    return new Promise((resolve) => {
      setInputValue(""); // Will store selected value
      setDialogState({
        type: "select",
        title,
        label,
        items,
        confirmText,
        cancelText,
        resolve,
      });
    });
  }, []);

  const showConfirm = useCallback((message, options = {}) => {
    const {
      title = "Confirm",
      confirmText = "Confirm",
      cancelText = "Cancel",
    } = options;
    return new Promise((resolve) => {
      setDialogState({
        type: "confirm",
        title,
        message,
        confirmText,
        cancelText,
        resolve,
      });
    });
  }, []);

  const value = useMemo(
    () => ({
      alert: showAlert,
      prompt: showPrompt,
      select: showSelect,
      confirm: showConfirm,
    }),
    [showAlert, showPrompt, showSelect, showConfirm]
  );

  return (
    <DialogContext.Provider value={value}>
      {children}
      {/* Portal-like root at the end of body tree */}
      <AnimatePresence>
        {dialogState && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onMouseDown={(e) => {
              // Click outside to dismiss (alerts resolve; others cancel)
              if (e.currentTarget === e.target) {
                if (dialogState.type === "alert") {
                  dialogState.resolve?.();
                } else {
                  dialogState.resolve?.(null);
                }
                closeDialog();
              }
            }}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-full max-w-md rounded-2xl bg-white/20 backdrop-blur-2xl shadow-xl text-white"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="px-5 pt-5">
                <div className="text-lg font-semibold">{dialogState.title}</div>
                {dialogState.type !== "prompt" && dialogState.message ? (
                  <div className="mt-2 text-white/80 text-sm leading-relaxed">
                    {dialogState.message}
                  </div>
                ) : null}
                {dialogState.type === "prompt" ? (
                  <div className="mt-4">
                    {dialogState.label ? (
                      <label className="block mb-2 text-sm text-white/80">
                        {dialogState.label}
                      </label>
                    ) : null}
                    <input
                      autoFocus
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={dialogState.placeholder}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                  </div>
                ) : null}
                {dialogState.type === "select" ? (
                  <div className="mt-4">
                    {dialogState.label ? (
                      <label className="block mb-2 text-sm text-white/80">
                        {dialogState.label}
                      </label>
                    ) : null}
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {dialogState.items.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => setInputValue(item.value || item)}
                          className={`w-full px-3 py-2 rounded-lg text-left transition ${
                            inputValue === (item.value || item)
                              ? "bg-sky-400/60 border-sky-400/90 text-sky-100"
                              : "bg-white/10 border-white/15 text-white/90 hover:bg-white/15"
                          } border`}
                        >
                          {item.label || item}
                        </button>
                      ))}
                    </div>
                    {dialogState.items.length === 0 && (
                      <div className="text-white/60 text-sm py-4 text-center">
                        No items available
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
              <div className="px-5 py-4 flex items-center justify-end gap-2">
                {dialogState.type !== "alert" && (
                  <button
                    onClick={() => {
                      dialogState.resolve?.(null);
                      closeDialog();
                    }}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 transition"
                  >
                    {dialogState.cancelText ?? "Cancel"}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (dialogState.type === "prompt") {
                      dialogState.resolve?.(inputValue.trim());
                    } else if (dialogState.type === "select") {
                      dialogState.resolve?.(inputValue || null);
                    } else if (dialogState.type === "confirm") {
                      dialogState.resolve?.(true);
                    } else {
                      dialogState.resolve?.();
                    }
                    closeDialog();
                  }}
                  disabled={dialogState.type === "select" && !inputValue}
                  className={`px-4 py-2 rounded-lg border border-white/15 transition ${
                    dialogState.type === "select" && !inputValue
                      ? "bg-white/5 text-white/40 cursor-not-allowed"
                      : "bg-sky-400/60 hover:bg-sky-400/90 text-sky-100"
                  }`}
                >
                  {dialogState.confirmText ?? "OK"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within a DialogProvider");
  return ctx;
};
