import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-full px-1 py-3 sm:px-8 lg:px-10">
        <div className="flex gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-500 text-2xl shadow-lg shadow-violet-500/20">
              <Link
                to="/"
              >
                📝
              </Link>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-violet-300">
                Todo App
              </p>
              <h1 className="text-1xl font-semibold sm:text-1xl">
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
