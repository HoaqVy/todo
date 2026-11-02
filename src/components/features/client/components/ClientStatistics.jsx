
import { Users } from "lucide-react";

function ClientStatistics({
    totalClients,
    activeClients,
    inactiveClients
}) {
    const statistics = [
        {
            title: "Total Clients",
            value: totalClients,
            description: "All registered clients",
            iconColor: "bg-blue-50 text-blue-600"
        },
        {
            title: "Active Clients",
            value: activeClients,
            description: "Currently active",
            iconColor: "bg-green-50 text-green-600"
        },
        {
            title: "Inactive Clients",
            value: inactiveClients,
            description: "Currently inactive",
            iconColor: "bg-orange-50 text-orange-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {statistics.map((item) => (
                <div
                    key={item.title}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500">
                            {item.title}
                        </p>

                        <div className={`rounded-lg p-2 ${item.iconColor}`}>
                            <Users size={20} />
                        </div>
                    </div>

                    <p className="mt-3 text-2xl font-bold text-gray-900">
                        {item.value}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        {item.description}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default ClientStatistics;
