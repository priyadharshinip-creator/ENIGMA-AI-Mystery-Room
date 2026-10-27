
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Fingerprint,
  Search,
  Lightbulb,
  CheckCircle2,
  LockKeyhole,
  ShieldAlert,
} from "lucide-react";

import {
  getMystery,
  discoverClue,
  requestHint,
} from "../services/api";

function Investigation() {
  const { caseId } = useParams();

  const [mystery, setMystery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [hints, setHints] = useState([]);

  const loadMystery = async () => {
    const data = await getMystery(caseId);
    setMystery(data.mystery);
  };

  useEffect(() => {
    let active = true;

    const fetchCase = async () => {
      try {
        const data = await getMystery(caseId);

        if (active) {
          setMystery(data.mystery);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
            "Unable to load this mystery."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchCase();

    return () => {
      active = false;
    };
  }, [caseId]);

  const handleDiscover = async (clueId) => {
    if (busy) return;

    setBusy(true);
    setError("");

    try {
      await discoverClue(caseId, clueId);
      await loadMystery();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to discover the clue."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleHint = async () => {
    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const data = await requestHint(caseId);

      setHints((previous) => [...previous, data.hint]);
      await loadMystery();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to retrieve a hint."
      );
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090b12] text-amber-400">
        <div className="text-center">
          <Fingerprint size={48} className="mx-auto mb-5 animate-pulse" />
          <p className="tracking-widest">
            OPENING CLASSIFIED CASE FILE...
          </p>
        </div>
      </div>
    );
  }

  if (!mystery) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#090b12] p-6 text-white">
        <ShieldAlert size={48} className="text-red-400" />
        <h1 className="text-2xl font-bold">
          Unable to Open Case
        </h1>
        <p role="alert" className="text-gray-400">
          {error || "Mystery not found."}
        </p>
        <Link to="/create" className="text-amber-400">
          Create a New Mystery
        </Link>
      </div>
    );
  }

  const discoveredCount = mystery.clues.filter(
    (clue) => clue.discovered
  ).length;

  const maxHints = mystery.difficulty === "easy" ? 2 : 3;
  const hintsRemaining = Math.max(
    0,
    maxHints - mystery.hintsUsed
  );

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
          INVESTIGATION ROOM
        </span>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">

        <Link
          to="/create"
          className="mb-10 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400"
        >
          <ArrowLeft size={17} />
          Back to Case Generator
        </Link>

        <header className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs tracking-widest text-amber-400">
            <LockKeyhole size={15} />
            CLASSIFIED CASE FILE
          </div>

          <h1 className="text-4xl font-bold md:text-5xl">
            {mystery.title}
          </h1>

          <p className="mt-4 text-sm uppercase tracking-widest text-gray-400">
            Difficulty: {mystery.difficulty}
          </p>
        </header>

        <section className="mb-10 rounded-2xl border border-white/10 bg-[#11151f] p-7">
          <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold">
            <Search className="text-amber-400" />
            The Mystery
          </h2>

          <p className="leading-8 text-gray-300">
            {mystery.story}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-6 text-2xl font-bold">
            Suspect Profiles
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {mystery.suspects.map((suspect) => (
              <div
                key={suspect.id}
                className="rounded-2xl border border-white/10 bg-[#11151f] p-6 transition hover:border-amber-400/40"
              >
                <Fingerprint
                  size={30}
                  className="mb-5 text-amber-400"
                />

                <h3 className="text-xl font-bold">
                  {suspect.name}
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  {suspect.description}
                </p>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="mb-2 text-sm font-semibold text-amber-400">
                    ALIBI
                  </p>

                  <p className="text-sm leading-7 text-gray-300">
                    {suspect.alibi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">
              Evidence Board
            </h2>

            <span className="rounded-full border border-amber-400/30 px-4 py-2 text-sm text-amber-400">
              {discoveredCount} / {mystery.clues.length} Clues Found
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {mystery.clues.map((clue) => (
              <div
                key={clue.id}
                className="rounded-xl border border-white/10 bg-[#11151f] p-6"
              >
                <div className="flex items-start gap-4">
                  <Search
                    size={23}
                    className="mt-1 shrink-0 text-amber-400"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-bold">
                      {clue.title}
                    </h3>

                    {clue.discovered ? (
                      <>
                        <p className="mt-3 text-sm leading-7 text-gray-300">
                          {clue.description}
                        </p>

                        <span className="mt-4 inline-flex items-center gap-2 text-sm text-green-400">
                          <CheckCircle2 size={17} />
                          Evidence Discovered
                        </span>
                      </>
                    ) : (
                      <>
                        <p className="mt-3 text-sm text-gray-500">
                          This evidence has not been examined yet.
                        </p>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleDiscover(clue.id)}
                          className="mt-5 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-amber-300 disabled:opacity-50"
                        >
                          Discover Clue
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-amber-400/20 bg-[#11151f] p-7">
          <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
            <Lightbulb className="text-amber-400" />
            Detective Hints
          </h2>

          <p className="mb-4 text-sm leading-7 text-gray-400">
            Need help solving the case? Each hint costs 10 points.
          </p>

          <p className="mb-5 text-sm text-amber-400">
            Hints remaining: {hintsRemaining}
          </p>

          {hints.map((hint, index) => (
            <div
              key={index}
              className="mb-3 rounded-lg border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-7 text-amber-100"
            >
              <span className="font-bold">
                Hint {index + 1}:
              </span>{" "}
              {hint}
            </div>
          ))}

          <button
            type="button"
            onClick={handleHint}
            disabled={busy || hintsRemaining === 0}
            className="rounded-lg border border-amber-400 px-6 py-3 font-semibold text-amber-400 transition hover:bg-amber-400/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {hintsRemaining === 0
              ? "No Hints Remaining"
              : "Request Hint (-10 Points)"}
          </button>
        </section>

        {error && (
          <p
            role="alert"
            className="mb-6 rounded-lg border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400"
          >
            {error}
          </p>
        )}

        <div className="flex justify-center pb-10">
          <Link
            to={`/accuse/${caseId}`}
            className="rounded-xl bg-amber-400 px-10 py-4 font-bold text-black transition hover:bg-amber-300"
          >
            Accuse a Suspect
          </Link>
        </div>

      </main>
    </div>
  );
}

export default Investigation;
