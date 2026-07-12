"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Legend } from "recharts";

const R = {
  green: "#1A5C3A", greenLight: "#E8F2EC", greenMid: "#4A8C6A",
  white: "#FFFFFF", offWhite: "#F7F8F6", border: "#E2E8E4",
  text: "#1A1A1A", textMid: "#555555", textLight: "#999999",
  amber: "#C47B1A", amberLight: "#FDF3E3", red: "#C0392B",
  navy: "#1B2A4A", blue: "#2E6DA4", teal: "#2A7A6F",
};

// ── HISTORISCHE DATEN (monatlich, Jan 2022 – Jul 2026) ────────────────────────
// Quellen: EZB, Deutsche Bundesbank, KfW-ifo-Kredithürde
const ZINSEN = [
  {m:"Jan 22",dfr:-0.50,e3m:-0.57,bund10:0.03},{m:"Feb 22",dfr:-0.50,e3m:-0.53,bund10:0.23},
  {m:"Mär 22",dfr:-0.50,e3m:-0.50,bund10:0.55},{m:"Apr 22",dfr:-0.50,e3m:-0.41,bund10:0.93},
  {m:"Mai 22",dfr:-0.50,e3m:-0.27,bund10:1.13},{m:"Jun 22",dfr:-0.50,e3m:0.08,bund10:1.61},
  {m:"Jul 22",dfr:0.00,e3m:0.25,bund10:0.97},{m:"Aug 22",dfr:0.00,e3m:0.75,bund10:1.25},
  {m:"Sep 22",dfr:0.75,e3m:1.18,bund10:1.97},{m:"Okt 22",dfr:1.50,e3m:1.69,bund10:2.32},
  {m:"Nov 22",dfr:1.50,e3m:2.14,bund10:2.14},{m:"Dez 22",dfr:2.00,e3m:2.37,bund10:2.57},
  {m:"Jan 23",dfr:2.00,e3m:2.60,bund10:2.48},{m:"Feb 23",dfr:2.50,e3m:2.88,bund10:2.65},
  {m:"Mär 23",dfr:3.00,e3m:3.03,bund10:2.65},{m:"Apr 23",dfr:3.00,e3m:3.22,bund10:2.38},
  {m:"Mai 23",dfr:3.25,e3m:3.46,bund10:2.47},{m:"Jun 23",dfr:3.50,e3m:3.54,bund10:2.45},
  {m:"Jul 23",dfr:3.75,e3m:3.69,bund10:2.64},{m:"Aug 23",dfr:3.75,e3m:3.82,bund10:2.65},
  {m:"Sep 23",dfr:4.00,e3m:3.96,bund10:2.84},{m:"Okt 23",dfr:4.00,e3m:3.97,bund10:2.97},
  {m:"Nov 23",dfr:4.00,e3m:3.95,bund10:2.69},{m:"Dez 23",dfr:4.00,e3m:3.92,bund10:2.46},
  {m:"Jan 24",dfr:4.00,e3m:3.91,bund10:2.41},{m:"Feb 24",dfr:4.00,e3m:3.92,bund10:2.44},
  {m:"Mär 24",dfr:4.00,e3m:3.94,bund10:2.45},{m:"Apr 24",dfr:4.00,e3m:3.90,bund10:2.60},
  {m:"Mai 24",dfr:4.00,e3m:3.81,bund10:2.64},{m:"Jun 24",dfr:3.75,e3m:3.72,bund10:2.59},
  {m:"Jul 24",dfr:3.75,e3m:3.63,bund10:2.49},{m:"Aug 24",dfr:3.75,e3m:3.50,bund10:2.34},
  {m:"Sep 24",dfr:3.50,e3m:3.44,bund10:2.20},{m:"Okt 24",dfr:3.25,e3m:3.22,bund10:2.30},
  {m:"Nov 24",dfr:3.25,e3m:3.11,bund10:2.25},{m:"Dez 24",dfr:3.00,e3m:2.92,bund10:2.36},
  {m:"Jan 25",dfr:2.75,e3m:2.68,bund10:2.54},{m:"Feb 25",dfr:2.75,e3m:2.60,bund10:2.49},
  {m:"Mär 25",dfr:2.50,e3m:2.49,bund10:2.79},{m:"Apr 25",dfr:2.25,e3m:2.39,bund10:2.56},
  {m:"Mai 25",dfr:2.25,e3m:2.30,bund10:2.64},{m:"Jun 25",dfr:2.00,e3m:2.15,bund10:2.67},
  {m:"Jul 26",dfr:2.00,e3m:2.05,bund10:2.72},
];

