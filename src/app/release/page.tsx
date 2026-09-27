"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { usePharma } from "@/context/PharmaContext";
import {
  Award,
  Printer,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lock,
} from "lucide-react";

export default function BatchReleaseCertificatePage() {
  const { releaseReports, selectedReportId, setSelectedReportId } = usePharma();
  const currentReport =
    releaseReports.find((r) => r.releaseCertificateNo === selectedReportId) || releaseReports[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 print:p-0 print:m-0 print:max-w-none">
        {/* Action Header Banner (Hidden on Print) */}
        <div className="print:hidden bg-white rounded-3xl p-6 shadow-lg border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[11px] font-mono font-bold text-indigo-700 shadow-sm mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>BPOM CPOB &amp; US FDA 21 CFR PART 211 COMPLIANT</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Certificate of Pharmaceutical <span className="text-indigo-600">Product Release (A4)</span>
            </h1>
            <p className="text-xs text-slate-600">
              Otorisasi pelulusan batch produk jadi farmasi untuk distribusi nasional &amp; ekspor.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedReportId}
              onChange={(e) => setSelectedReportId(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-sm"
            >
              {releaseReports.map((r) => (
                <option key={r.releaseCertificateNo} value={r.releaseCertificateNo}>
                  {r.batchNumber} // {r.productCode}
                </option>
              ))}
            </select>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> CETAK SERTIFIKAT A4
            </button>
          </div>
        </div>

        {/* Printable A4 Certificate Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 print:border-none print:shadow-none print:p-6 print:rounded-none text-slate-900 border border-slate-200">
          {/* Certificate Letterhead */}
          <div className="border-b-4 border-indigo-900 pb-6 mb-6 flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black tracking-tight text-indigo-950 font-sans uppercase">
                  PHARMATRACE GMP MANUFACTURING
                </span>
              </div>
              <p className="text-xs font-mono text-slate-600 font-bold uppercase tracking-wider">
                DEPARTEMEN PEMASTIAN MUTU (QUALITY ASSURANCE) • FASILITAS PRODUKSI STERIL
              </p>
              <p className="text-[11px] font-mono text-slate-500">
                Sertifikat CPOB No. CPOB-FARMA-2026/092 • Organisasi olyxmintabansos-byte
              </p>
            </div>

            <div className="text-right font-mono">
              <div className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-900 rounded font-bold text-xs text-indigo-950">
                SERTIFIKAT PELULUSAN BATCH
              </div>
              <p className="text-xs text-slate-600 mt-1 font-bold">NO: {currentReport.releaseCertificateNo}</p>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center my-6 space-y-1">
            <h2 className="text-xl font-bold tracking-wider text-slate-900 uppercase font-sans">
              CERTIFICATE OF FINISHED PRODUCT BATCH RELEASE
            </h2>
            <p className="text-xs italic text-slate-600">
              Pelulusan Resmi Batch Produk Jadi untuk Pengedaran Komersial
            </p>
          </div>

          {/* Product & Batch Identifiers Grid */}
          <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs mb-6">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">
                NAMA PRODUK OBAT:
              </span>
              <span className="text-sm font-bold text-slate-900">{currentReport.productName}</span>
              <p className="text-slate-600 text-[11px]">{currentReport.dosageForm} • Kode: {currentReport.productCode}</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">
                NOMOR BATCH / LOT:
              </span>
              <span className="text-sm font-bold text-indigo-900">{currentReport.batchNumber}</span>
              <p className="text-slate-600 text-[11px]">Besar Batch: {currentReport.lotSizeUnits.toLocaleString()} Unit</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">
                NOMOR IZIN EDAR (NIE BPOM):
              </span>
              <span className="font-bold text-slate-800">{currentReport.marketAuthorizationNo}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">
                TANGGAL PRODUKSI / KEDALUWARSA:
              </span>
              <span className="text-slate-800">{currentReport.manufacturingDate} &rarr; {currentReport.expirationDate}</span>
            </div>
          </div>

          {/* Analytical QC Results Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 font-sans flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              HASIL PENGUJIAN PENGAWASAN MUTU (QUALITY CONTROL ANALYTICAL RESULTS)
            </h3>

            <table className="w-full text-left font-mono text-xs border border-slate-200">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-800 text-[11px]">
                <tr>
                  <th className="p-2.5 border-r border-slate-200">PARAMETER PENGUJIAN</th>
                  <th className="p-2.5 border-r border-slate-200">SPESIFIKASI FARMAKOPE</th>
                  <th className="p-2.5 border-r border-slate-200">HASIL LABORATORIUM</th>
                  <th className="p-2.5">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {currentReport.analyticalTests.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 border-r border-slate-200 font-bold text-slate-900">
                      {row.testParameter}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-slate-700">
                      {row.specification}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-bold text-indigo-950">
                      {row.actualResult}
                    </td>
                    <td className="p-2.5 font-bold text-emerald-700">
                      MEMENUHI SYARAT
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* QA Disposition Declaration */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 font-mono text-xs mb-8">
            <span className="text-[10px] text-emerald-800 uppercase block font-bold">
              PERNYATAAN DISPOSISI PEMASTIAN MUTU (QA DISPOSITION):
            </span>
            <span className="text-base font-black text-emerald-800 uppercase">
              {currentReport.qaDisposition.replace(/_/g, " ")}
            </span>
            <p className="text-[11px] text-slate-600 mt-1">
              Dengan ini dinyatakan bahwa batch obat di atas telah diproduksi, diuji, dan dikemas sesuai dengan ketentuan CPOB / cGMP serta berkas Izin Edar yang berlaku.
            </p>
          </div>

          {/* Dual Pharmacist / Qualified Person Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t-2 border-slate-200 font-mono text-xs">
            <div className="text-center space-y-12">
              <span className="text-[10px] text-slate-500 uppercase block">
                HEAD OF QUALITY CONTROL:
              </span>
              <div>
                <p className="font-bold underline text-slate-900">{currentReport.qcDirectorName}</p>
                <p className="text-[10px] text-slate-500">STRA. 19881104/STRA-BPOM/2014</p>
              </div>
            </div>

            <div className="text-center space-y-12">
              <span className="text-[10px] text-slate-500 uppercase block">
                QUALIFIED PERSON (HEAD OF QUALITY ASSURANCE):
              </span>
              <div>
                <p className="font-bold underline text-slate-900">{currentReport.qualifiedPersonName}</p>
                <p className="text-[10px] text-slate-500">STRA. 19840219/STRA-BPOM/2009</p>
              </div>
            </div>
          </div>

          {/* Certificate Footer Notes */}
          <div className="mt-8 pt-3 border-t border-slate-200 flex justify-between items-center font-mono text-[10px] text-slate-400">
            <span>TANGGAL TERBIT: {currentReport.issueDate}</span>
            <span>PHARMATRACE GMP // TITAN #34 FLEET</span>
          </div>
        </div>
      </main>
    </div>
  );
}
