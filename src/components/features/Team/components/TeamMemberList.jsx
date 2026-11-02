import TeamMemberCard from "../TeamMemberCard";

function TeamMemberList({
    loading,
    error,
    members,
    onEdit,
    onDelete,
    deletingMemberId,
}) {
    if (loading) {
        return (
            <p className="text-sm text-gray-500">
                Loading team members...
            </p>
        );
    }

    if (error) {
        return (
            <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
            >
                {error}
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-gray-300 px-4 py-12 text-center">
                <h2 className="text-lg font-semibold text-gray-900">
                    No members found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    Try another name, email or position.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {members.map((member) => (
                <TeamMemberCard
                    key={member.id}
                    member={member}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isDeleting={deletingMemberId === member.id}
                />
            ))}
        </div>
    );
}

export default TeamMemberList;