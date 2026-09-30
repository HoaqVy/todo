import { FaRegUserCircle } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";

const report = [
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

function Report({ onClose }) {
    return (
        <>
            {/* TASKS */}
            <div className="mt-8 border-t border-gray-200 pt-6">
                <h2 className="mb-6 text-sm font-bold tracking-wider text-gray-500 uppercase">
                    Report
                </h2>
                <div className="space-y-2">
                    {report.map((report) => (
                        <NavLink
                            key={report.path}
                            to={report.path}
                            onClose={onClose}
                            className={({ isActive }) =>
                                `flex items-center justify-between rounded-lg px-4 py-3 ${isActive ? "bg-gray-200 text-black" : "hover:bg-gray-200"
                                }`
                            }
                        >
                            <div className="flex items-center gap-3">
                                <report.icon size={20} />
                                <span className="font-medium">{report.title}</span>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    );
}
export default Report;
