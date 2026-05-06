import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WithdrawalInfo {
    id: bigint;
    status: WithdrawalStatus;
    userId: Principal;
    processedAt?: Time;
    amount: bigint;
    requestedAt: Time;
}
export type Time = bigint;
export interface GameInfo {
    id: bigint;
    name: string;
    description: string;
    isActive: boolean;
    maxWinnings: bigint;
    entryFee: bigint;
}
export interface WalletInfo {
    balance: bigint;
    totalInvested: bigint;
    owner: Principal;
    joinTime: Time;
    totalEarned: bigint;
}
export interface RevenueStats {
    totalActiveGames: bigint;
    totalPaidOut: bigint;
    totalUsers: bigint;
    totalRevenue: bigint;
    netProfit: bigint;
}
export interface Transaction {
    id: bigint;
    userId: Principal;
    note: string;
    gameId?: bigint;
    timestamp: Time;
    txType: TxType;
    amount: bigint;
}
export enum TxType {
    WithdrawalRejected = "WithdrawalRejected",
    Deposit = "Deposit",
    GameEntry = "GameEntry",
    Bonus = "Bonus",
    GameWin = "GameWin",
    Withdrawal = "Withdrawal"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WithdrawalStatus {
    Approved = "Approved",
    Rejected = "Rejected",
    Pending = "Pending"
}
export interface backendInterface {
    /**
     * / Add a new game (admin).
     */
    adminAddGame(name: string, description: string, entryFee: bigint, maxWinnings: bigint): Promise<bigint>;
    /**
     * / List all registered users (admin).
     */
    adminGetAllUsers(): Promise<Array<WalletInfo>>;
    adminGetRevenueStats(): Promise<RevenueStats>;
    /**
     * / Get a specific user's wallet and recent transactions (admin).
     */
    adminGetUserDetails(userId: Principal): Promise<[WalletInfo, Array<Transaction>] | null>;
    /**
     * / Update an existing game (admin).
     */
    adminUpdateGame(id: bigint, name: string, description: string, entryFee: bigint, maxWinnings: bigint, isActive: boolean): Promise<boolean>;
    /**
     * / Approve a withdrawal request (admin).
     */
    approveWithdrawal(id: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Get caller's wallet info.
     */
    getMyWallet(): Promise<WalletInfo | null>;
    /**
     * / Get caller's transaction history.
     */
    getTransactionHistory(): Promise<Array<Transaction>>;
    /**
     * / Returns true if the caller is an admin.
     */
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / List all active games (public).
     */
    listActiveGames(): Promise<Array<GameInfo>>;
    /**
     * / List all pending withdrawals (admin).
     */
    listPendingWithdrawals(): Promise<Array<WithdrawalInfo>>;
    /**
     * / Play a game — deducts entry fee from wallet; returns session id.
     */
    playGame(gameId: bigint): Promise<bigint>;
    /**
     * / Admin records game result; credits winnings if won.
     */
    recordGameResult(sessionId: bigint, didWin: boolean, winAmount: bigint): Promise<void>;
    /**
     * / Register new user — creates wallet and gives 10 paisa signup bonus.
     */
    registerUser(): Promise<WalletInfo>;
    /**
     * / Reject a withdrawal request — returns balance to user (admin).
     */
    rejectWithdrawal(id: bigint): Promise<void>;
    /**
     * / Request a withdrawal (minimum 1 paisa).
     */
    requestWithdrawal(amount: bigint): Promise<bigint>;
}
