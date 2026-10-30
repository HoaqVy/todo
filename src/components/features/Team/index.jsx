
import { useEffect, useMemo, useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";
import AddMemberModal from "./AddMemberModal";
import {
    getTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
} from "@/api/teamMemberApi"
import TeamMemberCard from "./TeamMemberCard";
import TeamList from "./TeamList";


function TeamFeature() {

    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All")
    const [editingMember, setEditingMember] = useState(null);
    const [deletingMemberId, setDeletingMemberId] = useState(null)
    const [successMessage, setSuccessMessage] = useState("")

    const filteredMembers = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return members.filter((member) => {
            const matchesSearch =
                [
                    member.name,
                    member.email,
                    member.position,
                    member.role,
                    member.status ?? "Active"
                ].some((value) =>
                    value.toLowerCase().includes(keyword)
                )

            const status = member.status ?? "Active"

            const matchesStatus = statusFilter === "All" || status === statusFilter
            return matchesSearch && matchesStatus
        }

        );
    }, [members, search, statusFilter]);

    const activeMembers = members.filter(
        (member) => (member.status ?? "Active") === "Active"
    ).length;

    const inactiveMembers = members.filter(
        (member) => (member.status ?? "Active") === "Inactive"
    ).length;

    const handleAddMember = async (memberData) => {
        try {
            setError("");
            setSuccessMessage("");

            const createdMember = await createTeamMember(memberData);

            setMembers((prevMembers) => [
                { ...createdMember, id: createdMember._id },
                ...prevMembers,
            ]);

            setSuccessMessage("Team member added successfully!");
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };


    const handleEditMember = (member) => {
        setEditingMember(member);
    };

    const handleResetFilters = () => {
        setSearch("")
        setStatusFilter("All")
    }

    const handleDeleteMember = async (memberId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this member?"
        );

        if (!confirmed) return;

        try {
            setDeletingMemberId(memberId)
            setError("")
            await deleteTeamMember(memberId);

            setMembers((prevMembers) =>
                prevMembers.filter((member) => member.id !== memberId)
            );
            setSuccessMessage("Team member deleted successfully!")
        } catch (err) {
            setError(err.message);
        } finally {
            setDeletingMemberId(null)
        }
    };

    const handleUpdateMember = async (memberId, updatedData) => {
        try {
            setError("");
            setSuccessMessage("");

            const updatedMember = await updateTeamMember(
                memberId,
                updatedData
            );

            setMembers((prevMembers) =>
                prevMembers.map((member) =>
                    member.id === memberId
                        ? { ...updatedMember, id: updatedMember._id }
                        : member
                )
            );

            setSuccessMessage("Team member updated successfully!");
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getTeamMembers();
                console.log("Team members from API:", data);

                setMembers(
                    data.map((member) => ({
                        ...member,
                        id: member._id,
                    }))
                );
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    useEffect(() => {
        if (!successMessage) return;

        const timer = setTimeout(() => {
            setSuccessMessage("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMessage]);

    return (
        <div className="space-y-6">
            {/* Header */}
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
                    onClick={() => {
                        setIsModalOpen(true)
                        setEditingMember(null)
                    }
                    }
                    className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                    <UserPlus size={18} />
                    Add Member
                </button>
            </div>

            <TeamList />

            {successMessage && (
                <div role="status"
                    className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">
                    {successMessage}
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gray-100 p-3">
                            <Users size={22} className="text-gray-700" />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Members
                            </p>

                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                {members.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <p className="text-sm text-gray-500">Active Members</p>
                    <p className="mt-2 text-2xl font-bold text-green-600">
                        {activeMembers}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <p className="text-sm text-gray-500">Inactive Members</p>
                    <p className="mt-2 text-2xl font-bold text-gray-500">
                        {inactiveMembers}
                    </p>
                </div>
            </div>
            {/* Search and Status Filter */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative max-w-md flex-1">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search name, email or position..."
                        aria-label="Search team members"
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-gray-500"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label="Filter members by status"
                    className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500"
                >
                    <option value="All">All statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
                <button
                    type="button"
                    onClick={handleResetFilters}
                    disabled={!search && statusFilter === "All"}
                    className="h-11 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Clear Filters
                </button>
            </div>

            {loading && (
                <p className="text-sm text-gray-500">
                    Loading team members...
                </p>
            )}

            {error && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
                >
                    {error}
                </div>
            )}

            {/* Member list */}
            {!loading &&
                (filteredMembers.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filteredMembers.map((member) => (
                            <TeamMemberCard
                                key={member.id}
                                member={member}
                                onEdit={handleEditMember}
                                onDelete={handleDeleteMember}
                                isDeleting={deletingMemberId === member.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 px-4 py-12 text-center">
                        <h2 className="text-lg font-semibold text-gray-900">
                            No members found
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Try another name, email or position.
                        </p>
                    </div>
                ))}
            {(isModalOpen || editingMember) && (
                <AddMemberModal
                    member={editingMember}
                    onClose={() => {
                        setIsModalOpen(false)
                        setEditingMember(null)
                    }}
                    onAdd={handleAddMember}
                    onUpdate={handleUpdateMember}
                />
            )}
        </div>
    );
}

export default TeamFeature;
