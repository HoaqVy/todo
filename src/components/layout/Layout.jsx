import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (

        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <Header />

            {/* Main */}
            <div className="relative flex flex-1 overflow-hidden">
                {/* Mobile menu button  */}
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(true)}
                    className="fixed right-4 top-4 z-60 rounded-lg bg-white p-2 shadow-md lg:hidden"
                >
                    <Menu size={22} />
                </button>

                {/* Overlay */}
                {isMenuOpen && (
                    <div
                        onClick={() => setIsMenuOpen(false)}
                        className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    />
                )}
                {/* Navbar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-80.75 border-r border-gray-200 bg-gray-100 transition-transform duration-300 lg:static lg:translate-x-0 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`
                    }
                >
                    {/* Close button */}
                    <button type="button"
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute right-4 top-4 z-10 rounded-lg p-2 hover:bg-gray-200 lg:hidden"
                    >
                        <X size={22} />
                    </button>
                    <Navbar />
                </aside>

                {/* Content */}
                <main className="min-w-0 flex-1">
                    <div className="p-4 pt-16 sm:p-6 lg:p-8 lg:pt-8">
                        <Outlet />
                    </div>
                </main>
            </div>
            {/* Footer */}
            <Footer />
        </div>

    )
}

export default Layout