"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { usePharma } from "@/context/PharmaContext";
import {
  Wind,
  Gauge,
  Thermometer,
  Droplets,
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function CleanroomDashboardPage() {
  const {
    zones,
    selectedZoneId,
    setSelectedZoneId,
    adjustZonePressure,
    cycleHepaStatus,
    kpis,
  } = usePharma();

  const selectedZone = zones.find((z) => z.zoneId === selectedZoneId) || zones[0];

  const handlePressure = (delta: number) => {
    adjustZonePressure(selectedZone.zoneId, delta);
    if (delta > 0) {
      confetti({
        particleCount: 25,
        spread: 45,
        colors: ["#4F46E5", "#0D9488"],
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Material Elevated Hero Header */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200/80">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[11px] font-mono font-bold text-indigo-700 shadow-sm">
                <Wind className="w-3.5 h-3.5" />
                <span>ISO 14644-1 AIRBORNE PARTICULATE & DIFFERENTIAL CASCADE</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Sterile Cleanroom{" "}
                <span className="text-indigo-600">HVAC Cascade Telemetry</span>
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pemantauan diferensial tekanan kaskade positif (Grade A &gt; B &gt; C &gt; D),
                integritas HEPA H14, partikel 0.5µm airborne continuous, dan pertukaran udara laminar (ACH).
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">MEAN CASCADE ΔP</span>
                <span className="text-2xl font-bold font-mono text-indigo-700">
                  +{kpis.meanDifferentialPressurePa} <span className="text-xs font-normal">Pa</span>
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">HEPA FILTERS</span>
                <span className="text-2xl font-bold font-mono text-teal-700">
                  4/4 <span className="text-xs font-normal">ACTIVE</span>
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">STATUS MONITOR</span>
                <span className="text-lg font-bold font-mono text-emerald-700 flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  ISO PASS
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Zone Detail Deck */}
        {selectedZone && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-100 text-indigo-800">
                  {selectedZone.zoneId} // {selectedZone.grade.replace(/_/g, " ")}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                  {selectedZone.name}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold shadow-sm border ${
                    selectedZone.status === "IN_CONTROL"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {selectedZone.status}
                </span>
              </div>
            </div>

            {/* Core Sensor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Pressure Delta */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-4 h-4 text-indigo-600" /> TEKANAN (ΔP)
                  </span>
                  <span>TARGET: +{selectedZone.targetPressurePa} Pa</span>
                </div>
                <div className="text-3xl font-black font-mono text-indigo-900">
                  +{selectedZone.differentialPressurePa}{" "}
                  <span className="text-xs font-normal text-slate-500">Pa</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handlePressure(-2)}
                    className="flex-1 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-mono font-bold text-slate-700 shadow-sm flex items-center justify-center gap-1"
                  >
                    <Minus className="w-3.5 h-3.5" /> -2 Pa
                  </button>
                  <button
                    onClick={() => handlePressure(2)}
                    className="flex-1 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold shadow-md flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> +2 Pa
                  </button>
                </div>
              </div>

              {/* Particulate Count */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Wind className="w-4 h-4 text-teal-600" /> PARTIKEL 0.5µm
                  </span>
                  <span>MAX: {selectedZone.maxAllowedParticles05.toLocaleString()}</span>
                </div>
                <div className="text-3xl font-black font-mono text-teal-800">
                  {selectedZone.particles05MicronM3.toLocaleString()}{" "}
                  <span className="text-xs font-normal text-slate-500">/ m³</span>
                </div>
                <p className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> MEMENUHI KELAS ISO
                </p>
              </div>

              {/* Temperature & Humidity */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Thermometer className="w-4 h-4 text-amber-600" /> SUHU & RH
                  </span>
                  <span>TARGET: 20°C / 45%</span>
                </div>
                <div className="text-3xl font-black font-mono text-slate-900">
                  {selectedZone.temperatureC}°C{" "}
                  <span className="text-lg font-normal text-slate-500">/ {selectedZone.humidityPct}% RH</span>
                </div>
                <p className="text-[11px] font-mono text-slate-500 pt-1">
                  Airflow ACH: {selectedZone.airChangesPerHour}x / hour
                </p>
              </div>

              {/* HEPA Integrity */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-xs font-mono text-slate-500 block mb-1">INTEGRITAS FILTER HEPA</span>
                  <span className="text-sm font-bold font-mono text-slate-800">
                    {selectedZone.hepaFilterStatus}
                  </span>
                </div>
                <button
                  onClick={() => cycleHepaStatus(selectedZone.zoneId)}
                  className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-mono font-bold text-slate-700 shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" /> TEST LEAK DOP
                </button>
              </div>
            </div>
          </section>
        )}

        {/* All Cleanroom Zones Grid */}
        <section className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-sans">
            ALL CLEANROOM SUITES (GRADE A &rarr; D HIERARCHY)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {zones.map((zone) => {
              const isSelected = zone.zoneId === selectedZoneId;
              return (
                <div
                  key={zone.zoneId}
                  onClick={() => setSelectedZoneId(zone.zoneId)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 ${
                    isSelected
                      ? "bg-white border-indigo-500 shadow-lg ring-2 ring-indigo-500/20"
                      : "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-indigo-700">
                      {zone.zoneId}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {zone.grade.split("_")[1]}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{zone.name}</h4>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block">PRESSURE</span>
                      <span className="font-bold text-indigo-800">+{zone.differentialPressurePa} Pa</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">0.5µm COUNT</span>
                      <span className="font-bold text-teal-800">
                        {zone.particles05MicronM3 < 1000
                          ? `${zone.particles05MicronM3}`
                          : `${(zone.particles05MicronM3 / 1000).toFixed(0)}k`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
