
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Fingerprint,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Lightbulb,
  Search,
} from "lucide-react";

import { getResult } from "../services/api";

function Result() {
  const { caseId } = useParams();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadResult = async () => {
      try {
        const data = await getResult(caseId);

        if (active) setResult(data.result);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
            "Unable to load the result."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadResult();

    return () => {
      active = false;
    };
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090b12] text-amber-400">
        Revealing the truth...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-[#090b12] p-10 text-white">
        <p role="alert">{error || "Result not found."}</p>
        <Link to="/create" className="mt-5 inline-block text-amber-400">
          Create a New Mystery
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090b12] text-white">

      <nav className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-12">
        <Link to="/" className="flex items-center gap-3">
          <Fingerprint size={28} className="text-amber-400" />
          <span className="text-xl font-bold tracking-[0.2em]">
            ENIGMA
          </span>
        </Link>

        <span className="text-xs tracking-widest text-gray-400">
          CASE CLOSED
        </span>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-12">

        <div className="mb-10 text-center">
          {result.correct ? (
            <CheckCircle2
              size={64}
              className="mx-auto mb-6 text-green-400"
            />
          ) : (
            <XCircle
              size={64}
              className="mx-auto mb-6 text-red-400"
            />
          )}

          <p className="mb-4 text-sm uppercase tracking-widest text-amber-400">
            {result.title}
          </p>

          <h1 className="text-4xl font-bold md:text-6xl">
            {result.correct
              ? "Case Solved!"
              : "Case Closed!"}
          </h1>

          <p className="mt-5 text-gray-400">
            {result.correct
              ? "Brilliant detective work! You identified the culprit."
              : "Your accusation was incorrect. The truth is now revealed."}
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-amber-400/30 bg-[#11151f] p-8 text-center">
          <Trophy
            size={42}
            className="mx-auto mb-4 text-amber-400"
          />

          <p className="text-sm uppercase tracking-widest text-gray-400">
            Final Score
          </p>

          <p className="mt-3 text-6xl font-bold text-amber-400">
            {result.score}
          </p>

          <p className="mt-3 text-sm text-gray-400">
            Difficulty: {result.difficulty}
          </p>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[#11151f] p-6">
            <p className="mb-3 text-sm text-gray-400">
              Your Accusation
            </p>
            <p className="text-xl font-bold">
              {result.accusedSuspect}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#11151f] p-6">
            <p className="mb-3 text-sm text-gray-400">
              Actual Culprit
            </p>
            <p className="text-xl font-bold text-amber-400">
              {result.culprit}
            </p>
          </div>
        </div>

        <section className="mb-8 rounded-2xl border border-white/10 bg-[#11151f] p-7">
          <h2 className="mb-5 text-2xl font-bold">
            The Truth Revealed
          </h2>

          <p className="leading-8 text-gray-300">
            {result.explanation}
          </p>
        </section>

        <div className="mb-10 grid gap-5 md:grid-cols-2">
          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#11151f] p-6">
            <Search className="text-amber-400" />
            <div>
              <p className="text-2xl font-bold">
                {result.cluesDiscovered}
              </p>
              <p className="text-sm text-gray-400">
                Clues Discovered
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#11151f] p-6">
            <Lightbulb className="text-amber-400" />
            <div>
              <p className="text-2xl font-bold">
                {result.hintsUsed}
              </p>
              <p className="text-sm text-gray-400">
                Hints Used
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pb-10">
          <Link
            to="/create"
            className="flex items-center gap-3 rounded-xl bg-amber-400 px-9 py-4 font-bold text-black hover:bg-amber-300"
          >
            <RotateCcw size={20} />
            Play Another Mystery
          </Link>
        </div>

      </main>
    </div>
  );
}

export default Result;

