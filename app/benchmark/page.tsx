"use client";
import { useState } from "react";

const R = {
  green: "#1A5C3A", greenLight: "#E8F2EC", greenMid: "#4A8C6A",
  white: "#FFFFFF", offWhite: "#F7F8F6", border: "#E2E8E4",
  text: "#1A1A1A", textMid: "#555555", textLight: "#999999",
  amber: "#C47B1A", amberLight: "#FDF3E3", red: "#C0392B", redLight: "#FDEDEB",
};

const BENCHMARKS: Record<string, {label: string; daten: Record<string, number>}> = {
  "alle_wirtschaftszweige": {"label": "Alle Wirtschaftszweige", "daten": {"materialaufwand_median": 25.3, "materialaufwand_p75": 42.0, "personalaufwand_median": 1.8, "personalaufwand_p75": 4.2, "abschreibungen_median": 3.3, "abschreibungen_p75": 8.2, "jahresergebnis_gl_median": 14.0, "jahresergebnis_gl_p75": 37.1, "sachanlagen_median": 11.3, "sachanlagen_p75": 38.3, "vorraete_median": 31.8, "vorraete_p75": 55.8, "eigenmittel_median": 38.0, "eigenmittel_p75": 65.7, "kfv_median": 3.8, "kfv_p75": 26.0, "bankverbindlichkeiten_median": 4.3, "bankverbindlichkeiten_p75": 10.4, "rendite_median": 7.1, "rendite_p75": 14.5, "cashflow_umsatz_median": 6.6, "cashflow_umsatz_p75": 12.0, "forderungen_median": 7.0, "forderungen_p75": 15.6, "zinsdeckung_bs_median": 17.1, "zinsdeckung_bs_p75": 46.3, "cashflow_fremdmittel_median": 180.2, "cashflow_fremdmittel_p75": 492.1, "liquiditaet_median": 8.6, "liquiditaet_p75": 17.5}},
  "landwirtschaft": {"label": "Land- und Forstwirtschaft, Fischerei", "daten": {"materialaufwand_median": 15.0, "materialaufwand_p75": 26.4, "personalaufwand_median": 7.9, "personalaufwand_p75": 13.3, "abschreibungen_median": 6.4, "abschreibungen_p75": 17.0, "jahresergebnis_gl_median": 64.9, "jahresergebnis_gl_p75": 78.8, "sachanlagen_median": 8.1, "sachanlagen_p75": 15.7, "vorraete_median": 41.1, "vorraete_p75": 64.9, "eigenmittel_median": 25.0, "eigenmittel_p75": 56.4, "kfv_median": 25.3, "kfv_p75": 46.1, "bankverbindlichkeiten_median": 7.7, "bankverbindlichkeiten_p75": 18.9, "rendite_median": 17.2, "rendite_p75": 30.1, "cashflow_umsatz_median": 6.2, "cashflow_umsatz_p75": 11.3, "forderungen_median": 5.3, "forderungen_p75": 12.0, "zinsdeckung_bs_median": 19.2, "zinsdeckung_bs_p75": 41.9, "cashflow_fremdmittel_median": 103.3, "cashflow_fremdmittel_p75": 130.9, "liquiditaet_median": 14.5, "liquiditaet_p75": 35.3}},
  "bergbau": {"label": "Bergbau und Gewinnung von Steinen und Erden", "daten": {"materialaufwand_median": 20.0, "materialaufwand_p75": 28.7, "personalaufwand_median": 7.3, "personalaufwand_p75": 11.9, "abschreibungen_median": 6.0, "abschreibungen_p75": 13.1, "jahresergebnis_gl_median": 47.9, "jahresergebnis_gl_p75": 64.3, "sachanlagen_median": 6.4, "sachanlagen_p75": 15.1, "vorraete_median": 35.7, "vorraete_p75": 56.6, "eigenmittel_median": 24.7, "eigenmittel_p75": 43.3, "kfv_median": 5.6, "kfv_p75": 21.3, "bankverbindlichkeiten_median": 7.2, "bankverbindlichkeiten_p75": 16.6, "rendite_median": 15.9, "rendite_p75": 26.5, "cashflow_umsatz_median": 4.6, "cashflow_umsatz_p75": 8.7, "forderungen_median": 5.8, "forderungen_p75": 11.1, "zinsdeckung_bs_median": 20.7, "zinsdeckung_bs_p75": 41.7, "cashflow_fremdmittel_median": 98.9, "cashflow_fremdmittel_p75": 154.0, "liquiditaet_median": 12.0, "liquiditaet_p75": 24.9}},
  "verarbeitendes_gewerbe": {"label": "Verarbeitendes Gewerbe (gesamt)", "daten": {"materialaufwand_median": 26.9, "materialaufwand_p75": 36.7, "personalaufwand_median": 2.2, "personalaufwand_p75": 4.0, "abschreibungen_median": 3.4, "abschreibungen_p75": 7.7, "jahresergebnis_gl_median": 18.6, "jahresergebnis_gl_p75": 36.5, "sachanlagen_median": 27.7, "sachanlagen_p75": 45.3, "vorraete_median": 34.8, "vorraete_p75": 58.5, "eigenmittel_median": 35.3, "eigenmittel_p75": 60.1, "kfv_median": 4.2, "kfv_p75": 23.1, "bankverbindlichkeiten_median": 4.4, "bankverbindlichkeiten_p75": 9.7, "rendite_median": 7.3, "rendite_p75": 13.1, "cashflow_umsatz_median": 6.5, "cashflow_umsatz_p75": 10.9, "forderungen_median": 6.8, "forderungen_p75": 13.5, "zinsdeckung_bs_median": 16.8, "zinsdeckung_bs_p75": 43.7, "cashflow_fremdmittel_median": 181.4, "cashflow_fremdmittel_p75": 374.4, "liquiditaet_median": 7.7, "liquiditaet_p75": 13.4}},
  "nahrungsmittel": {"label": "Nahrungsmittel- und Futtermittelherstellung", "daten": {"materialaufwand_median": 15.5, "materialaufwand_p75": 28.6, "personalaufwand_median": 2.1, "personalaufwand_p75": 3.6, "abschreibungen_median": 2.4, "abschreibungen_p75": 5.6, "jahresergebnis_gl_median": 32.2, "jahresergebnis_gl_p75": 51.4, "sachanlagen_median": 14.1, "sachanlagen_p75": 28.4, "vorraete_median": 33.9, "vorraete_p75": 56.6, "eigenmittel_median": 36.0, "eigenmittel_p75": 60.4, "kfv_median": 6.9, "kfv_p75": 27.9, "bankverbindlichkeiten_median": 3.1, "bankverbindlichkeiten_p75": 7.1, "rendite_median": 5.4, "rendite_p75": 10.2, "cashflow_umsatz_median": 4.4, "cashflow_umsatz_p75": 8.6, "forderungen_median": 7.4, "forderungen_p75": 15.6, "zinsdeckung_bs_median": 21.1, "zinsdeckung_bs_p75": 49.1, "cashflow_fremdmittel_median": 125.1, "cashflow_fremdmittel_p75": 226.0, "liquiditaet_median": 8.2, "liquiditaet_p75": 13.3}},
  "getraenke": {"label": "Getränkeherstellung", "daten": {"materialaufwand_median": 21.2, "materialaufwand_p75": 29.3, "personalaufwand_median": 5.4, "personalaufwand_p75": 9.6, "abschreibungen_median": 1.6, "abschreibungen_p75": 5.3, "jahresergebnis_gl_median": 36.0, "jahresergebnis_gl_p75": 58.0, "sachanlagen_median": 14.5, "sachanlagen_p75": 31.4, "vorraete_median": 33.6, "vorraete_p75": 50.5, "eigenmittel_median": 32.9, "eigenmittel_p75": 51.7, "kfv_median": 11.7, "kfv_p75": 32.2, "bankverbindlichkeiten_median": 2.1, "bankverbindlichkeiten_p75": 6.3, "rendite_median": 7.9, "rendite_p75": 15.5, "cashflow_umsatz_median": 6.7, "cashflow_umsatz_p75": 11.1, "forderungen_median": 3.5, "forderungen_p75": 7.9, "zinsdeckung_bs_median": 16.0, "zinsdeckung_bs_p75": 41.1, "cashflow_fremdmittel_median": 119.9, "cashflow_fremdmittel_p75": 204.1, "liquiditaet_median": 13.0, "liquiditaet_p75": 23.2}},
  "textilien": {"label": "Herstellung von Textilien", "daten": {"materialaufwand_median": 25.0, "materialaufwand_p75": 32.5, "personalaufwand_median": 2.0, "personalaufwand_p75": 3.9, "abschreibungen_median": 2.5, "abschreibungen_p75": 6.6, "jahresergebnis_gl_median": 17.7, "jahresergebnis_gl_p75": 32.6, "sachanlagen_median": 29.6, "sachanlagen_p75": 47.3, "vorraete_median": 38.5, "vorraete_p75": 63.4, "eigenmittel_median": 31.5, "eigenmittel_p75": 56.1, "kfv_median": 5.5, "kfv_p75": 24.4, "bankverbindlichkeiten_median": 3.1, "bankverbindlichkeiten_p75": 8.0, "rendite_median": 6.1, "rendite_p75": 11.5, "cashflow_umsatz_median": 5.8, "cashflow_umsatz_p75": 9.6, "forderungen_median": 5.2, "forderungen_p75": 12.5, "zinsdeckung_bs_median": 12.3, "zinsdeckung_bs_p75": 37.7, "cashflow_fremdmittel_median": 200.1, "cashflow_fremdmittel_p75": 384.7, "liquiditaet_median": 6.6, "liquiditaet_p75": 13.0}},
  "holz": {"label": "Holz- und Korkwaren (ohne Möbel)", "daten": {"materialaufwand_median": 25.1, "materialaufwand_p75": 35.4, "personalaufwand_median": 2.6, "personalaufwand_p75": 4.2, "abschreibungen_median": 3.3, "abschreibungen_p75": 7.5, "jahresergebnis_gl_median": 25.7, "jahresergebnis_gl_p75": 46.3, "sachanlagen_median": 25.3, "sachanlagen_p75": 44.8, "vorraete_median": 30.8, "vorraete_p75": 54.4, "eigenmittel_median": 40.8, "eigenmittel_p75": 67.7, "kfv_median": 12.3, "kfv_p75": 29.5, "bankverbindlichkeiten_median": 4.1, "bankverbindlichkeiten_p75": 9.4, "rendite_median": 7.4, "rendite_p75": 13.0, "cashflow_umsatz_median": 4.4, "cashflow_umsatz_p75": 7.9, "forderungen_median": 7.5, "forderungen_p75": 13.7, "zinsdeckung_bs_median": 16.8, "zinsdeckung_bs_p75": 46.9, "cashflow_fremdmittel_median": 155.3, "cashflow_fremdmittel_p75": 266.7, "liquiditaet_median": 5.4, "liquiditaet_p75": 10.0}},
  "papier": {"label": "Herstellung von Papier und Pappe", "daten": {"materialaufwand_median": 21.0, "materialaufwand_p75": 27.4, "personalaufwand_median": 2.7, "personalaufwand_p75": 4.3, "abschreibungen_median": 3.8, "abschreibungen_p75": 7.5, "jahresergebnis_gl_median": 28.7, "jahresergebnis_gl_p75": 45.4, "sachanlagen_median": 20.5, "sachanlagen_p75": 32.6, "vorraete_median": 38.3, "vorraete_p75": 64.8, "eigenmittel_median": 27.1, "eigenmittel_p75": 49.7, "kfv_median": 3.0, "kfv_p75": 21.4, "bankverbindlichkeiten_median": 4.3, "bankverbindlichkeiten_p75": 8.7, "rendite_median": 7.2, "rendite_p75": 12.1, "cashflow_umsatz_median": 5.7, "cashflow_umsatz_p75": 9.8, "forderungen_median": 6.7, "forderungen_p75": 14.0, "zinsdeckung_bs_median": 21.6, "zinsdeckung_bs_p75": 50.0, "cashflow_fremdmittel_median": 157.2, "cashflow_fremdmittel_p75": 271.5, "liquiditaet_median": 7.1, "liquiditaet_p75": 11.2}},
  "druck": {"label": "Druckerzeugnisse", "daten": {"materialaufwand_median": 29.6, "materialaufwand_p75": 38.4, "personalaufwand_median": 3.4, "personalaufwand_p75": 5.3, "abschreibungen_median": 2.1, "abschreibungen_p75": 6.2, "jahresergebnis_gl_median": 25.5, "jahresergebnis_gl_p75": 47.2, "sachanlagen_median": 12.5, "sachanlagen_p75": 23.3, "vorraete_median": 32.6, "vorraete_p75": 51.1, "eigenmittel_median": 34.5, "eigenmittel_p75": 53.6, "kfv_median": 15.0, "kfv_p75": 39.2, "bankverbindlichkeiten_median": 2.9, "bankverbindlichkeiten_p75": 7.6, "rendite_median": 6.4, "rendite_p75": 11.7, "cashflow_umsatz_median": 6.6, "cashflow_umsatz_p75": 10.3, "forderungen_median": 5.8, "forderungen_p75": 14.6, "zinsdeckung_bs_median": 18.2, "zinsdeckung_bs_p75": 43.6, "cashflow_fremdmittel_median": 151.6, "cashflow_fremdmittel_p75": 290.2, "liquiditaet_median": 9.5, "liquiditaet_p75": 16.3}},
  "chemie": {"label": "Herstellung von chemischen Erzeugnissen", "daten": {"materialaufwand_median": 18.5, "materialaufwand_p75": 26.8, "personalaufwand_median": 2.4, "personalaufwand_p75": 4.2, "abschreibungen_median": 3.4, "abschreibungen_p75": 7.3, "jahresergebnis_gl_median": 23.4, "jahresergebnis_gl_p75": 39.9, "sachanlagen_median": 21.6, "sachanlagen_p75": 34.5, "vorraete_median": 38.7, "vorraete_p75": 63.2, "eigenmittel_median": 26.9, "eigenmittel_p75": 49.7, "kfv_median": 0.0, "kfv_p75": 14.1, "bankverbindlichkeiten_median": 4.4, "bankverbindlichkeiten_p75": 9.0, "rendite_median": 7.4, "rendite_p75": 12.8, "cashflow_umsatz_median": 6.0, "cashflow_umsatz_p75": 9.9, "forderungen_median": 6.4, "forderungen_p75": 11.4, "zinsdeckung_bs_median": 15.2, "zinsdeckung_bs_p75": 40.0, "cashflow_fremdmittel_median": 161.9, "cashflow_fremdmittel_p75": 309.7, "liquiditaet_median": 8.1, "liquiditaet_p75": 13.9}},
  "pharma": {"label": "Pharmazeutische Erzeugnisse", "daten": {"materialaufwand_median": 20.1, "materialaufwand_p75": 31.7, "personalaufwand_median": 3.1, "personalaufwand_p75": 6.0, "abschreibungen_median": 7.6, "abschreibungen_p75": 15.6, "jahresergebnis_gl_median": 18.3, "jahresergebnis_gl_p75": 32.0, "sachanlagen_median": 21.6, "sachanlagen_p75": 35.4, "vorraete_median": 45.0, "vorraete_p75": 65.9, "eigenmittel_median": 22.2, "eigenmittel_p75": 43.1, "kfv_median": 0.0, "kfv_p75": 8.9, "bankverbindlichkeiten_median": 9.9, "bankverbindlichkeiten_p75": 19.4, "rendite_median": 13.8, "rendite_p75": 24.5, "cashflow_umsatz_median": 7.7, "cashflow_umsatz_p75": 12.6, "forderungen_median": 8.5, "forderungen_p75": 17.0, "zinsdeckung_bs_median": 24.2, "zinsdeckung_bs_p75": 48.3, "cashflow_fremdmittel_median": 174.4, "cashflow_fremdmittel_p75": 329.5, "liquiditaet_median": 12.7, "liquiditaet_p75": 20.6}},
  "gummi_kunststoff": {"label": "Gummi- und Kunststoffwaren", "daten": {"materialaufwand_median": 25.8, "materialaufwand_p75": 33.4, "personalaufwand_median": 2.8, "personalaufwand_p75": 4.5, "abschreibungen_median": 2.9, "abschreibungen_p75": 7.1, "jahresergebnis_gl_median": 25.5, "jahresergebnis_gl_p75": 43.4, "sachanlagen_median": 26.2, "sachanlagen_p75": 37.8, "vorraete_median": 40.8, "vorraete_p75": 63.0, "eigenmittel_median": 32.2, "eigenmittel_p75": 53.8, "kfv_median": 7.8, "kfv_p75": 25.0, "bankverbindlichkeiten_median": 3.7, "bankverbindlichkeiten_p75": 8.8, "rendite_median": 6.9, "rendite_p75": 12.7, "cashflow_umsatz_median": 5.9, "cashflow_umsatz_p75": 9.4, "forderungen_median": 6.7, "forderungen_p75": 13.5, "zinsdeckung_bs_median": 19.9, "zinsdeckung_bs_p75": 52.0, "cashflow_fremdmittel_median": 164.5, "cashflow_fremdmittel_p75": 274.7, "liquiditaet_median": 6.7, "liquiditaet_p75": 11.8}},
  "glas_keramik": {"label": "Glas, Keramik, Steine und Erden", "daten": {"materialaufwand_median": 23.6, "materialaufwand_p75": 33.3, "personalaufwand_median": 3.0, "personalaufwand_p75": 4.9, "abschreibungen_median": 4.1, "abschreibungen_p75": 8.4, "jahresergebnis_gl_median": 29.0, "jahresergebnis_gl_p75": 45.9, "sachanlagen_median": 21.6, "sachanlagen_p75": 37.0, "vorraete_median": 33.9, "vorraete_p75": 59.1, "eigenmittel_median": 32.3, "eigenmittel_p75": 56.3, "kfv_median": 2.4, "kfv_p75": 21.3, "bankverbindlichkeiten_median": 4.9, "bankverbindlichkeiten_p75": 10.5, "rendite_median": 8.7, "rendite_p75": 14.3, "cashflow_umsatz_median": 3.9, "cashflow_umsatz_p75": 7.1, "forderungen_median": 7.4, "forderungen_p75": 15.0, "zinsdeckung_bs_median": 19.5, "zinsdeckung_bs_p75": 50.2, "cashflow_fremdmittel_median": 145.5, "cashflow_fremdmittel_p75": 257.9, "liquiditaet_median": 6.6, "liquiditaet_p75": 11.1}},
  "metallerzeugung": {"label": "Metallerzeugung und -bearbeitung", "daten": {"materialaufwand_median": 20.3, "materialaufwand_p75": 30.8, "personalaufwand_median": 2.1, "personalaufwand_p75": 3.6, "abschreibungen_median": 2.3, "abschreibungen_p75": 6.1, "jahresergebnis_gl_median": 23.9, "jahresergebnis_gl_p75": 38.7, "sachanlagen_median": 30.8, "sachanlagen_p75": 44.0, "vorraete_median": 37.9, "vorraete_p75": 58.1, "eigenmittel_median": 32.0, "eigenmittel_p75": 55.3, "kfv_median": 4.2, "kfv_p75": 16.3, "bankverbindlichkeiten_median": 2.9, "bankverbindlichkeiten_p75": 7.4, "rendite_median": 5.6, "rendite_p75": 10.3, "cashflow_umsatz_median": 5.1, "cashflow_umsatz_p75": 8.5, "forderungen_median": 6.2, "forderungen_p75": 11.9, "zinsdeckung_bs_median": 16.3, "zinsdeckung_bs_p75": 39.2, "cashflow_fremdmittel_median": 171.0, "cashflow_fremdmittel_p75": 320.6, "liquiditaet_median": 6.2, "liquiditaet_p75": 11.0}},
  "metallerzeugnisse": {"label": "Herstellung von Metallerzeugnissen", "daten": {"materialaufwand_median": 31.3, "materialaufwand_p75": 40.0, "personalaufwand_median": 2.5, "personalaufwand_p75": 4.7, "abschreibungen_median": 3.5, "abschreibungen_p75": 7.7, "jahresergebnis_gl_median": 21.8, "jahresergebnis_gl_p75": 41.2, "sachanlagen_median": 27.8, "sachanlagen_p75": 47.0, "vorraete_median": 32.9, "vorraete_p75": 57.5, "eigenmittel_median": 37.0, "eigenmittel_p75": 63.8, "kfv_median": 8.7, "kfv_p75": 27.7, "bankverbindlichkeiten_median": 4.5, "bankverbindlichkeiten_p75": 9.9, "rendite_median": 7.8, "rendite_p75": 13.8, "cashflow_umsatz_median": 6.5, "cashflow_umsatz_p75": 10.4, "forderungen_median": 6.8, "forderungen_p75": 13.3, "zinsdeckung_bs_median": 16.5, "zinsdeckung_bs_p75": 42.3, "cashflow_fremdmittel_median": 175.5, "cashflow_fremdmittel_p75": 335.4, "liquiditaet_median": 7.7, "liquiditaet_p75": 13.9}},
  "elektronik": {"label": "Datenverarbeitungsgeräte und Elektronik", "daten": {"materialaufwand_median": 29.7, "materialaufwand_p75": 39.3, "personalaufwand_median": 2.0, "personalaufwand_p75": 3.5, "abschreibungen_median": 4.8, "abschreibungen_p75": 9.9, "jahresergebnis_gl_median": 10.3, "jahresergebnis_gl_p75": 22.2, "sachanlagen_median": 33.6, "sachanlagen_p75": 48.6, "vorraete_median": 44.8, "vorraete_p75": 66.1, "eigenmittel_median": 27.9, "eigenmittel_p75": 50.5, "kfv_median": 0.1, "kfv_p75": 16.2, "bankverbindlichkeiten_median": 6.4, "bankverbindlichkeiten_p75": 13.1, "rendite_median": 9.1, "rendite_p75": 16.0, "cashflow_umsatz_median": 8.3, "cashflow_umsatz_p75": 13.3, "forderungen_median": 7.7, "forderungen_p75": 14.8, "zinsdeckung_bs_median": 20.0, "zinsdeckung_bs_p75": 58.5, "cashflow_fremdmittel_median": 262.7, "cashflow_fremdmittel_p75": 613.3, "liquiditaet_median": 7.8, "liquiditaet_p75": 13.4}},
  "elektro_ausruestungen": {"label": "Elektrische Ausrüstungen", "daten": {"materialaufwand_median": 27.0, "materialaufwand_p75": 35.4, "personalaufwand_median": 1.6, "personalaufwand_p75": 2.9, "abschreibungen_median": 3.7, "abschreibungen_p75": 8.5, "jahresergebnis_gl_median": 10.9, "jahresergebnis_gl_p75": 22.7, "sachanlagen_median": 36.2, "sachanlagen_p75": 54.3, "vorraete_median": 34.3, "vorraete_p75": 58.8, "eigenmittel_median": 37.6, "eigenmittel_p75": 61.3, "kfv_median": 1.3, "kfv_p75": 17.6, "bankverbindlichkeiten_median": 4.9, "bankverbindlichkeiten_p75": 11.2, "rendite_median": 7.1, "rendite_p75": 13.4, "cashflow_umsatz_median": 7.3, "cashflow_umsatz_p75": 12.1, "forderungen_median": 7.1, "forderungen_p75": 13.9, "zinsdeckung_bs_median": 15.1, "zinsdeckung_bs_p75": 42.2, "cashflow_fremdmittel_median": 261.9, "cashflow_fremdmittel_p75": 585.2, "liquiditaet_median": 7.3, "liquiditaet_p75": 11.9}},
  "maschinenbau": {"label": "Maschinenbau", "daten": {"materialaufwand_median": 30.2, "materialaufwand_p75": 38.3, "personalaufwand_median": 1.8, "personalaufwand_p75": 3.1, "abschreibungen_median": 3.8, "abschreibungen_p75": 7.9, "jahresergebnis_gl_median": 11.4, "jahresergebnis_gl_p75": 22.9, "sachanlagen_median": 39.2, "sachanlagen_p75": 55.1, "vorraete_median": 31.6, "vorraete_p75": 55.1, "eigenmittel_median": 42.6, "eigenmittel_p75": 66.8, "kfv_median": 1.3, "kfv_p75": 17.4, "bankverbindlichkeiten_median": 4.8, "bankverbindlichkeiten_p75": 10.1, "rendite_median": 7.3, "rendite_p75": 12.8, "cashflow_umsatz_median": 8.4, "cashflow_umsatz_p75": 13.8, "forderungen_median": 6.4, "forderungen_p75": 12.3, "zinsdeckung_bs_median": 14.0, "zinsdeckung_bs_p75": 37.3, "cashflow_fremdmittel_median": 227.0, "cashflow_fremdmittel_p75": 488.3, "liquiditaet_median": 7.5, "liquiditaet_p75": 12.8}},
  "kraftwagen": {"label": "Kraftwagen und Kraftwagenteile", "daten": {"materialaufwand_median": 21.2, "materialaufwand_p75": 29.1, "personalaufwand_median": 2.0, "personalaufwand_p75": 3.8, "abschreibungen_median": 2.4, "abschreibungen_p75": 5.6, "jahresergebnis_gl_median": 16.2, "jahresergebnis_gl_p75": 31.3, "sachanlagen_median": 27.6, "sachanlagen_p75": 45.6, "vorraete_median": 29.6, "vorraete_p75": 47.9, "eigenmittel_median": 41.0, "eigenmittel_p75": 59.2, "kfv_median": 2.1, "kfv_p75": 24.1, "bankverbindlichkeiten_median": 2.8, "bankverbindlichkeiten_p75": 6.7, "rendite_median": 5.4, "rendite_p75": 9.4, "cashflow_umsatz_median": 6.4, "cashflow_umsatz_p75": 10.4, "forderungen_median": 5.6, "forderungen_p75": 11.3, "zinsdeckung_bs_median": 13.2, "zinsdeckung_bs_p75": 30.4, "cashflow_fremdmittel_median": 162.7, "cashflow_fremdmittel_p75": 335.0, "liquiditaet_median": 9.3, "liquiditaet_p75": 13.5}},
  "sonstiger_fahrzeugbau": {"label": "Sonstiger Fahrzeugbau", "daten": {"materialaufwand_median": 25.3, "materialaufwand_p75": 35.4, "personalaufwand_median": 1.8, "personalaufwand_p75": 3.7, "abschreibungen_median": 1.6, "abschreibungen_p75": 6.2, "jahresergebnis_gl_median": 9.5, "jahresergebnis_gl_p75": 23.2, "sachanlagen_median": 39.8, "sachanlagen_p75": 61.5, "vorraete_median": 21.3, "vorraete_p75": 38.8, "eigenmittel_median": 53.7, "eigenmittel_p75": 77.8, "kfv_median": 0.9, "kfv_p75": 22.9, "bankverbindlichkeiten_median": 2.3, "bankverbindlichkeiten_p75": 8.3, "rendite_median": 4.6, "rendite_p75": 11.9, "cashflow_umsatz_median": 7.0, "cashflow_umsatz_p75": 13.1, "forderungen_median": 4.2, "forderungen_p75": 9.7, "zinsdeckung_bs_median": 7.4, "zinsdeckung_bs_p75": 22.6, "cashflow_fremdmittel_median": 207.9, "cashflow_fremdmittel_p75": 481.4, "liquiditaet_median": 10.8, "liquiditaet_p75": 20.5}},
  "moebel": {"label": "Herstellung von Möbeln", "daten": {"materialaufwand_median": 29.3, "materialaufwand_p75": 37.0, "personalaufwand_median": 2.2, "personalaufwand_p75": 3.7, "abschreibungen_median": 2.2, "abschreibungen_p75": 5.3, "jahresergebnis_gl_median": 19.8, "jahresergebnis_gl_p75": 37.8, "sachanlagen_median": 26.5, "sachanlagen_p75": 45.3, "vorraete_median": 27.9, "vorraete_p75": 54.0, "eigenmittel_median": 39.3, "eigenmittel_p75": 65.0, "kfv_median": 9.7, "kfv_p75": 29.6, "bankverbindlichkeiten_median": 2.8, "bankverbindlichkeiten_p75": 6.9, "rendite_median": 5.6, "rendite_p75": 10.7, "cashflow_umsatz_median": 6.0, "cashflow_umsatz_p75": 10.1, "forderungen_median": 5.5, "forderungen_p75": 11.8, "zinsdeckung_bs_median": 14.3, "zinsdeckung_bs_p75": 35.9, "cashflow_fremdmittel_median": 155.2, "cashflow_fremdmittel_p75": 341.5, "liquiditaet_median": 6.8, "liquiditaet_p75": 12.3}},
  "sonstige_waren": {"label": "Herstellung von sonstigen Waren", "daten": {"materialaufwand_median": 32.8, "materialaufwand_p75": 43.3, "personalaufwand_median": 2.4, "personalaufwand_p75": 4.6, "abschreibungen_median": 4.7, "abschreibungen_p75": 9.9, "jahresergebnis_gl_median": 16.1, "jahresergebnis_gl_p75": 32.6, "sachanlagen_median": 25.5, "sachanlagen_p75": 41.5, "vorraete_median": 40.0, "vorraete_p75": 64.4, "eigenmittel_median": 27.5, "eigenmittel_p75": 53.8, "kfv_median": 5.7, "kfv_p75": 25.7, "bankverbindlichkeiten_median": 5.9, "bankverbindlichkeiten_p75": 12.5, "rendite_median": 9.5, "rendite_p75": 16.1, "cashflow_umsatz_median": 7.6, "cashflow_umsatz_p75": 11.8, "forderungen_median": 8.1, "forderungen_p75": 16.0, "zinsdeckung_bs_median": 20.0, "zinsdeckung_bs_p75": 54.4, "cashflow_fremdmittel_median": 204.1, "cashflow_fremdmittel_p75": 433.8, "liquiditaet_median": 8.6, "liquiditaet_p75": 15.5}},
  "reparatur_maschinen": {"label": "Reparatur und Installation von Maschinen", "daten": {"materialaufwand_median": 32.0, "materialaufwand_p75": 44.7, "personalaufwand_median": 1.7, "personalaufwand_p75": 3.1, "abschreibungen_median": 4.5, "abschreibungen_p75": 8.9, "jahresergebnis_gl_median": 12.4, "jahresergebnis_gl_p75": 27.3, "sachanlagen_median": 18.9, "sachanlagen_p75": 40.7, "vorraete_median": 31.3, "vorraete_p75": 57.4, "eigenmittel_median": 38.7, "eigenmittel_p75": 63.8, "kfv_median": 1.5, "kfv_p75": 19.9, "bankverbindlichkeiten_median": 5.7, "bankverbindlichkeiten_p75": 11.8, "rendite_median": 8.5, "rendite_p75": 14.7, "cashflow_umsatz_median": 8.9, "cashflow_umsatz_p75": 14.4, "forderungen_median": 9.0, "forderungen_p75": 18.7, "zinsdeckung_bs_median": 19.1, "zinsdeckung_bs_p75": 51.7, "cashflow_fremdmittel_median": 243.2, "cashflow_fremdmittel_p75": 587.7, "liquiditaet_median": 8.7, "liquiditaet_p75": 17.7}},
  "energieversorgung": {"label": "Energieversorgung", "daten": {"materialaufwand_median": 0.9, "materialaufwand_p75": 8.5, "personalaufwand_median": 7.3, "personalaufwand_p75": 34.7, "abschreibungen_median": 7.5, "abschreibungen_p75": 23.6, "jahresergebnis_gl_median": 62.3, "jahresergebnis_gl_p75": 78.5, "sachanlagen_median": 0.1, "sachanlagen_p75": 2.5, "vorraete_median": 36.8, "vorraete_p75": 53.0, "eigenmittel_median": 21.3, "eigenmittel_p75": 39.5, "kfv_median": 17.7, "kfv_p75": 44.4, "bankverbindlichkeiten_median": 9.6, "bankverbindlichkeiten_p75": 27.6, "rendite_median": 19.1, "rendite_p75": 66.3, "cashflow_umsatz_median": 8.5, "cashflow_umsatz_p75": 13.9, "forderungen_median": 5.6, "forderungen_p75": 10.0, "zinsdeckung_bs_median": 20.3, "zinsdeckung_bs_p75": 38.3, "cashflow_fremdmittel_median": 101.1, "cashflow_fremdmittel_p75": 123.9, "liquiditaet_median": 8.3, "liquiditaet_p75": 17.6}},
  "wasser_entsorgung": {"label": "Wasserversorgung; Abwasser- und Abfallentsorgung", "daten": {"materialaufwand_median": 22.5, "materialaufwand_p75": 32.9, "personalaufwand_median": 6.9, "personalaufwand_p75": 14.3, "abschreibungen_median": 3.9, "abschreibungen_p75": 9.2, "jahresergebnis_gl_median": 53.2, "jahresergebnis_gl_p75": 79.4, "sachanlagen_median": 0.9, "sachanlagen_p75": 5.8, "vorraete_median": 38.5, "vorraete_p75": 59.5, "eigenmittel_median": 21.2, "eigenmittel_p75": 46.4, "kfv_median": 14.0, "kfv_p75": 36.1, "bankverbindlichkeiten_median": 5.1, "bankverbindlichkeiten_p75": 11.7, "rendite_median": 14.6, "rendite_p75": 25.4, "cashflow_umsatz_median": 7.8, "cashflow_umsatz_p75": 12.1, "forderungen_median": 4.1, "forderungen_p75": 11.1, "zinsdeckung_bs_median": 18.5, "zinsdeckung_bs_p75": 44.8, "cashflow_fremdmittel_median": 101.8, "cashflow_fremdmittel_p75": 149.9, "liquiditaet_median": 12.6, "liquiditaet_p75": 23.4}},
  "baugewerbe": {"label": "Baugewerbe (gesamt)", "daten": {"materialaufwand_median": 29.7, "materialaufwand_p75": 39.7, "personalaufwand_median": 1.8, "personalaufwand_p75": 3.4, "abschreibungen_median": 4.2, "abschreibungen_p75": 8.6, "jahresergebnis_gl_median": 10.7, "jahresergebnis_gl_p75": 23.8, "sachanlagen_median": 34.9, "sachanlagen_p75": 61.8, "vorraete_median": 21.1, "vorraete_p75": 42.8, "eigenmittel_median": 58.9, "eigenmittel_p75": 79.7, "kfv_median": 4.1, "kfv_p75": 18.7, "bankverbindlichkeiten_median": 5.6, "bankverbindlichkeiten_p75": 11.5, "rendite_median": 8.2, "rendite_p75": 14.6, "cashflow_umsatz_median": 7.9, "cashflow_umsatz_p75": 13.5, "forderungen_median": 6.7, "forderungen_p75": 15.4, "zinsdeckung_bs_median": 15.1, "zinsdeckung_bs_p75": 41.1, "cashflow_fremdmittel_median": 216.0, "cashflow_fremdmittel_p75": 496.6, "liquiditaet_median": 8.0, "liquiditaet_p75": 14.5}},
  "hochbau": {"label": "Hochbau", "daten": {"materialaufwand_median": 21.1, "materialaufwand_p75": 32.8, "personalaufwand_median": 1.5, "personalaufwand_p75": 2.9, "abschreibungen_median": 3.1, "abschreibungen_p75": 7.3, "jahresergebnis_gl_median": 7.0, "jahresergebnis_gl_p75": 17.9, "sachanlagen_median": 55.0, "sachanlagen_p75": 73.8, "vorraete_median": 15.7, "vorraete_p75": 33.6, "eigenmittel_median": 68.8, "eigenmittel_p75": 84.6, "kfv_median": 1.9, "kfv_p75": 16.6, "bankverbindlichkeiten_median": 4.2, "bankverbindlichkeiten_p75": 9.5, "rendite_median": 6.5, "rendite_p75": 12.2, "cashflow_umsatz_median": 5.6, "cashflow_umsatz_p75": 11.1, "forderungen_median": 3.9, "forderungen_p75": 8.6, "zinsdeckung_bs_median": 8.2, "zinsdeckung_bs_p75": 22.2, "cashflow_fremdmittel_median": 213.7, "cashflow_fremdmittel_p75": 565.6, "liquiditaet_median": 7.1, "liquiditaet_p75": 12.1}},
  "tiefbau": {"label": "Tiefbau", "daten": {"materialaufwand_median": 30.4, "materialaufwand_p75": 39.5, "personalaufwand_median": 3.3, "personalaufwand_p75": 5.3, "abschreibungen_median": 4.3, "abschreibungen_p75": 8.0, "jahresergebnis_gl_median": 16.0, "jahresergebnis_gl_p75": 32.1, "sachanlagen_median": 35.4, "sachanlagen_p75": 58.9, "vorraete_median": 21.7, "vorraete_p75": 41.6, "eigenmittel_median": 59.9, "eigenmittel_p75": 79.3, "kfv_median": 3.5, "kfv_p75": 14.2, "bankverbindlichkeiten_median": 5.9, "bankverbindlichkeiten_p75": 11.4, "rendite_median": 10.0, "rendite_p75": 16.3, "cashflow_umsatz_median": 9.6, "cashflow_umsatz_p75": 15.6, "forderungen_median": 5.6, "forderungen_p75": 12.0, "zinsdeckung_bs_median": 16.0, "zinsdeckung_bs_p75": 39.6, "cashflow_fremdmittel_median": 151.7, "cashflow_fremdmittel_p75": 279.9, "liquiditaet_median": 9.5, "liquiditaet_p75": 16.6}},
  "ausbaugewerbe": {"label": "Ausbaugewerbe", "daten": {"materialaufwand_median": 31.3, "materialaufwand_p75": 40.8, "personalaufwand_median": 1.8, "personalaufwand_p75": 3.1, "abschreibungen_median": 4.5, "abschreibungen_p75": 9.2, "jahresergebnis_gl_median": 11.1, "jahresergebnis_gl_p75": 24.2, "sachanlagen_median": 29.5, "sachanlagen_p75": 57.1, "vorraete_median": 22.8, "vorraete_p75": 45.5, "eigenmittel_median": 55.6, "eigenmittel_p75": 77.9, "kfv_median": 5.0, "kfv_p75": 20.5, "bankverbindlichkeiten_median": 6.0, "bankverbindlichkeiten_p75": 12.1, "rendite_median": 8.4, "rendite_p75": 14.9, "cashflow_umsatz_median": 8.2, "cashflow_umsatz_p75": 13.8, "forderungen_median": 8.1, "forderungen_p75": 18.2, "zinsdeckung_bs_median": 17.5, "zinsdeckung_bs_p75": 48.6, "cashflow_fremdmittel_median": 234.1, "cashflow_fremdmittel_p75": 514.2, "liquiditaet_median": 8.1, "liquiditaet_p75": 14.7}},
  "handel_gesamt": {"label": "Handel (gesamt)", "daten": {"materialaufwand_median": 11.8, "materialaufwand_p75": 20.0, "personalaufwand_median": 0.8, "personalaufwand_p75": 1.8, "abschreibungen_median": 2.5, "abschreibungen_p75": 5.6, "jahresergebnis_gl_median": 8.3, "jahresergebnis_gl_p75": 22.0, "sachanlagen_median": 31.3, "sachanlagen_p75": 52.9, "vorraete_median": 31.6, "vorraete_p75": 55.0, "eigenmittel_median": 44.4, "eigenmittel_p75": 68.2, "kfv_median": 5.3, "kfv_p75": 29.0, "bankverbindlichkeiten_median": 3.2, "bankverbindlichkeiten_p75": 7.0, "rendite_median": 4.5, "rendite_p75": 8.8, "cashflow_umsatz_median": 4.9, "cashflow_umsatz_p75": 8.7, "forderungen_median": 7.7, "forderungen_p75": 15.6, "zinsdeckung_bs_median": 16.4, "zinsdeckung_bs_p75": 43.8, "cashflow_fremdmittel_median": 280.7, "cashflow_fremdmittel_p75": 880.7, "liquiditaet_median": 5.8, "liquiditaet_p75": 11.4}},
  "kfz_handel": {"label": "Handel mit Kraftfahrzeugen", "daten": {"materialaufwand_median": 11.2, "materialaufwand_p75": 20.8, "personalaufwand_median": 1.1, "personalaufwand_p75": 2.2, "abschreibungen_median": 2.3, "abschreibungen_p75": 4.8, "jahresergebnis_gl_median": 14.3, "jahresergebnis_gl_p75": 28.2, "sachanlagen_median": 47.2, "sachanlagen_p75": 63.2, "vorraete_median": 23.2, "vorraete_p75": 44.9, "eigenmittel_median": 56.0, "eigenmittel_p75": 75.5, "kfv_median": 24.8, "kfv_p75": 52.6, "bankverbindlichkeiten_median": 3.0, "bankverbindlichkeiten_p75": 6.1, "rendite_median": 4.4, "rendite_p75": 8.0, "cashflow_umsatz_median": 3.8, "cashflow_umsatz_p75": 6.7, "forderungen_median": 7.6, "forderungen_p75": 14.0, "zinsdeckung_bs_median": 14.6, "zinsdeckung_bs_p75": 34.2, "cashflow_fremdmittel_median": 184.2, "cashflow_fremdmittel_p75": 500.0, "liquiditaet_median": 4.8, "liquiditaet_p75": 11.3}},
  "grosshandel": {"label": "Großhandel", "daten": {"materialaufwand_median": 10.6, "materialaufwand_p75": 17.8, "personalaufwand_median": 0.7, "personalaufwand_p75": 1.5, "abschreibungen_median": 2.4, "abschreibungen_p75": 5.6, "jahresergebnis_gl_median": 6.1, "jahresergebnis_gl_p75": 18.4, "sachanlagen_median": 28.1, "sachanlagen_p75": 48.2, "vorraete_median": 36.8, "vorraete_p75": 58.7, "eigenmittel_median": 41.8, "eigenmittel_p75": 64.5, "kfv_median": 0.9, "kfv_p75": 20.3, "bankverbindlichkeiten_median": 3.2, "bankverbindlichkeiten_p75": 7.1, "rendite_median": 4.3, "rendite_p75": 8.7, "cashflow_umsatz_median": 6.0, "cashflow_umsatz_p75": 10.2, "forderungen_median": 7.4, "forderungen_p75": 14.9, "zinsdeckung_bs_median": 16.5, "zinsdeckung_bs_p75": 44.5, "cashflow_fremdmittel_median": 349.5, "cashflow_fremdmittel_p75": 44.5, "liquiditaet_median": 5.1, "liquiditaet_p75": 10.2}},
  "einzelhandel": {"label": "Einzelhandel", "daten": {"materialaufwand_median": 15.2, "materialaufwand_p75": 24.3, "personalaufwand_median": 1.1, "personalaufwand_p75": 2.0, "abschreibungen_median": 2.8, "abschreibungen_p75": 6.2, "jahresergebnis_gl_median": 9.4, "jahresergebnis_gl_p75": 23.9, "sachanlagen_median": 29.7, "sachanlagen_p75": 51.3, "vorraete_median": 28.4, "vorraete_p75": 51.2, "eigenmittel_median": 44.2, "eigenmittel_p75": 69.1, "kfv_median": 8.2, "kfv_p75": 31.5, "bankverbindlichkeiten_median": 3.4, "bankverbindlichkeiten_p75": 7.6, "rendite_median": 4.8, "rendite_p75": 9.4, "cashflow_umsatz_median": 2.6, "cashflow_umsatz_p75": 6.8, "forderungen_median": 8.7, "forderungen_p75": 19.7, "zinsdeckung_bs_median": 18.0, "zinsdeckung_bs_p75": 50.0, "cashflow_fremdmittel_median": 239.7, "cashflow_fremdmittel_p75": 695.5, "liquiditaet_median": 8.0, "liquiditaet_p75": 13.8}},
  "verkehr_lagerei": {"label": "Verkehr und Lagerei (gesamt)", "daten": {"materialaufwand_median": 29.4, "materialaufwand_p75": 42.8, "personalaufwand_median": 4.0, "personalaufwand_p75": 8.6, "abschreibungen_median": 2.6, "abschreibungen_p75": 6.9, "jahresergebnis_gl_median": 37.7, "jahresergebnis_gl_p75": 63.7, "sachanlagen_median": 0.1, "sachanlagen_p75": 1.6, "vorraete_median": 27.0, "vorraete_p75": 50.4, "eigenmittel_median": 35.6, "eigenmittel_p75": 62.3, "kfv_median": 11.4, "kfv_p75": 41.1, "bankverbindlichkeiten_median": 3.4, "bankverbindlichkeiten_p75": 8.6, "rendite_median": 8.4, "rendite_p75": 16.2, "cashflow_umsatz_median": 7.8, "cashflow_umsatz_p75": 12.1, "forderungen_median": 6.6, "forderungen_p75": 14.5, "zinsdeckung_bs_median": 23.8, "zinsdeckung_bs_p75": 50.8, "cashflow_fremdmittel_median": 114.7, "cashflow_fremdmittel_p75": 225.6, "liquiditaet_median": 15.2, "liquiditaet_p75": 41.1}},
  "landverkehr": {"label": "Landverkehr und Transport", "daten": {"materialaufwand_median": 34.6, "materialaufwand_p75": 47.4, "personalaufwand_median": 6.5, "personalaufwand_p75": 10.8, "abschreibungen_median": 2.9, "abschreibungen_p75": 7.5, "jahresergebnis_gl_median": 51.3, "jahresergebnis_gl_p75": 68.7, "sachanlagen_median": 0.2, "sachanlagen_p75": 1.7, "vorraete_median": 23.3, "vorraete_p75": 47.9, "eigenmittel_median": 33.5, "eigenmittel_p75": 60.2, "kfv_median": 27.0, "kfv_p75": 53.1, "bankverbindlichkeiten_median": 3.5, "bankverbindlichkeiten_p75": 9.2, "rendite_median": 10.5, "rendite_p75": 18.6, "cashflow_umsatz_median": 7.5, "cashflow_umsatz_p75": 11.3, "forderungen_median": 6.9, "forderungen_p75": 15.0, "zinsdeckung_bs_median": 25.5, "zinsdeckung_bs_p75": 52.1, "cashflow_fremdmittel_median": 103.3, "cashflow_fremdmittel_p75": 156.7, "liquiditaet_median": 19.8, "liquiditaet_p75": 65.6}},
  "schifffahrt": {"label": "Schifffahrt", "daten": {"materialaufwand_median": 10.6, "materialaufwand_p75": 32.6, "personalaufwand_median": 5.8, "personalaufwand_p75": 21.0, "abschreibungen_median": 10.2, "abschreibungen_p75": 28.5, "jahresergebnis_gl_median": 41.5, "jahresergebnis_gl_p75": 83.4, "sachanlagen_median": 0.6, "sachanlagen_p75": 2.0, "vorraete_median": 37.7, "vorraete_p75": 66.9, "eigenmittel_median": 23.4, "eigenmittel_p75": 62.6, "kfv_median": 3.5, "kfv_p75": 33.2, "bankverbindlichkeiten_median": 11.9, "bankverbindlichkeiten_p75": 30.4, "rendite_median": 24.6, "rendite_p75": 65.7, "cashflow_umsatz_median": 1.7, "cashflow_umsatz_p75": 5.3, "forderungen_median": 11.1, "forderungen_p75": 21.0, "zinsdeckung_bs_median": 27.2, "zinsdeckung_bs_p75": 68.8, "cashflow_fremdmittel_median": 108.6, "cashflow_fremdmittel_p75": 180.0, "liquiditaet_median": 6.7, "liquiditaet_p75": 12.3}},
  "lagerei": {"label": "Lagerei und Verkehrsdienstleistungen", "daten": {"materialaufwand_median": 26.2, "materialaufwand_p75": 38.8, "personalaufwand_median": 2.4, "personalaufwand_p75": 6.7, "abschreibungen_median": 2.4, "abschreibungen_p75": 6.0, "jahresergebnis_gl_median": 28.1, "jahresergebnis_gl_p75": 59.0, "sachanlagen_median": 0.0, "sachanlagen_p75": 1.5, "vorraete_median": 29.8, "vorraete_p75": 52.3, "eigenmittel_median": 37.2, "eigenmittel_p75": 62.5, "kfv_median": 2.2, "kfv_p75": 32.0, "bankverbindlichkeiten_median": 3.1, "bankverbindlichkeiten_p75": 7.6, "rendite_median": 7.1, "rendite_p75": 13.6, "cashflow_umsatz_median": 8.3, "cashflow_umsatz_p75": 13.0, "forderungen_median": 6.2, "forderungen_p75": 13.4, "zinsdeckung_bs_median": 22.6, "zinsdeckung_bs_p75": 48.2, "cashflow_fremdmittel_median": 130.0, "cashflow_fremdmittel_p75": 304.4, "liquiditaet_median": 14.3, "liquiditaet_p75": 33.6}},
  "gastgewerbe": {"label": "Gastgewerbe (Hotels und Gastronomie)", "daten": {"materialaufwand_median": 34.2, "materialaufwand_p75": 41.9, "personalaufwand_median": 2.5, "personalaufwand_p75": 4.6, "abschreibungen_median": 4.7, "abschreibungen_p75": 10.7, "jahresergebnis_gl_median": 27.6, "jahresergebnis_gl_p75": 55.5, "sachanlagen_median": 2.2, "sachanlagen_p75": 5.1, "vorraete_median": 19.9, "vorraete_p75": 46.2, "eigenmittel_median": 41.2, "eigenmittel_p75": 71.9, "kfv_median": 6.1, "kfv_p75": 36.8, "bankverbindlichkeiten_median": 5.6, "bankverbindlichkeiten_p75": 13.0, "rendite_median": 8.9, "rendite_p75": 16.9, "cashflow_umsatz_median": 0.8, "cashflow_umsatz_p75": 3.3, "forderungen_median": 11.1, "forderungen_p75": 27.1, "zinsdeckung_bs_median": 23.5, "zinsdeckung_bs_p75": 68.4, "cashflow_fremdmittel_median": 104.9, "cashflow_fremdmittel_p75": 246.3, "liquiditaet_median": 13.9, "liquiditaet_p75": 28.6}},
  "information_kommunikation": {"label": "Information und Kommunikation (gesamt)", "daten": {"materialaufwand_median": 40.1, "materialaufwand_p75": 59.0, "personalaufwand_median": 1.5, "personalaufwand_p75": 4.0, "abschreibungen_median": 4.2, "abschreibungen_p75": 10.5, "jahresergebnis_gl_median": 3.8, "jahresergebnis_gl_p75": 12.4, "sachanlagen_median": 0.1, "sachanlagen_p75": 5.2, "vorraete_median": 35.4, "vorraete_p75": 58.6, "eigenmittel_median": 29.3, "eigenmittel_p75": 56.2, "kfv_median": 0.0, "kfv_p75": 6.5, "bankverbindlichkeiten_median": 5.5, "bankverbindlichkeiten_p75": 13.4, "rendite_median": 8.6, "rendite_p75": 18.0, "cashflow_umsatz_median": 9.2, "cashflow_umsatz_p75": 15.9, "forderungen_median": 8.7, "forderungen_p75": 20.4, "zinsdeckung_bs_median": 17.3, "zinsdeckung_bs_p75": 60.4, "cashflow_fremdmittel_median": 250.6, "cashflow_fremdmittel_p75": 966.3, "liquiditaet_median": 12.3, "liquiditaet_p75": 25.6}},
  "verlagswesen": {"label": "Verlagswesen", "daten": {"materialaufwand_median": 26.0, "materialaufwand_p75": 42.1, "personalaufwand_median": 1.1, "personalaufwand_p75": 3.2, "abschreibungen_median": 4.6, "abschreibungen_p75": 11.5, "jahresergebnis_gl_median": 1.9, "jahresergebnis_gl_p75": 6.7, "sachanlagen_median": 0.9, "sachanlagen_p75": 13.4, "vorraete_median": 33.8, "vorraete_p75": 54.1, "eigenmittel_median": 34.0, "eigenmittel_p75": 58.7, "kfv_median": 0.0, "kfv_p75": 2.0, "bankverbindlichkeiten_median": 6.4, "bankverbindlichkeiten_p75": 14.6, "rendite_median": 8.8, "rendite_p75": 17.3, "cashflow_umsatz_median": 8.0, "cashflow_umsatz_p75": 16.4, "forderungen_median": 7.8, "forderungen_p75": 19.3, "zinsdeckung_bs_median": 15.7, "zinsdeckung_bs_p75": 54.4, "cashflow_fremdmittel_median": 241.7, "cashflow_fremdmittel_p75": 54.4, "liquiditaet_median": 10.8, "liquiditaet_p75": 25.4}},
  "telekommunikation": {"label": "Telekommunikation", "daten": {"materialaufwand_median": 21.6, "materialaufwand_p75": 35.3, "personalaufwand_median": 4.4, "personalaufwand_p75": 12.1, "abschreibungen_median": 4.0, "abschreibungen_p75": 11.0, "jahresergebnis_gl_median": 20.1, "jahresergebnis_gl_p75": 63.4, "sachanlagen_median": 0.7, "sachanlagen_p75": 6.1, "vorraete_median": 34.5, "vorraete_p75": 57.7, "eigenmittel_median": 28.0, "eigenmittel_p75": 59.1, "kfv_median": 0.0, "kfv_p75": 12.7, "bankverbindlichkeiten_median": 5.3, "bankverbindlichkeiten_p75": 13.8, "rendite_median": 11.5, "rendite_p75": 23.8, "cashflow_umsatz_median": 8.6, "cashflow_umsatz_p75": 14.0, "forderungen_median": 6.9, "forderungen_p75": 17.7, "zinsdeckung_bs_median": 18.9, "zinsdeckung_bs_p75": 46.2, "cashflow_fremdmittel_median": 106.2, "cashflow_fremdmittel_p75": 325.9, "liquiditaet_median": 12.1, "liquiditaet_p75": 24.5}},
  "it_dienstleistungen": {"label": "IT-Dienstleistungen", "daten": {"materialaufwand_median": 44.8, "materialaufwand_p75": 61.9, "personalaufwand_median": 1.4, "personalaufwand_p75": 3.5, "abschreibungen_median": 4.2, "abschreibungen_p75": 10.4, "jahresergebnis_gl_median": 3.6, "jahresergebnis_gl_p75": 10.9, "sachanlagen_median": 0.0, "sachanlagen_p75": 4.4, "vorraete_median": 36.7, "vorraete_p75": 60.1, "eigenmittel_median": 28.2, "eigenmittel_p75": 54.6, "kfv_median": 0.0, "kfv_p75": 5.7, "bankverbindlichkeiten_median": 5.7, "bankverbindlichkeiten_p75": 13.4, "rendite_median": 8.5, "rendite_p75": 17.2, "cashflow_umsatz_median": 9.4, "cashflow_umsatz_p75": 16.0, "forderungen_median": 9.1, "forderungen_p75": 21.2, "zinsdeckung_bs_median": 17.6, "zinsdeckung_bs_p75": 64.4, "cashflow_fremdmittel_median": 277.5, "cashflow_fremdmittel_p75": 64.4, "liquiditaet_median": 12.6, "liquiditaet_p75": 25.7}},
  "immobilien": {"label": "Grundstücks- und Wohnungswesen", "daten": {"materialaufwand_median": 0.0, "materialaufwand_p75": 11.9, "personalaufwand_median": 18.5, "personalaufwand_p75": 29.3, "abschreibungen_median": 15.1, "abschreibungen_p75": 36.8, "jahresergebnis_gl_median": 85.1, "jahresergebnis_gl_p75": 94.5, "sachanlagen_median": 0.0, "sachanlagen_p75": 2.3, "vorraete_median": 30.5, "vorraete_p75": 57.7, "eigenmittel_median": 13.1, "eigenmittel_p75": 44.6, "kfv_median": 32.8, "kfv_p75": 59.3, "bankverbindlichkeiten_median": 16.8, "bankverbindlichkeiten_p75": 41.5, "rendite_median": 39.9, "rendite_p75": 67.8, "cashflow_umsatz_median": 0.6, "cashflow_umsatz_p75": 3.7, "forderungen_median": 3.8, "forderungen_p75": 7.6, "zinsdeckung_bs_median": 8.2, "zinsdeckung_bs_p75": 20.2, "cashflow_fremdmittel_median": 98.1, "cashflow_fremdmittel_p75": 112.6, "liquiditaet_median": 10.4, "liquiditaet_p75": 26.1}},
  "unternehmensdienstleistungen": {"label": "Unternehmensdienstleistungen (gesamt)", "daten": {"materialaufwand_median": 39.9, "materialaufwand_p75": 60.7, "personalaufwand_median": 1.7, "personalaufwand_p75": 4.8, "abschreibungen_median": 4.5, "abschreibungen_p75": 11.7, "jahresergebnis_gl_median": 7.7, "jahresergebnis_gl_p75": 29.7, "sachanlagen_median": 0.4, "sachanlagen_p75": 12.1, "vorraete_median": 30.1, "vorraete_p75": 54.7, "eigenmittel_median": 37.4, "eigenmittel_p75": 66.7, "kfv_median": 0.0, "kfv_p75": 20.9, "bankverbindlichkeiten_median": 5.9, "bankverbindlichkeiten_p75": 15.3, "rendite_median": 9.3, "rendite_p75": 21.6, "cashflow_umsatz_median": 8.8, "cashflow_umsatz_p75": 15.9, "forderungen_median": 8.3, "forderungen_p75": 19.7, "zinsdeckung_bs_median": 18.7, "zinsdeckung_bs_p75": 58.1, "cashflow_fremdmittel_median": 207.3, "cashflow_fremdmittel_p75": 695.3, "liquiditaet_median": 13.2, "liquiditaet_p75": 32.1}},
  "rechts_steuerberatung": {"label": "Rechts- und Steuerberatung, Wirtschaftsprüfung", "daten": {"materialaufwand_median": 48.5, "materialaufwand_p75": 62.8, "personalaufwand_median": 1.2, "personalaufwand_p75": 3.1, "abschreibungen_median": 6.3, "abschreibungen_p75": 16.4, "jahresergebnis_gl_median": 3.3, "jahresergebnis_gl_p75": 10.9, "sachanlagen_median": 0.0, "sachanlagen_p75": 4.3, "vorraete_median": 38.2, "vorraete_p75": 61.6, "eigenmittel_median": 27.5, "eigenmittel_p75": 53.2, "kfv_median": 0.0, "kfv_p75": 12.6, "bankverbindlichkeiten_median": 8.5, "bankverbindlichkeiten_p75": 21.5, "rendite_median": 11.3, "rendite_p75": 24.8, "cashflow_umsatz_median": 10.6, "cashflow_umsatz_p75": 19.2, "forderungen_median": 12.1, "forderungen_p75": 28.4, "zinsdeckung_bs_median": 19.4, "zinsdeckung_bs_p75": 78.6, "cashflow_fremdmittel_median": 358.3, "cashflow_fremdmittel_p75": 78.6, "liquiditaet_median": 16.9, "liquiditaet_p75": 44.0}},
  "architektur_ingenieure": {"label": "Architektur- und Ingenieurbüros", "daten": {"materialaufwand_median": 44.5, "materialaufwand_p75": 60.3, "personalaufwand_median": 1.6, "personalaufwand_p75": 3.3, "abschreibungen_median": 4.7, "abschreibungen_p75": 10.4, "jahresergebnis_gl_median": 5.0, "jahresergebnis_gl_p75": 18.1, "sachanlagen_median": 13.4, "sachanlagen_p75": 48.5, "vorraete_median": 29.0, "vorraete_p75": 54.2, "eigenmittel_median": 43.8, "eigenmittel_p75": 76.7, "kfv_median": 0.0, "kfv_p75": 8.8, "bankverbindlichkeiten_median": 6.3, "bankverbindlichkeiten_p75": 14.4, "rendite_median": 8.9, "rendite_p75": 17.8, "cashflow_umsatz_median": 10.6, "cashflow_umsatz_p75": 18.3, "forderungen_median": 6.7, "forderungen_p75": 16.7, "zinsdeckung_bs_median": 11.7, "zinsdeckung_bs_p75": 47.1, "cashflow_fremdmittel_median": 273.0, "cashflow_fremdmittel_p75": 831.6, "liquiditaet_median": 13.3, "liquiditaet_p75": 28.9}},
  "personaldienstleistung": {"label": "Personaldienstleistungen", "daten": {"materialaufwand_median": 79.7, "materialaufwand_p75": 89.4, "personalaufwand_median": 0.4, "personalaufwand_p75": 0.9, "abschreibungen_median": 2.0, "abschreibungen_p75": 4.8, "jahresergebnis_gl_median": 2.4, "jahresergebnis_gl_p75": 8.6, "sachanlagen_median": 0.0, "sachanlagen_p75": 0.0, "vorraete_median": 23.3, "vorraete_p75": 47.8, "eigenmittel_median": 42.1, "eigenmittel_p75": 69.8, "kfv_median": 0.0, "kfv_p75": 13.7, "bankverbindlichkeiten_median": 2.6, "bankverbindlichkeiten_p75": 6.2, "rendite_median": 3.3, "rendite_p75": 6.9, "cashflow_umsatz_median": 9.6, "cashflow_umsatz_p75": 14.5, "forderungen_median": 8.4, "forderungen_p75": 18.1, "zinsdeckung_bs_median": 14.4, "zinsdeckung_bs_p75": 47.5, "cashflow_fremdmittel_median": 368.3, "cashflow_fremdmittel_p75": 47.5, "liquiditaet_median": 16.5, "liquiditaet_p75": 66.5}},
  "gebaeudebetreuung": {"label": "Gebäudebetreuung und Gartenbau", "daten": {"materialaufwand_median": 44.8, "materialaufwand_p75": 64.7, "personalaufwand_median": 2.4, "personalaufwand_p75": 4.8, "abschreibungen_median": 3.8, "abschreibungen_p75": 9.2, "jahresergebnis_gl_median": 19.9, "jahresergebnis_gl_p75": 40.3, "sachanlagen_median": 1.5, "sachanlagen_p75": 12.1, "vorraete_median": 26.3, "vorraete_p75": 49.9, "eigenmittel_median": 43.9, "eigenmittel_p75": 71.9, "kfv_median": 7.3, "kfv_p75": 30.9, "bankverbindlichkeiten_median": 5.0, "bankverbindlichkeiten_p75": 12.0, "rendite_median": 8.1, "rendite_p75": 16.4, "cashflow_umsatz_median": 8.4, "cashflow_umsatz_p75": 13.5, "forderungen_median": 10.0, "forderungen_p75": 21.6, "zinsdeckung_bs_median": 24.7, "zinsdeckung_bs_p75": 64.2, "cashflow_fremdmittel_median": 151.7, "cashflow_fremdmittel_p75": 348.1, "liquiditaet_median": 12.1, "liquiditaet_p75": 25.3}},
  "erziehung_unterricht": {"label": "Erziehung und Unterricht", "daten": {"materialaufwand_median": 64.1, "materialaufwand_p75": 76.3, "personalaufwand_median": 2.6, "personalaufwand_p75": 5.1, "abschreibungen_median": 2.1, "abschreibungen_p75": 8.0, "jahresergebnis_gl_median": 20.8, "jahresergebnis_gl_p75": 50.9, "sachanlagen_median": 0.1, "sachanlagen_p75": 1.5, "vorraete_median": 44.2, "vorraete_p75": 68.2, "eigenmittel_median": 23.8, "eigenmittel_p75": 50.9, "kfv_median": 2.1, "kfv_p75": 23.5, "bankverbindlichkeiten_median": 2.3, "bankverbindlichkeiten_p75": 8.8, "rendite_median": 5.8, "rendite_p75": 13.2, "cashflow_umsatz_median": 8.3, "cashflow_umsatz_p75": 13.8, "forderungen_median": 4.0, "forderungen_p75": 16.0, "zinsdeckung_bs_median": 11.3, "zinsdeckung_bs_p75": 44.1, "cashflow_fremdmittel_median": 142.8, "cashflow_fremdmittel_p75": 379.5, "liquiditaet_median": 12.7, "liquiditaet_p75": 29.2}},
  "gesundheitswesen": {"label": "Gesundheitswesen", "daten": {"materialaufwand_median": 61.9, "materialaufwand_p75": 71.7, "personalaufwand_median": 3.8, "personalaufwand_p75": 5.9, "abschreibungen_median": 0.9, "abschreibungen_p75": 6.6, "jahresergebnis_gl_median": 29.7, "jahresergebnis_gl_p75": 54.7, "sachanlagen_median": 1.0, "sachanlagen_p75": 3.2, "vorraete_median": 45.4, "vorraete_p75": 65.1, "eigenmittel_median": 23.8, "eigenmittel_p75": 44.5, "kfv_median": 1.5, "kfv_p75": 19.8, "bankverbindlichkeiten_median": 1.1, "bankverbindlichkeiten_p75": 7.3, "rendite_median": 5.3, "rendite_p75": 12.1, "cashflow_umsatz_median": 13.0, "cashflow_umsatz_p75": 19.0, "forderungen_median": 2.1, "forderungen_p75": 10.1, "zinsdeckung_bs_median": 10.5, "zinsdeckung_bs_p75": 34.3, "cashflow_fremdmittel_median": 126.8, "cashflow_fremdmittel_p75": 225.3, "liquiditaet_median": 15.0, "liquiditaet_p75": 32.0}},
  "heime": {"label": "Heime (Pflege und Senioreneinrichtungen)", "daten": {"materialaufwand_median": 67.6, "materialaufwand_p75": 75.7, "personalaufwand_median": 1.7, "personalaufwand_p75": 4.0, "abschreibungen_median": 1.0, "abschreibungen_p75": 4.1, "jahresergebnis_gl_median": 25.8, "jahresergebnis_gl_p75": 63.1, "sachanlagen_median": 0.4, "sachanlagen_p75": 1.3, "vorraete_median": 47.6, "vorraete_p75": 68.0, "eigenmittel_median": 20.7, "eigenmittel_p75": 46.0, "kfv_median": 3.7, "kfv_p75": 24.9, "bankverbindlichkeiten_median": 1.1, "bankverbindlichkeiten_p75": 4.2, "rendite_median": 3.5, "rendite_p75": 7.6, "cashflow_umsatz_median": 4.8, "cashflow_umsatz_p75": 8.8, "forderungen_median": 2.3, "forderungen_p75": 9.4, "zinsdeckung_bs_median": 8.2, "zinsdeckung_bs_p75": 31.1, "cashflow_fremdmittel_median": 130.2, "cashflow_fremdmittel_p75": 299.5, "liquiditaet_median": 10.2, "liquiditaet_p75": 16.2}},
  "sozialwesen": {"label": "Sozialwesen (ohne Heime)", "daten": {"materialaufwand_median": 75.7, "materialaufwand_p75": 83.0, "personalaufwand_median": 1.7, "personalaufwand_p75": 3.2, "abschreibungen_median": 3.1, "abschreibungen_p75": 8.8, "jahresergebnis_gl_median": 12.9, "jahresergebnis_gl_p75": 29.9, "sachanlagen_median": 0.0, "sachanlagen_p75": 0.1, "vorraete_median": 52.9, "vorraete_p75": 74.6, "eigenmittel_median": 21.2, "eigenmittel_p75": 46.1, "kfv_median": 3.5, "kfv_p75": 23.0, "bankverbindlichkeiten_median": 3.2, "bankverbindlichkeiten_p75": 9.1, "rendite_median": 5.8, "rendite_p75": 11.7, "cashflow_umsatz_median": 10.7, "cashflow_umsatz_p75": 15.0, "forderungen_median": 7.5, "forderungen_p75": 21.4, "zinsdeckung_bs_median": 10.9, "zinsdeckung_bs_p75": 52.5, "cashflow_fremdmittel_median": 256.2, "cashflow_fremdmittel_p75": 751.3, "liquiditaet_median": 10.1, "liquiditaet_p75": 20.0}},
  "sport_unterhaltung": {"label": "Sport, Unterhaltung und Erholung", "daten": {"materialaufwand_median": 34.5, "materialaufwand_p75": 48.6, "personalaufwand_median": 5.4, "personalaufwand_p75": 11.6, "abschreibungen_median": 2.6, "abschreibungen_p75": 11.6, "jahresergebnis_gl_median": 37.3, "jahresergebnis_gl_p75": 68.5, "sachanlagen_median": 0.4, "sachanlagen_p75": 1.8, "vorraete_median": 16.8, "vorraete_p75": 48.4, "eigenmittel_median": 39.6, "eigenmittel_p75": 75.0, "kfv_median": 6.4, "kfv_p75": 32.5, "bankverbindlichkeiten_median": 3.3, "bankverbindlichkeiten_p75": 14.4, "rendite_median": 10.5, "rendite_p75": 21.3, "cashflow_umsatz_median": 1.9, "cashflow_umsatz_p75": 6.4, "forderungen_median": 6.0, "forderungen_p75": 21.5, "zinsdeckung_bs_median": 17.6, "zinsdeckung_bs_p75": 52.7, "cashflow_fremdmittel_median": 92.9, "cashflow_fremdmittel_p75": 161.6, "liquiditaet_median": 40.9, "liquiditaet_p75": 150.0}}
};

