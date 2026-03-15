import WordGenerator from "@/components/WordGenerator";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050510] relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <WordGenerator />
      </div>
    </main>
  );
}
