import { useEffect, useState } from "react";
import { Mail, Pencil, Phone, Plus, Search, Trash2, Users } from "lucide-react";
import AddClientModal from "./AddClientModal";
import {
    getClients,
    createClient,
    deleteClient,
    updateClient
} from "@/api/clientApi";

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

    if (error) {
        return (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
            </p>
        )
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}
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
                    onClick={() => {
                        setEditingClient(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                    <Plus size={18} />
                    Add Client
                </button>
            </div>
            {/* CLIENT STATISTICS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                {/* Total Clients */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500">
                            Total Clients
                        </p>

                        <div className="rounded-lg bg-blue-50 p-2">
                            <Users size={20} className="text-blue-600" />
                        </div>
                    </div>

                    <p className="mt-3 text-2xl font-bold text-gray-900">
                        {totalClients}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        All registered clients
                    </p>
                </div>

                {/* Active Clients */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500">
                            Active Clients
                        </p>

                        <div className="rounded-lg bg-green-50 p-2">
                            <Users size={20} className="text-green-600" />
                        </div>
                    </div>

                    <p className="mt-3 text-2xl font-bold text-gray-900">
                        {activeClients}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Currently active
                    </p>
                </div>

                {/* Inactive Clients */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500">
                            Inactive Clients
                        </p>

                        <div className="rounded-lg bg-orange-50 p-2">
                            <Users size={20} className="text-orange-600" />
                        </div>
                    </div>

                    <p className="mt-3 text-2xl font-bold text-gray-900">
                        {inactiveClients}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Currently inactive
                    </p>
                </div>

            </div>
            {/* SEARCH & FILTER */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* Search */}
                <div className="relative w-full sm:max-w-sm">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search clients..."
                        className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>

            </div>
            {filteredClients.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                        <Users size={26} className="text-gray-400" />
                    </div>

                    <h3 className="text-base font-semibold text-gray-900">
                        No clients found
                    </h3>

                    <p className="mt-1 max-w-sm text-sm text-gray-500">
                        {clients.length === 0
                            ? "You haven't added any clients yet. Start by adding your first client."
                            : "Try changing your search keyword or status filter."}
                    </p>

                    {clients.length === 0 && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingClient(null);
                                setIsModalOpen(true);
                            }}
                            className="mt-5 flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                            <Plus size={16} />
                            Add Your First Client
                        </button>
                    )}
                </div>
            )}

            {filteredClients.length > 0 && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredClients.map((client) => (
                        <div
                            key={client._id}
                            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                        >
                            {/* CARD HEADER */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
                                        {client.name?.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate font-semibold text-gray-900">
                                            {client.name}
                                        </h3>

                                        <p className="mt-1 truncate text-sm text-gray-500">
                                            {client.company || "No company"}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${client.status === "Inactive"
                                        ? "bg-gray-100 text-gray-600"
                                        : "bg-green-50 text-green-700"
                                        }`}
                                >
                                    {client.status ?? "Active"}
                                </span>
                            </div>

                            <div className="my-4 border-t border-gray-100" />

                            {/* CLIENT INFORMATION */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail size={16} className="shrink-0 text-gray-400" />
                                    <span className="truncate">
                                        {client.email}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone size={16} className="shrink-0 text-gray-400" />
                                    <span>
                                        {client.phone || "No phone"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Users size={16} className="shrink-0 text-gray-400" />
                                    <span className="truncate">
                                        {client.teamId?.name || "No Team"}
                                    </span>
                                </div>
                            </div>

                            <div className="my-4 border-t border-gray-100" />

                            {/* ACTIONS */}
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleEditClient(client)}
                                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                >
                                    <Pencil size={15} />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDeleteClient(client._id)}
                                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 size={15} />
                                    Delete
                                </button>
                            </div>
                        </div>
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