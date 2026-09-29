"use client";

import React, { useState } from "react";
import {
  Workflow,
  Copy,
  Check,
  Play,
  Send,
  Loader2,
  FileCode,
} from "lucide-react";

export function N8nIntegrationGuide() {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: "idle" | "success" | "error";
    message?: string;
  }>({ status: "idle" });

  const webhookUrl = "http://localhost:3000/api/webhooks/n8n";

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleTriggerTest = async () => {
    setSendingTest(true);
    setTestResult({ status: "idle" });
    try {
      const samplePayload = {
        date: new Date().toISOString().split("T")[0],
        overview: "Simulated n8n pipeline digest: Sunny in San Francisco with major advancements in autonomous agents and AI tooling.",
        weatherSummary: {
          city: "San Francisco",
          temperature: 19,
          apparentTemperature: 19,
          weatherCode: 1,
          conditionText: "Mainly Clear",
          windSpeed: 12,
          humidity: 62,
          lifestyleAdvice: "Pleasant outdoor weather throughout the day.",
        },
        newsSummary: [
          {
            id: "n8n-test-1",
            title: "Simulated n8n Ingest: Next.js 15 Agentic Pipelines Reach Enterprise Scale",
            summary: "Workflows leveraging visual orchestration paired with modern edge frameworks report 40% reduction in glue code maintenance.",
            source: "n8n Automation Feed",
            url: "https://n8n.io",
            category: "tech",
            publishedAt: new Date().toISOString(),
            aiTakeaway: "Visual pipelines provide rapid feedback loops for news scrapers and weather alerts.",
          },
        ],
        source: "n8n_test_simulator",
      };

      const res = await fetch("/api/webhooks/n8n", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(samplePayload),
      });

      const data = await res.json();
      if (res.ok) {
        setTestResult({
          status: "success",
          message: data.message || "Webhook successfully received by Next.js receiver!",
        });
      } else {
        setTestResult({
          status: "error",
          message: data.error || "Failed to trigger webhook",
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      setTestResult({ status: "error", message });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-orange-200/80 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-rose-500/10 p-6 dark:border-orange-900/30">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-500/30">
            <Workflow className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              n8n Workflow Integration Hub
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Visual automation, scheduling, feed polling, and AI pipeline orchestration.
            </p>
          </div>
        </div>
      </div>

      {/* Webhook Endpoint Config */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Webhook Receiver URL
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
          Configure your n8n HTTP Request node to send synthesized daily digests to this endpoint:
        </p>

        <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-950">
          <span className="rounded-md bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
            POST
          </span>
          <code className="flex-1 font-mono text-xs text-zinc-800 dark:text-zinc-200">
            {webhookUrl}
          </code>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 shadow-sm hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            {copiedUrl ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Workflow Template File */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-orange-500" />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Pre-Packaged Workflow Template
              </h3>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              A complete importable n8n workflow has been generated directly in your repository:
            </p>
            <div className="mt-2 rounded-lg bg-zinc-100 p-2 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              workflows/n8n/beta-digest-n8n-workflow.json
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl border border-zinc-200/80 p-3 dark:border-zinc-800">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">1. Trigger</span>
            <p className="mt-1 text-[11px] text-zinc-500">Cron schedule runs every morning at 07:00 AM</p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 p-3 dark:border-zinc-800">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">2. Ingest</span>
            <p className="mt-1 text-[11px] text-zinc-500">Fetches Open-Meteo weather and RSS feeds</p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 p-3 dark:border-zinc-800">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">3. Synthesize</span>
            <p className="mt-1 text-[11px] text-zinc-500">Formats structured briefs & AI takeaways</p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 p-3 dark:border-zinc-800">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">4. Dispatch</span>
            <p className="mt-1 text-[11px] text-zinc-500">Pushes payload to Next.js webhook receiver</p>
          </div>
        </div>
      </div>

      {/* Simulator Test Tool */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          Interactive Webhook Simulator
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Test the Next.js receiver endpoint by simulating a synthetic payload from n8n:
        </p>

        <button
          onClick={handleTriggerTest}
          disabled={sendingTest}
          className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-orange-600/20 hover:bg-orange-500 disabled:opacity-50"
        >
          {sendingTest ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span>Send Test Webhook Payload</span>
        </button>

        {testResult.status !== "idle" && (
          <div
            className={`mt-4 rounded-xl p-3 text-xs leading-relaxed ${
              testResult.status === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
            }`}
          >
            <strong>{testResult.status === "success" ? "✓ Success: " : "✕ Error: "}</strong>
            {testResult.message}
          </div>
        )}
      </div>
    </div>
  );
}
