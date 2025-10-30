import MainInterface from "@/components/MainInterface";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <MainInterface />
        </div>
      </main>
    </div>
  );
}
