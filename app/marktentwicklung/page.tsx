"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

const R = {
  green: "#1A5C3A", greenLight: "#E8F2EC", greenMid: "#4A8C6A",
  white: "#FFFFFF", offWhite: "#F7F8F6", border: "#E2E8E4",
  text: "#1A1A1A", textMid: "#555555", textLight: "#999999",
  amber: "#C47B1A", red: "#C0392B",
  navy: "#1B2A4A", blue: "#2E6DA4",
};

// Historical data Jan 2022 – Jun 2026 (monthly, sourced from ECB/Bundesbank)
// EZB Deposit Facility Rate (DFR), EURIBOR 3M, Bundesanleihe 10J
const HISTORISCH = [
  { m: "Jan 22", dfr: -0.50, e3m: -0.57, bund10: 0.03 },
  { m: "Feb 22", dfr: -0.50, e3m: -0.53, bund10: 0.23 },
  { m: "Mär 22", dfr: -0.50, e3m: -0.50, bund10: 0.55 },
  { m: "Apr 22", dfr: -0.50, e3m: -0.41, bund10: 0.93 },
  { m: "Mai 22", dfr: -0.50, e3m: -0.27, bund10: 1.13 },
  { m: "Jun 22", dfr: -0.50, e3m:  0.08, bund10: 1.61 },
  { m: "Jul 22", dfr:  0.00, e3m:  0.25, bund10: 0.97 },
  { m: "Aug 22", dfr:  0.00, e3m:  0.75, bund10: 1.25 },
  { m: "Sep 22", dfr:  0.75, e3m:  1.18, bund10: 1.97 },
  { m: "Okt 22", dfr:  1.50, e3m:  1.69, bund10: 2.32 },
  { m: "Nov 22", dfr:  1.50, e3m:  2.14, bund10: 2.14 },
  { m: "Dez 22", dfr:  2.00, e3m:  2.37, bund10: 2.57 },
  { m: "Jan 23", dfr:  2.00, e3m:  2.60, bund10: 2.48 },
  { m: "Feb 23", dfr:  2.50, e3m:  2.88, bund10: 2.65 },
  { m: "Mär 23", dfr:  3.00, e3m:  3.03, bund10: 2.65 },
  { m: "Apr 23", dfr:  3.00, e3m:  3.22, bund10: 2.38 },
  { m: "Mai 23", dfr:  3.25, e3m:  3.46, bund10: 2.47 },
  { m: "Jun 23", dfr:  3.50, e3m:  3.54, bund10: 2.45 },
  { m: "Jul 23", dfr:  3.75, e3m:  3.69, bund10: 2.64 },
  { m: "Aug 23", dfr:  3.75, e3m:  3.82, bund10: 2.65 },
  { m: "Sep 23", dfr:  4.00, e3m:  3.96, bund10: 2.84 },
  { m: "Okt 23", dfr:  4.00, e3m:  3.97, bund10: 2.97 },
  { m: "Nov 23", dfr:  4.00, e3m:  3.95, bund10: 2.69 },
  { m: "Dez 23", dfr:  4.00, e3m:  3.92, bund10: 2.46 },
  { m: "Jan 24", dfr:  4.00, e3m:  3.91, bund10: 2.41 },
  { m: "Feb 24", dfr:  4.00, e3m:  3.92, bund10: 2.44 },
  { m: "Mär 24", dfr:  4.00, e3m:  3.94, bund10: 2.45 },
  { m: "Apr 24", dfr:  4.00, e3m:  3.90, bund10: 2.60 },
  { m: "Mai 24", dfr:  4.00, e3m:  3.81, bund10: 2.64 },
  { m: "Jun 24", dfr:  3.75, e3m:  3.72, bund10: 2.59 },
  { m: "Jul 24", dfr:  3.75, e3m:  3.63, bund10: 2.49 },
  { m: "Aug 24", dfr:  3.75, e3m:  3.50, bund10: 2.34 },
  { m: "Sep 24", dfr:  3.50, e3m:  3.44, bund10: 2.20 },
  { m: "Okt 24", dfr:  3.25, e3m:  3.22, bund10: 2.30 },
  { m: "Nov 24", dfr:  3.25, e3m:  3.11, bund10: 2.25 },
  { m: "Dez 24", dfr:  3.00, e3m:  2.92, bund10: 2.36 },
  { m: "Jan 25", dfr:  2.75, e3m:  2.68, bund10: 2.54 },
  { m: "Feb 25", dfr:  2.75, e3m:  2.60, bund10: 2.49 },
  { m: "Mär 25", dfr:  2.50, e3m:  2.49, bund10: 2.79 },
  { m: "Apr 25", dfr:  2.25, e3m:  2.39, bund10: 2.56 },
  { m: "Mai 25", dfr:  2.25, e3m:  2.30, bund10: 2.64 },
  { m: "Jun 25", dfr:  2.00, e3m:  2.15, bund10: 2.67 },
  { m: "Jul 25", dfr:  2.00, e3m:  2.05, bund10: 2.72 },
];

