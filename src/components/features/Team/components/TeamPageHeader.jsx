import { UserPlus } from "lucide-react";

function TeamPageHeader({ onAddMember }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-black sm:text-4xl">
                    Team
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Manage your team members and their information.
                </p>
            </div>

            <button
                type="button"
                onClick={onAddMember}
                className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
                <UserPlus size={18} />
                Add Member
            </button>
        </div>
    );
}

export default TeamPageHeader;