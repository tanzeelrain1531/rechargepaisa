import type { Principal } from "@icp-sdk/core/principal";

export type TxType =
  | { Deposit: null }
  | { Withdrawal: null }
  | { WithdrawalRejected: null }
  | { GameEntry: null }
  | { GameWin: null }
  | { Bonus: null }
  | { Commission: null };

export type WithdrawalStatus =
  | { Pending: null }
  | { Approved: null }
  | { Rejected: null };

export interface WalletInfo {
  owner: Principal;
  balance: bigint;
  totalInvested: bigint;
  totalEarned: bigint;
  joinTime: bigint;
}

export interface GameInfo {
  id: bigint;
  name: string;
  description: string;
  entryFee: bigint;
  maxWinnings: bigint;
  isActive: boolean;
}

export interface TransactionInfo {
  id: bigint;
  userId: Principal;
  amount: bigint;
  txType: TxType;
  gameId: bigint | null;
  timestamp: bigint;
  note: string;
}

export interface WithdrawalRequestInfo {
  id: bigint;
  userId: Principal;
  amount: bigint;
  status: WithdrawalStatus;
  requestedAt: bigint;
  processedAt: bigint | null;
}

export interface UserSummary {
  owner: Principal;
  balance: bigint;
  totalInvested: bigint;
  totalEarned: bigint;
  joinTime: bigint;
}

export interface RevenueStats {
  totalRevenue: bigint;
  totalPaidOut: bigint;
  netProfit: bigint;
  totalUsers: bigint;
  totalActiveGames: bigint;
}

export function formatPaisa(paisa: bigint): string {
  const rupees = Number(paisa) / 100;
  if (rupees < 1) return `${Number(paisa)}p`;
  return `\u20b9${rupees.toFixed(2)}`;
}

export function formatPaisaShort(paisa: bigint): string {
  const rupees = Number(paisa) / 100;
  if (rupees >= 1000) return `\u20b9${(rupees / 1000).toFixed(1)}k`;
  if (rupees >= 1) return `\u20b9${rupees.toFixed(0)}`;
  return `${Number(paisa)}p`;
}

export function txTypeLabel(txType: TxType): string {
  if ("Deposit" in txType) return "Deposit";
  if ("Withdrawal" in txType) return "Withdrawal";
  if ("WithdrawalRejected" in txType) return "Refund";
  if ("GameEntry" in txType) return "Game Entry";
  if ("GameWin" in txType) return "Game Win";
  if ("Bonus" in txType) return "Bonus";
  if ("Commission" in txType) return "Commission";
  return "Unknown";
}

export function txTypeSign(txType: TxType): "+" | "-" {
  if (
    "Deposit" in txType ||
    "GameWin" in txType ||
    "Bonus" in txType ||
    "Commission" in txType ||
    "WithdrawalRejected" in txType
  )
    return "+";
  return "-";
}

export function withdrawalStatusLabel(status: WithdrawalStatus): string {
  if ("Pending" in status) return "Pending";
  if ("Approved" in status) return "Approved";
  if ("Rejected" in status) return "Rejected";
  return "Unknown";
}

export function nanosToDate(ns: bigint): Date {
  return new Date(Number(ns / BigInt(1_000_000)));
}
