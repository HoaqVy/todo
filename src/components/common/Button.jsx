import { Link } from "react-router-dom";

function Button({
    href,
    children,
    icon: Icon,
    type = "button",
    disabled = false,
    loading = false,
    onClick,
    variant = "primary",
    size = "default",
    className = "",
}) {
    const isDisabled = disabled || loading;

    const variants = {
        primary:
            "bg-black text-white hover:bg-gray-800",

        secondary:
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100",

        danger:
            "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes = {
        default: "h-10 px-4",
        icon: "h-9 w-9 p-0",
    };

    const buttonClassName = `
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-lg
        text-sm
        font-medium
        transition
        duration-200
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
    `;

    const content = (
        <>
            {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
                Icon && <Icon size={18} />
            )}

            {children}
        </>
    );

    if (href) {
        return (
            <Link
                to={href}
                className={buttonClassName}
                aria-disabled={isDisabled}
                onClick={(event) => {
                    if (isDisabled) {
                        event.preventDefault();
                        return;
                    }

                    onClick?.(event);
                }}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type={type}
            disabled={isDisabled}
            onClick={onClick}
            className={buttonClassName}
        >
            {content}
        </button>
    );
}

export default Button;