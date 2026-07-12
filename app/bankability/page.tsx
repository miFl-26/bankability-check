"use client";

import { useState, useRef, useEffect } from "react";

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
  amber:      "#C47B1A",
  amberLight: "#FDF3E3",
  red:        "#C0392B",
  redLight:   "#FDEDEB",
};

const OPENING = `Guten Tag. Ich begleite Sie durch eine strukturierte Einschätzung Ihrer Bankfähigkeit — das dauert etwa 12 Minuten.

Am Ende erhalten Sie eine grafische Einschätzung mit echten Branchenbenchmarks aus der Bundesbank-Jahresabschlussstatistik 2023.

Fangen wir an: Was beschreibt Ihr Unternehmen — Branche und grob was Sie tun?`;

const TOTAL_QUESTIONS = 13;
const PHASES = [
  { label: "Unternehmen",     questions: 3, icon: "01" },
  { label: "Kennzahlen",      questions: 4, icon: "02" },
  { label: "Vorhaben",        questions: 3, icon: "03" },
  { label: "Kapitalstruktur", questions: 3, icon: "04" },
];

interface BrancheData {
  label: string;
  cashflow: { gruen: number; gelb: number };
  rendite:  { gruen: number; gelb: number };
  bankverb: { gruen: number; gelb: number };
}

