import { HiOutlineMenuAlt3 } from "react-icons/hi";

import Tasks from "../features/task/tasks";
import Search from "../common/Search";
import Lists from "../features/task/lists";
import Tags from "../features/task/tags";
import UserMenu from "../features/task/userName";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <aside className="w-80.75 h-screen overflow-y-auto border-r border-gray-200 bg-[#F8F8F8] p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Link
            to="/dashboard"
            className="flex w-full items-center justify-between gap-7 rounded-lg px-4 py-3 hover:bg-gray-200"
          >
           <h1 className="text-4xl font-bold text-black">Menu</h1>
            <HiOutlineMenuAlt3 size={24} />
          </Link>
      </div>
      <Search />
      <Tasks />
      <Lists />
      <Tags />
      <UserMenu />
    </aside>
  );
}

export default Navbar;
