import DashboardFeature from "@/components/features/dashboard";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";

function Dashboard() {
  return (
    <div>
      <div className="h-full flex flex-col">
        <Header />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <Navbar />
          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <DashboardFeature />
          </main>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
export default Dashboard;
