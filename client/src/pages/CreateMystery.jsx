
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createMystery } from "../services/api";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Fingerprint,
  Sparkles,
} from "lucide-react";

const difficulties = [
  {
    id: "easy",
    title: "Rookie Detective",
    level: "EASY",
    suspects: 3,
    clues: 5,
    points: 100,
    description: "A perfect start for new investigators.",
  },
  {
    id: "medium",
    title: "Skilled Investigator",
    level: "MEDIUM",
    suspects: 4,
    clues: 7,
    points: 150,
    description: "More suspects and deeper mysteries.",
  },
  {
    id: "hard",
    title: "Master Detective",
    level: "HARD",
    suspects: 5,
    clues: 9,
    points: 200,
    description: "Only the sharpest minds will succeed.",
  },
];

function CreateMystery() {
  const navigate = useNavigate();

  const [premise, setPremise] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (premise.trim().length < 15) {
      setError("Please enter at least 15 characters.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await createMystery(
        premise.trim(),
        difficulty
      );

      if (!data.success || !data.caseId) {
        throw new Error("Mystery generation failed");
      }

      navigate(`/investigate/${data.caseId}`);

    } catch (err) {
      console.error("Mystery generation error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to generate your mystery. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b12] text-white">

      <nav className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-12">
        <Link to="/" className="flex items-center gap-3">
          <Fingerprint className="text-amber-400" size={28} />
          <span className="text-xl font-bold tracking-[0.2em]">
            ENIGMA
          </span>
        </Link>

        <span className="text-xs tracking-widest text-gray-400">
          CASE GENERATOR
        </span>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-12 md:py-16">

        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-2 text-xs tracking-widest text-amber-400">
            <Sparkles size={15} />
            CREATE YOUR CASE
          </div>

          <h1 className="text-4xl font-bold md:text-6xl">
            A New Mystery
            <span className="text-amber-400"> Awaits.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-gray-400">
            Every great investigation begins with a story.
            Tell us what happened and let AI build your mystery.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-10">

          <section className="rounded-2xl border border-white/10 bg-[#11151f] p-6 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <Brain className="text-amber-400" />
              <h2 className="text-xl font-semibold">
                Your Mystery Premise
              </h2>
            </div>

            <p className="mb-5 text-sm text-gray-400">
              Describe a mysterious event, crime, or unexplained incident.
            </p>

            <textarea
              value={premise}
              disabled={loading}
              onChange={(e) => {
                setPremise(e.target.value);
                setError("");
              }}
              maxLength={500}
              rows={5}
              placeholder="Example: A priceless diamond disappears from a locked museum during a midnight celebration. Five guests were present, but nobody saw anything..."
              className="w-full resize-none rounded-xl border border-white/10 bg-[#090b12] p-5 text-white outline-none placeholder:text-gray-600 focus:border-amber-400 disabled:opacity-60"
            />

            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <span>Minimum 15 characters</span>
              <span>{premise.length}/500</span>
            </div>

            {error && (
              <p role="alert" className="mt-3 text-sm text-red-400">
                {error}
              </p>
            )}
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold">
              Choose Your Difficulty
            </h2>

            <p className="mb-6 text-gray-400">
              How challenging should your investigation be?
            </p>

            <div className="grid gap-5 md:grid-cols-3">
              {difficulties.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  disabled={loading}
                  onClick={() => setDifficulty(item.id)}
                  aria-pressed={difficulty === item.id}
                  className={`rounded-2xl border p-6 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                    difficulty === item.id
                      ? "border-amber-400 bg-amber-400/10"
                      : "border-white/10 bg-[#11151f] hover:border-white/30"
                  }`}
                >
                  <span className="text-xs font-bold tracking-widest text-amber-400">
                    {item.level}
                  </span>

                  <h3 className="mt-4 text-lg font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-3 min-h-12 text-sm text-gray-400">
                    {item.description}
                  </p>

                  <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm text-gray-300">
                    <p>{item.suspects} Suspects</p>
                    <p>{item.clues} Clues</p>
                    <p className="font-semibold text-amber-400">
                      {item.points} Base Points
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <div className="flex flex-col items-center gap-5">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 rounded-xl bg-amber-400 px-10 py-4 font-bold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  Generating Your Mystery...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate My Mystery
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {loading && (
              <div
                role="status"
                className="text-center"
              >
                <p className="animate-pulse text-sm font-medium text-amber-400">
                  Our AI detective is building your case...
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  Creating suspects, evidence, and hidden secrets.
                  This may take a little while.
                </p>
              </div>
            )}
          </div>

        </form>
      </main>
    </div>
  );
}

export default CreateMystery;
