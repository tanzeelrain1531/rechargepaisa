import { createActor } from "@/backend";
import type {
  GameInfo,
  RevenueStats,
  TransactionInfo,
  UserSummary,
  WalletInfo,
  WithdrawalRequestInfo,
} from "@/lib/backendTypes";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ── Queries ────────────────────────────────────────────────────────────────

export function useMyWallet() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<WalletInfo | null>({
    queryKey: ["myWallet"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await (
        actor as unknown as { getMyWallet: () => Promise<WalletInfo | null> }
      ).getMyWallet();
      return result ?? null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTransactionHistory() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TransactionInfo[]>({
    queryKey: ["transactionHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return (
        actor as unknown as {
          getTransactionHistory: () => Promise<TransactionInfo[]>;
        }
      ).getTransactionHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useActiveGames() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<GameInfo[]>({
    queryKey: ["activeGames"],
    queryFn: async () => {
      if (!actor) return FALLBACK_GAMES;
      try {
        return await (
          actor as unknown as { listActiveGames: () => Promise<GameInfo[]> }
        ).listActiveGames();
      } catch {
        return FALLBACK_GAMES;
      }
    },
    enabled: !!actor && !isFetching,
    placeholderData: FALLBACK_GAMES,
  });
}

export function usePendingWithdrawals() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<WithdrawalRequestInfo[]>({
    queryKey: ["pendingWithdrawals"],
    queryFn: async () => {
      if (!actor) return [];
      return (
        actor as unknown as {
          listPendingWithdrawals: () => Promise<WithdrawalRequestInfo[]>;
        }
      ).listPendingWithdrawals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllUsers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserSummary[]>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return (
        actor as unknown as { adminGetAllUsers: () => Promise<UserSummary[]> }
      ).adminGetAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRevenueStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<RevenueStats | null>({
    queryKey: ["revenueStats"],
    queryFn: async () => {
      if (!actor) return null;
      return (
        actor as unknown as {
          adminGetRevenueStats: () => Promise<RevenueStats | null>;
        }
      ).adminGetRevenueStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return (
        actor as unknown as { isAdmin: () => Promise<boolean> }
      ).isAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Mutations ───────────────────────────────────────────────────────────────

export function useRegisterUser() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return (
        actor as unknown as { registerUser: () => Promise<WalletInfo> }
      ).registerUser();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myWallet"] }),
  });
}

export function usePlayGame() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (gameId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (
        actor as unknown as {
          playGame: (id: bigint) => Promise<TransactionInfo>;
        }
      ).playGame(gameId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myWallet"] });
      qc.invalidateQueries({ queryKey: ["transactionHistory"] });
    },
  });
}

export function useRequestWithdrawal() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (
        actor as unknown as {
          requestWithdrawal: (a: bigint) => Promise<WithdrawalRequestInfo>;
        }
      ).requestWithdrawal(amount);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myWallet"] });
      qc.invalidateQueries({ queryKey: ["transactionHistory"] });
    },
  });
}

export function useRecordGameResult() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      gameId,
      won,
    }: { userId: string; gameId: bigint; won: boolean }) => {
      if (!actor) throw new Error("Not connected");
      return (
        actor as unknown as {
          recordGameResult: (u: string, g: bigint, w: boolean) => Promise<void>;
        }
      ).recordGameResult(userId, gameId, won);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["revenueStats"] }),
  });
}

export function useApproveWithdrawal() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (
        actor as unknown as { approveWithdrawal: (id: bigint) => Promise<void> }
      ).approveWithdrawal(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pendingWithdrawals"] }),
  });
}

export function useRejectWithdrawal() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (
        actor as unknown as { rejectWithdrawal: (id: bigint) => Promise<void> }
      ).rejectWithdrawal(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pendingWithdrawals"] }),
  });
}

export function useAdminAddGame() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (game: Omit<GameInfo, "id" | "isActive">) => {
      if (!actor) throw new Error("Not connected");
      return (
        actor as unknown as {
          adminAddGame: (
            name: string,
            description: string,
            entryFee: bigint,
            maxWinnings: bigint,
          ) => Promise<GameInfo>;
        }
      ).adminAddGame(
        game.name,
        game.description,
        game.entryFee,
        game.maxWinnings,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activeGames"] }),
  });
}

// ── Fallback data ──────────────────────────────────────────────────────────

export const FALLBACK_GAMES: GameInfo[] = [
  {
    id: BigInt(1),
    name: "Ludo Pro",
    description: "Classic board game with real money stakes",
    entryFee: BigInt(1000),
    maxWinnings: BigInt(5000),
    isActive: true,
  },
  {
    id: BigInt(2),
    name: "Teen Patti Master",
    description: "India's favorite card game",
    entryFee: BigInt(2000),
    maxWinnings: BigInt(10000),
    isActive: true,
  },
  {
    id: BigInt(3),
    name: "Slots Fortune",
    description: "Spin the reels for jackpot wins",
    entryFee: BigInt(500),
    maxWinnings: BigInt(20000),
    isActive: true,
  },
  {
    id: BigInt(4),
    name: "Cricket Trivia",
    description: "Test your cricket knowledge",
    entryFee: BigInt(200),
    maxWinnings: BigInt(1000),
    isActive: true,
  },
  {
    id: BigInt(5),
    name: "Rummy Star",
    description: "Strategic rummy for big rewards",
    entryFee: BigInt(3000),
    maxWinnings: BigInt(15000),
    isActive: true,
  },
  {
    id: BigInt(6),
    name: "Number King",
    description: "Pick numbers and multiply your paisa",
    entryFee: BigInt(100),
    maxWinnings: BigInt(500),
    isActive: true,
  },
];
