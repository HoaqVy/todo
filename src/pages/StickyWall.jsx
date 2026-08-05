import StickyWallFeature from "@/components/features/sticky-wall";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";

function StickyWall() {
  return (
    <div>
      <div className="h-screen flex flex-col">
        <Header />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <Navbar />

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <StickyWallFeature />
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
export default StickyWall;
