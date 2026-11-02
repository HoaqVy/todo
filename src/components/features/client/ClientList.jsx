import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import AddClientModal from "./AddClientModal";
import {
    getClients,
    createClient,
    deleteClient,
    updateClient
} from "@/api/clientApi";
import ClientPageHeader from "./components/ClientPageHeader";
import ClientStatistics from "./components/ClientStatistics";
import ClientFilters from "./components/ClientFilters";
import ClientEmptyState from "./components/ClientEmptyState";
import ClientCard from "./components/ClientCard";

function ClientList() {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingClient, setEditingClient] = useState(null)
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoading(true)
                setError("")

                const data = await getClients()
                setClients(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchClients()
    }, [])

    const handleAddClient = async (clientData) => {
        try {
            await createClient({
                ...clientData,
                teamId: clientData.teamId || null
            });

            const data = await getClients();
            setClients(data);

            setIsModalOpen(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteClient = async (id) => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this client ?"
        )

        if (!isConfirmed) return

        try {
            await deleteClient(id)

            setClients((prev) =>
                prev.filter((client) => client._id !== id))
        } catch (error) {
            setError(error.message)
        }
    }


    const handleEditClient = (client) => {
        setEditingClient(client)
        setIsModalOpen(true)
    }

    const handleUpdateClient = async (clientData) => {
        try {
            await updateClient(
                editingClient._id,
                {
                    ...clientData,
                    teamId: clientData.teamId || null
                }
            );

            const data = await getClients();
            setClients(data);

            setEditingClient(null);
            setIsModalOpen(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const totalClients = clients.length;

    const activeClients = clients.filter(
        (client) => (client.status ?? "Active") === "Active"
    ).length;

    const inactiveClients = clients.filter(
        (client) => client.status === "Inactive"
    ).length;

    const filteredClients = clients.filter((client) => {
        const keyword = search.trim().toLowerCase();

        const matchesSearch = [
            client.name,
            client.company,
            client.email,
            client.phone,
            client.teamId?.name
        ].some((value) =>
            (value ?? "").toLowerCase().includes(keyword)
        );

        const status = client.status ?? "Active";

        const matchesStatus =
            statusFilter === "All" || status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <p className="text-sm text-gray-500">Loading clients ...</p>
        )
    }


    return (
        <div className="space-y-6">
            {/* HEADER */}
            <ClientPageHeader
                onAddClient={() => {
                    setEditingClient(null)
                    setIsModalOpen(true)
                }}
            />

            {/* ERROR MESSAGE */}
            {error && (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setError("")}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* CLIENT STATISTICS */}
            <ClientStatistics
                totalClients={totalClients}
                activeClients={activeClients}
                inactiveClients={inactiveClients}
            />
            {/* SEARCH & FILTER */}
            <ClientFilters
                search={search}
                setSearch={setSearch}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />
            {filteredClients.length === 0 && (
                <ClientEmptyState
                    hasClients={clients.length > 0}
                    onAddClient={() => {
                        setEditingClient(null);
                        setIsModalOpen(true);
                    }}
                />
            )}

            {filteredClients.length > 0 && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredClients.map((client) => (
                        <ClientCard
                            key={client._id}
                            client={client}
                            onEdit={handleEditClient}
                            onDelete={handleDeleteClient}
                        />
                    ))}
                </div>
            )}

            {isModalOpen && (
                <AddClientModal
                    onClose={() => {
                        setIsModalOpen(false)
                        setEditingClient(null)
                    }}
                    onAdd={editingClient ? handleUpdateClient : handleAddClient}
                    editingClient={editingClient}
                />
            )}
        </div>
    )
}

export default ClientList