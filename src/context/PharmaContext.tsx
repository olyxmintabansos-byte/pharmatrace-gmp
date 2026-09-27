"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CleanroomZone,
  BatchRecord,
  PharmaKpi,
  BatchStage,
  StabilityChamber,
  StabilityPullSample,
  BatchReleaseReport,
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
  chambers: StabilityChamber[];
  pullSamples: StabilityPullSample[];
  adjustChamberTemp: (chamberId: string, delta: number) => void;
  adjustChamberRh: (chamberId: string, delta: number) => void;
  advancePullStatus: (sampleId: string) => void;
  releaseReports: BatchReleaseReport[];
  selectedReportId: string;
  setSelectedReportId: (id: string) => void;
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

const INITIAL_CHAMBERS: StabilityChamber[] = [
  {
    chamberId: "CHAMBER-ACC-01",
    name: "ICH Accelerated Stability Room (Zone IVb)",
    zoneType: "ACCELERATED_40C_75RH",
    actualTempC: 40.1,
    targetTempC: 40.0,
    actualRhPct: 75.2,
    targetRhPct: 75.0,
    status: "CALIBRATED_NOMINAL",
    totalSamplesStored: 84,
  },
  {
    chamberId: "CHAMBER-LONG-02",
    name: "ICH Long-Term Real-Time Vault (Climate Zone IVa)",
    zoneType: "LONG_TERM_25C_60RH",
    actualTempC: 25.0,
    targetTempC: 25.0,
    actualRhPct: 60.1,
    targetRhPct: 60.0,
    status: "CALIBRATED_NOMINAL",
    totalSamplesStored: 140,
  },
  {
    chamberId: "CHAMBER-INT-03",
    name: "ICH Intermediate Testing Unit",
    zoneType: "INTERMEDIATE_30C_65RH",
    actualTempC: 30.2,
    targetTempC: 30.0,
    actualRhPct: 65.4,
    targetRhPct: 65.0,
    status: "CALIBRATED_NOMINAL",
    totalSamplesStored: 48,
  },
];

const INITIAL_PULL_SAMPLES: StabilityPullSample[] = [
  {
    sampleId: "STAB-CPX-6M",
    batchNumber: "LOT-CIPRO-2026-081",
    productName: "Ciprofloxacin HCl Tablet 500mg",
    timePoint: "6_MONTHS",
    storageCondition: "40°C ± 2°C / 75% RH ± 5%",
    assayPotencyPct: 99.2,
    dissolutionPct: 94.5,
    totalImpuritiesPct: 0.18,
    pullStatus: "VALIDATED_PASSED",
  },
  {
    sampleId: "STAB-MRP-3M",
    batchNumber: "LOT-MERO-2026-042",
    productName: "Meropenem Sterile Powder 1g",
    timePoint: "3_MONTHS",
    storageCondition: "40°C ± 2°C / 75% RH ± 5%",
    assayPotencyPct: 98.6,
    dissolutionPct: 99.8,
    totalImpuritiesPct: 0.24,
    pullStatus: "TESTING_IN_PROGRESS",
  },
  {
    sampleId: "STAB-ATV-12M",
    batchNumber: "LOT-ATOR-2026-119",
    productName: "Atorvastatin Calcium 20mg",
    timePoint: "12_MONTHS",
    storageCondition: "25°C ± 2°C / 60% RH ± 5%",
    assayPotencyPct: 99.8,
    dissolutionPct: 96.2,
    totalImpuritiesPct: 0.12,
    pullStatus: "VALIDATED_PASSED",
  },
];

