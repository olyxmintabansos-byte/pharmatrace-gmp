"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CleanroomZone,
  BatchRecord,
  PharmaKpi,
  BatchStage,
} from "@/types/pharma";

interface PharmaContextType {
  zones: CleanroomZone[];
  batches: BatchRecord[];
  selectedZoneId: string;
  setSelectedZoneId: (id: string) => void;
  kpis: PharmaKpi;
  adjustZonePressure: (zoneId: string, delta: number) => void;
  cycleHepaStatus: (zoneId: string) => void;
  advanceBatchStage: (batchNumber: string) => void;
  addBatchRecord: (b: Omit<BatchRecord, "batchNumber" | "electronicSignatureHash">) => void;
  toggleBatchDeviation: (batchNumber: string) => void;
  resetPharmaData: () => void;
}

const INITIAL_ZONES: CleanroomZone[] = [
  {
    zoneId: "ZONE-A-01",
    name: "Aseptic Filling Line #1 (Laminar Flow Hood)",
    grade: "GRADE_A_LAMINAR",
    differentialPressurePa: 48,
    targetPressurePa: 45,
    particles05MicronM3: 450,
    maxAllowedParticles05: 3520,
    temperatureC: 20.2,
    humidityPct: 44,
    airChangesPerHour: 60,
    hepaFilterStatus: "OPTIMAL_INTEGRITY",
    status: "IN_CONTROL",
  },
  {
    zoneId: "ZONE-B-02",
    name: "Sterile Formulation & Core Preparation Suite",
    grade: "GRADE_B_STERILE_CORE",
    differentialPressurePa: 34,
    targetPressurePa: 30,
    particles05MicronM3: 21500,
    maxAllowedParticles05: 352000,
    temperatureC: 20.8,
    humidityPct: 46,
    airChangesPerHour: 45,
    hepaFilterStatus: "OPTIMAL_INTEGRITY",
    status: "IN_CONTROL",
  },
  {
    zoneId: "ZONE-C-03",
    name: "High-Shear Granulation & Tablet Compression",
    grade: "GRADE_C_FORMULATION",
    differentialPressurePa: 18,
    targetPressurePa: 15,
    particles05MicronM3: 84000,
    maxAllowedParticles05: 3520000,
    temperatureC: 21.5,
    humidityPct: 42,
    airChangesPerHour: 30,
    hepaFilterStatus: "CERTIFIED_DOP_LEAK_TEST",
    status: "IN_CONTROL",
  },
  {
    zoneId: "ZONE-D-04",
    name: "Secondary Packaging Airlock & Gowning Suite",
    grade: "GRADE_D_AIRLOCK",
    differentialPressurePa: 6,
    targetPressurePa: 5,
    particles05MicronM3: 420000,
    maxAllowedParticles05: 3520000,
    temperatureC: 22.0,
    humidityPct: 48,
    airChangesPerHour: 20,
    hepaFilterStatus: "OPTIMAL_INTEGRITY",
    status: "IN_CONTROL",
  },
];

const INITIAL_BATCHES: BatchRecord[] = [
  {
    batchNumber: "LOT-CIPRO-2026-081",
    productCode: "MED-CPX-500",
    productName: "Ciprofloxacin HCl Film-Coated Tablet 500mg",
    dosageForm: "Oral Solid Tablet",
    lotQuantityUnits: 150000,
    currentStage: "COMPRESSION",
    yieldPercentage: 99.4,
    plannedEndDate: "27 September 2026",
    leadPharmacistId: "APT-HARYO-44 (Sp.Farm)",
    deviationReported: false,
    electronicSignatureHash: "SHA256:8f921a9c4021e847b3",
  },
  {
    batchNumber: "LOT-MERO-2026-042",
    productCode: "INJ-MRP-1000",
    productName: "Meropenem Sterile Powder for Injection 1g",
    dosageForm: "Lyophilized Powder",
    lotQuantityUnits: 50000,
    currentStage: "DISPENSING",
    yieldPercentage: 98.8,
    plannedEndDate: "28 September 2026",
    leadPharmacistId: "APT-RATNA-19 (Sp.Farm)",
    deviationReported: false,
    electronicSignatureHash: "SHA256:1a84f33b91c0e294f8",
  },
  {
    batchNumber: "LOT-ATOR-2026-119",
    productCode: "MED-ATV-20",
    productName: "Atorvastatin Calcium Trihydrate 20mg",
    dosageForm: "Oral Solid Tablet",
    lotQuantityUnits: 300000,
    currentStage: "QC_RELEASE",
    yieldPercentage: 99.7,
    plannedEndDate: "26 September 2026",
    leadPharmacistId: "APT-HARYO-44 (Sp.Farm)",
    deviationReported: false,
    electronicSignatureHash: "SHA256:7e20b85a11d4e0821c",
  },
];

const PharmaContext = createContext<PharmaContextType | undefined>(undefined);

