import { NavLink } from "react-router-dom";
import { ListChecks } from "lucide-react";

const workspaceItems = [
    {
        title: "My Tasks",
        path: "/my-tasks",
        icon: ListChecks,
    },
];

function Workspace({ onClose }) {
    return (
        <div className="mb-6">
            <h2 className="mb-4 px-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Workspace
            </h2>

            <nav className="space-y-2">
                {workspaceItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition
                                ${isActive
                                    ? "bg-gray-200 font-medium text-black"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span>{item.title}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
}

export default Workspace;