const KPIS = [
  {
    "key": "rendite",
    "label": "Renditemarge",
    "sub": "Jahresergebnis vor Steuern / Umsatz",
    "einheit": "%",
    "higherIsBetter": true,
    "maxVal": 90
  },
  {
    "key": "cashflow_umsatz",
    "label": "Cashflow-Marge",
    "sub": "Jahresergebnis + Abschreibungen / Umsatz",
    "einheit": "%",
    "higherIsBetter": true,
    "maxVal": 20
  },
  {
    "key": "eigenmittel",
    "label": "Eigenkapitalquote",
    "sub": "Eigenmittel / Bilanzsumme",
    "einheit": "%",
    "higherIsBetter": true,
    "maxVal": 110
  },
  {
    "key": "bankverbindlichkeiten",
    "label": "Bankverbindlichkeiten",
    "sub": "% der Bilanzsumme",
    "einheit": "%",
    "higherIsBetter": false,
    "maxVal": 50
  },
  {
    "key": "personalaufwand",
    "label": "Personalaufwand",
    "sub": "% der Gesamtleistung",
    "einheit": "%",
    "higherIsBetter": false,
    "maxVal": 50
  },
  {
    "key": "materialaufwand",
    "label": "Materialaufwand",
    "sub": "% der Gesamtleistung",
    "einheit": "%",
    "higherIsBetter": false,
    "maxVal": 120
  },
  {
    "key": "liquiditaet",
    "label": "Liquiditätsgrad",
    "sub": "Liquide Mittel + kurzfr. Ford. / kurzfr. Verbindlichkeiten",
    "einheit": "%",
    "higherIsBetter": true,
    "maxVal": 200
  }
];

