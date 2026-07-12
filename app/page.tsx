// app/page.tsx — Modul-Startseite

import Link from "next/link";

const R = {
  green:      "#1A5C3A",
  greenLight: "#E8F2EC",
  greenMid:   "#4A8C6A",
  white:      "#FFFFFF",
  offWhite:   "#F7F8F6",
  border:     "#E2E8E4",
  text:       "#1A1A1A",
  textMid:    "#555555",
  textLight:  "#999999",
};

const MODULES = [
  {
    href: "/bankability",
    nummer: "01",
    titel: "Bankability Check",
    beschreibung: "KI-gestütztes Erstgespräch in 13 Fragen. Am Ende: strukturierte Einschätzung Ihrer Bankfähigkeit mit Branchenbenchmarks.",
    dauer: "ca. 12 Minuten",
    icon: "◈",
    status: "Verfügbar",
  },
  {
    href: "/benchmark",
    nummer: "02",
    titel: "Branchen-Benchmark",
    beschreibung: "Vergleichen Sie Ihre Kennzahlen mit dem Branchendurchschnitt. 54 Branchen, 10 KPIs — direkt aus der Bundesbank-Jahresabschlussstatistik.",
    dauer: "ca. 3 Minuten",
    icon: "◉",
    status: "Verfügbar",
  },
  {
    href: "/marktentwicklung",
    nummer: "03",
    titel: "Marktentwicklung",
    beschreibung: "Aktuelle Zinsen, Kreditkonditionen und Finanzierungsmarkt-Indikatoren für den deutschen Mittelstand.",
    dauer: "Echtzeit",
    icon: "◎",
    status: "Demnächst",
  },
];

export default function Home() {
  return (
    <div style={{ background: R.offWhite, minHeight: "100vh", fontFamily: "'Helvetica Neue', sans-serif" }}>
      {/* Header */}
      <div style={{ background: R.white, borderBottom: `1px solid ${R.border}`, padding: "0 64px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.08em", color: R.green }}>RÖDL</span>
          <span style={{ fontSize: 11, color: R.textLight, marginLeft: 12, letterSpacing: "0.06em" }}>Debt Advisory</span>
        </div>
        <div style={{ fontSize: 11, color: R.textLight }}>Finanzierungs-Tools für den Mittelstand</div>
      </div>

      {/* Hero */}
      <div style={{ padding: "72px 64px 48px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: R.greenMid, marginBottom: 12 }}>
          Debt Advisory Platform
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 300, color: R.text, margin: 0, lineHeight: 1.25, letterSpacing: "-0.02em" }}>
          Wo steht Ihr Unternehmen<br />in der Finanzierungsfähigkeit?
        </h1>
        <p style={{ fontSize: 15, color: R.textMid, marginTop: 20, lineHeight: 1.75, maxWidth: 600 }}>
          Drei strukturierte Tools — basierend auf echten Bundesbank-Daten und KI-gestützter Analyse. Kostenlos, anonym, ohne Registrierung.
        </p>
      </div>

      {/* Module Cards */}
      <div style={{ padding: "0 64px 80px", maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {MODULES.map((mod) => {
          const isAvailable = mod.status === "Verfügbar";
          const card = (
            <div style={{
              background: R.white,
              border: `1px solid ${R.border}`,
              borderRadius: 8,
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              opacity: isAvailable ? 1 : 0.6,
              transition: "box-shadow 0.2s, transform 0.2s",
              cursor: isAvailable ? "pointer" : "default",
              textDecoration: "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 24, color: R.greenMid }}>{mod.icon}</div>
                <div style={{
                  fontSize: 10, letterSpacing: "0.1em", padding: "3px 8px",
                  borderRadius: 3, fontWeight: 600,
                  background: isAvailable ? R.greenLight : "#F5F5F5",
                  color: isAvailable ? R.green : R.textLight,
                }}>
                  {mod.status}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: R.textLight, letterSpacing: "0.1em", marginBottom: 6 }}>{mod.nummer}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: R.text, marginBottom: 10, lineHeight: 1.3 }}>{mod.titel}</div>
                <div style={{ fontSize: 13, color: R.textMid, lineHeight: 1.7 }}>{mod.beschreibung}</div>
              </div>
              <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `1px solid ${R.border}` }}>
                <div style={{ fontSize: 11, color: R.textLight }}>{mod.dauer}</div>
                {isAvailable && (
                  <div style={{ fontSize: 12, color: R.green, fontWeight: 600, letterSpacing: "0.04em" }}>
                    Starten →
                  </div>
                )}
              </div>
            </div>
          );

          return isAvailable ? (
            <Link key={mod.href} href={mod.href} style={{ textDecoration: "none" }}>
              {card}
            </Link>
          ) : (
            <div key={mod.href}>{card}</div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${R.border}`, background: R.white, padding: "20px 64px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, color: R.textLight }}>
          Benchmarks: Deutsche Bundesbank, Jahresabschlussstatistik Mai 2026 (Berichtsjahr 2023)
        </div>
        <div style={{ fontSize: 11, color: R.textLight }}>© 2026 RÖDL · roedl.com</div>
      </div>
    </div>
  );
}
