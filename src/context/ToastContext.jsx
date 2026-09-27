import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import { CheckCircle2, X, XCircle } from "lucide-react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = "success") => {
        setToast({
            id: Date.now(),
            message,
            type,
        });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    // Auto hide after 3 seconds
    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(() => {
            setToast(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [toast]);

    return (
        <ToastContext.Provider
            value={{
                showToast,
                hideToast,
            }}
        >
            {children}

            {toast && (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
        </ToastContext.Provider>
    );
}

function Toast({ message, type, onClose }) {
    const isSuccess = type === "success";

    return (
        <div className="fixed right-6 top-6 z-50">
            <div
                className={`
                    flex
                    min-w-80
                    items-center
                    gap-3
                    rounded-xl
                    border
                    bg-white
                    px-4
                    py-3
                    shadow-lg
                    transition-all
                    duration-300
                    ${isSuccess
                        ? "border-emerald-200"
                        : "border-red-200"
                    }
                `}
            >
                {/* Icon */}
                {isSuccess ? (
                    <CheckCircle2
                        size={20}
                        className="shrink-0 text-emerald-500"
                    />
                ) : (
                    <XCircle
                        size={20}
                        className="shrink-0 text-red-500"
                    />
                )}

                {/* Message */}
                <div className="flex-1">
                    <p
                        className={`text-sm font-medium ${isSuccess
                                ? "text-emerald-700"
                                : "text-red-700"
                            }`}
                    >
                        {message}
                    </p>
                </div>

                {/* Close */}
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 transition hover:text-gray-700"
                    aria-label="Close notification"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}

export function useToast() {
    return useContext(ToastContext);
}