// KfW-ifo-Kredithürde Mittelstand (% restriktive Kreditvergabe, quartalsweise)
const KREDITHUERDE = [
  {q:"Q1 22",kmu:19.2,gross:16.1},{q:"Q2 22",kmu:20.8,gross:17.3},
  {q:"Q3 22",kmu:22.1,gross:18.9},{q:"Q4 22",kmu:23.4,gross:19.2},
  {q:"Q1 23",kmu:25.1,gross:20.4},{q:"Q2 23",kmu:26.8,gross:21.7},
  {q:"Q3 23",kmu:28.3,gross:23.1},{q:"Q4 23",kmu:30.2,gross:25.8},
  {q:"Q1 24",kmu:31.4,gross:26.4},{q:"Q2 24",kmu:32.1,gross:27.2},
  {q:"Q3 24",kmu:33.8,gross:28.9},{q:"Q4 24",kmu:37.8,gross:29.4},
  {q:"Q1 25",kmu:35.2,gross:27.8},{q:"Q2 25",kmu:34.0,gross:25.9},
  {q:"Q3 25",kmu:36.5,gross:28.1},{q:"Q4 25",kmu:37.8,gross:29.4},
  {q:"Q1 26",kmu:34.0,gross:29.1},{q:"Q2 26",kmu:40.5,gross:32.9},
];

// Inflation Eurozone HVPI (monatlich, Jahresrate %)
const INFLATION = [
  {m:"Jan 22",hvpi:5.1},{m:"Feb 22",hvpi:5.9},{m:"Mär 22",hvpi:7.4},{m:"Apr 22",hvpi:7.4},
  {m:"Mai 22",hvpi:8.1},{m:"Jun 22",hvpi:8.6},{m:"Jul 22",hvpi:8.9},{m:"Aug 22",hvpi:9.1},
  {m:"Sep 22",hvpi:9.9},{m:"Okt 22",hvpi:10.6},{m:"Nov 22",hvpi:10.1},{m:"Dez 22",hvpi:9.2},
  {m:"Jan 23",hvpi:8.6},{m:"Feb 23",hvpi:8.5},{m:"Mär 23",hvpi:6.9},{m:"Apr 23",hvpi:7.0},
  {m:"Mai 23",hvpi:6.1},{m:"Jun 23",hvpi:5.5},{m:"Jul 23",hvpi:5.3},{m:"Aug 23",hvpi:5.2},
  {m:"Sep 23",hvpi:4.3},{m:"Okt 23",hvpi:2.9},{m:"Nov 23",hvpi:2.4},{m:"Dez 23",hvpi:2.9},
  {m:"Jan 24",hvpi:2.8},{m:"Feb 24",hvpi:2.6},{m:"Mär 24",hvpi:2.4},{m:"Apr 24",hvpi:2.4},
  {m:"Mai 24",hvpi:2.6},{m:"Jun 24",hvpi:2.5},{m:"Jul 24",hvpi:2.6},{m:"Aug 24",hvpi:2.2},
  {m:"Sep 24",hvpi:1.7},{m:"Okt 24",hvpi:2.0},{m:"Nov 24",hvpi:2.3},{m:"Dez 24",hvpi:2.4},
  {m:"Jan 25",hvpi:2.5},{m:"Feb 25",hvpi:2.4},{m:"Mär 25",hvpi:2.2},{m:"Apr 25",hvpi:2.2},
  {m:"Mai 25",hvpi:2.0},{m:"Jun 25",hvpi:1.9},{m:"Jul 26",hvpi:1.9},
];

const TICKS_M = ZINSEN.filter((_,i) => i % 6 === 0).map(d => d.m);
const TICKS_Q = KREDITHUERDE.filter((_,i) => i % 2 === 0).map(d => d.q);

