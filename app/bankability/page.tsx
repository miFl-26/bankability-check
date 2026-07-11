"use client";

import { useState, useRef, useEffect } from "react";

// ── RÖDL Brand Colors (Hunter Green System, Dec 2025)
const R = {
  green:      "#1A5C3A",   // Hunter Green — primary
  greenLight: "#E8F2EC",   // light green tint
  greenMid:   "#4A8C6A",   // mid green
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

Am Ende erhalten Sie eine grafische Einschätzung mit Branchenbenchmarks: wo Sie stehen, was Banken sehen werden, und was Sie vor einem Bankgespräch klären sollten.

Fangen wir an: Was beschreibt Ihr Unternehmen — Branche und grob was Sie tun?`;

// 13 questions total across 4 phases
const PHASES = [
  { label: "Unternehmen",   questions: 3, icon: "01" },
  { label: "Kennzahlen",    questions: 4, icon: "02" },
  { label: "Vorhaben",      questions: 3, icon: "03" },
  { label: "Kapitalstruktur", questions: 3, icon: "04" },
];
const TOTAL_QUESTIONS = 13;

const BENCHMARKS: Record<string, {
  ebitdaMarge: { gruen: number; gelb: number };
  leverage: { gruen: number; gelb: number };
  label: string;
}> = {
  bau:       { label: "Bau & Immobilien",       ebitdaMarge: { gruen: 7,  gelb: 4  }, leverage: { gruen: 2.5, gelb: 4.0 } },
  energie:   { label: "Energie & Infrastruktur", ebitdaMarge: { gruen: 20, gelb: 10 }, leverage: { gruen: 4.0, gelb: 6.0 } },
  transport: { label: "Transport & Logistik",    ebitdaMarge: { gruen: 8,  gelb: 5  }, leverage: { gruen: 2.5, gelb: 4.0 } },
  sonstige:  { label: "Mittelstand (Allgemein)", ebitdaMarge: { gruen: 10, gelb: 5  }, leverage: { gruen: 3.0, gelb: 5.0 } },
};

interface EinschaetzungData {
  unternehmen: { branche: string; brancheKategorie: string; mitarbeiter: number; region: string; kundenprofil: string };
  kennzahlen: { umsatz: number; ebitda: number; ebitdaMarge: number; bankverbindlichkeiten: number; leverage: number };
  finanzierung: { anlass: string; kapitalbedarf: number; zeitraum: string; hausbankStatus: string };
  staerken: string[];
  handlungsfelder: string[];
  gesamteinschaetzung: string;
}

function parseEinschaetzung(text: string): EinschaetzungData | null {
  try {
    const start = text.indexOf("EINSCHAETZUNG_JSON_START");
    const end = text.indexOf("EINSCHAETZUNG_JSON_ENDE");
    if (start === -1 || end === -1) return null;
    const jsonStr = text.substring(start + "EINSCHAETZUNG_JSON_START".length, end).trim();
    return JSON.parse(jsonStr);
  } catch { return null; }
}

function getAmpel(value: number, gruen: number, gelb: number, higherIsBetter: boolean) {
  if (value === -1) return "grau";
  if (higherIsBetter) {
    if (value >= gruen) return "gruen";
    if (value >= gelb) return "gelb";
    return "rot";
  } else {
    if (value <= gruen) return "gruen";
    if (value <= gelb) return "gelb";
    return "rot";
  }
}

const AMPEL_STYLES = {
  gruen: { bg: R.greenLight, border: R.greenMid, text: R.green,  bar: R.green,  label: "SOLIDE",      dot: "#22C55E" },
  gelb:  { bg: R.amberLight, border: R.amber,    text: R.amber,  bar: R.amber,  label: "BEOBACHTEN",  dot: R.amber   },
  rot:   { bg: R.redLight,   border: R.red,      text: R.red,    bar: R.red,    label: "KRITISCH",    dot: R.red     },
  grau:  { bg: "#F5F5F5",   border: "#CCC",      text: "#999",   bar: "#CCC",   label: "KEINE ANGABE",dot: "#CCC"   },
};

function BenchmarkBar({ label, value, unit, bench, higherIsBetter, maxVal }: {
  label: string; value: number; unit: string;
  bench: { gruen: number; gelb: number };
  higherIsBetter: boolean; maxVal: number;
}) {
  const status = getAmpel(value, bench.gruen, bench.gelb, higherIsBetter);
  const s = AMPEL_STYLES[status as keyof typeof AMPEL_STYLES];
  const pct = value === -1 ? 0 : Math.min((value / maxVal) * 100, 100);
  const g1pct = (bench.gruen / maxVal) * 100;
  const g2pct = (bench.gelb / maxVal) * 100;
  const lowPct  = Math.min(g1pct, g2pct);
  const highPct = Math.max(g1pct, g2pct);

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.textLight, marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 300, color: s.text, letterSpacing: "-0.02em" }}>
            {value === -1 ? "—" : `${value}${unit}`}
          </div>
        </div>
        <div style={{
          padding: "5px 12px", borderRadius: 3,
          background: s.bg, border: `1px solid ${s.border}`,
          fontSize: 10, letterSpacing: "0.12em", color: s.text, fontWeight: 700,
        }}>
          {s.label}
        </div>
      </div>

      {/* Track */}
      <div style={{ position: "relative", height: 6, background: "#E8E8E8", borderRadius: 3 }}>
        {/* Zone colorierung */}
        <div style={{
          position: "absolute", left: `${lowPct}%`, width: `${highPct - lowPct}%`,
          top: 0, bottom: 0, background: "#FEF3C7", borderRadius: 0,
        }} />
        <div style={{
          position: "absolute", left: 0,
          width: `${higherIsBetter ? lowPct : highPct}%`,
          top: 0, bottom: 0, background: "#D1FAE5", borderRadius: "3px 0 0 3px",
        }} />

        {/* Value marker */}
        {value !== -1 && (
          <div style={{
            position: "absolute", left: `${pct}%`,
            top: -5, bottom: -5, width: 3,
            background: s.bar, borderRadius: 2,
            transform: "translateX(-50%)",
            boxShadow: `0 0 0 3px white, 0 0 0 4px ${s.bar}`,
          }} />
        )}
      </div>

      {/* Scale labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: R.textLight }}>
        <span>0{unit}</span>
        <span style={{ color: R.amber }}>▲ {Math.min(bench.gruen, bench.gelb)}{unit} Gelb</span>
        <span style={{ color: R.green }}>▲ {Math.max(bench.gruen, bench.gelb)}{unit} Grün</span>
        <span>{maxVal}{unit}</span>
      </div>
    </div>
  );
}

function EinschaetzungCard({ data }: { data: EinschaetzungData }) {
  const bench = BENCHMARKS[data.unternehmen.brancheKategorie] || BENCHMARKS.sonstige;
  const { kennzahlen } = data;

  return (
    <div style={{
      background: R.white, border: `1px solid ${R.border}`,
      borderRadius: 8, overflow: "hidden", maxWidth: 620, width: "100%",
      marginTop: 8, boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    }}>
      {/* Header */}
      <div style={{ background: R.green, padding: "24px 32px" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>
          RÖDL · Debt Advisory
        </div>
        <div style={{ fontSize: 18, color: R.white, fontWeight: 300, letterSpacing: "0.02em" }}>
          Bankability-Einschätzung
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 20, flexWrap: "wrap" as const }}>
          {[
            { label: "Branche", value: data.unternehmen.branche },
            { label: "Region", value: data.unternehmen.region || "—" },
            { label: "Mitarbeiter", value: data.unternehmen.mitarbeiter > 0 ? `${data.unternehmen.mitarbeiter}` : "—" },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{item.label}</div>
              <div style={{ fontSize: 13, color: R.white, marginTop: 2 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPIs Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: `1px solid ${R.border}` }}>
        {[
          { label: "Umsatz",           value: kennzahlen.umsatz,               unit: " Mio." },
          { label: "EBITDA",           value: kennzahlen.ebitda,               unit: " Mio." },
          { label: "Verbindlichkeiten",value: kennzahlen.bankverbindlichkeiten, unit: " Mio." },
          { label: "Kapitalbedarf",    value: data.finanzierung.kapitalbedarf, unit: " Mio." },
        ].map((item, i) => (
          <div key={i} style={{
            padding: "16px 20px",
            borderRight: i < 3 ? `1px solid ${R.border}` : "none",
          }}>
            <div style={{ fontSize: 9, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.textLight, marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 20, fontWeight: 300, color: R.text }}>
              {item.value === -1 ? "—" : `${item.value}`}
              <span style={{ fontSize: 11, color: R.textLight, marginLeft: 2 }}>{item.value !== -1 ? item.unit : ""}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Benchmark Charts */}
      <div style={{ padding: "28px 32px", borderBottom: `1px solid ${R.border}` }}>
        <div style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: R.textLight, marginBottom: 20 }}>
          Benchmark-Vergleich · {bench.label}
        </div>
        <BenchmarkBar label="EBITDA-Marge" value={kennzahlen.ebitdaMarge} unit="%" bench={bench.ebitdaMarge} higherIsBetter={true} maxVal={40} />
        <BenchmarkBar label="Leverage (Nettoverschuldung / EBITDA)" value={kennzahlen.leverage} unit="x" bench={bench.leverage} higherIsBetter={false} maxVal={10} />
      </div>

      {/* Stärken & Handlungsfelder */}
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

      {/* Gesamteinschätzung */}
      <div style={{ padding: "20px 32px", background: R.offWhite, borderBottom: `1px solid ${R.border}` }}>
        <div style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.textLight, marginBottom: 10 }}>Gesamteinschätzung</div>
        <div style={{ fontSize: 13, color: R.text, lineHeight: 1.8 }}>{data.gesamteinschaetzung}</div>
      </div>

      {/* CTA */}
      <div style={{ padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, color: R.textLight }}>
          Quelle: Deutsche Bundesbank, Jahresabschlussstatistik 2023 (vorläufig), veröffentlicht Dez. 2024. Keine Beratungsleistung.
        </div>
        <a href="mailto:debt-advisory@roedl.com" style={{
          padding: "10px 20px", background: R.green, color: R.white,
          fontSize: 11, letterSpacing: "0.06em", textDecoration: "none",
          borderRadius: 3, whiteSpace: "nowrap" as const, marginLeft: 16, flexShrink: 0,
          fontWeight: 600,
        }}>
          Erstgespräch vereinbaren →
        </a>
      </div>
    </div>
  );
}

interface Message {
  role: "user" | "assistant";
  content: string;
  einschaetzung?: EinschaetzungData;
}

function estimateQuestionIndex(userMessageCount: number) {
  // user messages after the first opening = questions answered
  return Math.min(userMessageCount, TOTAL_QUESTIONS);
}

function ProgressBar({ answered }: { answered: number }) {
  const pct = Math.min((answered / TOTAL_QUESTIONS) * 100, 100);
  const done = answered >= TOTAL_QUESTIONS;

  // Which phase are we in?
  let cumulative = 0;
  let currentPhase = 0;
  for (let i = 0; i < PHASES.length; i++) {
    if (answered <= cumulative + PHASES[i].questions) { currentPhase = i; break; }
    cumulative += PHASES[i].questions;
    currentPhase = i;
  }

  return (
    <div style={{ padding: "0 0 24px 0" }}>
      {/* Phase dots */}
      <div style={{ display: "flex", gap: 0, marginBottom: 12 }}>
        {PHASES.map((phase, i) => {
          const phaseStart = PHASES.slice(0, i).reduce((a, p) => a + p.questions, 0);
          const isDone = answered > phaseStart + phase.questions - 1;
          const isActive = !isDone && answered > phaseStart - (i === 0 ? 1 : 0);
          return (
            <div key={i} style={{ flex: 1, paddingRight: i < PHASES.length - 1 ? 6 : 0 }}>
              <div style={{
                height: 3, borderRadius: 2,
                background: isDone ? R.green : isActive ? R.greenMid : R.border,
                transition: "background 0.4s",
                marginBottom: 6,
              }} />
              <div style={{
                fontSize: 9, textTransform: "uppercase" as const, letterSpacing: "0.1em",
                color: isDone ? R.green : isActive ? R.greenMid : R.textLight,
                transition: "color 0.4s",
              }}>
                {phase.icon} {phase.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Single progress bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, height: 4, background: R.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: done ? R.green : R.greenMid,
            borderRadius: 2, transition: "width 0.5s ease",
          }} />
        </div>
        <div style={{ fontSize: 11, color: done ? R.green : R.textMid, whiteSpace: "nowrap" as const, minWidth: 80, textAlign: "right" as const }}>
          {done ? "Einschätzung bereit" : `Frage ${Math.min(answered + 1, TOTAL_QUESTIONS)} / ${TOTAL_QUESTIONS}`}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isAI = msg.role === "assistant";
  let displayText = msg.content;
  if (msg.einschaetzung) {
    const s = displayText.indexOf("EINSCHAETZUNG_JSON_START");
    if (s !== -1) displayText = displayText.substring(0, s).trim();
  }
  // Strip progress tag from displayed text
  displayText = displayText.replace(/\s*\[FORTSCHRITT:P\dF\d+\]\s*$/, "").trim();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isAI ? "flex-start" : "flex-end", gap: 5 }}>
      <div style={{
        fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" as const,
        color: R.textLight, paddingLeft: isAI ? 2 : 0, paddingRight: isAI ? 0 : 2,
      }}>
        {isAI ? "RÖDL · Debt Advisory" : "Sie"}
      </div>

      {displayText && (
        <div style={{
          maxWidth: 560,
          padding: "14px 18px",
          borderRadius: isAI ? "2px 12px 12px 12px" : "12px 2px 12px 12px",
          background: isAI ? R.white : R.green,
          border: isAI ? `1px solid ${R.border}` : "none",
          fontSize: 14, lineHeight: 1.75,
          color: isAI ? R.text : R.white,
          boxShadow: isAI ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
          whiteSpace: "pre-wrap",
        }}>
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
      <div style={{
        padding: "14px 18px", borderRadius: "2px 12px 12px 12px",
        background: R.white, border: `1px solid ${R.border}`,
        display: "flex", gap: 5, alignItems: "center", width: "fit-content",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%", background: R.greenMid,
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

export default function BankabilityCheck() {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: OPENING }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const isDone = messages.some(m => m.einschaetzung);

  // Read progress from KI tag [FORTSCHRITT:P{phase}F{frage}] instead of counting messages
  const lastAiMsg = [...messages].reverse().find(m => m.role === "assistant" && !m.einschaetzung);
  const progressMatch = lastAiMsg?.content?.match(/\[FORTSCHRITT:P(\d)F(\d+)\]/);
  const currentQuestion = progressMatch ? parseInt(progressMatch[2]) : 0;
  const userMsgCount = currentQuestion; // alias for ProgressBar and top bar

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setError("");
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/bankability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const einschaetzung = parseEinschaetzung(data.text);
      setMessages(prev => [...prev, { role: "assistant", content: data.text, einschaetzung: einschaetzung || undefined }]);
    } catch (err) {
      setError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div style={{ background: R.offWhite, minHeight: "100vh", display: "grid", gridTemplateColumns: "300px 1fr" }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.4; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
        textarea:focus { outline: none; }
        textarea::placeholder { color: #BBB; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${R.border}; border-radius: 2px; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Sidebar */}
      <div style={{
        background: R.white, borderRight: `1px solid ${R.border}`,
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        {/* Logo bar */}
        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${R.border}` }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.08em", color: R.green }}>RÖDL</div>
          <div style={{ fontSize: 11, color: R.textLight, marginTop: 2, letterSpacing: "0.06em" }}>Debt Advisory</div>
        </div>

        <div style={{ padding: "28px 28px", flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: R.text, marginBottom: 8, lineHeight: 1.4 }}>
              Bankability Check
            </div>
            <div style={{ fontSize: 12, color: R.textMid, lineHeight: 1.7 }}>
              Strukturierte Einschätzung Ihrer Bankfähigkeit — ca. 12 Minuten, 13 Fragen.
            </div>
          </div>

          {/* Phase detail */}
          <div>
            <div style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.textLight, marginBottom: 12 }}>Gesprächsphasen</div>
            {PHASES.map((phase, i) => {
              const phaseStart = PHASES.slice(0, i).reduce((a, p) => a + p.questions, 0);
              const isDonePhase = userMsgCount > phaseStart + phase.questions - 1 || isDone;
              const isActive = !isDonePhase && userMsgCount > phaseStart - (i === 0 ? 1 : 0);
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0", borderBottom: `1px solid ${R.border}`,
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                    background: isDonePhase ? R.green : isActive ? R.greenLight : R.offWhite,
                    border: `1.5px solid ${isDonePhase ? R.green : isActive ? R.greenMid : R.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700,
                    color: isDonePhase ? R.white : isActive ? R.green : R.textLight,
                    transition: "all 0.3s",
                  }}>
                    {isDonePhase ? "✓" : phase.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: isDonePhase ? R.green : isActive ? R.text : R.textLight, fontWeight: isActive ? 600 : 400, transition: "color 0.3s" }}>
                      {phase.label}
                    </div>
                    <div style={{ fontSize: 10, color: R.textLight, marginTop: 1 }}>
                      {phase.questions} Fragen
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "auto", padding: "16px", background: R.greenLight, borderRadius: 6, border: `1px solid ${R.border}` }}>
            <div style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.green, marginBottom: 6, fontWeight: 700 }}>🔒 Datenschutz</div>
            <div style={{ fontSize: 11, color: R.textMid, lineHeight: 1.7 }}>
              Ihre Angaben werden <strong>nicht gespeichert</strong> und <strong>nicht an Dritte weitergegeben</strong>. Die Analyse läuft ausschließlich in dieser Sitzung — nach dem Schließen des Browsers sind alle Daten unwiderruflich gelöscht. Benchmarks basieren auf der Bundesbank-Jahresabschlussstatistik 2023.
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 28px", borderTop: `1px solid ${R.border}`, fontSize: 10, color: R.textLight }}>
          © 2026 RÖDL · roedl.com
        </div>
      </div>

      {/* Chat area */}
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Top bar */}
        <div style={{
          background: R.white, borderBottom: `1px solid ${R.border}`,
          padding: "14px 48px", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ fontSize: 12, color: R.textMid }}>
            {isDone ? "Einschätzung abgeschlossen" : `${TOTAL_QUESTIONS - userMsgCount > 0 ? `Noch ca. ${TOTAL_QUESTIONS - userMsgCount} Fragen` : "Einschätzung wird erstellt…"}`}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 120, height: 4, background: R.border, borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${Math.min((isDone ? TOTAL_QUESTIONS : userMsgCount) / TOTAL_QUESTIONS * 100, 100)}%`,
                background: isDone ? R.green : R.greenMid,
                borderRadius: 2, transition: "width 0.5s",
              }} />
            </div>
            <div style={{ fontSize: 11, color: R.textMid, minWidth: 30 }}>
              {Math.round(Math.min((isDone ? TOTAL_QUESTIONS : userMsgCount) / TOTAL_QUESTIONS * 100, 100))}%
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "40px 48px", display: "flex", flexDirection: "column", gap: 24 }}>
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
          {loading && <TypingIndicator />}
          {error && <div style={{ fontSize: 12, color: R.red, padding: "8px 0" }}>{error}</div>}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {!isDone && (
          <div style={{ background: R.white, borderTop: `1px solid ${R.border}`, padding: "16px 48px 24px", display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ihre Antwort… (Enter zum Senden)"
              rows={1}
              disabled={loading}
              style={{
                flex: 1, background: R.offWhite, border: `1.5px solid ${input ? R.green : R.border}`,
                borderRadius: 6, padding: "12px 16px", color: R.text, fontSize: 14,
                resize: "none", lineHeight: 1.6, minHeight: 48, maxHeight: 120,
                opacity: loading ? 0.6 : 1, transition: "border-color 0.2s",
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: input.trim() && !loading ? R.green : R.border,
                border: "none", color: input.trim() && !loading ? R.white : R.textLight,
                padding: "12px 24px", fontSize: 12, letterSpacing: "0.06em",
                textTransform: "uppercase" as const, cursor: input.trim() && !loading ? "pointer" : "default",
                borderRadius: 6, transition: "all 0.2s", whiteSpace: "nowrap" as const, fontWeight: 600,
              }}
            >
              Senden →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
