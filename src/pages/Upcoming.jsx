import UpcomingFeature from "@/components/features/upcoming";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";

function Upcoming() {
   return (
    <div>
      <div className="h-screen flex flex-col">
        <Header />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <Navbar />

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <UpcomingFeature />
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
export default Upcoming;
