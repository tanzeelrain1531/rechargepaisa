import { createContext, useContext } from "react";
import type { ReactNode } from "react";

export interface PortalPatient {
  id: bigint;
  name: string;
  mrn: string;
  dateOfBirth: string;
}

const PortalContext = createContext<PortalPatient | null>(null);

export function PortalContextProvider({
  value,
  children,
}: {
  value: PortalPatient;
  children: ReactNode;
}) {
  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  );
}

export function usePortalContext(): PortalPatient {
  const ctx = useContext(PortalContext);
  if (!ctx) {
    throw new Error(
      "usePortalContext must be used inside PortalContextProvider",
    );
  }
  return ctx;
}