const INITIAL_RELEASE_REPORTS: BatchReleaseReport[] = [
  {
    releaseCertificateNo: "BPOM-CPOB-2026-REL-0914",
    batchNumber: "LOT-ATOR-2026-119",
    productCode: "MED-ATV-20",
    productName: "Atorvastatin Calcium Trihydrate Film-Coated Tablet 20mg",
    dosageForm: "Oral Solid Tablet",
    manufacturingDate: "20 September 2026",
    expirationDate: "September 2029 (36 Bulan)",
    lotSizeUnits: 300000,
    marketAuthorizationNo: "DKL1928409117A1",
    qaDisposition: "RELEASED_FOR_DISTRIBUTION",
    analyticalTests: [
      {
        testParameter: "Identifikasi Spektrofotometri IR & HPLC",
        specification: "Sesuai baku pembanding Atorvastatin BPFI",
        actualResult: "Positif Teridentifikasi (Rt: 4.82 min)",
        compliance: "PASS",
      },
      {
        testParameter: "Kadar Bahan Aktif (Assay HPLC)",
        specification: "95.0% - 105.0% klaim label",
        actualResult: "99.7% Kadar Nyata",
        compliance: "PASS",
      },
      {
        testParameter: "Uji Disolusi In Vitro (45 menit)",
        specification: "Q >= 80% dalam dapar fosfat pH 6.8",
        actualResult: "Q = 96.4% (Rata-rata n=6)",
        compliance: "PASS",
      },
      {
        testParameter: "Keseragaman Sediaan (Uniformity of Dosage Units)",
        specification: "Nilai Penerimaan (AV) <= 15.0",
        actualResult: "AV = 3.8",
        compliance: "PASS",
      },
      {
        testParameter: "Cemaran Senyawa Sejenis (Total Impurities)",
        specification: "Tidak lebih dari 0.50%",
        actualResult: "0.12% Total Impuritas",
        compliance: "PASS",
      },
    ],
    qualifiedPersonName: "Apt. Haryo Wicaksono, M.Farm (Head of QA)",
    qcDirectorName: "Dr. Apt. Ratna Kusuma, M.Si (Head of QC)",
    issueDate: "27 September 2026",
  },
  {
    releaseCertificateNo: "BPOM-CPOB-2026-REL-0915",
    batchNumber: "LOT-CIPRO-2026-081",
    productCode: "MED-CPX-500",
    productName: "Ciprofloxacin HCl Film-Coated Tablet 500mg",
    dosageForm: "Oral Solid Tablet",
    manufacturingDate: "22 September 2026",
    expirationDate: "September 2029 (36 Bulan)",
    lotSizeUnits: 150000,
    marketAuthorizationNo: "DKL1814092109A1",
    qaDisposition: "RELEASED_FOR_DISTRIBUTION",
    analyticalTests: [
      {
        testParameter: "Identifikasi Kimia & KCKT (HPLC)",
        specification: "Sesuai baku pembanding Ciprofloxacin HCl",
        actualResult: "Positif Teridentifikasi",
        compliance: "PASS",
      },
      {
        testParameter: "Kadar Bahan Aktif (Assay HPLC)",
        specification: "95.0% - 105.0% klaim label",
        actualResult: "99.4% Kadar Nyata",
        compliance: "PASS",
      },
      {
        testParameter: "Uji Disolusi In Vitro (30 menit)",
        specification: "Q >= 80% dalam 0.01 N HCl",
        actualResult: "Q = 94.8% (n=6)",
        compliance: "PASS",
      },
      {
        testParameter: "Uji Batas Mikroba (TAMC / TYMC)",
        specification: "TAMC < 1000 CFU/g, TYMC < 100 CFU/g",
        actualResult: "TAMC: 15 CFU/g, Bebas Salmonella & E. coli",
        compliance: "PASS",
      },
    ],
    qualifiedPersonName: "Apt. Haryo Wicaksono, M.Farm (Head of QA)",
    qcDirectorName: "Dr. Apt. Ratna Kusuma, M.Si (Head of QC)",
    issueDate: "27 September 2026",
  },
];

const PharmaContext = createContext<PharmaContextType | undefined>(undefined);

