"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { usePharma } from "@/context/PharmaContext";
import {
  Layers,
  Plus,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Lock,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function BatchRecordPage() {
  const { batches, advanceBatchStage, addBatchRecord, toggleBatchDeviation } = usePharma();
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [productCode, setProductCode] = useState("MED-AMX-500");
  const [productName, setProductName] = useState("Amoxicillin Trihydrate 500mg Capsule");
  const [dosageForm, setDosageForm] = useState("Hard Gelatin Capsule");
  const [lotQuantity, setLotQuantity] = useState(200000);
  const [leadPharmacist, setLeadPharmacist] = useState("APT-HARYO-44 (Sp.Farm)");

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    addBatchRecord({
      productCode,
      productName,
      dosageForm,
      lotQuantityUnits: Number(lotQuantity),
      currentStage: "DISPENSING",
      yieldPercentage: 99.1,
      plannedEndDate: "30 September 2026",
      leadPharmacistId: leadPharmacist,
      deviationReported: false,
    });

    confetti({
      particleCount: 40,
      spread: 60,
      colors: ["#4F46E5", "#0D9488", "#D97706"],
    });

    setShowModal(false);
  };

  const handleAdvance = (batchNumber: string) => {
    advanceBatchStage(batchNumber);
    confetti({
      particleCount: 20,
      spread: 40,
      colors: ["#4F46E5", "#0D9488"],
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
              <Lock className="w-3.5 h-3.5" />
              <span>cGMP 21 CFR PART 11 ELECTRONIC SIGNATURES & AUDIT TRAIL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Electronic Batch Production <span className="text-indigo-600">Record (eBR)</span>
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl">
              Alur kerja otomatisasi manufaktur farmasi berurutan: Dispensing &rarr; Granulation &rarr; Drying &rarr; Compression &rarr; Coating &rarr; Final QC Release.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs font-mono shadow-md hover:shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> INITIATE NEW GMP LOT
          </button>
        </section>

        {/* Modal Initiate New Batch */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Initiate Production Batch
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateBatch} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">NAMA PRODUK:</label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">KODE PRODUK:</label>
                    <input
                      type="text"
                      required
                      value={productCode}
                      onChange={(e) => setProductCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">JUMLAH TARGET:</label>
                    <input
                      type="number"
                      required
                      value={lotQuantity}
                      onChange={(e) => setLotQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">BENTUK SEDIAAN:</label>
                  <input
                    type="text"
                    required
                    value={dosageForm}
                    onChange={(e) => setDosageForm(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">APOTEKER PENANGGUNG JAWAB:</label>
                  <input
                    type="text"
                    required
                    value={leadPharmacist}
                    onChange={(e) => setLeadPharmacist(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                  >
                    Otorisasi Lot
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Batches Production Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => {
            return (
              <div
                key={batch.batchNumber}
                className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-sm">
                      {batch.batchNumber}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        batch.deviationReported
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {batch.deviationReported ? "DEVIATION CAPA" : "IN COMPLIANCE"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {batch.productName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {batch.dosageForm} • {batch.productCode}
                  </p>

                  {/* Stage Stepper Banner */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">CURRENT STAGE:</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold text-[11px] shadow-sm">
                        {batch.currentStage}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-700 text-[11px]">
                      <span>Batch Yield:</span>
                      <span className="font-bold text-teal-700">{batch.yieldPercentage}%</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-700 text-[11px]">
                      <span>Lot Size:</span>
                      <span className="font-bold">{batch.lotQuantityUnits.toLocaleString()} units</span>
                    </div>
                  </div>

                  {/* 21 CFR Electronic Signature Stamp */}
                  <div className="mt-4 pt-3 border-t border-slate-100 font-mono text-[10px] text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                      <Lock className="w-3 h-3 text-indigo-600" />
                      <span>{batch.leadPharmacistId}</span>
                    </div>
                    <div className="truncate text-slate-400">SigHash: {batch.electronicSignatureHash}</div>
                  </div>
                </div>

                {/* Card Action Area */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleBatchDeviation(batch.batchNumber)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700 transition-colors"
                  >
                    {batch.deviationReported ? "Clear Dev" : "Log Dev"}
                  </button>

                  <button
                    onClick={() => handleAdvance(batch.batchNumber)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <span>ADVANCE STAGE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
