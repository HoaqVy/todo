
import { Mail, Pencil, Phone, Trash2, Users } from "lucide-react";

function ClientCard({ client, onEdit, onDelete }) {
    return (
        <div className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">

            {/* CARD HEADER */}
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

            {/* CLIENT INFORMATION */}
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail size={16} className="shrink-0 text-gray-400" />
                    <span className="truncate">{client.email}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone size={16} className="shrink-0 text-gray-400" />
                    <span>{client.phone || "No phone"}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Users size={16} className="shrink-0 text-gray-400" />
                    <span className="truncate">
                        {client.teamId?.name || "No Team"}
                    </span>
                </div>
            </div>

            <div className="my-4 border-t border-gray-100" />

            {/* ACTIONS */}
            <div className="flex items-center justify-end gap-2">
                <button
                    type="button"
                    onClick={() => onEdit(client)}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                    <Pencil size={15} />
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(client._id)}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                    <Trash2 size={15} />
                    Delete
                </button>
            </div>
        </div>
    );
}

export default ClientCard;
