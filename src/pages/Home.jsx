import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import DashboardFeature from "@/components/features/dashboard";

function Home() {
  return (
    <div>
      <div className="h-screen flex flex-col">
        <Header />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <Navbar />
          <DashboardFeature />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
export default Home;
