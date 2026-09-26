export type CleanroomGrade =
  | "GRADE_A_LAMINAR"
  | "GRADE_B_STERILE_CORE"
  | "GRADE_C_FORMULATION"
  | "GRADE_D_AIRLOCK";

export type CleanroomStatus = "IN_CONTROL" | "ALERT_LEVEL" | "ACTION_EXCURSION";

export interface CleanroomZone {
  zoneId: string;
  name: string;
  grade: CleanroomGrade;
  differentialPressurePa: number;
  targetPressurePa: number;
  particles05MicronM3: number;
  maxAllowedParticles05: number;
  temperatureC: number;
  humidityPct: number;
  airChangesPerHour: number;
  hepaFilterStatus: "OPTIMAL_INTEGRITY" | "WARNING_DIFF_PRESSURE" | "CERTIFIED_DOP_LEAK_TEST";
  status: CleanroomStatus;
}

export type BatchStage =
  | "DISPENSING"
  | "GRANULATION"
  | "DRYING"
  | "COMPRESSION"
  | "COATING"
  | "QC_RELEASE";

export interface BatchRecord {
  batchNumber: string;
  productCode: string;
  productName: string;
  dosageForm: string;
  lotQuantityUnits: number;
  currentStage: BatchStage;
  yieldPercentage: number;
  plannedEndDate: string;
  leadPharmacistId: string;
  deviationReported: boolean;
  electronicSignatureHash: string;
}

export interface PharmaKpi {
  activeBatches: number;
  cleanroomCompliantPct: number;
  activeDeviations: number;
  meanDifferentialPressurePa: number;
  totalUnitsManufacturedToday: number;
}
