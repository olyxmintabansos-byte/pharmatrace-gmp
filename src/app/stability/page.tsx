"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { usePharma } from "@/context/PharmaContext";
import {
  Thermometer,
  Droplets,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function StabilityChambersPage() {
  const { chambers, pullSamples, adjustChamberTemp, adjustChamberRh, advancePullStatus } =
    usePharma();

  const handlePullAdvance = (sampleId: string) => {
    advancePullStatus(sampleId);
    confetti({
      particleCount: 30,
      spread: 50,
      colors: ["#4F46E5", "#0D9488", "#D97706"],
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Material Elevated Header */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[11px] font-mono font-bold text-indigo-700 shadow-sm">
              <Thermometer className="w-3.5 h-3.5" />
              <span>ICH Q1A(R2) STABILITY TESTING // CLIMATE ZONE IVb</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Accelerated &amp; Real-Time <span className="text-indigo-600">Stability Chambers</span>
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl">
              Pengujian stabilitas jangka panjang dan dipercepat untuk penetapan masa kedaluwarsa (shelf-life), profil disolusi, dan laju degradasi impuritas kimia.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700 shadow-sm">
              3 CHAMBERS ACTIVE
            </span>
          </div>
        </section>

        {/* Chambers Environmental Telemetry Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {chambers.map((chamber) => {
            const isExcursion = chamber.status === "EXCURSION_ALARM";

            return (
              <div
                key={chamber.chamberId}
                className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {chamber.chamberId}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        isExcursion
                          ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {chamber.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {chamber.name}
                  </h3>

                  {/* Temperature & Humidity Gauges */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">SUHU AKTUAL</span>
                      <div className="text-2xl font-black font-mono text-indigo-900">
                        {chamber.actualTempC}°C
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        Target: {chamber.targetTempC}°C
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">RH AKTUAL</span>
                      <div className="text-2xl font-black font-mono text-teal-800">
                        {chamber.actualRhPct}%
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        Target: {chamber.targetRhPct}%
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] font-mono text-slate-500 mt-4">
                    Total Sampel Disimpan: <strong className="text-slate-800">{chamber.totalSamplesStored} Lots</strong>
                  </p>
                </div>

                {/* Adjuster Steppers */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => adjustChamberTemp(chamber.chamberId, -0.5)}
                      className="flex-1 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700 transition-colors"
                    >
                      -0.5°C
                    </button>
                    <button
                      onClick={() => adjustChamberTemp(chamber.chamberId, 0.5)}
                      className="flex-1 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700 transition-colors"
                    >
                      +0.5°C
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => adjustChamberRh(chamber.chamberId, -1.0)}
                      className="flex-1 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700 transition-colors"
                    >
                      -1% RH
                    </button>
                    <button
                      onClick={() => adjustChamberRh(chamber.chamberId, 1.0)}
                      className="flex-1 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700 transition-colors"
                    >
                      +1% RH
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Pull Schedule & Analytical Stability Testing */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-sans">
                ICH STABILITY PULL INTERVAL AUDIT TABLE
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Pengambilan sampel berkala 1, 3, 6, 12 &amp; 24 bulan untuk uji disolusi dan degradasi impuritas.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full font-bold">
              ICH Q1A COMPLIANT
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-[11px]">
                <tr>
                  <th className="p-3">SAMPLE ID</th>
                  <th className="p-3">LOT NUMBER</th>
                  <th className="p-3">NAMA PRODUK</th>
                  <th className="p-3">PULL INTERVAL</th>
                  <th className="p-3">KADAR (ASSAY %)</th>
                  <th className="p-3">DISOLUSI</th>
                  <th className="p-3">TOTAL IMPURITAS</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pullSamples.map((sample) => (
                  <tr key={sample.sampleId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-indigo-700">{sample.sampleId}</td>
                    <td className="p-3 text-slate-800">{sample.batchNumber}</td>
                    <td className="p-3 font-medium text-slate-900">{sample.productName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[10px]">
                        {sample.timePoint.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">{sample.assayPotencyPct}%</td>
                    <td className="p-3 font-bold text-teal-700">{sample.dissolutionPct}%</td>
                    <td className="p-3 text-slate-700">{sample.totalImpuritiesPct}%</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          sample.pullStatus === "VALIDATED_PASSED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : sample.pullStatus === "TESTING_IN_PROGRESS"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {sample.pullStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handlePullAdvance(sample.sampleId)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white border border-indigo-200 text-[10px] font-bold text-indigo-700 transition-all flex items-center gap-1 ml-auto"
                      >
                        <span>ADVANCE</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