// Tick every 6 months
const TICKS = HISTORISCH.filter((_, i) => i % 6 === 0).map(d => d.m);

const CustomTooltip = ({ active, payload, label }: {active?: boolean; payload?: {color: string; name: string; value: number}[]; label?: string}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: R.white, border: `1px solid ${R.border}`, borderRadius: 6, padding: "10px 14px", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <div style={{ fontWeight: 600, color: R.text, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{p.value?.toFixed(2)} %</strong>
        </div>
      ))}
    </div>
  );
};

function ChartCard({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div style={{ background: R.white, border: `1px solid ${R.border}`, borderRadius: 8, padding: "24px 28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: R.text, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 11, color: R.textLight, marginBottom: 20 }}>{sub}</div>
      {children}
    </div>
  );
}

function KPI({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div style={{ background: R.white, border: `1px solid ${R.border}`, borderRadius: 8, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.textLight, marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 300, color: color || R.text, letterSpacing: "-0.02em", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: R.textMid }}>{sub}</div>
    </div>
  );
}

export default function MarktentwicklungPage() {
  const [liveData, setLiveData] = useState<{ecbRate?: number; euribor3m?: number; euribor6m?: number; inflation?: number; bund10y?: number} | null>(null);

  useEffect(() => {
    fetch("/api/markt")
      .then(r => r.json())
      .then(d => setLiveData({
        ecbRate:  d.ecbRate?.rate,
        euribor3m: d.euribor?.rate3m,
        euribor6m: d.euribor?.rate6m,
        inflation: d.inflation?.rate,
        bund10y:  d.govBond?.de10y,
      }))
      .catch(() => {});
  }, []);

  const fmt = (v?: number) => v !== undefined && v !== null ? `${v.toFixed(2)} %` : "—";

  // Enrich chart data with live latest point if available
  const chartData = [...HISTORISCH];
  const latestLive = liveData?.euribor3m;
  if (latestLive) {
    const last = chartData[chartData.length - 1];
    if (last.e3m !== latestLive) {
      chartData.push({ m: "Aktuell", dfr: liveData?.ecbRate ?? last.dfr, e3m: latestLive, bund10: liveData?.bund10y ?? last.bund10 });
    }
  }

  const euribor3m = liveData?.euribor3m ?? HISTORISCH[HISTORISCH.length - 1].e3m;
  const bund10y   = liveData?.bund10y   ?? HISTORISCH[HISTORISCH.length - 1].bund10;
  const ecbRate   = liveData?.ecbRate   ?? HISTORISCH[HISTORISCH.length - 1].dfr;

  return (
    <div style={{ background: R.offWhite, minHeight: "100vh", fontFamily: "'Helvetica Neue', sans-serif" }}>
      <style>{`* { box-sizing: border-box; }`}</style>

      {/* Header */}
      <div style={{ background: R.white, borderBottom: `1px solid ${R.border}`, padding: "0 48px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.08em", color: R.green, textDecoration: "none" }}>RÖDL</a>
          <span style={{ color: R.border }}>|</span>
          <span style={{ fontSize: 13, color: R.textMid }}>Marktentwicklung</span>
        </div>
        <a href="/" style={{ fontSize: 11, color: R.textLight, textDecoration: "none" }}>← Alle Module</a>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 300, color: R.text, margin: "0 0 6px", letterSpacing: "-0.01em" }}>Marktentwicklung</h1>
          <p style={{ fontSize: 13, color: R.textMid, margin: 0 }}>Zinsentwicklung und Finanzierungsmarkt-Indikatoren seit 2022 · Quelle: EZB, Bundesbank</p>
        </div>

        {/* KPI Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 32 }}>
          <KPI label="EZB Einlagefazilität" value={fmt(ecbRate)} sub="Leitzins" color={ecbRate > 2 ? R.amber : R.green} />
          <KPI label="EURIBOR 3M" value={fmt(euribor3m)} sub="Kurzfristzins" />
          <KPI label="EURIBOR 6M" value={fmt(liveData?.euribor6m)} sub="Schuldschein-Referenz" />
          <KPI label="Bundesanleihe 10J" value={fmt(bund10y)} sub="Risikofreier Zins" />
          <KPI label="Inflation (HVPI)" value={fmt(liveData?.inflation)} sub="Eurozone Jahresrate" color={liveData?.inflation && liveData.inflation > 3 ? R.red : R.green} />
        </div>

        {/* Chart 1: EZB + EURIBOR */}
        <div style={{ marginBottom: 20 }}>
          <ChartCard title="EZB-Leitzins & EURIBOR 3M" sub="In % p.a. · Jan 2022 – heute · Quelle: Europäische Zentralbank">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
                <XAxis dataKey="m" ticks={TICKS} tick={{ fontSize: 10, fill: R.textLight }} />
                <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: R.textLight }} domain={[-1, 5]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine y={0} stroke="#CCC" strokeDasharray="2 2" />
                <Line type="monotone" dataKey="dfr" name="EZB Einlagefazilität" stroke={R.navy} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="e3m" name="EURIBOR 3M" stroke={R.blue} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Chart 2: Bundesanleihe */}
        <div style={{ marginBottom: 32 }}>
          <ChartCard title="Bundesanleihe 10 Jahre" sub="Rendite in % p.a. · Jan 2022 – heute · Quelle: Deutsche Bundesbank">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
                <XAxis dataKey="m" ticks={TICKS} tick={{ fontSize: 10, fill: R.textLight }} />
                <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: R.textLight }} domain={[0, 4]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="bund10" name="Bund 10J" stroke={R.green} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Mittelstand Relevanz */}
        <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: R.textLight, marginBottom: 14 }}>Relevanz für Mittelstandsfinanzierung</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{ background: R.white, border: `1px solid ${R.border}`, borderRadius: 8, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: R.text, marginBottom: 14 }}>Typische Kreditkosten</div>
            {[
              { label: "Variabel (EURIBOR 3M + Marge 1,5–2,5%)", wert: `${(euribor3m + 1.5).toFixed(1)}–${(euribor3m + 2.5).toFixed(1)} %` },
              { label: "Fest 5J (Bund 10J + Marge 1,0–2,0%)", wert: `${(bund10y + 1.0).toFixed(1)}–${(bund10y + 2.0).toFixed(1)} %` },
              { label: "Schuldschein 5J (EURIBOR 6M + Spread 0,8–1,8%)", wert: liveData?.euribor6m ? `${(liveData.euribor6m + 0.8).toFixed(1)}–${(liveData.euribor6m + 1.8).toFixed(1)} %` : "—" },
            ].map((item, i, arr) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${R.border}` : "none" }}>
                <div style={{ fontSize: 12, color: R.textMid }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: R.text, marginLeft: 16, whiteSpace: "nowrap" as const }}>{item.wert}</div>
              </div>
            ))}
          </div>
          <div style={{ background: R.white, border: `1px solid ${R.border}`, borderRadius: 8, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: R.text, marginBottom: 14 }}>Markteinschätzung</div>
            {[
              { label: "Zinsumfeld", wert: euribor3m > 3 ? "Erhöht" : euribor3m > 1.5 ? "Moderat" : "Günstig", farbe: euribor3m > 3 ? R.red : euribor3m > 1.5 ? R.amber : R.green },
              { label: "Zinstrend (seit Peak Sep 23)", wert: "Sinkend ↓", farbe: R.green },
              { label: "Inflationsdruck", wert: liveData?.inflation && liveData.inflation > 3 ? "Hoch" : liveData?.inflation && liveData.inflation > 2 ? "Moderat" : "Stabil", farbe: liveData?.inflation && liveData.inflation > 3 ? R.red : liveData?.inflation && liveData.inflation > 2 ? R.amber : R.green },
              { label: "Finanzierungsklima Mittelstand", wert: euribor3m < 2.5 ? "Verbessernd" : "Neutral", farbe: euribor3m < 2.5 ? R.green : R.amber },
            ].map((item, i, arr) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${R.border}` : "none" }}>
                <div style={{ fontSize: 12, color: R.textMid }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: item.farbe }}>{item.wert}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "14px 20px", background: R.greenLight, borderRadius: 6, fontSize: 11, color: R.textMid, lineHeight: 1.7 }}>
          <strong style={{ color: R.green }}>Hinweis:</strong> Kreditkosten sind Schätzwerte auf Basis marktüblicher Spreads für Mittelstand mit durchschnittlichem Kreditprofil. Tatsächliche Konditionen hängen von Bonität, Sicherheiten und Bankbeziehung ab.
        </div>
      </div>
    </div>
  );
}
