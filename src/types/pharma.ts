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

export interface StabilityChamber {
  chamberId: string;
  name: string;
  zoneType: "ACCELERATED_40C_75RH" | "LONG_TERM_25C_60RH" | "INTERMEDIATE_30C_65RH";
  actualTempC: number;
  targetTempC: number;
  actualRhPct: number;
  targetRhPct: number;
  status: "CALIBRATED_NOMINAL" | "EXCURSION_ALARM";
  totalSamplesStored: number;
}

export interface StabilityPullSample {
  sampleId: string;
  batchNumber: string;
  productName: string;
  timePoint: "1_MONTH" | "3_MONTHS" | "6_MONTHS" | "12_MONTHS" | "24_MONTHS";
  storageCondition: string;
  assayPotencyPct: number;
  dissolutionPct: number;
  totalImpuritiesPct: number;
  pullStatus: "VALIDATED_PASSED" | "TESTING_IN_PROGRESS" | "SCHEDULED_PULL";
}

export interface BatchReleaseReport {
  releaseCertificateNo: string;
  batchNumber: string;
  productCode: string;
  productName: string;
  dosageForm: string;
  manufacturingDate: string;
  expirationDate: string;
  lotSizeUnits: number;
  marketAuthorizationNo: string;
  qaDisposition: "RELEASED_FOR_DISTRIBUTION" | "QUARANTINE_HOLD" | "REJECTED";
  analyticalTests: {
    testParameter: string;
    specification: string;
    actualResult: string;
    compliance: "PASS" | "FAIL";
  }[];
  qualifiedPersonName: string;
  qcDirectorName: string;
  issueDate: string;
}
