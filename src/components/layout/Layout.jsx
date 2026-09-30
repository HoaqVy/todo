import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <div className="relative flex min-h-0 flex-1 overflow-hidden">
                {/* Open menu button */}
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(true)}
                    className="
                        fixed left-4 top-20 z-40
                        rounded-lg border border-gray-200
                        bg-white p-2 shadow-md
                        transition hover:bg-gray-100
                        lg:hidden
                    "
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                {/* Overlay */}
                {isMenuOpen && (
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setIsMenuOpen(false)}
                        className="
                            fixed inset-0 z-40
                            cursor-default bg-black/30
                            lg:hidden
                        "
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-50
                        w-70
                        border-r border-gray-200
                        bg-gray-100
                        transition-transform duration-300
                        ease-in-out

                        lg:static
                        lg:w-80
                        lg:translate-x-0

                        ${isMenuOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                        }
                    `}
                >
                    {/* Close button */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(false)}
                        className="
                            absolute right-4 top-4 z-10
                            rounded-lg p-2
                            transition hover:bg-gray-200
                            lg:hidden
                        "
                        aria-label="Close menu"
                    >
                        <X size={22} />
                    </button>

                    <Navbar
                        onClose={() => setIsMenuOpen(false)}
                    />
                </aside>

                {/* Main */}
                <main className="min-w-0 flex-1 overflow-y-auto">
                    <div className="p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-8">
                        <Outlet />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default Layout;