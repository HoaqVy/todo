
import Tasks from "../features/page-nav/tasks";
import Search from "../common/Search";
import Report from "../features/page-nav/report";
import Tags from "../features/page-nav/tags";
import UserMenu from "../features/page-nav/userName";

function Navbar() {
  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-black">
          Menu
        </h1>
      </div>
      <Search />
      <Tasks />
      <Report />
      <Tags />
      <UserMenu />
    </div>
  );
}

export default Navbar;