const BENCHMARKS: Record<string, BrancheData> = {
  "alle_wirtschaftszweige": { label: "Alle Wirtschaftszweige", cashflow: { gruen: 15.6, gelb: 7.0 }, rendite: { gruen: 10.4, gelb: 4.3 }, bankverb: { gruen: 3.8, gelb: 26.0 } },
  "landwirtschaft": { label: "Land- und Forstwirtschaft, Fischerei", cashflow: { gruen: 12.0, gelb: 5.3 }, rendite: { gruen: 18.9, gelb: 7.7 }, bankverb: { gruen: 25.3, gelb: 46.1 } },
  "bergbau": { label: "Bergbau und Gewinnung von Steinen und Erden", cashflow: { gruen: 11.1, gelb: 5.8 }, rendite: { gruen: 16.6, gelb: 7.2 }, bankverb: { gruen: 5.6, gelb: 21.3 } },
  "verarbeitendes_gewerbe": { label: "Verarbeitendes Gewerbe (gesamt)", cashflow: { gruen: 13.5, gelb: 6.8 }, rendite: { gruen: 9.7, gelb: 4.4 }, bankverb: { gruen: 4.2, gelb: 23.1 } },
  "nahrungsmittel": { label: "Nahrungsmittel- und Futtermittelherstellung", cashflow: { gruen: 15.6, gelb: 7.4 }, rendite: { gruen: 7.1, gelb: 3.1 }, bankverb: { gruen: 6.9, gelb: 27.9 } },
  "getraenke": { label: "Getränkeherstellung", cashflow: { gruen: 7.9, gelb: 3.5 }, rendite: { gruen: 6.3, gelb: 2.1 }, bankverb: { gruen: 11.7, gelb: 32.2 } },
  "textilien": { label: "Herstellung von Textilien", cashflow: { gruen: 12.5, gelb: 5.2 }, rendite: { gruen: 8.0, gelb: 3.1 }, bankverb: { gruen: 5.5, gelb: 24.4 } },
  "holz": { label: "Holz- und Korkwaren (ohne Möbel)", cashflow: { gruen: 13.7, gelb: 7.5 }, rendite: { gruen: 9.4, gelb: 4.1 }, bankverb: { gruen: 12.3, gelb: 29.5 } },
  "papier": { label: "Herstellung von Papier und Pappe", cashflow: { gruen: 14.0, gelb: 6.7 }, rendite: { gruen: 8.7, gelb: 4.3 }, bankverb: { gruen: 3.0, gelb: 21.4 } },
  "druck": { label: "Druckerzeugnisse", cashflow: { gruen: 14.6, gelb: 5.8 }, rendite: { gruen: 7.6, gelb: 2.9 }, bankverb: { gruen: 15.0, gelb: 39.2 } },
  "chemie": { label: "Herstellung von chemischen Erzeugnissen", cashflow: { gruen: 11.4, gelb: 6.4 }, rendite: { gruen: 9.0, gelb: 4.4 }, bankverb: { gruen: 0.0, gelb: 14.1 } },
  "pharma": { label: "Pharmazeutische Erzeugnisse", cashflow: { gruen: 17.0, gelb: 8.5 }, rendite: { gruen: 19.4, gelb: 9.9 }, bankverb: { gruen: 0.0, gelb: 8.9 } },
  "gummi_kunststoff": { label: "Gummi- und Kunststoffwaren", cashflow: { gruen: 13.5, gelb: 6.7 }, rendite: { gruen: 8.8, gelb: 3.7 }, bankverb: { gruen: 7.8, gelb: 25.0 } },
  "glas_keramik": { label: "Glas, Keramik, Steine und Erden", cashflow: { gruen: 15.0, gelb: 7.4 }, rendite: { gruen: 10.5, gelb: 4.9 }, bankverb: { gruen: 2.4, gelb: 21.3 } },
  "metallerzeugung": { label: "Metallerzeugung und -bearbeitung", cashflow: { gruen: 11.9, gelb: 6.2 }, rendite: { gruen: 7.4, gelb: 2.9 }, bankverb: { gruen: 4.2, gelb: 16.3 } },
  "metallerzeugnisse": { label: "Herstellung von Metallerzeugnissen", cashflow: { gruen: 13.3, gelb: 6.8 }, rendite: { gruen: 9.9, gelb: 4.5 }, bankverb: { gruen: 8.7, gelb: 27.7 } },
  "elektronik": { label: "Datenverarbeitungsgeräte und Elektronik", cashflow: { gruen: 14.8, gelb: 7.7 }, rendite: { gruen: 13.1, gelb: 6.4 }, bankverb: { gruen: 0.1, gelb: 16.2 } },
  "elektro_ausruestungen": { label: "Elektrische Ausrüstungen", cashflow: { gruen: 13.9, gelb: 7.1 }, rendite: { gruen: 11.2, gelb: 4.9 }, bankverb: { gruen: 1.3, gelb: 17.6 } },
  "maschinenbau": { label: "Maschinenbau", cashflow: { gruen: 12.3, gelb: 6.4 }, rendite: { gruen: 10.1, gelb: 4.8 }, bankverb: { gruen: 1.3, gelb: 17.4 } },
  "kraftwagen": { label: "Kraftwagen und Kraftwagenteile", cashflow: { gruen: 11.3, gelb: 5.6 }, rendite: { gruen: 6.7, gelb: 2.8 }, bankverb: { gruen: 2.1, gelb: 24.1 } },
  "sonstiger_fahrzeugbau": { label: "Sonstiger Fahrzeugbau", cashflow: { gruen: 9.7, gelb: 4.2 }, rendite: { gruen: 8.3, gelb: 2.3 }, bankverb: { gruen: 0.9, gelb: 22.9 } },
  "moebel": { label: "Herstellung von Möbeln", cashflow: { gruen: 11.8, gelb: 5.5 }, rendite: { gruen: 6.9, gelb: 2.8 }, bankverb: { gruen: 9.7, gelb: 29.6 } },
  "sonstige_waren": { label: "Herstellung von sonstigen Waren", cashflow: { gruen: 16.0, gelb: 8.1 }, rendite: { gruen: 12.5, gelb: 5.9 }, bankverb: { gruen: 5.7, gelb: 25.7 } },
  "reparatur_maschinen": { label: "Reparatur und Installation von Maschinen", cashflow: { gruen: 18.7, gelb: 9.0 }, rendite: { gruen: 11.8, gelb: 5.7 }, bankverb: { gruen: 1.5, gelb: 19.9 } },
  "energieversorgung": { label: "Energieversorgung", cashflow: { gruen: 10.0, gelb: 5.6 }, rendite: { gruen: 27.6, gelb: 9.6 }, bankverb: { gruen: 17.7, gelb: 44.4 } },
  "wasser_entsorgung": { label: "Wasserversorgung; Abwasser- und Abfallentsorgung", cashflow: { gruen: 11.1, gelb: 4.1 }, rendite: { gruen: 11.7, gelb: 5.1 }, bankverb: { gruen: 14.0, gelb: 36.1 } },
  "baugewerbe": { label: "Baugewerbe (gesamt)", cashflow: { gruen: 15.4, gelb: 6.7 }, rendite: { gruen: 11.5, gelb: 5.6 }, bankverb: { gruen: 4.1, gelb: 18.7 } },
  "hochbau": { label: "Hochbau", cashflow: { gruen: 8.6, gelb: 3.9 }, rendite: { gruen: 9.5, gelb: 4.2 }, bankverb: { gruen: 1.9, gelb: 16.6 } },
  "tiefbau": { label: "Tiefbau", cashflow: { gruen: 12.0, gelb: 5.6 }, rendite: { gruen: 11.4, gelb: 5.9 }, bankverb: { gruen: 3.5, gelb: 14.2 } },
  "ausbaugewerbe": { label: "Ausbaugewerbe", cashflow: { gruen: 18.2, gelb: 8.1 }, rendite: { gruen: 12.1, gelb: 6.0 }, bankverb: { gruen: 5.0, gelb: 20.5 } },
  "handel_gesamt": { label: "Handel (gesamt)", cashflow: { gruen: 15.6, gelb: 7.7 }, rendite: { gruen: 7.0, gelb: 3.2 }, bankverb: { gruen: 5.3, gelb: 29.0 } },
  "kfz_handel": { label: "Handel mit Kraftfahrzeugen", cashflow: { gruen: 14.0, gelb: 7.6 }, rendite: { gruen: 6.1, gelb: 3.0 }, bankverb: { gruen: 24.8, gelb: 52.6 } },
  "grosshandel": { label: "Großhandel", cashflow: { gruen: 14.9, gelb: 7.4 }, rendite: { gruen: 7.1, gelb: 3.2 }, bankverb: { gruen: 0.9, gelb: 20.3 } },
  "einzelhandel": { label: "Einzelhandel", cashflow: { gruen: 19.7, gelb: 8.7 }, rendite: { gruen: 7.6, gelb: 3.4 }, bankverb: { gruen: 8.2, gelb: 31.5 } },
  "verkehr_lagerei": { label: "Verkehr und Lagerei (gesamt)", cashflow: { gruen: 14.5, gelb: 6.6 }, rendite: { gruen: 8.6, gelb: 3.4 }, bankverb: { gruen: 11.4, gelb: 41.1 } },
  "landverkehr": { label: "Landverkehr und Transport", cashflow: { gruen: 15.0, gelb: 6.9 }, rendite: { gruen: 9.2, gelb: 3.5 }, bankverb: { gruen: 27.0, gelb: 53.1 } },
  "schifffahrt": { label: "Schifffahrt", cashflow: { gruen: 21.0, gelb: 11.1 }, rendite: { gruen: 30.4, gelb: 11.9 }, bankverb: { gruen: 3.5, gelb: 33.2 } },
  "lagerei": { label: "Lagerei und Verkehrsdienstleistungen", cashflow: { gruen: 13.4, gelb: 6.2 }, rendite: { gruen: 7.6, gelb: 3.1 }, bankverb: { gruen: 2.2, gelb: 32.0 } },
  "gastgewerbe": { label: "Gastgewerbe (Hotels und Gastronomie)", cashflow: { gruen: 27.1, gelb: 11.1 }, rendite: { gruen: 13.0, gelb: 5.6 }, bankverb: { gruen: 6.1, gelb: 36.8 } },
  "information_kommunikation": { label: "Information und Kommunikation (gesamt)", cashflow: { gruen: 20.4, gelb: 8.7 }, rendite: { gruen: 13.4, gelb: 5.5 }, bankverb: { gruen: 0.0, gelb: 6.5 } },
  "verlagswesen": { label: "Verlagswesen", cashflow: { gruen: 19.3, gelb: 7.8 }, rendite: { gruen: 14.6, gelb: 6.4 }, bankverb: { gruen: 0.0, gelb: 2.0 } },
  "telekommunikation": { label: "Telekommunikation", cashflow: { gruen: 17.7, gelb: 6.9 }, rendite: { gruen: 13.8, gelb: 5.3 }, bankverb: { gruen: 0.0, gelb: 12.7 } },
  "it_dienstleistungen": { label: "IT-Dienstleistungen und Informationsdienstleistungen", cashflow: { gruen: 21.2, gelb: 9.1 }, rendite: { gruen: 13.4, gelb: 5.7 }, bankverb: { gruen: 0.0, gelb: 5.7 } },
  "immobilien": { label: "Grundstücks- und Wohnungswesen", cashflow: { gruen: 7.6, gelb: 3.8 }, rendite: { gruen: 41.5, gelb: 16.8 }, bankverb: { gruen: 32.8, gelb: 59.3 } },
  "unternehmensdienstleistungen": { label: "Unternehmensdienstleistungen (gesamt)", cashflow: { gruen: 19.7, gelb: 8.3 }, rendite: { gruen: 15.3, gelb: 5.9 }, bankverb: { gruen: 0.0, gelb: 20.9 } },
  "rechts_steuerberatung": { label: "Rechts- und Steuerberatung, Wirtschaftsprüfung", cashflow: { gruen: 28.4, gelb: 12.1 }, rendite: { gruen: 21.5, gelb: 8.5 }, bankverb: { gruen: 0.0, gelb: 12.6 } },
  "architektur_ingenieure": { label: "Architektur- und Ingenieurbüros", cashflow: { gruen: 16.7, gelb: 6.7 }, rendite: { gruen: 14.4, gelb: 6.3 }, bankverb: { gruen: 0.0, gelb: 8.8 } },
  "personaldienstleistung": { label: "Personaldienstleistungen", cashflow: { gruen: 18.1, gelb: 8.4 }, rendite: { gruen: 6.2, gelb: 2.6 }, bankverb: { gruen: 0.0, gelb: 13.7 } },
  "gebaeudebetreuung": { label: "Gebäudebetreuung und Gartenbau", cashflow: { gruen: 21.6, gelb: 10.0 }, rendite: { gruen: 12.0, gelb: 5.0 }, bankverb: { gruen: 7.3, gelb: 30.9 } },
  "erziehung_unterricht": { label: "Erziehung und Unterricht", cashflow: { gruen: 16.0, gelb: 4.0 }, rendite: { gruen: 8.8, gelb: 2.3 }, bankverb: { gruen: 2.1, gelb: 23.5 } },
  "gesundheitswesen": { label: "Gesundheitswesen", cashflow: { gruen: 10.1, gelb: 2.1 }, rendite: { gruen: 7.3, gelb: 1.1 }, bankverb: { gruen: 1.5, gelb: 19.8 } },
  "heime": { label: "Heime (Pflege und Senioreneinrichtungen)", cashflow: { gruen: 9.4, gelb: 2.3 }, rendite: { gruen: 4.2, gelb: 1.1 }, bankverb: { gruen: 3.7, gelb: 24.9 } },
  "sozialwesen": { label: "Sozialwesen (ohne Heime)", cashflow: { gruen: 21.4, gelb: 7.5 }, rendite: { gruen: 9.1, gelb: 3.2 }, bankverb: { gruen: 3.5, gelb: 23.0 } },
  "sport_unterhaltung": { label: "Sport, Unterhaltung und Erholung", cashflow: { gruen: 21.5, gelb: 6.0 }, rendite: { gruen: 14.4, gelb: 3.3 }, bankverb: { gruen: 6.4, gelb: 32.5 } }
};

