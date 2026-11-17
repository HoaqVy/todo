import { FaRegUserCircle } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const management = [
    {
        title: "Team",
        path: "/team",
        icon: RiTeamFill,
    },
    {
        title: "Client",
        path: "/client",
        icon: FaRegUserCircle,
    },
];

function Management({ onClose }) {
    const { user } = useAuth()
    return (
        <>
            {/* TASKS */}
            <div className="mt-8 border-t border-gray-200 pt-6">
                <h2 className="mb-6 text-sm font-bold tracking-wider text-gray-500 uppercase">
                    Management
                </h2>
                <div className="space-y-2">
                    {user?.role === "Admin" && management.map((management) => (
                        <NavLink
                            key={management.path}
                            to={management.path}
                            onClose={onClose}
                            className={({ isActive }) =>
                                `flex items-center justify-between rounded-lg px-4 py-3 ${isActive ? "bg-gray-200 text-black" : "hover:bg-gray-200"
                                }`
                            }
                        >
                            <div className="flex items-center gap-3">
                                <management.icon size={20} />
                                <span className="font-medium">{management.title}</span>
                            </div>
                        </NavLink>

                    ))}
                </div>
            </div>
        </>
    );
}
export default Management;
