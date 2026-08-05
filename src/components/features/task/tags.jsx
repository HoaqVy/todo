function Tags() {
  const tags = [
    { id: 1, name: "Tag 1", color: "bg-red-400" },
    { id: 2, name: "Tag 2", color: "bg-blue-400" },
    { id: 3, name: "Tag 3", color: "bg-green-400" },
  ];
  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      {/* Title */}
      <h2 className="mb-5 text-sm uppercase font-bold tracking-wider text-gray-500">
        Tags
      </h2>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <button
            key={tag.id}
            className={`rounded-md px-4 py-2 text-xs font-medium text-white ${tag.color}  transition`}
          >
            {tag.name}
          </button>
        ))}
        <button className="rounded-md bg-gray-200 px-4 py-2 text-xs font-medium hover:bg-gray-300">
          + Add tag
        </button>
      </div>
    </div>
  );
}
export default Tags;