interface EinschaetzungData {
  unternehmen: { branche: string; brancheKategorie: string; mitarbeiter: number; region: string; kundenprofil: string };
  kennzahlen: { umsatz: number; jahresergebnis: number; renditeMarge: number; bankverbindlichkeiten: number; bankverbindlichkeitenPctBilanzsumme: number; cashflowMarge: number };
  finanzierung: { anlass: string; kapitalbedarf: number; zeitraum: string; hausbankStatus: string };
  staerken: string[];
  handlungsfelder: string[];
  gesamteinschaetzung: string;
}

function parseEinschaetzung(text: string): EinschaetzungData | null {
  try {
    const start = text.indexOf("EINSCHAETZUNG_JSON_START");
    const end   = text.indexOf("EINSCHAETZUNG_JSON_ENDE");
    if (start === -1 || end === -1) return null;
    return JSON.parse(text.substring(start + "EINSCHAETZUNG_JSON_START".length, end).trim());
  } catch { return null; }
}

function getAmpel(value: number, gruen: number, gelb: number, higherIsBetter: boolean) {
  if (value === -1) return "grau";
  if (higherIsBetter) return value >= gruen ? "gruen" : value >= gelb ? "gelb" : "rot";
  return value <= gruen ? "gruen" : value <= gelb ? "gelb" : "rot";
}

