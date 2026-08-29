import { ClipboardList } from "lucide-react";

function DashboardCard({ title, value, description, icon: Icon = ClipboardList }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                    <Icon size={20} className="text-gray-600" />
                </div>
            </div>
            {/* Value */}
            <div className="mt-4">
                <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
                <p className="mt-1 text-sm text-gray-500">{description}</p>
            </div>
        </div>
    )
}
export default DashboardCard