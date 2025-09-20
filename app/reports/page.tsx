"use client";
import React, { useState } from "react";
import type { CyberReport } from "@/lib/CyberReportService";

export default function ReportsPage() {
  const [reports, setReports] = useState<CyberReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState({
    reportHash: "",
    category: "",
    severity: "",
    targetType: "",
  });

  const loadReports = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/reports", { cache: "no-store" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "API error");
      const data: any[] = json.data || [];
      const normalized: CyberReport[] = data.map((report: any, index: number) => ({
        id: Number(report.id ?? index + 1),
        reporter: report.reporter ?? "0x0000000000000000000000000000000000000000",
        reportHash: report.reportHash ?? "",
        category: report.category ?? "",
        severity: report.severity ?? "",
        targetType: report.targetType ?? "",
        timestamp: Number(report.timestamp ?? Date.now() / 1000),
        verified: Boolean(report.verified ?? false),
      }));
      setReports(normalized);
    } catch (e: any) {
      setError(e?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const submitReport = async () => {
    setError("");
    setSubmitting(true);
    try {
      const { reportHash, category, severity, targetType } = form;
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportHash, category, severity, targetType }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "API submit error");
      console.log("Submitted via API, tx:", json.txHash);
      await loadReports();
    } catch (e: any) {
      setError(e?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  const verify = async (id: number) => {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/reports/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: id }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "API verify error");
      console.log("Verified via API, tx:", json.txHash);
      await loadReports();
    } catch (e: any) {
      setError(e?.message || "Verify failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 900 }}>
      <h1>Cyber Reports</h1>

      <section style={{ margin: "12px 0" }}>
        <button onClick={loadReports} disabled={loading}>
          {loading ? "Loading..." : "Load Reports"}
        </button>
      </section>

      {error && (
        <div style={{ color: "red", marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <section style={{ margin: "16px 0", borderTop: "1px solid #ddd", paddingTop: 16 }}>
        <h2>Submit Report</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            Report Hash
            <input
              type="text"
              value={form.reportHash}
              onChange={(e) => setForm((f) => ({ ...f, reportHash: e.target.value }))}
              placeholder="IPFS or content hash"
              style={{ width: "100%" }}
            />
          </label>
          <label>
            Category
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="phishing, malware..."
              style={{ width: "100%" }}
            />
          </label>
          <label>
            Severity
            <input
              type="text"
              value={form.severity}
              onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}
              placeholder="low | medium | high | critical"
              style={{ width: "100%" }}
            />
          </label>
          <label>
            Target Type
            <input
              type="text"
              value={form.targetType}
              onChange={(e) => setForm((f) => ({ ...f, targetType: e.target.value }))}
              placeholder="email | website | phone ..."
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <div style={{ marginTop: 12 }}>
          <button onClick={submitReport} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Reports</h2>
        {reports.length === 0 ? (
          <p>No reports loaded yet.</p>
        ) : (
          <ul>
            {reports.map((r) => (
              <li key={r.id}>
                #{r.id} | {r.category} | {r.severity} | {new Date(r.timestamp * 1000).toLocaleString()} | reporter {r.reporter} | {r.verified ? "verified" : "unverified"}
                {!r.verified && (
                  <button style={{ marginLeft: 8 }} onClick={() => verify(r.id)} disabled={submitting}>
                    Verify
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