const AMPEL_STYLES = {
  gruen: { bg: R.greenLight,  border: R.greenMid, text: R.green, bar: R.green, label: "SOLIDE" },
  gelb:  { bg: R.amberLight,  border: R.amber,    text: R.amber, bar: R.amber, label: "BEOBACHTEN" },
  rot:   { bg: R.redLight,    border: R.red,       text: R.red,  bar: R.red,   label: "KRITISCH" },
  grau:  { bg: "#F5F5F5",    border: "#CCC",       text: "#999", bar: "#CCC",  label: "KEINE ANGABE" },
};

function BenchmarkBar({ label, value, unit, bench, higherIsBetter, maxVal }: {
  label: string; value: number; unit: string;
  bench: { gruen: number; gelb: number };
  higherIsBetter: boolean; maxVal: number;
}) {
  const status = getAmpel(value, bench.gruen, bench.gelb, higherIsBetter);
  const s = AMPEL_STYLES[status as keyof typeof AMPEL_STYLES];
  const pct = value === -1 ? 0 : Math.min((value / maxVal) * 100, 100);
  const gPct = (bench.gruen / maxVal) * 100;
  const yPct = (bench.gelb  / maxVal) * 100;
  const lowPct  = Math.min(gPct, yPct);
  const highPct = Math.max(gPct, yPct);

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.textLight, marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 300, color: s.text, letterSpacing: "-0.02em" }}>
            {value === -1 ? "—" : `${value}${unit}`}
          </div>
        </div>
        <div style={{ padding: "5px 12px", borderRadius: 3, background: s.bg, border: `1px solid ${s.border}`, fontSize: 10, letterSpacing: "0.12em", color: s.text, fontWeight: 700 }}>
          {s.label}
        </div>
      </div>
      <div style={{ position: "relative", height: 6, background: "#E8E8E8", borderRadius: 3 }}>
        <div style={{ position: "absolute", left: `${lowPct}%`, width: `${highPct - lowPct}%`, top: 0, bottom: 0, background: "#FEF3C7" }} />
        <div style={{ position: "absolute", left: 0, width: `${higherIsBetter ? lowPct : highPct}%`, top: 0, bottom: 0, background: "#D1FAE5", borderRadius: "3px 0 0 3px" }} />
        {value !== -1 && (
          <div style={{ position: "absolute", left: `${pct}%`, top: -5, bottom: -5, width: 3, background: s.bar, borderRadius: 2, transform: "translateX(-50%)", boxShadow: `0 0 0 3px white, 0 0 0 4px ${s.bar}` }} />
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: R.textLight }}>
        <span>0{unit}</span>
        <span style={{ color: R.amber }}>▲ {Math.min(bench.gruen, bench.gelb)}{unit} Median</span>
        <span style={{ color: R.green }}>▲ {Math.max(bench.gruen, bench.gelb)}{unit} P75</span>
        <span>{maxVal}{unit}</span>
      </div>
    </div>
  );
}

