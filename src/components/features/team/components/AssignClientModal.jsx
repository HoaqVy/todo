import { useState } from "react";
import { X, Users } from "lucide-react";

function AssignClientModal({ selectedTeam, clients, onClose, onAssign }) {
    const [selectedClientId, setSelectedClientId] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedClientId) return;

        await onAssign(selectedClientId);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Assign Client
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Assign a client to {selectedTeam.name}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Select Client
                    </label>

                    <select
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                        <option value="">Choose a client</option>

                        {clients.map((client) => (
                            <option key={client._id} value={client._id}>
                                {client.name} - {client.company || "No company"}
                            </option>
                        ))}
                    </select>

                    {clients.length === 0 && (
                        <p className="mt-2 text-sm text-gray-500">
                            No available clients to assign.
                        </p>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={!selectedClientId}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Users size={16} />
                            Assign
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AssignClientModal;