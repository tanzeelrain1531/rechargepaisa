export type BedStatus = "occupied" | "available" | "reserved";

export interface BedHistoryEntry {
  date: string;
  action: "admitted" | "discharged" | "transferred";
  patientName: string;
  diagnosis?: string;
}

export type IsolationType = "Contact" | "Droplet" | "Airborne" | null;

export interface SafetyAssessment {
  morseHistory: number;
  morseSecondary: number;
  morseAid: number;
  morseIV: number;
  morseGait: number;
  morseMental: number;
  bradenSensory: number;
  bradenMoisture: number;
  bradenActivity: number;
  bradenMobility: number;
  bradenNutrition: number;
  bradenFriction: number;
  assessedDate: string;
}

export interface TransferEvent {
  timestamp: string;
  fromWard: string;
  fromBed: string;
  toWard: string;
  toBed: string;
  reason: string;
  orderingProvider: string;
}

export interface Bed {
  number: string;
  status: BedStatus;
  patientName?: string;
  admittedDate?: string;
  diagnosis?: string;
  history?: BedHistoryEntry[];
  isolation?: IsolationType;
  isolationNotes?: string;
  safetyAssessment?: SafetyAssessment;
  transferHistory?: TransferEvent[];
}

export interface RoundingNote {
  id: string;
  timestamp: string;
  provider: string;
  note: string;
}

export interface Ward {
  id: string;
  name: string;
  beds: Bed[];
}

export interface DietaryOrder {
  dietType: string;
  texture: string;
  foodAllergies: string;
  supplements: string;
}
