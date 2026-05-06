import type React from "react";
import { createContext, useContext, useRef } from "react";
import type { backendInterface } from "../backend.d";
import {
  DEMO_APPOINTMENTS,
  DEMO_AUDIT_LOGS,
  DEMO_CLAIMS,
  DEMO_CLINICAL_NOTES,
  DEMO_IMAGING_ORDERS,
  DEMO_INPATIENT_BEDS,
  DEMO_INVOICES,
  DEMO_LAB_CONNECTIONS,
  DEMO_LAB_RESULTS,
  DEMO_MEDICATIONS,
  DEMO_MESSAGES,
  DEMO_PATIENTS,
  DEMO_PRESCRIPTIONS,
  DEMO_REFERRALS,
  DEMO_RESULTS_INBOX,
  DEMO_USERS,
} from "../demoData";

function createDemoActor() {
  // Mutable session-local copies
  let patients = [...DEMO_PATIENTS];
  let appointments = [...DEMO_APPOINTMENTS];
  let labResults = [...DEMO_LAB_RESULTS];
  let medications = [...DEMO_MEDICATIONS];
  let clinicalNotes = [...DEMO_CLINICAL_NOTES];
  let invoices = [...DEMO_INVOICES];
  let messages = [...DEMO_MESSAGES];
  let auditLogs = [...DEMO_AUDIT_LOGS];
  let prescriptions = [...DEMO_PRESCRIPTIONS];
  let referrals = [...DEMO_REFERRALS];
  let imagingOrders = [...DEMO_IMAGING_ORDERS];
  let claims: Array<{
    id: bigint;
    patientId: bigint;
    patientName: string;
    claimNumber: string;
    insurerId: bigint;
    totalAmount: bigint;
    status: string;
    serviceDate: string;
    cptCodes: string;
    diagnosisCodes: string;
    submittedAt: bigint;
  }> = DEMO_CLAIMS.map((c, i) => ({
    id: BigInt(i + 1),
    patientId: BigInt(0),
    patientName: c.patientName,
    claimNumber: c.claimNumber,
    insurerId: BigInt(0),
    totalAmount: BigInt(Math.round(c.billedAmount)),
    status: c.status,
    serviceDate: c.serviceDate,
    cptCodes: c.cptCodes.join(", "),
    diagnosisCodes: c.diagnosisCodes.join(", "),
    submittedAt: BigInt(0),
  }));
  let allergies: Array<{
    id: bigint;
    patientId: bigint;
    allergen: string;
    reaction: string;
    severity: string;
  }> = [];
  let users = [...DEMO_USERS];
  let resultsInbox = [...DEMO_RESULTS_INBOX];
  let labConnections = [...DEMO_LAB_CONNECTIONS];
  let inpatientBeds = [...DEMO_INPATIENT_BEDS];
  let userProfile: { userId: bigint; name: string; role: string } | null = {
    userId: 10n,
    name: "Dr. Jordan Lee",
    role: "Doctor",
  };

  function nextId<T extends { id: bigint }>(arr: T[]): bigint {
    if (arr.length === 0) return 1n;
    return arr.reduce((max, item) => (item.id > max ? item.id : max), 0n) + 1n;
  }

  return {
    listPatients: () => Promise.resolve([...patients]),
    listAppointments: () => Promise.resolve([...appointments]),
    listLabResults: () => Promise.resolve([...labResults]),
    listInvoices: () => Promise.resolve([...invoices]),
    listPrescriptions: () => Promise.resolve([...prescriptions]),
    listMedications: () => Promise.resolve([...medications]),
    listClinicalNotes: () => Promise.resolve([...clinicalNotes]),
    listMessages: () => Promise.resolve([...messages]),
    listAuditLogs: () => Promise.resolve([...auditLogs]),
    listReferrals: () => Promise.resolve([...referrals]),

    // Extended demo-only methods
    listImagingOrders: () => Promise.resolve([...imagingOrders]),
    listUsers: () => Promise.resolve([...users]),
    listResultsInbox: () => Promise.resolve([...resultsInbox]),
    listLabConnections: () => Promise.resolve([...labConnections]),
    listInpatientBeds: () => Promise.resolve([...inpatientBeds]),

    createPatient: (
      name: string,
      dob: string,
      phone: string,
      email: string,
      mrn: string,
    ) => {
      const id = nextId(patients);
      patients = [
        ...patients,
        { id, name, dateOfBirth: dob, phone, email, mrn },
      ];
      return Promise.resolve(id);
    },

    createAppointment: (
      patientId: bigint,
      providerId: bigint,
      date: string,
    ) => {
      const id = nextId(appointments);
      appointments = [
        ...appointments,
        { id, patientId, providerId, date, status: "scheduled" },
      ];
      return Promise.resolve(id);
    },

    addLabResult: (
      patientId: bigint,
      testName: string,
      result: string,
      unit: string,
      isCritical: boolean,
    ) => {
      const id = nextId(labResults);
      labResults = [
        ...labResults,
        { id, patientId, testName, result, unit, isCritical },
      ];
      return Promise.resolve(id);
    },

    createInvoice: (patientId: bigint, amount: bigint, status: string) => {
      const id = nextId(invoices);
      invoices = [...invoices, { id, patientId, amount, status }];
      return Promise.resolve(id);
    },

    createPrescription: (
      patientId: bigint,
      patientName: string,
      medication: string,
      dose: string,
      prescribedBy: string,
      notes: string,
    ) => {
      const id = nextId(prescriptions);
      prescriptions = [
        ...prescriptions,
        {
          id,
          patientId,
          patientName,
          medication,
          dose,
          prescribedBy,
          notes,
          status: "pending",
          createdAt: BigInt(Date.now()) * 1_000_000n,
        },
      ];
      return Promise.resolve(id);
    },

    updatePrescriptionStatus: (id: bigint, newStatus: string) => {
      prescriptions = prescriptions.map((p) =>
        p.id === id ? { ...p, status: newStatus } : p,
      );
      return Promise.resolve(true);
    },

    createReferral: (
      patientId: bigint,
      patientName: string,
      referredTo: string,
      reason: string,
      priority: string,
      notes: string,
    ) => {
      const id = nextId(referrals);
      referrals = [
        ...referrals,
        {
          id,
          patientId,
          patientName,
          referredTo,
          reason,
          priority,
          notes,
          status: "pending",
          createdAt: BigInt(Date.now()) * 1_000_000n,
        },
      ];
      return Promise.resolve(id);
    },

    updateReferralStatus: (id: bigint, newStatus: string) => {
      referrals = referrals.map((r) =>
        r.id === id ? { ...r, status: newStatus } : r,
      );
      return Promise.resolve(true);
    },

    sendMessage: (fromUserId: bigint, toUserId: bigint, content: string) => {
      const id = nextId(messages);
      messages = [
        ...messages,
        {
          id,
          fromUserId,
          toUserId,
          content,
          createdAt: BigInt(Date.now()) * 1_000_000n,
        },
      ];
      return Promise.resolve(id);
    },

    addMedication: (
      patientId: bigint,
      name: string,
      dose: string,
      frequency: string,
      status: string,
    ) => {
      const id = nextId(medications);
      medications = [
        ...medications,
        { id, patientId, name, dose, frequency, status },
      ];
      return Promise.resolve(id);
    },

    createClinicalNote: (
      patientId: bigint,
      noteType: string,
      content: string,
      authorId: bigint,
    ) => {
      const id = nextId(clinicalNotes);
      clinicalNotes = [
        ...clinicalNotes,
        { id, patientId, noteType, content, authorId },
      ];
      return Promise.resolve(id);
    },

    saveCallerUserProfile: (profile: {
      userId: bigint;
      name: string;
      role: string;
    }) => {
      userProfile = profile;
      return Promise.resolve();
    },

    getCallerUserProfile: () => Promise.resolve(userProfile),

    getUserProfile: (_user: unknown) => Promise.resolve(null),

    getCallerUserRole: () => Promise.resolve("user" as any),

    isCallerAdmin: () => Promise.resolve(true),

    assignCallerUserRole: (_user: unknown, _role: unknown) => Promise.resolve(),

    _initializeAccessControlWithSecret: (_token: unknown) => Promise.resolve(),

    // Claims
    listClaims: () => Promise.resolve([...claims]),
    createClaim: (
      patientId: bigint,
      patientName: string,
      claimNumber: string,
      insurerId: bigint,
      totalAmount: bigint,
      serviceDate: string,
      cptCodes: string,
      diagnosisCodes: string,
    ) => {
      const id = BigInt(claims.length + 1);
      claims = [
        ...claims,
        {
          id,
          patientId,
          patientName,
          claimNumber,
          insurerId,
          totalAmount,
          status: "pending",
          serviceDate,
          cptCodes,
          diagnosisCodes,
          submittedAt: BigInt(Date.now()) * 1_000_000n,
        },
      ];
      return Promise.resolve(id);
    },
    updateClaimStatus: (id: bigint, newStatus: string) => {
      claims = claims.map((c) =>
        c.id === id ? { ...c, status: newStatus } : c,
      );
      return Promise.resolve(true);
    },

    // Imaging orders
    createImagingOrder: (
      patientId: bigint,
      patientName: string,
      modality: string,
      bodyPart: string,
      priority: string,
      orderedBy: string,
      indication: string,
    ) => {
      const id = BigInt(imagingOrders.length + 1);
      imagingOrders = [
        ...imagingOrders,
        {
          id: Number(id),
          patientId,
          patientName,
          modality,
          bodyPart,
          priority,
          orderedBy,
          indication,
          status: "ordered",
          date: new Date().toISOString().slice(0, 10),
          createdAt: BigInt(Date.now()) * 1_000_000n,
        } as any,
      ];
      return Promise.resolve(id);
    },
    updateImagingOrderStatus: (id: bigint, newStatus: string) => {
      imagingOrders = imagingOrders.map((o: any) =>
        Number(o.id) === Number(id) ? { ...o, status: newStatus } : o,
      );
      return Promise.resolve(true);
    },

    // Appointment status
    updateAppointmentStatus: (id: bigint, newStatus: string) => {
      appointments = appointments.map((a) =>
        a.id === id ? { ...a, status: newStatus } : a,
      );
      return Promise.resolve(true);
    },

    // Invoice status
    updateInvoiceStatus: (id: bigint, newStatus: string) => {
      invoices = invoices.map((inv) =>
        inv.id === id ? { ...inv, status: newStatus } : inv,
      );
      return Promise.resolve(true);
    },

    // Medication status
    updateMedicationStatus: (id: bigint, newStatus: string) => {
      medications = medications.map((m) =>
        m.id === id ? { ...m, status: newStatus } : m,
      );
      return Promise.resolve(true);
    },

    // Allergies
    listAllergies: () => Promise.resolve([...allergies]),
    addAllergy: (
      patientId: bigint,
      allergen: string,
      reaction: string,
      severity: string,
    ) => {
      const id = BigInt(allergies.length + 1);
      allergies = [
        ...allergies,
        { id, patientId, allergen, reaction, severity },
      ];
      return Promise.resolve(id);
    },

    updatePatient: (
      _id: bigint,
      _name: string,
      _dob: string,
      _phone: string,
      _email: string,
    ) => {
      return Promise.resolve(true);
    },

    getConsentSettings: (_patientId: bigint) => {
      return Promise.resolve(null);
    },

    saveConsentSettings: (
      _patientId: bigint,
      _allowLabs: boolean,
      _allowMeds: boolean,
      _allowVitals: boolean,
      _allowMentalHealth: boolean,
      _allowBilling: boolean,
      _analyticsOptIn: boolean,
    ) => {
      return Promise.resolve();
    },
  };
}

type DemoModeContextValue = {
  isDemoMode: boolean;
  demoActor: ReturnType<typeof createDemoActor> | null;
};

const DemoModeContext = createContext<DemoModeContextValue>({
  isDemoMode: false,
  demoActor: null,
});

export function DemoModeProvider({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) {
  const actorRef = useRef<ReturnType<typeof createDemoActor> | null>(
    active ? createDemoActor() : null,
  );
  return (
    <DemoModeContext.Provider
      value={{ isDemoMode: active, demoActor: actorRef.current }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  return useContext(DemoModeContext);
}
