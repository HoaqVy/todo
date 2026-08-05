import { Copyright } from "lucide-react";

function Footer() {
  return (
    <footer className=" mt-auto flex flex-col text-slate-50 ">
      <div className="my-auto max-w-full px-1 py-5 sm:px-8 lg:px-10">
        <div className="flex gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Copyright size={20} className="text-violet-400" />
            <p className="text-sm uppercase tracking-[0.28em] text-violet-400">
              Todo App
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