export function PharmaProvider({ children }: { children: React.ReactNode }) {
  const [zones, setZones] = useState<CleanroomZone[]>(INITIAL_ZONES);
  const [batches, setBatches] = useState<BatchRecord[]>(INITIAL_BATCHES);
  const [selectedZoneId, setSelectedZoneId] = useState<string>("ZONE-A-01");
  const [chambers, setChambers] = useState<StabilityChamber[]>(INITIAL_CHAMBERS);
  const [pullSamples, setPullSamples] = useState<StabilityPullSample[]>(INITIAL_PULL_SAMPLES);
  const [releaseReports] = useState<BatchReleaseReport[]>(INITIAL_RELEASE_REPORTS);
  const [selectedReportId, setSelectedReportId] = useState<string>("BPOM-CPOB-2026-REL-0914");

  useEffect(() => {
    try {
      const savedZones = localStorage.getItem("pharmatrace_zones");
      const savedBatches = localStorage.getItem("pharmatrace_batches");
      const savedChambers = localStorage.getItem("pharmatrace_chambers");
      const savedPulls = localStorage.getItem("pharmatrace_pulls");
      if (savedZones) setZones(JSON.parse(savedZones));
      if (savedBatches) setBatches(JSON.parse(savedBatches));
      if (savedChambers) setChambers(JSON.parse(savedChambers));
      if (savedPulls) setPullSamples(JSON.parse(savedPulls));
    } catch {}
  }, []);

  const saveZones = (data: CleanroomZone[]) => {
    setZones(data);
    try { localStorage.setItem("pharmatrace_zones", JSON.stringify(data)); } catch {}
  };
  const saveBatches = (data: BatchRecord[]) => {
    setBatches(data);
    try { localStorage.setItem("pharmatrace_batches", JSON.stringify(data)); } catch {}
  };
  const saveChambers = (data: StabilityChamber[]) => {
    setChambers(data);
    try { localStorage.setItem("pharmatrace_chambers", JSON.stringify(data)); } catch {}
  };
  const savePulls = (data: StabilityPullSample[]) => {
    setPullSamples(data);
    try { localStorage.setItem("pharmatrace_pulls", JSON.stringify(data)); } catch {}
  };

  const adjustZonePressure = (zoneId: string, delta: number) => {
    const updated = zones.map((z) => {
      if (z.zoneId === zoneId) {
        const nextP = Math.max(0, z.differentialPressurePa + delta);
        const status: CleanroomZone["status"] =
          nextP < z.targetPressurePa - 5 ? "ACTION_EXCURSION"
          : nextP < z.targetPressurePa ? "ALERT_LEVEL"
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
          z.hepaFilterStatus === "OPTIMAL_INTEGRITY" ? "CERTIFIED_DOP_LEAK_TEST"
          : z.hepaFilterStatus === "CERTIFIED_DOP_LEAK_TEST" ? "WARNING_DIFF_PRESSURE"
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
        const stages: BatchStage[] = ["DISPENSING","GRANULATION","DRYING","COMPRESSION","COATING","QC_RELEASE"];
        const nextStage = stages[(stages.indexOf(b.currentStage) + 1) % stages.length];
        return { ...b, currentStage: nextStage };
      }
      return b;
    });
    saveBatches(updated);
  };

  const addBatchRecord = (b: Omit<BatchRecord, "batchNumber" | "electronicSignatureHash">) => {
    const randCode = Math.floor(100 + Math.random() * 900);
    saveBatches([{
      ...b,
      batchNumber: `LOT-GMP-2026-${randCode}`,
      electronicSignatureHash: `SHA256:${Math.random().toString(16).slice(2, 12)}`,
    }, ...batches]);
  };

  const toggleBatchDeviation = (batchNumber: string) => {
    saveBatches(batches.map((b) =>
      b.batchNumber === batchNumber ? { ...b, deviationReported: !b.deviationReported } : b
    ));
  };

  const adjustChamberTemp = (chamberId: string, delta: number) => {
    const updated = chambers.map((c) => {
      if (c.chamberId === chamberId) {
        const nextT = Number((c.actualTempC + delta).toFixed(1));
        const status: StabilityChamber["status"] =
          Math.abs(nextT - c.targetTempC) > 2.0 ? "EXCURSION_ALARM" : "CALIBRATED_NOMINAL";
        return { ...c, actualTempC: nextT, status };
      }
      return c;
    });
    saveChambers(updated);
  };

  const adjustChamberRh = (chamberId: string, delta: number) => {
    const updated = chambers.map((c) => {
      if (c.chamberId === chamberId) {
        const nextRh = Number((c.actualRhPct + delta).toFixed(1));
        const status: StabilityChamber["status"] =
          Math.abs(nextRh - c.targetRhPct) > 5.0 ? "EXCURSION_ALARM" : "CALIBRATED_NOMINAL";
        return { ...c, actualRhPct: nextRh, status };
      }
      return c;
    });
    saveChambers(updated);
  };

  const advancePullStatus = (sampleId: string) => {
    savePulls(pullSamples.map((p) => {
      if (p.sampleId === sampleId) {
        const nextStatus: StabilityPullSample["pullStatus"] =
          p.pullStatus === "SCHEDULED_PULL" ? "TESTING_IN_PROGRESS"
          : p.pullStatus === "TESTING_IN_PROGRESS" ? "VALIDATED_PASSED"
          : "SCHEDULED_PULL";
        return { ...p, pullStatus: nextStatus };
      }
      return p;
    }));
  };

  const resetPharmaData = () => {
    saveZones(INITIAL_ZONES);
    saveBatches(INITIAL_BATCHES);
    saveChambers(INITIAL_CHAMBERS);
    savePulls(INITIAL_PULL_SAMPLES);
    setSelectedZoneId("ZONE-A-01");
    setSelectedReportId("BPOM-CPOB-2026-REL-0914");
  };

  const activeDeviations = batches.filter((b) => b.deviationReported).length;
  const meanPressure = Math.round(zones.reduce((acc, z) => acc + z.differentialPressurePa, 0) / zones.length);
  const totalUnits = batches.reduce((acc, b) => acc + b.lotQuantityUnits, 0);

  const kpis: PharmaKpi = {
    activeBatches: batches.length,
    cleanroomCompliantPct: 98.9,
    activeDeviations,
    meanDifferentialPressurePa: meanPressure,
    totalUnitsManufacturedToday: totalUnits,
  };

  return (
    <PharmaContext.Provider value={{
      zones, batches, selectedZoneId, setSelectedZoneId, kpis,
      adjustZonePressure, cycleHepaStatus, advanceBatchStage, addBatchRecord, toggleBatchDeviation,
      chambers, pullSamples, adjustChamberTemp, adjustChamberRh, advancePullStatus,
      releaseReports, selectedReportId, setSelectedReportId, resetPharmaData,
    }}>
      {children}
    </PharmaContext.Provider>
  );
}

export function usePharma() {
  const context = useContext(PharmaContext);
  if (!context) throw new Error("usePharma must be used within a PharmaProvider");
  return context;
}