function EinschaetzungCard({ data }: { data: EinschaetzungData }) {
  const bench = BENCHMARKS[data.unternehmen.brancheKategorie] || BENCHMARKS["alle_wirtschaftszweige"];
  const { kennzahlen } = data;

  return (
    <div style={{ background: R.white, border: `1px solid ${R.border}`, borderRadius: 8, overflow: "hidden", maxWidth: 620, width: "100%", marginTop: 8, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
      <div style={{ background: R.green, padding: "24px 32px" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>RÖDL · Debt Advisory</div>
        <div style={{ fontSize: 18, color: R.white, fontWeight: 300 }}>Bankability-Einschätzung</div>
        <div style={{ marginTop: 12, display: "flex", gap: 20, flexWrap: "wrap" as const }}>
          {[
            { label: "Branche", value: bench.label },
            { label: "Region",  value: data.unternehmen.region || "—" },
            { label: "Mitarbeiter", value: data.unternehmen.mitarbeiter > 0 ? `${data.unternehmen.mitarbeiter}` : "—" },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{item.label}</div>
              <div style={{ fontSize: 13, color: R.white, marginTop: 2 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: `1px solid ${R.border}` }}>
        {[
          { label: "Umsatz",           value: kennzahlen.umsatz,              unit: " Mio." },
          { label: "Jahresergebnis",   value: kennzahlen.jahresergebnis,      unit: " Mio." },
          { label: "Verbindlichkeiten",value: kennzahlen.bankverbindlichkeiten,unit: " Mio." },
          { label: "Kapitalbedarf",    value: data.finanzierung.kapitalbedarf, unit: " Mio." },
        ].map((item, i) => (
          <div key={i} style={{ padding: "16px 20px", borderRight: i < 3 ? `1px solid ${R.border}` : "none" }}>
            <div style={{ fontSize: 9, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.textLight, marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 20, fontWeight: 300, color: R.text }}>
              {item.value === -1 ? "—" : `${item.value}`}
              <span style={{ fontSize: 11, color: R.textLight, marginLeft: 2 }}>{item.value !== -1 ? item.unit : ""}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "28px 32px", borderBottom: `1px solid ${R.border}` }}>
        <div style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: R.textLight, marginBottom: 4 }}>Benchmark-Vergleich</div>
        <div style={{ fontSize: 11, color: R.greenMid, marginBottom: 20 }}>{bench.label} · Bundesbank Jahresabschlussstatistik 2023</div>
        <BenchmarkBar label="Cashflow-Marge (Jahresergebnis + Abschreibungen / Umsatz)" value={kennzahlen.cashflowMarge} unit="%" bench={bench.cashflow} higherIsBetter={true} maxVal={40} />
        <BenchmarkBar label="Renditemarge (Jahresergebnis vor Steuern / Umsatz)" value={kennzahlen.renditeMarge} unit="%" bench={bench.rendite} higherIsBetter={true} maxVal={30} />
        <BenchmarkBar label="Bankverbindlichkeiten (% Bilanzsumme)" value={kennzahlen.bankverbindlichkeitenPctBilanzsumme} unit="%" bench={bench.bankverb} higherIsBetter={false} maxVal={60} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `1px solid ${R.border}` }}>
        <div style={{ padding: "20px 24px", borderRight: `1px solid ${R.border}` }}>
          <div style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.green, fontWeight: 700, marginBottom: 14 }}>Stärken</div>
          {data.staerken.map((s, i) => (
            <div key={i} style={{ fontSize: 12, color: R.textMid, lineHeight: 1.6, marginBottom: 8, paddingLeft: 14, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: R.green, fontWeight: 700 }}>+</span>{s}
            </div>
          ))}
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.amber, fontWeight: 700, marginBottom: 14 }}>Vor Bankgespräch klären</div>
          {data.handlungsfelder.map((h, i) => (
            <div key={i} style={{ fontSize: 12, color: R.textMid, lineHeight: 1.6, marginBottom: 8, paddingLeft: 14, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: R.amber, fontWeight: 700 }}>→</span>{h}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 32px", background: R.offWhite, borderBottom: `1px solid ${R.border}` }}>
        <div style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.textLight, marginBottom: 10 }}>Gesamteinschätzung</div>
        <div style={{ fontSize: 13, color: R.text, lineHeight: 1.8 }}>{data.gesamteinschaetzung}</div>
      </div>

      <div style={{ padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, color: R.textLight }}>Quelle: Deutsche Bundesbank, Jahresabschlussstatistik Mai 2026 (Berichtsjahr 2023). Keine Beratungsleistung.</div>
        <a href="mailto:debt-advisory@roedl.com" style={{ padding: "10px 20px", background: R.green, color: R.white, fontSize: 11, letterSpacing: "0.06em", textDecoration: "none", borderRadius: 3, whiteSpace: "nowrap" as const, marginLeft: 16, flexShrink: 0, fontWeight: 600 }}>
          Erstgespräch →
        </a>
      </div>
    </div>
  );
}

