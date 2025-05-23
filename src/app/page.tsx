import ProductDashboard from "@/components/ProductDashboard";
import Header from "@/components/Header";
import AuthCheck from "@/components/AuthCheck";

export default function Home() {
  return (
    <div className="min-h-screen bg-[rgb(22,24,28)] flex flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <AuthCheck>
            <ProductDashboard />
          </AuthCheck>
        </div>
      </main>
    </div>
  );
}
