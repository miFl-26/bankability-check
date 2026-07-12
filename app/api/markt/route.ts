// app/api/markt/route.ts
import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache 1 Stunde

async function fetchECBRate(): Promise<{rate: number; date: string} | null> {
  try {
    // ECB Key Interest Rates - Deposit Facility
    const res = await fetch(
      "https://data-api.ecb.europa.eu/service/data/FM/B.U2.EUR.4F.KR.DFR.LEV?format=jsondata&lastNObservations=1",
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const obs = data.dataSets[0].series["0:0:0:0:0:0:0"].observations;
    const keys = Object.keys(obs).sort();
    const latest = obs[keys[keys.length - 1]];
    const timePeriods = data.structure.dimensions.observation[0].values;
    return {
      rate: latest[0],
      date: timePeriods[parseInt(keys[keys.length - 1])].id,
    };
  } catch { return null; }
}

async function fetchEURIBOR(): Promise<{rate3m: number; rate6m: number; date: string} | null> {
  try {
    // ECB EURIBOR 3M and 6M
    const [r3m, r6m] = await Promise.all([
      fetch("https://data-api.ecb.europa.eu/service/data/FM/B.U2.EUR.RT0.MM.EURIBOR3MD_.HSTA?format=jsondata&lastNObservations=1", { next: { revalidate: 3600 } }),
      fetch("https://data-api.ecb.europa.eu/service/data/FM/B.U2.EUR.RT0.MM.EURIBOR6MD_.HSTA?format=jsondata&lastNObservations=1", { next: { revalidate: 3600 } }),
    ]);
    const d3m = await r3m.json();
    const d6m = await r6m.json();
    const get = (d: Record<string, unknown>) => {
      const obs = (d as {dataSets: {series: Record<string, {observations: Record<string, number[]>}>}[]}
      ).dataSets[0].series["0:0:0:0:0:0:0"].observations;
      const keys = Object.keys(obs).sort();
      return obs[keys[keys.length - 1]][0];
    };
    return { rate3m: get(d3m), rate6m: get(d6m), date: new Date().toISOString().split("T")[0] };
  } catch { return null; }
}

async function fetchInflation(): Promise<{rate: number; date: string} | null> {
  try {
    // ECB HICP Eurozone
    const res = await fetch(
      "https://data-api.ecb.europa.eu/service/data/ICP/M.U2.N.000000.4.ANR?format=jsondata&lastNObservations=1",
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const obs = data.dataSets[0].series["0:0:0:0:0:0"].observations;
    const keys = Object.keys(obs).sort();
    const latest = obs[keys[keys.length - 1]];
    const timePeriods = data.structure.dimensions.observation[0].values;
    return {
      rate: latest[0],
      date: timePeriods[parseInt(keys[keys.length - 1])].id,
    };
  } catch { return null; }
}

async function fetchGovBond(): Promise<{de10y: number; date: string} | null> {
  try {
    // ECB German 10Y Bund
    const res = await fetch(
      "https://data-api.ecb.europa.eu/service/data/FM/B.DE.EUR.FR.BB.U2.10Y.YLDA.IP.NAI.EUR?format=jsondata&lastNObservations=1",
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const obs = data.dataSets[0].series["0:0:0:0:0:0:0:0:0:0:0"].observations;
    const keys = Object.keys(obs).sort();
    return {
      de10y: obs[keys[keys.length - 1]][0],
      date: new Date().toISOString().split("T")[0],
    };
  } catch { return null; }
}

export async function GET() {
  const [ecbRate, euribor, inflation, govBond] = await Promise.all([
    fetchECBRate(),
    fetchEURIBOR(),
    fetchInflation(),
    fetchGovBond(),
  ]);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    ecbRate,
    euribor,
    inflation,
    govBond,
  });
}
