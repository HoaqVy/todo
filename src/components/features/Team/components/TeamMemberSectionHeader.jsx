function TeamMemberSectionHeader({ selectedTeam }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">
                    {selectedTeam
                        ? `Team Members - ${selectedTeam.name}`
                        : "All Team Members"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    {selectedTeam
                        ? `Members of ${selectedTeam.name}`
                        : "Manage all team members"}
                </p>
            </div>
        </div>
    );
}

export default TeamMemberSectionHeader;