import type { backendInterface, WalletInfo, GameInfo, RevenueStats, Transaction, WithdrawalInfo } from "../backend";
import { TxType, UserRole, WithdrawalStatus } from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

const samplePrincipal = { toString: () => "aaaaa-aa" } as unknown as Principal;

const sampleWallet: WalletInfo = {
  owner: samplePrincipal,
  balance: BigInt(250),
  totalInvested: BigInt(100),
  totalEarned: BigInt(360),
  joinTime: BigInt(Date.now() * 1_000_000),
};

const sampleGames: GameInfo[] = [
  {
    id: BigInt(1),
    name: "Coin Flip",
    description: "Heads ya tails? Seedha 50-50 chance!",
    entryFee: BigInt(5),
    maxWinnings: BigInt(9),
    isActive: true,
  },
  {
    id: BigInt(2),
    name: "Number Guess",
    description: "1-10 mein se ek number guess karo aur double karo!",
    entryFee: BigInt(10),
    maxWinnings: BigInt(18),
    isActive: true,
  },
  {
    id: BigInt(3),
    name: "Lucky Spin",
    description: "Wheel spin karo aur bada inam jeeto!",
    entryFee: BigInt(20),
    maxWinnings: BigInt(35),
    isActive: true,
  },
];

const sampleStats: RevenueStats = {
  totalRevenue: BigInt(1500),
  totalPaidOut: BigInt(900),
  netProfit: BigInt(600),
  totalUsers: BigInt(42),
  totalActiveGames: BigInt(3),
};

const sampleTransactions: Transaction[] = [
  {
    id: BigInt(1),
    userId: samplePrincipal,
    amount: BigInt(10),
    txType: TxType.Bonus,
    gameId: undefined,
    timestamp: BigInt(Date.now() * 1_000_000 - 3600000000000),
    note: "Signup bonus",
  },
  {
    id: BigInt(2),
    userId: samplePrincipal,
    amount: BigInt(5),
    txType: TxType.GameEntry,
    gameId: BigInt(1),
    timestamp: BigInt(Date.now() * 1_000_000 - 1800000000000),
    note: "Game entry: Coin Flip",
  },
  {
    id: BigInt(3),
    userId: samplePrincipal,
    amount: BigInt(9),
    txType: TxType.GameWin,
    gameId: BigInt(1),
    timestamp: BigInt(Date.now() * 1_000_000 - 900000000000),
    note: "Game win",
  },
];

const sampleWithdrawals: WithdrawalInfo[] = [
  {
    id: BigInt(1),
    userId: samplePrincipal,
    amount: BigInt(50),
    status: WithdrawalStatus.Pending,
    requestedAt: BigInt(Date.now() * 1_000_000 - 600000000000),
    processedAt: undefined,
  },
];

export const mockBackend: backendInterface = {
  _initializeAccessControl: async () => undefined,
  registerUser: async () => sampleWallet,
  getMyWallet: async () => sampleWallet,
  getTransactionHistory: async () => sampleTransactions,
  listActiveGames: async () => sampleGames,
  playGame: async (_gameId: bigint) => BigInt(1),
  requestWithdrawal: async (_amount: bigint) => BigInt(1),
  recordGameResult: async (_sessionId: bigint, _didWin: boolean, _winAmount: bigint) => undefined,
  listPendingWithdrawals: async () => sampleWithdrawals,
  approveWithdrawal: async (_id: bigint) => undefined,
  rejectWithdrawal: async (_id: bigint) => undefined,
  adminGetAllUsers: async () => [sampleWallet],
  adminGetUserDetails: async (_userId: Principal) => [sampleWallet, sampleTransactions],
  adminGetRevenueStats: async () => sampleStats,
  adminAddGame: async (_name: string, _desc: string, _fee: bigint, _win: bigint) => BigInt(4),
  adminUpdateGame: async (_id: bigint, _name: string, _desc: string, _fee: bigint, _win: bigint, _active: boolean) => true,
  isAdmin: async () => true,
  isCallerAdmin: async () => true,
  getCallerUserRole: async () => UserRole.admin,
  assignCallerUserRole: async (_user: Principal, _role: UserRole) => undefined,
};
