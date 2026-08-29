import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import Navbar from "@/components/layout/Navbar"
import Button from "@/components/common/Button";
import { CircleArrowLeft } from "lucide-react";

function DashboardCreate() {
    return (
        <div>
            <div className="h-full flex flex-col">
                <Header />

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden">
                    <Navbar />
                    {/* Content */}
                    <main className="flex-1 overflow-y-auto p-6 flex justify-between">
                        <h1>Dashboard Create</h1>
                        <Button href="/dashboard" icon={CircleArrowLeft} />
                    </main>
                </div>
                {/* Footer */}
                <Footer />
            </div>
        </div>
    )
}

export default DashboardCreate 
