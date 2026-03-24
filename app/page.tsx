"use client";

import { useState } from "react";
import { LandingView } from "@/components/LandingView";
import { ProcessingView } from "@/components/ProcessingView";
import { ResultsView } from "@/components/ResultsView";

type ViewState = "landing" | "processing" | "results";
type Insight = {
  section: string;
  severity: "High" | "Medium" | "Low";
  description: string;
  actionable_step: string;
};

export default function Home() {
  const [view, setView] = useState<ViewState>("landing");
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<any>(null);

  const handleAudit = async (auditUrl: string) => {
    setUrl(auditUrl);
    setView("processing");

    // Minimum wait time for the animation to feel real (at least 2.5s)
    const startTime = Date.now();

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: auditUrl }),
      });

      if (!response.ok) {
        throw new Error("Audit failed");
      }

      const data = await response.json();
      setResults(data);

      // Ensure we showed the loading screen for at least a bit
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 3000 - elapsed); // 3 seconds min

      setTimeout(() => {
        setView("results");
      }, remaining);

    } catch (error) {
      console.error(error);
      setResults({
        "Homepage": [{
          section: "Network",
          severity: "High",
          description: "Could not complete audit.",
          actionable_step: "Please check your connection and try again."
        }]
      });
      setView("results");
    }
  };

  if (view === "processing") {
    return <ProcessingView />;
  }

  if (view === "results") {
    return <ResultsView data={results} url={url} />;
  }

  return <LandingView onAudit={handleAudit} isLoading={false} />;
}
