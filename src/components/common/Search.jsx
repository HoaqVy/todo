import { HiOutlineSearch } from "react-icons/hi";

function Search({ className = "", value = "", onChange }) {
  return (
    <div className={`relative ${className}`}>
      {/* Search icon */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <HiOutlineSearch
          size={20}
          className="text-gray-400"
        />
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-12 pr-4 outline-none focus:border-gray-400"
      />
    </div>
  );
}

export default Search;