interface Message { role: "user" | "assistant"; content: string; einschaetzung?: EinschaetzungData; }

function MessageBubble({ msg }: { msg: Message }) {
  const isAI = msg.role === "assistant";
  let displayText = msg.content;
  if (msg.einschaetzung) {
    const s = displayText.indexOf("EINSCHAETZUNG_JSON_START");
    if (s !== -1) displayText = displayText.substring(0, s).trim();
  }
  displayText = displayText.replace(/\s*\[FORTSCHRITT:P\dF\d+\]\s*$/, "").trim();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isAI ? "flex-start" : "flex-end", gap: 5 }}>
      <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: R.textLight }}>
        {isAI ? "RÖDL · Debt Advisory" : "Sie"}
      </div>
      {displayText && (
        <div style={{ maxWidth: 560, padding: "14px 18px", borderRadius: isAI ? "2px 12px 12px 12px" : "12px 2px 12px 12px", background: isAI ? R.white : R.green, border: isAI ? `1px solid ${R.border}` : "none", fontSize: 14, lineHeight: 1.75, color: isAI ? R.text : R.white, boxShadow: isAI ? "0 1px 4px rgba(0,0,0,0.06)" : "none", whiteSpace: "pre-wrap" }}>
          {displayText}
        </div>
      )}
      {msg.einschaetzung && <EinschaetzungCard data={msg.einschaetzung} />}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: R.textLight }}>RÖDL · Debt Advisory</div>
      <div style={{ padding: "14px 18px", borderRadius: "2px 12px 12px 12px", background: R.white, border: `1px solid ${R.border}`, display: "flex", gap: 5, alignItems: "center", width: "fit-content", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: R.greenMid, animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ answered, isDone }: { answered: number; isDone: boolean }) {
  const pct = Math.min((answered / TOTAL_QUESTIONS) * 100, 100);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {PHASES.map((phase, i) => {
          const phaseStart = PHASES.slice(0,i).reduce((a,p) => a+p.questions, 0);
          const phaseDone  = isDone || answered > phaseStart + phase.questions - 1;
          const phaseActive = !phaseDone && answered > phaseStart - (i===0?1:0);
          return (
            <div key={i} style={{ flex: 1, paddingRight: i < PHASES.length-1 ? 4 : 0 }}>
              <div style={{ height: 3, borderRadius: 2, background: phaseDone ? R.green : phaseActive ? R.greenMid : R.border, marginBottom: 5, transition: "background 0.4s" }} />
              <div style={{ fontSize: 9, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: phaseDone ? R.green : phaseActive ? R.greenMid : R.textLight }}>
                {phase.icon} {phase.label}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, height: 4, background: R.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${isDone ? 100 : pct}%`, background: isDone ? R.green : R.greenMid, borderRadius: 2, transition: "width 0.5s ease" }} />
        </div>
        <div style={{ fontSize: 11, color: isDone ? R.green : R.textMid, whiteSpace: "nowrap" as const, minWidth: 120, textAlign: "right" as const }}>
          {isDone ? "Einschätzung bereit" : answered === 0 ? `${TOTAL_QUESTIONS} Fragen` : `Noch ca. ${TOTAL_QUESTIONS - answered} Fragen`}
        </div>
      </div>
    </div>
  );
}

export default function BankabilityCheck() {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: OPENING }]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const isDone = messages.some(m => m.einschaetzung);
  const lastAiMsg = [...messages].reverse().find(m => m.role === "assistant" && !m.einschaetzung);
  const progressMatch = lastAiMsg?.content?.match(/\[FORTSCHRITT:P(\d)F(\d+)\]/);
  const currentQuestion = progressMatch ? parseInt(progressMatch[2]) : 0;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setError("");
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/bankability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();
      if (d.error) throw new Error(d.error);
      const einschaetzung = parseEinschaetzung(d.text);
      setMessages(prev => [...prev, { role: "assistant", content: d.text, einschaetzung: einschaetzung || undefined }]);
    } catch (err) {
      setError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
      console.error(err);
    } finally { setLoading(false); }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div style={{ background: R.offWhite, minHeight: "100vh", display: "grid", gridTemplateColumns: "300px 1fr" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.4;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        textarea:focus{outline:none} textarea::placeholder{color:#BBB}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:${R.border};border-radius:2px}
        *{box-sizing:border-box}
      `}</style>

      {/* Sidebar */}
      <div style={{ background: R.white, borderRight: `1px solid ${R.border}`, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${R.border}` }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.08em", color: R.green }}>RÖDL</div>
          <div style={{ fontSize: 11, color: R.textLight, marginTop: 2, letterSpacing: "0.06em" }}>Debt Advisory</div>
        </div>
        <div style={{ padding: "28px", flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: R.text, marginBottom: 6 }}>Bankability Check</div>
            <div style={{ fontSize: 12, color: R.textMid, lineHeight: 1.7 }}>Strukturierte Einschätzung Ihrer Bankfähigkeit — ca. 12 Minuten, 13 Fragen.</div>
          </div>
          <ProgressBar answered={isDone ? TOTAL_QUESTIONS : currentQuestion} isDone={isDone} />
          <div>
            <div style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.textLight, marginBottom: 12 }}>Gesprächsphasen</div>
            {PHASES.map((phase, i) => {
              const phaseStart = PHASES.slice(0,i).reduce((a,p) => a+p.questions, 0);
              const phaseDone  = isDone || currentQuestion > phaseStart + phase.questions - 1;
              const phaseActive = !phaseDone && currentQuestion > phaseStart - (i===0?1:0);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${R.border}` }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: phaseDone ? R.green : phaseActive ? R.greenLight : R.offWhite, border: `1.5px solid ${phaseDone ? R.green : phaseActive ? R.greenMid : R.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: phaseDone ? R.white : phaseActive ? R.green : R.textLight, transition: "all 0.3s" }}>
                    {phaseDone ? "✓" : phase.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: phaseDone ? R.green : phaseActive ? R.text : R.textLight, fontWeight: phaseActive ? 600 : 400 }}>{phase.label}</div>
                    <div style={{ fontSize: 10, color: R.textLight, marginTop: 1 }}>{phase.questions} Fragen</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "auto", padding: 16, background: R.greenLight, borderRadius: 6, border: `1px solid ${R.border}` }}>
            <div style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.green, marginBottom: 6, fontWeight: 700 }}>🔒 Datenschutz</div>
            <div style={{ fontSize: 11, color: R.textMid, lineHeight: 1.7 }}>
              Ihre Angaben werden <strong>nicht gespeichert</strong> und <strong>nicht an Dritte weitergegeben</strong>. Die Analyse läuft ausschließlich in dieser Sitzung — nach dem Schließen des Browsers sind alle Daten unwiderruflich gelöscht. Benchmarks basieren auf der Bundesbank-Jahresabschlussstatistik 2023.
            </div>
          </div>
        </div>
        <div style={{ padding: "16px 28px", borderTop: `1px solid ${R.border}`, fontSize: 10, color: R.textLight }}>© 2026 RÖDL · roedl.com</div>
      </div>

      {/* Chat */}
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ background: R.white, borderBottom: `1px solid ${R.border}`, padding: "14px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: R.textMid }}>
            {isDone ? "Einschätzung abgeschlossen" : currentQuestion === 0 ? "Gespräch beginnen" : `Noch ca. ${TOTAL_QUESTIONS - currentQuestion} Fragen`}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 120, height: 4, background: R.border, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${isDone ? 100 : (currentQuestion/TOTAL_QUESTIONS)*100}%`, background: isDone ? R.green : R.greenMid, borderRadius: 2, transition: "width 0.5s" }} />
            </div>
            <div style={{ fontSize: 11, color: R.textMid, minWidth: 30 }}>
              {Math.round(isDone ? 100 : (currentQuestion/TOTAL_QUESTIONS)*100)}%
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "40px 48px", display: "flex", flexDirection: "column", gap: 24 }}>
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
          {loading && <TypingIndicator />}
          {error && <div style={{ fontSize: 12, color: R.red }}>{error}</div>}
          <div ref={bottomRef} />
        </div>

        {!isDone && (
          <div style={{ background: R.white, borderTop: `1px solid ${R.border}`, padding: "16px 48px 24px", display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea
              value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Ihre Antwort… (Enter zum Senden)" rows={1} disabled={loading}
              style={{ flex: 1, background: R.offWhite, border: `1.5px solid ${input ? R.green : R.border}`, borderRadius: 6, padding: "12px 16px", color: R.text, fontSize: 14, resize: "none", lineHeight: 1.6, minHeight: 48, maxHeight: 120, opacity: loading ? 0.6 : 1, transition: "border-color 0.2s" }}
            />
            <button onClick={send} disabled={loading || !input.trim()}
              style={{ background: input.trim() && !loading ? R.green : R.border, border: "none", color: input.trim() && !loading ? R.white : R.textLight, padding: "12px 24px", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" as const, cursor: input.trim() && !loading ? "pointer" : "default", borderRadius: 6, transition: "all 0.2s", whiteSpace: "nowrap" as const, fontWeight: 600 }}>
              Senden →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