export function PharmaProvider({ children }: { children: React.ReactNode }) {
  const [zones, setZones] = useState<CleanroomZone[]>(INITIAL_ZONES);
  const [batches, setBatches] = useState<BatchRecord[]>(INITIAL_BATCHES);
  const [selectedZoneId, setSelectedZoneId] = useState<string>("ZONE-A-01");

  useEffect(() => {
    try {
      const savedZones = localStorage.getItem("pharmatrace_zones");
      const savedBatches = localStorage.getItem("pharmatrace_batches");
      if (savedZones) setZones(JSON.parse(savedZones));
      if (savedBatches) setBatches(JSON.parse(savedBatches));
    } catch {}
  }, []);

  const saveZones = (data: CleanroomZone[]) => {
    setZones(data);
    try {
      localStorage.setItem("pharmatrace_zones", JSON.stringify(data));
    } catch {}
  };

  const saveBatches = (data: BatchRecord[]) => {
    setBatches(data);
    try {
      localStorage.setItem("pharmatrace_batches", JSON.stringify(data));
    } catch {}
  };

  const adjustZonePressure = (zoneId: string, delta: number) => {
    const updated = zones.map((z) => {
      if (z.zoneId === zoneId) {
        const nextP = Math.max(0, z.differentialPressurePa + delta);
        const status: CleanroomZone["status"] =
          nextP < z.targetPressurePa - 5
            ? "ACTION_EXCURSION"
            : nextP < z.targetPressurePa
            ? "ALERT_LEVEL"
            : "IN_CONTROL";
        return { ...z, differentialPressurePa: nextP, status };
      }
      return z;
    });
    saveZones(updated);
  };

  const cycleHepaStatus = (zoneId: string) => {
    const updated = zones.map((z) => {
      if (z.zoneId === zoneId) {
        const nextStatus: CleanroomZone["hepaFilterStatus"] =
          z.hepaFilterStatus === "OPTIMAL_INTEGRITY"
            ? "CERTIFIED_DOP_LEAK_TEST"
            : z.hepaFilterStatus === "CERTIFIED_DOP_LEAK_TEST"
            ? "WARNING_DIFF_PRESSURE"
            : "OPTIMAL_INTEGRITY";
        return { ...z, hepaFilterStatus: nextStatus };
      }
      return z;
    });
    saveZones(updated);
  };

  const advanceBatchStage = (batchNumber: string) => {
    const updated = batches.map((b) => {
      if (b.batchNumber === batchNumber) {
        const stages: BatchStage[] = [
          "DISPENSING",
          "GRANULATION",
          "DRYING",
          "COMPRESSION",
          "COATING",
          "QC_RELEASE",
        ];
        const currentIdx = stages.indexOf(b.currentStage);
        const nextStage = stages[(currentIdx + 1) % stages.length];
        return { ...b, currentStage: nextStage };
      }
      return b;
    });
    saveBatches(updated);
  };

  const addBatchRecord = (b: Omit<BatchRecord, "batchNumber" | "electronicSignatureHash">) => {
    const randCode = Math.floor(100 + Math.random() * 900);
    const newBatch: BatchRecord = {
      ...b,
      batchNumber: `LOT-GMP-2026-${randCode}`,
      electronicSignatureHash: `SHA256:${Math.random().toString(16).slice(2, 12)}`,
    };
    saveBatches([newBatch, ...batches]);
  };

  const toggleBatchDeviation = (batchNumber: string) => {
    const updated = batches.map((b) => {
      if (b.batchNumber === batchNumber) {
        return { ...b, deviationReported: !b.deviationReported };
      }
      return b;
    });
    saveBatches(updated);
  };

  const resetPharmaData = () => {
    saveZones(INITIAL_ZONES);
    saveBatches(INITIAL_BATCHES);
    setSelectedZoneId("ZONE-A-01");
  };

  const activeDeviations = batches.filter((b) => b.deviationReported).length;
  const meanPressure = Math.round(
    zones.reduce((acc, z) => acc + z.differentialPressurePa, 0) / zones.length
  );
  const totalUnits = batches.reduce((acc, b) => acc + b.lotQuantityUnits, 0);

  const kpis: PharmaKpi = {
    activeBatches: batches.length,
    cleanroomCompliantPct: 98.9,
    activeDeviations,
    meanDifferentialPressurePa: meanPressure,
    totalUnitsManufacturedToday: totalUnits,
  };

  return (
    <PharmaContext.Provider
      value={{
        zones,
        batches,
        selectedZoneId,
        setSelectedZoneId,
        kpis,
        adjustZonePressure,
        cycleHepaStatus,
        advanceBatchStage,
        addBatchRecord,
        toggleBatchDeviation,
        resetPharmaData,
      }}
    >
      {children}
    </PharmaContext.Provider>
  );
}

export function usePharma() {
  const context = useContext(PharmaContext);
  if (!context) throw new Error("usePharma must be used within a PharmaProvider");
  return context;
}
