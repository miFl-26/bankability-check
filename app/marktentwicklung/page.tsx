"use client";
import { useState, useEffect } from "react";

const R = {
  green: "#1A5C3A", greenLight: "#E8F2EC", greenMid: "#4A8C6A",
  white: "#FFFFFF", offWhite: "#F7F8F6", border: "#E2E8E4",
  text: "#1A1A1A", textMid: "#555555", textLight: "#999999",
  amber: "#C47B1A", amberLight: "#FDF3E3", red: "#C0392B", redLight: "#FDEDEB",
};

interface MarktData {
  timestamp: string;
  ecbRate:   { rate: number; date: string } | null;
  euribor:   { rate3m: number; rate6m: number; date: string } | null;
  inflation: { rate: number; date: string } | null;
  govBond:   { de10y: number; date: string } | null;
}

function fmt(val: number | null | undefined, decimals = 2): string {
  if (val === null || val === undefined) return "—";
  return val.toFixed(decimals) + " %";
}

function Kachel({ label, wert, sub, trend, color }: {
  label: string; wert: string; sub: string; trend?: string; color?: string;
}) {
  return (
    <div style={{ background: R.white, border: `1px solid ${R.border}`, borderRadius: 8, padding: "24px 28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.textLight, marginBottom: 12 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 300, color: color || R.text, letterSpacing: "-0.02em", marginBottom: 6 }}>{wert}</div>
      <div style={{ fontSize: 12, color: R.textMid }}>{sub}</div>
      {trend && <div style={{ fontSize: 11, color: R.textLight, marginTop: 6 }}>{trend}</div>}
    </div>
  );
}

function Kontext({ title, items }: { title: string; items: {label: string; wert: string; farbe?: string}[] }) {
  return (
    <div style={{ background: R.white, border: `1px solid ${R.border}`, borderRadius: 8, padding: "24px 28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: R.text, marginBottom: 16 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: i < items.length - 1 ? `1px solid ${R.border}` : "none" }}>
            <div style={{ fontSize: 13, color: R.textMid }}>{item.label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: item.farbe || R.text }}>{item.wert}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarktentwicklungPage() {
  const [data, setData] = useState<MarktData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/markt")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  // Derived context values for Mittelstand relevance
  const euribor3m = data?.euribor?.rate3m;
  const de10y = data?.govBond?.de10y;
  const inflation = data?.inflation?.rate;

  // Typical Mittelstand loan spread over EURIBOR: 1.5-2.5%
  const kreditkostenEst = euribor3m !== undefined && euribor3m !== null
    ? `ca. ${(euribor3m + 1.5).toFixed(1)}–${(euribor3m + 2.5).toFixed(1)} %`
    : "—";

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

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 24, fontWeight: 300, color: R.text, margin: "0 0 8px", letterSpacing: "-0.01em" }}>Marktentwicklung</h1>
          <p style={{ fontSize: 13, color: R.textMid, margin: 0, lineHeight: 1.7 }}>
            Aktuelle Zinsen und Finanzierungsmarkt-Indikatoren — relevant für Ihre Finanzierungsentscheidungen.
          </p>
          {data && (
            <div style={{ fontSize: 11, color: R.textLight, marginTop: 8 }}>
              Letzte Aktualisierung: {new Date(data.timestamp).toLocaleString("de-DE")} · Quelle: Europäische Zentralbank (EZB)
            </div>
          )}
        </div>

        {loading && (
          <div style={{ textAlign: "center" as const, padding: "64px 0", color: R.textLight }}>
            <div style={{ fontSize: 13 }}>Daten werden geladen…</div>
          </div>
        )}

        {error && (
          <div style={{ background: R.redLight, border: `1px solid ${R.red}`, borderRadius: 8, padding: "20px 24px", fontSize: 13, color: R.red }}>
            Daten konnten nicht geladen werden. Bitte Seite neu laden.
          </div>
        )}

        {data && !loading && (
          <>
            {/* Leitzinsen */}
            <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: R.textLight, marginBottom: 14 }}>EZB-Leitzinsen</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
              <Kachel
                label="EZB-Einlagefazilität"
                wert={fmt(data.ecbRate?.rate)}
                sub="Wichtigster Leitzins seit 2022-Reform"
                color={data.ecbRate?.rate && data.ecbRate.rate > 3 ? R.amber : R.green}
              />
              <Kachel
                label="EURIBOR 3M"
                wert={fmt(data.euribor?.rate3m)}
                sub="Kurzfristzins · Referenz für variabel verzinste Kredite"
                color={R.text}
              />
              <Kachel
                label="EURIBOR 6M"
                wert={fmt(data.euribor?.rate6m)}
                sub="Referenz für Schuldscheindarlehen"
                color={R.text}
              />
            </div>

            {/* Kapitalmarkt & Inflation */}
            <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: R.textLight, marginBottom: 14 }}>Kapitalmarkt & Inflation</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 32 }}>
              <Kachel
                label="Bundesanleihe 10 Jahre"
                wert={fmt(data.govBond?.de10y)}
                sub="Risikofreier Referenzzins · Basis für Kreditmargen"
                color={R.text}
              />
              <Kachel
                label="Inflation Eurozone (HVPI)"
                wert={fmt(data.inflation?.rate)}
                sub="Harmonisierter Verbraucherpreisindex · Jahresrate"
                color={inflation && inflation > 3 ? R.red : inflation && inflation > 2 ? R.amber : R.green}
              />
            </div>

            {/* Relevanz für Mittelstand */}
            <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: R.textLight, marginBottom: 14 }}>Relevanz für Mittelstandsfinanzierung</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Kontext
                title="Typische Kreditkosten für Mittelstand"
                items={[
                  { label: "Variabel (EURIBOR 3M + Marge)", wert: kreditkostenEst, farbe: R.text },
                  { label: "Fest 5 Jahre (Bund 10Y + Marge)", wert: de10y !== undefined && de10y !== null ? `ca. ${(de10y + 1.0).toFixed(1)}–${(de10y + 2.0).toFixed(1)} %` : "—" },
                  { label: "Schuldschein 5J (EURIBOR 6M + Spread)", wert: euribor3m !== undefined && euribor3m !== null ? `ca. ${(euribor3m + 0.8).toFixed(1)}–${(euribor3m + 1.8).toFixed(1)} %` : "—" },
                ]}
              />
              <Kontext
                title="Markteinschätzung"
                items={[
                  {
                    label: "Zinsumfeld",
                    wert: euribor3m !== null && euribor3m !== undefined
                      ? euribor3m > 3 ? "Erhöht" : euribor3m > 1.5 ? "Moderat" : "Niedrig"
                      : "—",
                    farbe: euribor3m !== null && euribor3m !== undefined
                      ? euribor3m > 3 ? R.red : euribor3m > 1.5 ? R.amber : R.green
                      : R.textLight,
                  },
                  {
                    label: "Inflationsdruck",
                    wert: inflation !== null && inflation !== undefined
                      ? inflation > 3 ? "Hoch" : inflation > 2 ? "Moderat" : "Stabil"
                      : "—",
                    farbe: inflation !== null && inflation !== undefined
                      ? inflation > 3 ? R.red : inflation > 2 ? R.amber : R.green
                      : R.textLight,
                  },
                  {
                    label: "Finanzierungsklima",
                    wert: euribor3m !== null && euribor3m !== undefined && inflation !== null && inflation !== undefined
                      ? (euribor3m < 2 && inflation < 2.5) ? "Günstig" : (euribor3m > 3.5 || inflation > 3.5) ? "Herausfordernd" : "Neutral"
                      : "—",
                    farbe: euribor3m !== null && euribor3m !== undefined && inflation !== null && inflation !== undefined
                      ? (euribor3m < 2 && inflation < 2.5) ? R.green : (euribor3m > 3.5 || inflation > 3.5) ? R.red : R.amber
                      : R.textLight,
                  },
                ]}
              />
            </div>

            <div style={{ marginTop: 24, padding: "16px 20px", background: R.greenLight, borderRadius: 6, fontSize: 11, color: R.textMid, lineHeight: 1.7 }}>
              <strong style={{ color: R.green }}>Hinweis:</strong> Die angezeigten Kreditkosten sind Schätzwerte basierend auf marktüblichen Spreads für mittelständische Unternehmen mit durchschnittlichem Kreditprofil. Tatsächliche Konditionen hängen von Bonität, Sicherheiten und Bankbeziehung ab. Für eine individuelle Einschätzung steht RÖDL Debt Advisory zur Verfügung.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
