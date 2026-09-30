import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-full px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center">
          <div className="flex items-center gap-4">

            {/* Logo */}
            <Link
              to="/"
              className="flex h-10 ư-10 shrink-0 items-center justify-center rounded-2xl bg-violet-500 text-xl shadow-lg shadow-violet-500/20 transition hover:bg-violet-400 sm:h-12 sm:w-12 sm:rounded-3xl sm:text-2xl"
              aria-label="Go to home"
            >
              📝
            </Link>

            {/* Title */}
            <div className="ml-3 min-w-0 sm:ml-4">
              <p className="text-sm uppercase tracking-[0.28em] text-violet-300">
                Todo App
              </p>
              <h1 className="truncate text-sm font-semibold sm:text-base">
                Quản lý công việc hàng ngày
              </h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
