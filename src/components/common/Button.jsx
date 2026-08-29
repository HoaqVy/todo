
import { Link } from "react-router-dom"

function Button({ href = "", children = "", icon: Icon }) {
    return (
        <Link to={href}>
            <button className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white">
                {children}
                {Icon && <Icon size={18} />}
            </button>
        </Link>
    )
}

export default Button
