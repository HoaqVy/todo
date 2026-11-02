
import Tasks from "../features/page-nav/tasks";
import UserMenu from "../features/page-nav/userName";
import Management from "../features/page-nav/management";
import Workspace from "../features/page-nav/workSpace";

function Navbar({ onClose }) {
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <h1 className="text-3xl font-bold text-black sm:text-4xl">
          Menu
        </h1>
      </div>
      <Tasks onClose={onClose} />
      <Management onClose={onClose} />
      <Workspace onClose={onClose} />
      <UserMenu />
    </div>
  );
}

export default Navbar;
