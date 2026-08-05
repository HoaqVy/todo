import { HiOutlineSearch } from "react-icons/hi";
function Search() {
  return (
    <>
      {/* Search */}
      <div className="relative mb-10">
        <HiOutlineSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={22}
        />

        <input
          type="text"
          placeholder="Search"
          className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-12 pr-4 outline-none focus:border-gray-400"
        />
      </div>
    </>
  );
}
export default Search;
