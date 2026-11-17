
import Button from "@/components/common/Button";
import { CircleArrowLeft } from "lucide-react";

function DashboardCreate() {
    return (
        <div>
            <main className="flex-1 overflow-y-auto p-6 flex justify-between">
                <h1>Dashboard Create</h1>
                <Button href="/dashboard" icon={CircleArrowLeft} />
            </main>
        </div>
    )
}

export default DashboardCreate 
