
import Tasks from "../features/task/tasks";
import Search from "../common/Search";
import Report from "../features/task/report";
import Tags from "../features/task/tags";
import UserMenu from "../features/task/userName";

function Navbar() {
  return (
    <aside className="w-80.75 h-full overflow-y-auto border-r border-gray-200 bg-[#F8F8F8] p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-black">Menu</h1>

      </div>
      <Search />
      <Tasks />
      <Report />
      <Tags />
      <UserMenu />
    </aside>
  );
}

export default Navbar;
