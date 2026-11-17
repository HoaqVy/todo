
import { Plus, Users } from "lucide-react";

function ClientEmptyState({ hasClients, onAddClient }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Users size={26} className="text-gray-400" />
            </div>

            <h3 className="text-base font-semibold text-gray-900">
                No clients found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
                {hasClients
                    ? "Try changing your search keyword or status filter."
                    : "You haven't added any clients yet. Start by adding your first client."}
            </p>

            {!hasClients && (
                <button
                    type="button"
                    onClick={onAddClient}
                    className="mt-5 flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                    <Plus size={16} />
                    Add Your First Client
                </button>
            )}
        </div>
    );
}

export default ClientEmptyState;
