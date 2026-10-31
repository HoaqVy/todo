
import { useEffect, useState } from "react";
import { getTeams, createTeam, updateTeam, deleteTeam } from "@/api/teamApi";
import AddTeamModal from "./AddTeamModal";
import { Plus, Pencil, Trash2 } from "lucide-react";

function TeamList({ selectedTeam, onSelectTeam }) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null)


    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getTeams();
                setTeams(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    const handleAddTeam = async (teamData) => {
        const createdTeam = await createTeam(teamData)

        setTeams((prev) => [createdTeam, ...prev])
    }

    const handleEditTeam = (team) => {
        setEditingTeam(team)
        setIsModalOpen(true)
    }

    const handleUpdateTeam = async (id, teamData) => {
        const updatedTeam = await updateTeam(id, teamData)

        setTeams((prev) =>
            prev.map((team) =>
                team._id === id ? updatedTeam : team
            )
        )
    }

    const handleDeleteTeam = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this team ?"
        )

        if (!confirmed) return

        await deleteTeam(id)

        setTeams((prev) =>
            prev.filter((team) => team._id !== id))
    }

    if (loading) {
        return <p className="text-sm text-gray-500">Loading teams...</p>;
    }

    if (error) {
        return (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
            </p>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                    Teams Member
                </h2>

                <div className="flex items-center gap-2">
                    {/* All Teams */}
                    <button
                        type="button"
                        onClick={() => onSelectTeam(null)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${!selectedTeam
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        All Teams
                    </button>

                    {/* Add Team */}
                    <button
                        type="button"
                        onClick={() => {
                            setEditingTeam(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        <Plus size={18} />
                        Add Team
                    </button>
                </div>
            </div>

            {teams.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {teams.map((team) => (
                        <div
                            key={team._id}
                            onClick={() => onSelectTeam(team)}
                            className={`cursor-pointer rounded-xl border p-5 transition ${selectedTeam?._id === team._id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-blue-300"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">
                                    {team.name}
                                </h3>

                                <div className="flex items-center gap-1">
                                    {/* Edit */}
                                    <button
                                        type="button"
                                        onClick={() => handleEditTeam(team)}
                                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                                        title="Edit Team"
                                    >
                                        <Pencil size={16} />
                                    </button>

                                    {/* Delete */}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteTeam(team._id)}
                                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                        title="Delete Team"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <p className="mt-2 text-sm text-gray-500">
                                {team.description || "No description"}
                            </p>

                            <span className="mt-4 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                {team.status}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">
                    No teams found.
                </p>
            )}

            {isModalOpen && (
                <AddTeamModal
                    onClose={() => {
                        setIsModalOpen(false)
                        setEditingTeam(null)
                    }}
                    onAdd={handleAddTeam}
                    onUpdate={handleUpdateTeam}
                    team={editingTeam}

                />
            )}
        </div>
    );
}

export default TeamList;
