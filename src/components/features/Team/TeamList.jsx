
import { useEffect, useState } from "react";
import { getTeams, createTeam, updateTeam, deleteTeam } from "@/api/teamApi";
import AddTeamModal from "./AddTeamModal";
import { Plus, Pencil, Trash2 } from "lucide-react";

function TeamList() {
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

                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                    <Plus size={18} />
                    Add Team
                </button>
            </div>

            {teams.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {teams.map((team) => (
                        <div
                            key={team._id}
                            className="rounded-xl border border-gray-200 bg-white p-5"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">
                                    {team.name}
                                </h3>

                                <button
                                    type="button"
                                    onClick={() => handleEditTeam(team)}
                                    className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                                    title="Edit Team"
                                >
                                    <Pencil size={16} />
                                </button>
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
