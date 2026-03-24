"use client";

import { useState } from "react";
import { LandingView } from "@/components/LandingView";
import { ProcessingView } from "@/components/ProcessingView";
import { ResultsView } from "@/components/ResultsView";

const STORAGE_KEY = "cro_audit_cache";

function getSaved() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Home() {
  const saved = typeof window !== "undefined" ? getSaved() : null;

  const [view, setView] = useState<"landing" | "processing" | "results">(
    saved ? "results" : "landing"
  );
  const [url, setUrl] = useState<string>(saved?.url ?? "");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any>(saved?.results ?? null);

  const handleAudit = async (auditUrl: string) => {
    setUrl(auditUrl);
    setView("processing");

    const startTime = Date.now();

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: auditUrl }),
      });

      if (!response.ok) throw new Error("Audit failed");

      const data = await response.json();
      setResults(data);

      // Persist so results survive page refreshes / browser restarts
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ url: auditUrl, results: data }));

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 3000 - elapsed);
      setTimeout(() => setView("results"), remaining);
    } catch (error) {
      console.error(error);
      const errData = {
        Homepage: [
          {
            section: "Network",
            severity: "High",
            description: "Could not complete audit.",
            actionable_step: "Please check your connection and try again.",
          },
        ],
      };
      setResults(errData);
      setView("results");
    }
  };

  const handleNewAudit = () => {
    localStorage.removeItem(STORAGE_KEY);
    setResults(null);
    setUrl("");
    setView("landing");
  };

  if (view === "processing") return <ProcessingView />;
  if (view === "results")
    return <ResultsView data={results} url={url} onNewAudit={handleNewAudit} />;
  return <LandingView onAudit={handleAudit} isLoading={false} />;
}
