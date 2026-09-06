import { HiOutlineSearch } from "react-icons/hi";

function Search({ className = "", value = "", onChange }) {
  return (
    <div className={`flex h-10 items-center rounded-lg border border-gray-300 bg-white px-4 focus-within:bg-gray-400 ${className}`}>
      <HiOutlineSearch size={20} className="shrink-0 text-gray-400" />

      {/* Input */}
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 w-full rounded-lg pl-6 pr-4 outline-none focus:border-gray-400"
      />
    </div >
  );
}

export default Search;