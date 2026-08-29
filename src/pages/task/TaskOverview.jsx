import Filter from "@/components/common/Filter";
import { useState } from "react";

const defaulrData = [
    { label: 'Completed', count: 12, color: 'bg-emerald-500' },
    { label: 'In Progress', count: 8, color: 'bg-blue-500' },
    { label: 'Todo', count: 4, color: 'bg-amber-500' },
    { label: 'Overdue', count: 2, color: 'bg-rose-500' },
];
function TaskOverview({ data = defaulrData }) {
    const [period, setPeriod] = useState()
    return (
        <div className="w-full max-w-prose rounded-xl border border-gray-300 bg-white p-6 shadow-sm font-mono ">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="mb-5 text-lg font-bold tracking-wide text-gray">Task Overview</h3>
                    <p className="mt-1 text-sm text-gray-500">Overview of your tasks</p>
                </div>
                <Filter value={period} onChange={setPeriod} className="w-40" />
            </div>

            {/* Chart */}
            <div className="mt-6 space-y-3">
                {data.map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center gap-4"
                    >
                        <span className="w-28 truncate text-sm text-gray-800">
                            {item.label}
                        </span>

                        <div className="flex flex-1 items-center gap-0.5 overflow-hidden">
                            {Array.from({ length: item.count }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-4 w-2 rounded-[1px] ${item.color} transition-all hover:opacity-15`}
                                />
                            ))}
                        </div>

                        <span className="w-6 text-right text-sm font-bold text-gray-800">
                            {item.count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default TaskOverview