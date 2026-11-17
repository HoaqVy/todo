
import { Plus } from "lucide-react";

function ClientPageHeader({ onAddClient }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Clients
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Manage your clients and their team assignments.
                </p>
            </div>

            <button
                type="button"
                onClick={onAddClient}
                className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
                <Plus size={18} />
                Add Client
            </button>
        </div>
    );
}

export default ClientPageHeader;
