import { createActor } from "@/backend";
// Compatibility shim for legacy MedUnite code and new RechargePaisa code
// New code: import { useActor } from "@caffeineai/core-infrastructure" directly
// Legacy code: import { useActor } from "./useActor" with no args
import { useActor as useCoreActor } from "@caffeineai/core-infrastructure";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyActor = Record<string, (...args: any[]) => any>;

// Legacy no-arg usage
export function useActor(): { actor: AnyActor | null; isFetching: boolean };
// New usage with explicit createActor factory
export function useActor<T>(factory: Parameters<typeof useCoreActor>[0]): {
  actor: (AnyActor & T) | null;
  isFetching: boolean;
};
// Implementation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useActor(factory?: any): { actor: any; isFetching: boolean } {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCoreActor(factory ?? createActor) as {
    actor: AnyActor | null;
    isFetching: boolean;
  };
}