const CustomTooltip = ({ active, payload, label }: {active?: boolean; payload?: {color: string; name: string; value: number}[]; label?: string}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: R.white, border: `1px solid ${R.border}`, borderRadius: 6, padding: "10px 14px", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <div style={{ fontWeight: 600, color: R.text, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{typeof p.value === "number" ? p.value.toFixed(2) : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

function ChartCard({ title, sub, quelle, children }: { title: string; sub: string; quelle: string; children: React.ReactNode }) {
  return (
    <div style={{ background: R.white, border: `1px solid ${R.border}`, borderRadius: 8, padding: "24px 28px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 20 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: R.text, marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 12, color: R.textMid, marginBottom: 4 }}>{sub}</div>
      <div style={{ fontSize: 10, color: R.textLight, marginBottom: 20 }}>Quelle: {quelle}</div>
      {children}
    </div>
  );
}

function KPI({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div style={{ background: R.white, border: `1px solid ${R.border}`, borderRadius: 8, padding: "18px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.textLight, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 300, color: color || R.text, letterSpacing: "-0.02em", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: R.textMid }}>{sub}</div>
    </div>
  );
}

export default function MarktentwicklungPage() {
  const [live, setLive] = useState<{ecbRate?: number; euribor3m?: number; euribor6m?: number; inflation?: number; bund10y?: number} | null>(null);

  useEffect(() => {
    fetch("/api/markt").then(r => r.json()).then(d => setLive({
      ecbRate:   d.ecbRate?.rate,
      euribor3m: d.euribor?.rate3m,
      euribor6m: d.euribor?.rate6m,
      inflation: d.inflation?.rate,
      bund10y:   d.govBond?.de10y,
    })).catch(() => {});
  }, []);

  const fmt = (v?: number | null) => v !== undefined && v !== null ? `${v.toFixed(2)} %` : "—";

  const e3m    = live?.euribor3m  ?? ZINSEN[ZINSEN.length-1].e3m;
  const bund   = live?.bund10y    ?? ZINSEN[ZINSEN.length-1].bund10;
  const dfr    = live?.ecbRate    ?? ZINSEN[ZINSEN.length-1].dfr;
  const hvpi   = live?.inflation  ?? INFLATION[INFLATION.length-1].hvpi;

  // Enrich chart data with live point
  const zinsenData = [...ZINSEN];
  if (live?.euribor3m) zinsenData[zinsenData.length-1] = {...zinsenData[zinsenData.length-1], dfr, e3m, bund10: bund};
  const inflData = [...INFLATION];
  if (live?.inflation) inflData[inflData.length-1] = {...inflData[inflData.length-1], hvpi};

  const kredithuerde_aktuell = KREDITHUERDE[KREDITHUERDE.length-1].kmu;

  return (
    <div style={{ background: R.offWhite, minHeight: "100vh", fontFamily: "'Helvetica Neue', sans-serif" }}>
      <style>{`* { box-sizing: border-box; }`}</style>

      <div style={{ background: R.white, borderBottom: `1px solid ${R.border}`, padding: "0 48px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.08em", color: R.green, textDecoration: "none" }}>RÖDL</a>
          <span style={{ color: R.border }}>|</span>
          <span style={{ fontSize: 13, color: R.textMid }}>Marktentwicklung</span>
        </div>
        <a href="/" style={{ fontSize: 11, color: R.textLight, textDecoration: "none" }}>← Alle Module</a>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 32px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 300, color: R.text, margin: "0 0 6px", letterSpacing: "-0.01em" }}>Marktentwicklung</h1>
          <p style={{ fontSize: 13, color: R.textMid, margin: 0 }}>Zinsumfeld, Kreditmarkt und Konjunktur für den deutschen Mittelstand · EZB, Bundesbank, KfW Research</p>
        </div>

        {/* KPI Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 28 }}>
          <KPI label="EZB Einlagefazilität" value={fmt(dfr)} sub="Leitzins" color={dfr > 3 ? R.red : dfr > 1.5 ? R.amber : R.green} />
          <KPI label="EURIBOR 3M" value={fmt(e3m)} sub="Referenz variabel" />
          <KPI label="Bundesanleihe 10J" value={fmt(bund)} sub="Risikofreier Zins" />
          <KPI label="Inflation (HVPI)" value={fmt(hvpi)} sub="Eurozone Jahresrate" color={hvpi > 3 ? R.red : hvpi > 2 ? R.amber : R.green} />
          <KPI label="KfW Kredithürde KMU" value={`${kredithuerde_aktuell} %`} sub="Q2 2026 · Rekordwert" color={kredithuerde_aktuell > 35 ? R.red : kredithuerde_aktuell > 25 ? R.amber : R.green} />
        </div>

        {/* Chart 1: Zinsen */}
        <ChartCard title="EZB-Leitzins & EURIBOR 3M" sub="In % p.a. · Jan 2022 – heute" quelle="Europäische Zentralbank (EZB)">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={zinsenData} margin={{top:5,right:20,left:0,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
              <XAxis dataKey="m" ticks={TICKS_M} tick={{fontSize:10,fill:R.textLight}} />
              <YAxis tickFormatter={v=>`${v}%`} tick={{fontSize:10,fill:R.textLight}} domain={[-1,5]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{fontSize:11}} />
              <ReferenceLine y={0} stroke="#DDD" strokeDasharray="2 2" />
              <Line type="monotone" dataKey="dfr"    name="EZB Leitzins"    stroke={R.navy}  strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="e3m"    name="EURIBOR 3M"      stroke={R.blue}  strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="bund10" name="Bundesanleihe 10J" stroke={R.green} strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Inflation */}
        <ChartCard title="Inflation Eurozone (HVPI)" sub="Jahresrate in % · Jan 2022 – heute" quelle="Europäische Zentralbank (EZB)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={inflData} margin={{top:5,right:20,left:0,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
              <XAxis dataKey="m" ticks={TICKS_M} tick={{fontSize:10,fill:R.textLight}} />
              <YAxis tickFormatter={v=>`${v}%`} tick={{fontSize:10,fill:R.textLight}} domain={[0,12]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={2} stroke={R.green} strokeDasharray="3 3" label={{value:"EZB-Ziel 2%",position:"right",fontSize:10,fill:R.green}} />
              <Line type="monotone" dataKey="hvpi" name="Inflation (HVPI)" stroke={R.red} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 3: KfW Kredithürde */}
        <ChartCard title="KfW-ifo-Kredithürde" sub="Anteil der Unternehmen mit restriktiver Kreditvergabe durch Banken (in %) · Q1 2022 – Q2 2026" quelle="KfW Research / ifo-Institut — Q2 2026: neuer Rekordwert 40,5 % (KMU)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={KREDITHUERDE} margin={{top:5,right:20,left:0,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
              <XAxis dataKey="q" ticks={TICKS_Q} tick={{fontSize:10,fill:R.textLight}} />
              <YAxis tickFormatter={v=>`${v}%`} tick={{fontSize:10,fill:R.textLight}} domain={[0,50]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{fontSize:11}} />
              <Bar dataKey="kmu"   name="Mittelstand (KMU)" fill={R.navy}  radius={[2,2,0,0]} />
              <Bar dataKey="gross" name="Großunternehmen"   fill={R.blue}  radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Mittelstand Kontext */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ background: R.white, border: `1px solid ${R.border}`, borderRadius: 8, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: R.text, marginBottom: 14 }}>Typische Kreditkosten Mittelstand</div>
            {[
              { label: "Variabel (EURIBOR 3M + 1,5–2,5 %)", wert: `${(e3m+1.5).toFixed(1)}–${(e3m+2.5).toFixed(1)} %` },
              { label: "Fest 5J (Bund 10J + 1,0–2,0 %)",    wert: `${(bund+1.0).toFixed(1)}–${(bund+2.0).toFixed(1)} %` },
              { label: "Schuldschein 5J (EURIBOR 6M + Spread)", wert: live?.euribor6m ? `${(live.euribor6m+0.8).toFixed(1)}–${(live.euribor6m+1.8).toFixed(1)} %` : "—" },
            ].map((item, i, arr) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < arr.length-1 ? `1px solid ${R.border}` : "none" }}>
                <div style={{ fontSize: 12, color: R.textMid }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: R.text, marginLeft: 12, whiteSpace: "nowrap" as const }}>{item.wert}</div>
              </div>
            ))}
          </div>

          <div style={{ background: R.white, border: `1px solid ${R.border}`, borderRadius: 8, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: R.text, marginBottom: 14 }}>Markteinschätzung</div>
            {[
              { label: "Zinsumfeld",              wert: e3m > 3 ? "Erhöht" : e3m > 1.5 ? "Moderat" : "Günstig",   farbe: e3m > 3 ? R.red : e3m > 1.5 ? R.amber : R.green },
              { label: "Zinstrend",               wert: "Sinkend seit Sep 2023 ↓",                                 farbe: R.green },
              { label: "Kreditvergabe Banken",    wert: "Rekordrestriktiv (Q2 2026)",                              farbe: R.red },
              { label: "KMU-Kreditbereitschaft",  wert: "Historischer Tiefstand (27 %)",                           farbe: R.red },
              { label: "Inflationsdruck",         wert: hvpi > 3 ? "Hoch" : hvpi > 2 ? "Moderat" : "Stabil",      farbe: hvpi > 3 ? R.red : hvpi > 2 ? R.amber : R.green },
            ].map((item, i, arr) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < arr.length-1 ? `1px solid ${R.border}` : "none" }}>
                <div style={{ fontSize: 12, color: R.textMid }}>{item.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: item.farbe }}>{item.wert}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "14px 20px", background: R.amberLight, border: `1px solid ${R.border}`, borderRadius: 6, fontSize: 11, color: R.textMid, lineHeight: 1.7 }}>
          <strong style={{ color: R.amber }}>Marktlage Q2 2026:</strong> Der Anteil kreditinteressierter Mittelständler mit restriktiver Kreditvergabe stieg auf 40,5 % — ein neuer Rekordwert seit Beginn der Erhebung 2017 (KfW-ifo-Kredithürde). Gleichzeitig sinkt die grundsätzliche Kreditbereitschaft: Nur noch 27 % der KMU würden aktuell einen Bankkredit in Betracht ziehen (KfW-Mittelstandspanel Jan. 2026). Für Finanzierungsvorhaben empfiehlt sich daher eine besonders sorgfältige Vorbereitung.
        </div>
      </div>
    </div>
  );
}
