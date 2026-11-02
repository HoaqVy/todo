
import { ListChecks } from "lucide-react";
import { NavLink } from "react-router-dom";

const workspaceItems = [
    {
        title: "My Tasks",
        path: "/my-tasks",
        icon: ListChecks,
    },
];

function Workspace({ onClose }) {
    return (
        <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="mb-6 text-sm font-bold tracking-wider text-gray-500 uppercase">
                Workspace
            </h2>

            <div className="space-y-2">
                {workspaceItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center rounded-lg px-4 py-3 transition ${isActive
                                ? "bg-gray-200 text-black"
                                : "text-gray-600 hover:bg-gray-200 hover:text-black"
                            }`
                        }
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={20} />
                            <span className="font-medium">
                                {item.title}
                            </span>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

export default Workspace;
