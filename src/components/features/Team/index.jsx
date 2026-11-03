
import { useEffect, useMemo, useState } from "react";
import AddMemberModal from "./AddMemberModal";
import {
    getTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
} from "@/api/teamMemberApi"
import TeamList from "./TeamList";
import { getClients } from "@/api/clientApi";
import AssignedClients from "./components/AssignedClients";
import TeamStatistics from "./components/TeamStatistics";
import TeamMemberFilters from "./components/TeamMemberFilters";
import TeamMemberList from "./components/TeamMemberList";
import TeamPageHeader from "./components/TeamPageHeader";
import TeamMemberSectionHeader from "./components/TeamMemberSectionHeader";
import AssignClientModal from "./components/AssignClientModal";

function TeamFeature() {

    const [members, setMembers] = useState([])
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedTeam, setSelectedTeam] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All")
    const [editingMember, setEditingMember] = useState(null);
    const [deletingMemberId, setDeletingMemberId] = useState(null)
    const [successMessage, setSuccessMessage] = useState("")

    const [isAssignClientOpen, setIsAssignClientOpen] = useState(false);

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
                );

            const status = member.status ?? "Active";

            const matchesStatus =
                statusFilter === "All" || status === statusFilter;

            const memberTeamId =
                typeof member.teamId === "object"
                    ? member.teamId?._id
                    : member.teamId;

            const matchesTeam =
                !selectedTeam ||
                String(memberTeamId) === String(selectedTeam._id);

            return matchesSearch && matchesStatus && matchesTeam;
        });
    }, [members, search, statusFilter, selectedTeam]);

    const assignedClients = useMemo(() => {
        if (!selectedTeam) {
            return [];
        }

        return clients.filter((client) => {
            const clientTeamId =
                typeof client.teamId === "object"
                    ? client.teamId?._id
                    : client.teamId;

            return String(clientTeamId) === String(selectedTeam._id);
        });
    }, [clients, selectedTeam]);
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

            // Bước 1: Tạo Member mới
            await createTeamMember(memberData);

            // Bước 2: Lấy lại danh sách Member từ Backend
            const data = await getTeamMembers();

            // Bước 3: Cập nhật danh sách trên giao diện
            setMembers(
                data.map((member) => ({
                    ...member,
                    id: member._id
                }))
            );

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
            setSuccessMessage("")

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

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await getClients()
                setClients(data)
            } catch (err) {
                console.error("Failed to fetch clients:", err);

            }
        }
        fetchClients()
    }, [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <TeamPageHeader
                onAddMember={() => {
                    setIsModalOpen(true)
                    setEditingMember(null)
                }}
            />

            <TeamList
                selectedTeam={selectedTeam}
                onSelectTeam={setSelectedTeam}
            />

            <TeamMemberSectionHeader selectedTeam={selectedTeam} />

            {successMessage && (
                <div role="status"
                    className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">
                    {successMessage}
                </div>
            )}

            {/* Statistics */}
            <TeamStatistics
                totalMembers={members.length}
                activeMembers={activeMembers}
                inactiveMembers={inactiveMembers}
            />
            {/* Search and Status Filter */}
            <TeamMemberFilters
                search={search}
                setSearch={setSearch}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onReset={handleResetFilters}
            />

            <TeamMemberList
                loading={loading}
                error={error}
                members={filteredMembers}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
                deletingMemberId={deletingMemberId}
            />
            {/* Assigned Clients */}
            <AssignedClients
                selectedTeam={selectedTeam}
                clients={assignedClients}
                onAssignClient={() => setIsAssignClientOpen(true)}
            />

            {(isModalOpen || editingMember) && (
                <AddMemberModal
                    member={editingMember}
                    selectedTeam={selectedTeam}
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
