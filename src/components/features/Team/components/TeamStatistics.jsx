import { Users, UserCheck, UserX } from "lucide-react";

function TeamStatistics({
    totalMembers,
    activeMembers,
    inactiveMembers,
}) {
    const statistics = [
        {
            title: "Total Members",
            value: totalMembers,
            icon: Users,
            iconStyle: "bg-blue-50 text-blue-600",
        },
        {
            title: "Active Members",
            value: activeMembers,
            icon: UserCheck,
            iconStyle: "bg-green-50 text-green-600",
        },
        {
            title: "Inactive Members",
            value: inactiveMembers,
            icon: UserX,
            iconStyle: "bg-gray-100 text-gray-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {statistics.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.title}
                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500">
                                {item.title}
                            </p>

                            <div className={`rounded-lg p-2 ${item.iconStyle}`}>
                                <Icon size={20} />
                            </div>
                        </div>

                        <p className="mt-3 text-2xl font-bold text-gray-900">
                            {item.value}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default TeamStatistics;