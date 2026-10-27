
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Fingerprint,
  ShieldAlert,
  Gavel,
  CheckCircle2,
} from "lucide-react";

import {
  getMystery,
  accuseSuspect,
} from "../services/api";

function Accusation() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [mystery, setMystery] = useState(null);
  const [selectedSuspect, setSelectedSuspect] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadCase = async () => {
      try {
        const data = await getMystery(caseId);

        if (active) {
          setMystery(data.mystery);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
            "Unable to load suspects."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCase();

    return () => {
      active = false;
    };
  }, [caseId]);

  const handleAccuse = async () => {
    if (!selectedSuspect || submitting) return;

    const confirmed = window.confirm(
      "Are you sure? Your accusation is final and cannot be changed."
    );

    if (!confirmed) return;

    setSubmitting(true);
    setError("");

    try {
      await accuseSuspect(caseId, selectedSuspect);

      navigate(`/result/${caseId}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to submit accusation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090b12] text-amber-400">
        Loading suspects...
      </div>
    );
  }

  if (!mystery) {
    return (
      <div className="min-h-screen bg-[#090b12] p-10 text-white">
        <p role="alert">{error || "Mystery not found."}</p>
        <Link to="/create" className="text-amber-400">
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
          FINAL ACCUSATION
        </span>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-12">

        <Link
          to={`/investigate/${caseId}`}
          className="mb-10 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400"
        >
          <ArrowLeft size={17} />
          Back to Investigation
        </Link>

        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-400/10 px-5 py-2 text-xs tracking-widest text-red-400">
            <ShieldAlert size={16} />
            FINAL DECISION
          </div>

          <h1 className="text-4xl font-bold md:text-5xl">
            Who Is the
            <span className="text-amber-400"> Culprit?</span>
          </h1>

          <p className="mt-5 text-gray-400">
            Review the suspects and make your final accusation.
            Once submitted, your decision cannot be changed.
          </p>

          <p className="mt-3 text-sm text-amber-400">
            Case: {mystery.title}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {mystery.suspects.map((suspect) => {
            const selected = selectedSuspect === suspect.id;

            return (
              <button
                key={suspect.id}
                type="button"
                disabled={submitting}
                onClick={() => setSelectedSuspect(suspect.id)}
                aria-pressed={selected}
                className={`rounded-2xl border p-6 text-left transition-all disabled:opacity-50 ${
                  selected
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-white/10 bg-[#11151f] hover:border-amber-400/40"
                }`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <Fingerprint
                    size={30}
                    className="text-amber-400"
                  />

                  {selected && (
                    <CheckCircle2 className="text-amber-400" />
                  )}
                </div>

                <h2 className="text-xl font-bold">
                  {suspect.name}
                </h2>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  {suspect.description}
                </p>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="mb-2 text-xs font-bold tracking-widest text-amber-400">
                    ALIBI
                  </p>

                  <p className="text-sm leading-7 text-gray-300">
                    {suspect.alibi}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <p
            role="alert"
            className="mt-8 rounded-lg border border-red-400/20 bg-red-400/10 p-4 text-center text-red-400"
          >
            {error}
          </p>
        )}

        <div className="mt-12 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={handleAccuse}
            disabled={!selectedSuspect || submitting}
            className="flex items-center gap-3 rounded-xl bg-amber-400 px-10 py-4 font-bold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Gavel size={21} />
            {submitting
              ? "Submitting Accusation..."
              : "Submit Final Accusation"}
          </button>

          <p className="text-sm text-gray-500">
            Choose carefully. Your accusation is final.
          </p>
        </div>

      </main>
    </div>
  );
}

export default Accusation;
