
import { Link } from "react-router-dom";
import {
  Search,
  Fingerprint,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-[#090b12] text-white">

      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Fingerprint className="text-amber-400" size={30} />
          <h1 className="text-2xl font-bold tracking-[0.2em]">
            ENIGMA
          </h1>
        </div>

        <span className="text-sm text-gray-400">
          AI MYSTERY ROOM
        </span>
      </nav>

      <main className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6">

        <div className="mb-8 rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-2 text-xs tracking-[0.2em] text-amber-300">
          AI-POWERED DETECTIVE EXPERIENCE
        </div>

        <Search size={64} className="text-amber-400 mb-8" />

        <h2 className="text-5xl md:text-7xl font-bold max-w-4xl leading-tight">
          Every Mystery
          <br />
          <span className="text-amber-400">Has a Truth.</span>
        </h2>

        <p className="text-gray-400 text-lg max-w-2xl mt-7 leading-relaxed">
          Step into a world of secrets, suspects, and hidden evidence.
          Create your own AI-generated mystery, investigate the clues,
          and uncover the criminal before the truth slips away.
        </p>

        <Link
          to="/create"
          className="mt-10 flex items-center gap-3 rounded-lg bg-amber-400 px-8 py-4 font-bold text-black hover:bg-amber-300 transition"
        >
          Start Investigation
          <ArrowRight size={20} />
        </Link>

        <div className="flex flex-wrap justify-center gap-8 mt-16 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <Fingerprint size={18} />
            Unique AI Mysteries
          </div>

          <div className="flex items-center gap-2">
            <Search size={18} />
            Interactive Investigation
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck size={18} />
            Solve & Earn Points
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
