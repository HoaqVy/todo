
import { Mail, Phone, UserPlus, Users } from "lucide-react";

function AssignedClients({ selectedTeam, clients, onAssignClient }) {
    if (!selectedTeam) return null;

    return (
        <div className="space-y-4">
            {/* Header */}
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Assigned Clients
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Clients assigned to {selectedTeam.name}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onAssignClient}
                    className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    <UserPlus size={16} />
                    Assign Client
                </button>
            </div>

            <p className="text-sm text-gray-500">
                Total Assigned Clients: {clients.length}
            </p>

            {/* Empty State */}
            {clients.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
                    <Users size={28} className="mx-auto text-gray-400" />

                    <h3 className="mt-3 font-semibold text-gray-900">
                        No clients assigned
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        This team doesn't have any clients yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {clients.map((client) => (
                        <div
                            key={client._id}
                            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            {/* Client Header */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
                                        {client.name?.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate font-semibold text-gray-900">
                                            {client.name}
                                        </h3>

                                        <p className="mt-1 truncate text-sm text-gray-500">
                                            {client.company || "No company"}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${client.status === "Inactive"
                                        ? "bg-gray-100 text-gray-600"
                                        : "bg-green-50 text-green-700"
                                        }`}
                                >
                                    {client.status ?? "Active"}
                                </span>
                            </div>

                            <div className="my-4 border-t border-gray-100" />

                            {/* Client Information */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail size={16} className="shrink-0 text-gray-400" />
                                    <span className="truncate">
                                        {client.email}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone size={16} className="shrink-0 text-gray-400" />
                                    <span>
                                        {client.phone || "No phone"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Users size={16} className="shrink-0 text-gray-400" />
                                    <span className="truncate">
                                        {client.teamId?.name || "No Team"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AssignedClients;
