import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Nat "mo:core/Nat";

import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  // ── Authorization ──────────────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── Types ──────────────────────────────────────────────────────────────────

  public type UserWallet = {
    owner     : Principal;
    var balance      : Nat;  // in paisa
    var totalInvested : Nat;
    var totalEarned   : Nat;
    joinTime  : Time.Time;
  };

  public type Game = {
    id        : Nat;
    name      : Text;
    description : Text;
    var entryFee  : Nat;  // paisa
    var maxWinnings : Nat;
    var isActive : Bool;
  };

  public type GameResult = { #Pending; #Win : Nat; #Loss };

  public type GameSession = {
    id        : Nat;
    userId    : Principal;
    gameId    : Nat;
    entryFee  : Nat;
    var result : GameResult;
    timestamp : Time.Time;
  };

  public type TxType = {
    #Bonus;
    #GameEntry;
    #GameWin;
    #Deposit;
    #Withdrawal;
    #WithdrawalRejected;
  };

  public type Transaction = {
    id        : Nat;
    userId    : Principal;
    amount    : Nat;
    txType    : TxType;
    gameId    : ?Nat;
    timestamp : Time.Time;
    note      : Text;
  };

  public type WithdrawalStatus = { #Pending; #Approved; #Rejected };

  public type WithdrawalRequest = {
    id          : Nat;
    userId      : Principal;
    amount      : Nat;
    var status  : WithdrawalStatus;
    requestedAt : Time.Time;
    var processedAt : ?Time.Time;
  };

  // ── Shared (API-boundary) types ────────────────────────────────────────────

  public type WalletInfo = {
    owner        : Principal;
    balance      : Nat;
    totalInvested : Nat;
    totalEarned  : Nat;
    joinTime     : Time.Time;
  };

  public type GameInfo = {
    id          : Nat;
    name        : Text;
    description : Text;
    entryFee    : Nat;
    maxWinnings : Nat;
    isActive    : Bool;
  };

  public type SessionInfo = {
    id        : Nat;
    userId    : Principal;
    gameId    : Nat;
    entryFee  : Nat;
    result    : GameResult;
    timestamp : Time.Time;
  };

  public type WithdrawalInfo = {
    id          : Nat;
    userId      : Principal;
    amount      : Nat;
    status      : WithdrawalStatus;
    requestedAt : Time.Time;
    processedAt : ?Time.Time;
  };

  public type RevenueStats = {
    totalRevenue     : Nat;  // sum of all GameEntry fees
    totalPaidOut     : Nat;  // sum of all GameWin transactions
    netProfit        : Nat;  // totalRevenue - totalPaidOut
    totalUsers       : Nat;
    totalActiveGames : Nat;
  };

  // ── State ──────────────────────────────────────────────────────────────────

  let wallets     = Map.empty<Principal, UserWallet>();
  let games       = Map.empty<Nat, Game>();
  let sessions    = Map.empty<Nat, GameSession>();
  let transactions = List.empty<Transaction>();
  let withdrawals = Map.empty<Nat, WithdrawalRequest>();

  var nextGameId       = 4;  // starts after sample games
  var nextSessionId    = 1;
  var nextTxId         = 1;
  var nextWithdrawalId = 1;

  // ── Sample Games (initial state) ───────────────────────────────────────────
  do {
    games.add(1, { id = 1; name = "Coin Flip"; description = "Heads ya tails? Seedha 50-50 chance!"; var entryFee = 5; var maxWinnings = 9; var isActive = true });
    games.add(2, { id = 2; name = "Number Guess"; description = "1-10 mein se ek number guess karo aur double karo!"; var entryFee = 10; var maxWinnings = 18; var isActive = true });
    games.add(3, { id = 3; name = "Lucky Spin"; description = "Wheel spin karo aur bada inam jeeto!"; var entryFee = 20; var maxWinnings = 35; var isActive = true });
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  func requireUser(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
  };

  func requireAdmin(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin only");
    };
  };

  func addTx(userId : Principal, amount : Nat, txType : TxType, gameId : ?Nat, note : Text) {
    let tx : Transaction = {
      id        = nextTxId;
      userId;
      amount;
      txType;
      gameId;
      timestamp = Time.now();
      note;
    };
    nextTxId += 1;
    transactions.add(tx);
  };

  func walletToInfo(w : UserWallet) : WalletInfo = {
    owner        = w.owner;
    balance      = w.balance;
    totalInvested = w.totalInvested;
    totalEarned  = w.totalEarned;
    joinTime     = w.joinTime;
  };

  func gameToInfo(g : Game) : GameInfo = {
    id          = g.id;
    name        = g.name;
    description = g.description;
    entryFee    = g.entryFee;
    maxWinnings = g.maxWinnings;
    isActive    = g.isActive;
  };

  func _sessionToInfo(s : GameSession) : SessionInfo = {
    id        = s.id;
    userId    = s.userId;
    gameId    = s.gameId;
    entryFee  = s.entryFee;
    result    = s.result;
    timestamp = s.timestamp;
  };

  func withdrawalToInfo(w : WithdrawalRequest) : WithdrawalInfo = {
    id          = w.id;
    userId      = w.userId;
    amount      = w.amount;
    status      = w.status;
    requestedAt = w.requestedAt;
    processedAt = w.processedAt;
  };

  // ── User Wallet ────────────────────────────────────────────────────────────

  /// Register new user — creates wallet and gives 10 paisa signup bonus.
  public shared ({ caller }) func registerUser() : async WalletInfo {
    requireUser(caller);
    switch (wallets.get(caller)) {
      case (?existing) { walletToInfo(existing) };
      case null {
        let wallet : UserWallet = {
          owner        = caller;
          var balance       = 10;  // 10 paisa signup bonus
          var totalInvested = 0;
          var totalEarned   = 10;
          joinTime     = Time.now();
        };
        wallets.add(caller, wallet);
        addTx(caller, 10, #Bonus, null, "Signup bonus");
        walletToInfo(wallet);
      };
    };
  };

  /// Get caller's wallet info.
  public query ({ caller }) func getMyWallet() : async ?WalletInfo {
    requireUser(caller);
    switch (wallets.get(caller)) {
      case (?w) { ?walletToInfo(w) };
      case null { null };
    };
  };

  /// Get caller's transaction history.
  public query ({ caller }) func getTransactionHistory() : async [Transaction] {
    requireUser(caller);
    transactions.filter(func(t) { Principal.equal(t.userId, caller) }).toArray();
  };

  // ── Games ──────────────────────────────────────────────────────────────────

  /// List all active games (public).
  public query func listActiveGames() : async [GameInfo] {
    games.values().filter(func(g) { g.isActive }).map<Game, GameInfo>(func(g) { gameToInfo(g) }).toArray();
  };

  /// Play a game — deducts entry fee from wallet; returns session id.
  public shared ({ caller }) func playGame(gameId : Nat) : async Nat {
    requireUser(caller);
    let game = switch (games.get(gameId)) {
      case (?g) { g };
      case null { Runtime.trap("Game not found") };
    };
    if (not game.isActive) {
      Runtime.trap("Game is not active");
    };
    let wallet = switch (wallets.get(caller)) {
      case (?w) { w };
      case null { Runtime.trap("Wallet not found — call registerUser first") };
    };
    if (wallet.balance < game.entryFee) {
      Runtime.trap("Insufficient balance");
    };
    wallet.balance      -= game.entryFee;
    wallet.totalInvested += game.entryFee;

    let sessionId = nextSessionId;
    nextSessionId += 1;
    let session : GameSession = {
      id       = sessionId;
      userId   = caller;
      gameId;
      entryFee = game.entryFee;
      var result = #Pending;
      timestamp = Time.now();
    };
    sessions.add(sessionId, session);
    addTx(caller, game.entryFee, #GameEntry, ?gameId, "Game entry: " # game.name);
    sessionId;
  };

  // ── Withdrawal ─────────────────────────────────────────────────────────────

  /// Request a withdrawal (minimum 1 paisa).
  public shared ({ caller }) func requestWithdrawal(amount : Nat) : async Nat {
    requireUser(caller);
    if (amount == 0) {
      Runtime.trap("Amount must be greater than 0");
    };
    let wallet = switch (wallets.get(caller)) {
      case (?w) { w };
      case null { Runtime.trap("Wallet not found — call registerUser first") };
    };
    if (wallet.balance < amount) {
      Runtime.trap("Insufficient balance");
    };
    wallet.balance -= amount;

    let wid = nextWithdrawalId;
    nextWithdrawalId += 1;
    let req : WithdrawalRequest = {
      id          = wid;
      userId      = caller;
      amount;
      var status  = #Pending;
      requestedAt = Time.now();
      var processedAt = null;
    };
    withdrawals.add(wid, req);
    addTx(caller, amount, #Withdrawal, null, "Withdrawal request");
    wid;
  };

  // ── Admin: Game Result ─────────────────────────────────────────────────────

  /// Admin records game result; credits winnings if won.
  public shared ({ caller }) func recordGameResult(sessionId : Nat, didWin : Bool, winAmount : Nat) : async () {
    requireAdmin(caller);
    let session = switch (sessions.get(sessionId)) {
      case (?s) { s };
      case null { Runtime.trap("Session not found") };
    };
    switch (session.result) {
      case (#Pending) {};
      case _ { Runtime.trap("Result already recorded") };
    };
    if (didWin) {
      session.result := #Win(winAmount);
      let wallet = switch (wallets.get(session.userId)) {
        case (?w) { w };
        case null { Runtime.trap("User wallet not found") };
      };
      wallet.balance     += winAmount;
      wallet.totalEarned += winAmount;
      addTx(session.userId, winAmount, #GameWin, ?session.gameId, "Game win");
    } else {
      session.result := #Loss;
    };
  };

  // ── Admin: Withdrawals ─────────────────────────────────────────────────────

  /// List all pending withdrawals (admin).
  public query ({ caller }) func listPendingWithdrawals() : async [WithdrawalInfo] {
    requireAdmin(caller);
    withdrawals.values()
      .filter(func(w) { switch (w.status) { case (#Pending) true; case _ false } })
      .map<WithdrawalRequest, WithdrawalInfo>(func(w) { withdrawalToInfo(w) })
      .toArray();
  };

  /// Approve a withdrawal request (admin).
  public shared ({ caller }) func approveWithdrawal(id : Nat) : async () {
    requireAdmin(caller);
    let req = switch (withdrawals.get(id)) {
      case (?r) { r };
      case null { Runtime.trap("Withdrawal not found") };
    };
    switch (req.status) {
      case (#Pending) {};
      case _ { Runtime.trap("Already processed") };
    };
    req.status      := #Approved;
    req.processedAt := ?Time.now();
  };

  /// Reject a withdrawal request — returns balance to user (admin).
  public shared ({ caller }) func rejectWithdrawal(id : Nat) : async () {
    requireAdmin(caller);
    let req = switch (withdrawals.get(id)) {
      case (?r) { r };
      case null { Runtime.trap("Withdrawal not found") };
    };
    switch (req.status) {
      case (#Pending) {};
      case _ { Runtime.trap("Already processed") };
    };
    req.status      := #Rejected;
    req.processedAt := ?Time.now();
    // Refund balance
    let wallet = switch (wallets.get(req.userId)) {
      case (?w) { w };
      case null { Runtime.trap("User wallet not found") };
    };
    wallet.balance += req.amount;
    addTx(req.userId, req.amount, #WithdrawalRejected, null, "Withdrawal rejected — balance refunded");
  };

  // ── Admin: Users ───────────────────────────────────────────────────────────

  /// List all registered users (admin).
  public query ({ caller }) func adminGetAllUsers() : async [WalletInfo] {
    requireAdmin(caller);
    wallets.values().map<UserWallet, WalletInfo>(func(w) { walletToInfo(w) }).toArray();
  };

  /// Get a specific user's wallet and recent transactions (admin).
  public query ({ caller }) func adminGetUserDetails(userId : Principal) : async ?(WalletInfo, [Transaction]) {
    requireAdmin(caller);
    switch (wallets.get(userId)) {
      case (?w) {
        let txs = transactions.filter(func(t) { Principal.equal(t.userId, userId) }).toArray();
        ?(walletToInfo(w), txs);
      };
      case null { null };
    };
  };

  // ── Admin: Games ───────────────────────────────────────────────────────────

  /// Add a new game (admin).
  public shared ({ caller }) func adminAddGame(
    name        : Text,
    description : Text,
    entryFee    : Nat,
    maxWinnings : Nat
  ) : async Nat {
    requireAdmin(caller);
    let id = nextGameId;
    nextGameId += 1;
    let game : Game = {
      id;
      name;
      description;
      var entryFee;
      var maxWinnings;
      var isActive = true;
    };
    games.add(id, game);
    id;
  };

  /// Update an existing game (admin).
  public shared ({ caller }) func adminUpdateGame(
    id          : Nat,
    name        : Text,
    description : Text,
    entryFee    : Nat,
    maxWinnings : Nat,
    isActive    : Bool
  ) : async Bool {
    requireAdmin(caller);
    switch (games.get(id)) {
      case (?g) {
        g.entryFee    := entryFee;
        g.maxWinnings := maxWinnings;
        g.isActive    := isActive;
        // name/description are immutable in the record; replace the entry
        let updated : Game = {
          id;
          name;
          description;
          var entryFee;
          var maxWinnings;
          var isActive;
        };
        games.add(id, updated);
        true;
      };
      case null { false };
    };
  };

  // ── Admin: Revenue Stats ───────────────────────────────────────────────────

  public query ({ caller }) func adminGetRevenueStats() : async RevenueStats {
    requireAdmin(caller);
    var totalRevenue = 0;
    var totalPaidOut = 0;

    transactions.forEach(func(t) {
      switch (t.txType) {
        case (#GameEntry) { totalRevenue += t.amount };
        case (#GameWin)   { totalPaidOut += t.amount };
        case _ {};
      };
    });

    let netProfit : Nat = if (totalRevenue >= totalPaidOut) {
      totalRevenue - totalPaidOut;
    } else { 0 };

    let totalActiveGames = games.values().filter(func(g) { g.isActive }).foldLeft(0, func(acc, _) { acc + 1 });

    {
      totalRevenue;
      totalPaidOut;
      netProfit;
      totalUsers       = wallets.size();
      totalActiveGames;
    };
  };

  // ── Utility ────────────────────────────────────────────────────────────────

  /// Returns true if the caller is an admin.
  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

};
