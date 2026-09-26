"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Wind, Layers, Activity, Award, RotateCcw } from "lucide-react";
import { usePharma } from "@/context/PharmaContext";

export default function Navbar() {
  const pathname = usePathname();
  const { kpis, resetPharmaData } = usePharma();

  const navLinks = [
    { href: "/", label: "CLEANROOM HVAC ISO-14644", icon: Wind },
    { href: "/batch/", label: "21 CFR PART 11 eBR", icon: Layers },
    { href: "/stability/", label: "ICH Q1A STABILITY CHAMBER", icon: Activity },
    { href: "/release/", label: "GMP RELEASE CERTIFICATE A4", icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 shadow-md flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900 font-sans">
                  PHARMATRACE GMP
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-sm">
                  TITAN #34
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                STERILE CLEANROOM & cGMP BATCH EXECUTION
              </p>
            </div>
          </div>

          {/* Material Elevation Quick Badges */}
          <div className="hidden lg:flex items-center gap-3 font-mono text-xs">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase font-bold">HVAC COMPLIANCE</span>
              <span className="font-bold text-teal-700">{kpis.cleanroomCompliantPct}% IN CONTROL</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase font-bold">ACTIVE BATCHES</span>
              <span className="font-bold text-indigo-700">{kpis.activeBatches} PRODUCTION LOTS</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase font-bold">DEVIATIONS</span>
              <span
                className={`font-bold ${
                  kpis.activeDeviations > 0 ? "text-rose-600" : "text-slate-800"
                }`}
              >
                {kpis.activeDeviations} OPEN CAPA
              </span>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={resetPharmaData}
              title="Reset Simulated State"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>cGMP BPOM / FDA</span>
            </div>
          </div>
        </div>

        {/* Material Segmented Navigation Tabs */}
        <nav className="flex space-x-2 py-2 overflow-x-auto scrollbar-none border-t border-slate-100">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              pathname === tab.href ||
              (tab.href !== "/" && pathname?.startsWith(tab.href.replace(/\/$/, "")));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
