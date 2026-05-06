import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

const STALE_TIME = 60_000; // 60 seconds

export function usePatients() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["patients"],
    queryFn: () => actor!.listPatients(),
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}

export function useAppointments() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["appointments"],
    queryFn: () => actor!.listAppointments(),
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}

export function useLabResults() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["labResults"],
    queryFn: () => actor!.listLabResults(),
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}

export function useInvoices() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["invoices"],
    queryFn: () => actor!.listInvoices(),
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}

export function usePrescriptions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["prescriptions"],
    queryFn: () => actor!.listPrescriptions(),
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}

export function useClaims() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["claims"],
    queryFn: () => actor!.listClaims(),
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}

export function useMessages() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["messages"],
    queryFn: () => actor!.listMessages(),
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}

export function useImagingOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["imagingOrders"],
    queryFn: () => actor!.listImagingOrders(),
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}

export function useReferrals() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["referrals"],
    queryFn: () => actor!.listReferrals(),
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}

export function useMedications() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["medications"],
    queryFn: () => actor!.listMedications(),
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}

export function useClinicalNotes() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["clinicalNotes"],
    queryFn: () => actor!.listClinicalNotes(),
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}
