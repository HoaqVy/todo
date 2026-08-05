import { HiPlusCircle } from "react-icons/hi";

const lists = [
  { id: 1, name: "Personal", color: "bg-red-400", count: 2 },
  { id: 2, name: "Work", color: "bg-cyan-300", count: 6 },
  { id: 3, name: "List 1", color: "bg-yellow-300", count: 5 },
];

function Lists() {
  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      {/* Title */}
      <h2 className="mb-5 text-sm font-bold tracking-wider text-gray-500 uppercase">
        Lists
      </h2>

      <div className="space-y-4">
        {/* Personal */}
        {lists.map((list) => (
          <div className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className={`h-4 w-4 rounded-sm ${list.color}`}></span>
              <span className="text-sm font-medium text-gray-700">
                {list.name}
              </span>
            </div>

            <span className="rounded bg-gray-200 px-2 py-1 text-xs font-semibold">
              {list.count}
            </span>
          </div>
        ))}
        {/* Add New List */}
        <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-gray-600 transition hover:bg-gray-100">
          <HiPlusCircle size={18} />
          <span className="text-sm font-medium">Add New List</span>
        </button>
      </div>
    </div>
  );
}

export default Lists;