type AmpelStatus = "gruen" | "gelb" | "rot" | "grau";

const AMPEL: Record<AmpelStatus, {bg: string; border: string; text: string; bar: string; label: string}> = {
  gruen: { bg: R.greenLight, border: R.greenMid, text: R.green, bar: R.green, label: "ÜBER MEDIAN" },
  gelb:  { bg: R.amberLight, border: R.amber,    text: R.amber, bar: R.amber, label: "UNTER MEDIAN" },
  rot:   { bg: R.redLight,   border: R.red,      text: R.red,   bar: R.red,   label: "KRITISCH" },
  grau:  { bg: "#F5F5F5",   border: "#CCC",      text: "#999",  bar: "#CCC",  label: "KEIN WERT" },
};

function getAmpel(userVal: number | null, median: number, p75: number, higherIsBetter: boolean): AmpelStatus {
  if (userVal === null) return "grau";
  if (higherIsBetter) {
    if (userVal >= p75) return "gruen";
    if (userVal >= median) return "gelb";
    return "rot";
  } else {
    if (userVal <= median) return "gruen";
    if (userVal <= p75) return "gelb";
    return "rot";
  }
}

function BenchmarkRow({ kpi, median, p75, userVal }: {
  kpi: typeof KPIS[0]; median: number; p75: number; userVal: number | null;
}) {
  const status = getAmpel(userVal, median, p75, kpi.higherIsBetter);
  const s = AMPEL[status];
  const maxV = kpi.maxVal;
  const medPct  = Math.min((median / maxV) * 100, 98);
  const p75Pct  = Math.min((p75    / maxV) * 100, 98);
  const userPct = userVal !== null ? Math.min((userVal / maxV) * 100, 98) : null;
  const lowPct  = Math.min(medPct, p75Pct);
  const highPct = Math.max(medPct, p75Pct);

  return (
    <div style={{ padding: "16px 0", borderBottom: `1px solid ${R.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: R.text }}>{kpi.label}</div>
          <div style={{ fontSize: 11, color: R.textLight, marginTop: 2 }}>{kpi.sub}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {userVal !== null && (
            <div style={{ padding: "3px 10px", borderRadius: 3, background: s.bg, border: `1px solid ${s.border}`, fontSize: 10, color: s.text, fontWeight: 700, letterSpacing: "0.1em" }}>
              {s.label}
            </div>
          )}
          {userVal !== null && (
            <div style={{ fontSize: 18, fontWeight: 600, color: s.text }}>{userVal}{kpi.einheit}</div>
          )}
        </div>
      </div>

      <div style={{ position: "relative", height: 8, background: "#E8E8E8", borderRadius: 4, overflow: "visible" }}>
        {/* Green zone */}
        <div style={{ position: "absolute",
          left: `${kpi.higherIsBetter ? 0 : highPct}%`,
          width: `${kpi.higherIsBetter ? lowPct : 100 - highPct}%`,
          top: 0, bottom: 0, background: "#D1FAE5",
          borderRadius: kpi.higherIsBetter ? "4px 0 0 4px" : "0 4px 4px 0"
        }} />
        {/* Yellow zone */}
        <div style={{ position: "absolute", left: `${lowPct}%`, width: `${highPct - lowPct}%`, top: 0, bottom: 0, background: "#FEF3C7" }} />
        {/* Median marker */}
        <div style={{ position: "absolute", left: `${medPct}%`, top: -4, bottom: -4, width: 2, background: R.amber, borderRadius: 1, transform: "translateX(-50%)" }} />
        {/* P75 marker */}
        <div style={{ position: "absolute", left: `${p75Pct}%`, top: -4, bottom: -4, width: 2, background: R.green, borderRadius: 1, transform: "translateX(-50%)" }} />
        {/* User value */}
        {userPct !== null && (
          <div style={{ position: "absolute", left: `${userPct}%`, top: -6, bottom: -6, width: 3, background: s.bar, borderRadius: 2, transform: "translateX(-50%)", boxShadow: `0 0 0 3px white, 0 0 0 4px ${s.bar}` }} />
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: R.textLight }}>
        <span>0{kpi.einheit}</span>
        <span style={{ color: R.amber }}>▲ Median {median}{kpi.einheit}</span>
        <span style={{ color: R.green }}>▲ P75 {p75}{kpi.einheit}</span>
        <span>{maxV}{kpi.einheit}</span>
      </div>
    </div>
  );
}

export default function BenchmarkPage() {
  const [selectedKey, setSelectedKey] = useState("");
  const [umsatz, setUmsatz] = useState("");
  const [userValues, setUserValues] = useState<Record<string, string>>({});
  const [showUserInputs, setShowUserInputs] = useState(false);

  const branche = selectedKey ? BENCHMARKS[selectedKey] : null;
  const branchen = Object.entries(BENCHMARKS).map(([k, v]) => ({ key: k, label: v.label }));
  const getVal = (key: string, suffix: "median" | "p75"): number =>
    branche?.daten[`${key}_${suffix}`] ?? 0;

  return (
    <div style={{ background: R.offWhite, minHeight: "100vh", fontFamily: "'Helvetica Neue', sans-serif" }}>
      <style>{`* { box-sizing: border-box; } select:focus, input:focus { outline: none; }`}</style>

      <div style={{ background: R.white, borderBottom: `1px solid ${R.border}`, padding: "0 48px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.08em", color: R.green, textDecoration: "none" }}>RÖDL</a>
          <span style={{ color: R.border }}>|</span>
          <span style={{ fontSize: 13, color: R.textMid }}>Branchen-Benchmark</span>
        </div>
        <a href="/" style={{ fontSize: 11, color: R.textLight, textDecoration: "none" }}>← Alle Module</a>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 24, fontWeight: 300, color: R.text, margin: "0 0 8px", letterSpacing: "-0.01em" }}>Branchen-Benchmark</h1>
          <p style={{ fontSize: 13, color: R.textMid, margin: 0, lineHeight: 1.7 }}>
            Wählen Sie Ihre Branche — die Benchmarks werden sofort angezeigt. Optional können Sie Ihre eigenen Kennzahlen eintragen und direkt vergleichen.
          </p>
        </div>

        <div style={{ background: R.white, border: `1px solid ${R.border}`, borderRadius: 8, padding: "28px 32px", marginBottom: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 20 }}>
            <div>
              <label style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.textLight, display: "block", marginBottom: 8 }}>Branche</label>
              <select value={selectedKey} onChange={e => setSelectedKey(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${selectedKey ? R.green : R.border}`, borderRadius: 6, fontSize: 14, color: R.text, background: R.white, appearance: "none" as const }}>
                <option value="">Branche auswählen…</option>
                {branchen.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.textLight, display: "block", marginBottom: 8 }}>Umsatz (Mio. EUR)</label>
              <input type="number" value={umsatz} onChange={e => setUmsatz(e.target.value)} placeholder="z.B. 25"
                style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${umsatz ? R.green : R.border}`, borderRadius: 6, fontSize: 14, color: R.text, background: R.white }} />
            </div>
          </div>
          {branche && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${R.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 12, color: R.textMid }}>Möchten Sie Ihre eigenen Kennzahlen eintragen und direkt vergleichen?</div>
              <button onClick={() => setShowUserInputs(!showUserInputs)}
                style={{ padding: "8px 18px", background: showUserInputs ? R.green : R.white, border: `1.5px solid ${R.green}`, color: showUserInputs ? R.white : R.green, borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {showUserInputs ? "Eigene Werte ausblenden" : "Eigene Werte eingeben"}
              </button>
            </div>
          )}
        </div>

        {branche && showUserInputs && (
          <div style={{ background: R.greenLight, border: `1px solid ${R.border}`, borderRadius: 8, padding: "24px 32px", marginBottom: 28 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: R.green, fontWeight: 700, marginBottom: 16 }}>Ihre Kennzahlen</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {KPIS.map(kpi => (
                <div key={kpi.key}>
                  <label style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: R.textMid, display: "block", marginBottom: 6 }}>{kpi.label} ({kpi.einheit})</label>
                  <input type="number" value={userValues[kpi.key] || ""} onChange={e => setUserValues(prev => ({...prev, [kpi.key]: e.target.value}))} placeholder="—"
                    style={{ width: "100%", padding: "9px 12px", border: `1px solid ${R.border}`, borderRadius: 4, fontSize: 13, color: R.text, background: R.white }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {branche ? (
          <div style={{ background: R.white, border: `1px solid ${R.border}`, borderRadius: 8, padding: "28px 32px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: R.text }}>{branche.label}</div>
              <div style={{ fontSize: 11, color: R.textLight, marginTop: 4 }}>
                Quelle: Deutsche Bundesbank, Jahresabschlussstatistik Mai 2026 (Berichtsjahr 2023)
                {umsatz && ` · Umsatz: ${umsatz} Mio. EUR`}
              </div>
            </div>
            <div style={{ display: "flex", gap: 20, marginBottom: 20, fontSize: 11, color: R.textLight }}>
              <span>Legende:</span>
              <span style={{ color: R.amber }}>▲ Median (50. Perzentil)</span>
              <span style={{ color: R.green }}>▲ P75 (75. Perzentil)</span>
              {showUserInputs && <span style={{ color: R.text, fontWeight: 600 }}>● Ihr Wert</span>}
            </div>
            {KPIS.map(kpi => {
              const median  = getVal(kpi.key, "median");
              const p75     = getVal(kpi.key, "p75");
              const raw     = userValues[kpi.key];
              const userVal = showUserInputs && raw !== undefined && raw !== "" ? parseFloat(raw) : null;
              if (!median && !p75) return null;
              return <BenchmarkRow key={kpi.key} kpi={kpi} median={median} p75={p75} userVal={userVal} />;
            })}
          </div>
        ) : (
          <div style={{ background: R.white, border: `1px dashed ${R.border}`, borderRadius: 8, padding: "64px 32px", textAlign: "center" as const }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>◉</div>
            <div style={{ fontSize: 15, color: R.textMid }}>Branche auswählen, um Benchmarks anzuzeigen</div>
            <div style={{ fontSize: 12, color: R.textLight, marginTop: 8 }}>54 Branchen · 7 Kennzahlen · Bundesbank Mai 2026</div>
          </div>
        )}
      </div>
    </div>
  );
}
