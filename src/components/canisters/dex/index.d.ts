import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Account {
    owner: Principal;
    subaccount: [] | [Subaccount];
}
export interface AccountBalanceArgs {
    account: AccountIdentifier;
}
export type AccountId = Uint8Array | number[];
export type AccountId__1 = Uint8Array | number[];
export type AccountId__2 = Uint8Array | number[];
export type AccountId__3 = Uint8Array | number[];
export type AccountId__4 = Uint8Array | number[];
export type AccountIdentifier = Uint8Array | number[];
export interface AccountSetting {
    enPoolMode: boolean;
    modeSwitchHistory: Array<[Nonce__2, Nonce__2]>;
    start: [] | [Nonce__2];
    enKeepingBalance: boolean;
}
export interface AccountSetting__1 {
    enPoolMode: boolean;
    modeSwitchHistory: Array<[Nonce__2, Nonce__2]>;
    start: [] | [Nonce__2];
    enKeepingBalance: boolean;
}
export interface Account__1 {
    owner: Principal;
    subaccount: [] | [Subaccount__1];
}
export interface Account__2 {
    owner: Principal;
    subaccount: [] | [Subaccount__2];
}
export type Address = string;
export type Address__1 = string;
export type Address__2 = string;
export type AmbassadorData = [string, bigint, Vol__1];
export type Amount = bigint;
export type Amount__1 = bigint;
export type Amount__2 = bigint;
export type Amount__3 = bigint;
export interface ApproveArgs {
    fee: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    from_subaccount: [] | [Uint8Array | number[]];
    created_at_time: [] | [bigint];
    amount: bigint;
    spender: Principal;
}
export interface ApproveArgs__1 {
    fee: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    from_subaccount: [] | [Uint8Array | number[]];
    created_at_time: [] | [bigint];
    amount: bigint;
    expected_allowance: [] | [bigint];
    expires_at: [] | [bigint];
    spender: Account__1;
}
export type ApproveError =
    | {
          GenericError: { message: string; error_code: bigint };
      }
    | { TemporarilyUnavailable: null }
    | { Duplicate: { duplicate_of: bigint } }
    | { BadFee: { expected_fee: bigint } }
    | { CreatedInFuture: { ledger_time: bigint } }
    | { TooOld: null }
    | { InsufficientFunds: { balance: bigint } };
export type ApproveError__1 =
    | {
          GenericError: { message: string; error_code: bigint };
      }
    | { TemporarilyUnavailable: null }
    | { Duplicate: { duplicate_of: bigint } }
    | { BadFee: { expected_fee: bigint } }
    | { AllowanceChanged: { current_allowance: bigint } }
    | { CreatedInFuture: { ledger_time: bigint } }
    | { TooOld: null }
    | { Expired: { ledger_time: bigint } }
    | { InsufficientFunds: { balance: bigint } };
export type Attempts = bigint;
export type BackupRequest =
    | { icdex_keepingBalances: null }
    | { timeSortedTxids: null }
    | { icdex_failedOrders: null }
    | { icdex_makers: null }
    | { icdex_poolBalance: null }
    | { drc205Data: { All: null } | { Base: null } }
    | { icdex_vols: null }
    | { icdex_accountSettings: null }
    | { icdex_pendingOrders: null }
    | { ictcTaskCallbackEvents: null }
    | { otherData: null }
    | { icdex_dip20Balances: null }
    | { clearingTxids: null }
    | { icdex_nonces: null }
    | { competitors: null }
    | { icdex_klines2: null }
    | { sagaData: { All: null } | { Base: null } }
    | { icdex_orders: null }
    | { icdex_orderBook: null }
    | { rounds: null }
    | { traderReferrers: null }
    | { icdex_RPCAccounts: null }
    | { traderReferrerTemps: null }
    | { ambassadors: null };
export type BackupResponse =
    | {
          icdex_keepingBalances: Array<[AccountId__2, KeepingBalance]>;
      }
    | { timeSortedTxids: [Array<[Txid__3, Time]>, Array<[Txid__3, Time]>] }
    | { icdex_failedOrders: Array<[Txid__3, TradingOrder]> }
    | { icdex_makers: Array<[AccountId__2, [bigint, Principal]]> }
    | { icdex_poolBalance: { token0: Amount__2; token1: Amount__2 } }
    | { drc205Data: DRC205Data }
    | { icdex_vols: Array<[AccountId__2, Vol__1]> }
    | { icdex_accountSettings: Array<[AccountId__2, AccountSetting]> }
    | { icdex_pendingOrders: Array<[AccountId__2, Array<Txid__3>]> }
    | { ictcTaskCallbackEvents: Array<[Ttid, Time]> }
    | {
          otherData: {
              icdex_totalFee: FeeBalance;
              icdex_totalVol: Vol__1;
              activeRound: bigint;
              icdex_index: bigint;
              icdex_lastPrice: OrderPrice__1;
              icdex_priceWeighted: PriceWeighted;
              taDescription: string;
          };
      }
    | { icdex_dip20Balances: Array<[AccountId__2, [Principal, bigint]]> }
    | { clearingTxids: Array<Txid__3> }
    | { icdex_nonces: Array<[AccountId__2, Nonce__3]> }
    | { competitors: Array<[bigint, Array<[AccountId__2, CompResult]>]> }
    | { icdex_klines2: Array<[KInterval, [Array<KBar>, Array<KBar>]]> }
    | { sagaData: SagaData }
    | { icdex_orders: Array<[Txid__3, TradingOrder]> }
    | {
          icdex_orderBook: {
              ask: Array<[Txid__3, OrderPrice__1]>;
              bid: Array<[Txid__3, OrderPrice__1]>;
          };
      }
    | { rounds: Array<[bigint, RoundItem]> }
    | { traderReferrers: Array<[AccountId__2, AccountId__2]> }
    | {
          icdex_RPCAccounts: Array<
              [string, Array<{ owner: Principal; subaccount: [] | [Uint8Array | number[]] }>]
          >;
      }
    | {
          traderReferrerTemps: Array<[AccountId__2, [AccountId__2, string, Time]]>;
      }
    | { ambassadors: Array<[AccountId__2, AmbassadorData]> };
export type BalanceChange = { DebitRecord: bigint } | { CreditRecord: bigint } | { NoChange: null };
export type BalanceChange__1 =
    | { DebitRecord: bigint }
    | { CreditRecord: bigint }
    | { NoChange: null };
export type BlobFill = { AutoFill: null } | { ManualFill: Uint8Array | number[] };
export type BlockIndex = bigint;
export type CallType =
    | { __block: null }
    | {
          ICRC1: { icrc1_balance_of: Account } | { icrc1_transfer: TransferArgs };
      }
    | {
          ICRC2: { icrc2_approve: ApproveArgs } | { icrc2_transfer_from: TransferFromArgs };
      }
    | {
          This:
              | { dip20SendComp: [Uint8Array | number[], Principal, bigint] }
              | { dip20Send: [Uint8Array | number[], bigint] };
      }
    | {
          DIP20:
              | { transferFrom: [Principal, Principal, bigint] }
              | { approve: [Principal, bigint] }
              | { balanceOf: Principal }
              | { transfer: [Principal, bigint] };
      }
    | {
          DRC20:
              | {
                    transferBatch: [
                        Array<To>,
                        Array<Amount__3>,
                        [] | [Nonce__4],
                        [] | [Sa__1],
                        [] | [Data__2],
                    ];
                }
              | {
                    transferFrom: [
                        From,
                        To,
                        Amount__3,
                        [] | [Nonce__4],
                        [] | [Sa__1],
                        [] | [Data__2],
                    ];
                }
              | {
                    approve: [Spender, Amount__3, [] | [Nonce__4], [] | [Sa__1], [] | [Data__2]];
                }
              | { balanceOf: Address__1 }
              | { txnRecord: BlobFill }
              | {
                    lockTransfer: [
                        To,
                        Amount__3,
                        Timeout,
                        [] | [Decider],
                        [] | [Nonce__4],
                        [] | [Sa__1],
                        [] | [Data__2],
                    ];
                }
              | {
                    transfer: [To, Amount__3, [] | [Nonce__4], [] | [Sa__1], [] | [Data__2]];
                }
              | { dropAccount: [] | [Sa__1] }
              | {
                    executeTransfer: [
                        BlobFill,
                        ExecuteType,
                        [] | [To],
                        [] | [Nonce__4],
                        [] | [Sa__1],
                        [] | [Data__2],
                    ];
                }
              | {
                    lockTransferFrom: [
                        From,
                        To,
                        Amount__3,
                        Timeout,
                        [] | [Decider],
                        [] | [Nonce__4],
                        [] | [Sa__1],
                        [] | [Data__2],
                    ];
                };
      }
    | {
          ICRC1New: { icrc1_balance_of: Account__1 } | { icrc1_transfer: TransferArgs__1 };
      }
    | {
          ICRC2New:
              | { icrc2_approve: ApproveArgs__1 }
              | { icrc2_transfer_from: TransferFromArgs__1 };
      }
    | {
          Ledger: { account_balance: AccountBalanceArgs } | { transfer: TransferArgs__2 };
      }
    | {
          ICTokens:
              | {
                    burn: [Amount__3, [] | [Nonce__4], [] | [Sa__1], [] | [Data__2]];
                }
              | { mint: [Address__1, Amount__3, [] | [Nonce__4], [] | [Data__2]] };
      }
    | { __skip: null };
export type CallType__1 =
    | { __block: null }
    | {
          ICRC1: { icrc1_balance_of: Account } | { icrc1_transfer: TransferArgs };
      }
    | {
          ICRC2: { icrc2_approve: ApproveArgs } | { icrc2_transfer_from: TransferFromArgs };
      }
    | {
          This:
              | { dip20SendComp: [Uint8Array | number[], Principal, bigint] }
              | { dip20Send: [Uint8Array | number[], bigint] };
      }
    | {
          DIP20:
              | { transferFrom: [Principal, Principal, bigint] }
              | { approve: [Principal, bigint] }
              | { balanceOf: Principal }
              | { transfer: [Principal, bigint] };
      }
    | {
          DRC20:
              | {
                    transferBatch: [
                        Array<To>,
                        Array<Amount__3>,
                        [] | [Nonce__4],
                        [] | [Sa__1],
                        [] | [Data__2],
                    ];
                }
              | {
                    transferFrom: [
                        From,
                        To,
                        Amount__3,
                        [] | [Nonce__4],
                        [] | [Sa__1],
                        [] | [Data__2],
                    ];
                }
              | {
                    approve: [Spender, Amount__3, [] | [Nonce__4], [] | [Sa__1], [] | [Data__2]];
                }
              | { balanceOf: Address__1 }
              | { txnRecord: BlobFill }
              | {
                    lockTransfer: [
                        To,
                        Amount__3,
                        Timeout,
                        [] | [Decider],
                        [] | [Nonce__4],
                        [] | [Sa__1],
                        [] | [Data__2],
                    ];
                }
              | {
                    transfer: [To, Amount__3, [] | [Nonce__4], [] | [Sa__1], [] | [Data__2]];
                }
              | { dropAccount: [] | [Sa__1] }
              | {
                    executeTransfer: [
                        BlobFill,
                        ExecuteType,
                        [] | [To],
                        [] | [Nonce__4],
                        [] | [Sa__1],
                        [] | [Data__2],
                    ];
                }
              | {
                    lockTransferFrom: [
                        From,
                        To,
                        Amount__3,
                        Timeout,
                        [] | [Decider],
                        [] | [Nonce__4],
                        [] | [Sa__1],
                        [] | [Data__2],
                    ];
                };
      }
    | {
          ICRC1New: { icrc1_balance_of: Account__1 } | { icrc1_transfer: TransferArgs__1 };
      }
    | {
          ICRC2New:
              | { icrc2_approve: ApproveArgs__1 }
              | { icrc2_transfer_from: TransferFromArgs__1 };
      }
    | {
          Ledger: { account_balance: AccountBalanceArgs } | { transfer: TransferArgs__2 };
      }
    | {
          ICTokens:
              | {
                    burn: [Amount__3, [] | [Nonce__4], [] | [Sa__1], [] | [Data__2]];
                }
              | { mint: [Address__1, Amount__3, [] | [Nonce__4], [] | [Data__2]] };
      }
    | { __skip: null };
export type Callee = Principal;
export interface CalleeStatus {
    continuousFailure: bigint;
    successCount: bigint;
    failureCount: bigint;
}
export type Callee__1 = Principal;
export interface CompCapital {
    total: number;
    value0: bigint;
    value1: bigint;
}
export interface CompResult {
    vol: Vol__1;
    status: { Active: null } | { Dropout: null };
    icrc1Account: {
        owner: Principal;
        subaccount: [] | [Uint8Array | number[]];
    };
    capital: CompCapital;
    assetValue: [] | [CompCapital];
}
export type CompStrategy = { Backward: null } | { Forward: null };
export interface CompTask {
    status: Status__3;
    comp: Compensation;
    tcid: Tcid;
    forTtid: Ttid__2;
}
export interface Compensation {
    preTtid: Array<Ttid__1>;
    data: [] | [Uint8Array | number[]];
    time: Time;
    toid: [] | [Toid__1];
    callType: CallType;
    cycles: bigint;
    recallInterval: bigint;
    attemptsMax: Attempts;
    callee: Callee__1;
    forTtid: [] | [Ttid__1];
}
export interface Config {
    MAX_STORAGE_TRIES: [] | [bigint];
    EN_DEBUG: [] | [boolean];
    MAX_CACHE_NUMBER_PER: [] | [bigint];
    MAX_CACHE_TIME: [] | [bigint];
}
export type CyclesWallet = Principal;
export interface DRC205Data {
    accountLastTxns: Array<[AccountId__2, [Array<Txid__3>, Array<Txid__3>]]>;
    setting: Setting;
    globalLastTxns: [Array<Txid__3>, Array<Txid__3>];
    storagePool: Array<[Txid__3, TxnRecord__1, bigint]>;
    globalTxns: [Array<[Txid__3, Time]>, Array<[Txid__3, Time]>];
    txnRecords: Array<[Txid__3, TxnRecord__1]>;
}
export interface DRC207Support {
    timer: { interval_seconds: [] | [bigint]; enable: boolean };
    monitorable_by_self: boolean;
    monitorable_by_blackhole: {
        canister_id: [] | [Principal];
        allowed: boolean;
    };
    cycles_receivable: boolean;
}
export type Data = Uint8Array | number[];
export type Data__1 = Uint8Array | number[];
export type Data__2 = Uint8Array | number[];
export type DebitToken = Principal;
export type Decider = string;
export interface DexConfig {
    MAX_TPS: [] | [bigint];
    ICTC_RUN_INTERVAL: [] | [bigint];
    MAKER_BONUS_RATE: [] | [bigint];
    MAX_PENDINGS: [] | [bigint];
    ORDER_EXPIRATION_DURATION: [] | [bigint];
    TRADING_FEE: [] | [bigint];
    UNIT_SIZE: [] | [bigint];
    STORAGE_INTERVAL: [] | [bigint];
    ICP_FEE: [] | [IcpE8s];
}
export interface DexInfo {
    feeRate: number;
    mmType: { AMM: null } | { OrderBook: null };
    token0: [TokenType, TokenStd__1];
    token1: [TokenType, TokenStd__1];
    pairName: string;
    dexName: string;
    canisterId: Principal;
}
export interface DexSetting {
    MAX_TPS: bigint;
    ICTC_RUN_INTERVAL: bigint;
    MAKER_BONUS_RATE: bigint;
    MAX_PENDINGS: bigint;
    TRADING_FEE: bigint;
    UNIT_SIZE: bigint;
    STORAGE_INTERVAL: bigint;
    ICP_FEE: IcpE8s;
}
export type Duration = bigint;
export interface Err {
    code: ErrorCode;
    message: string;
}
export type ErrorCode =
    | { canister_error: null }
    | { call_error: { err_code: number } }
    | { system_transient: null }
    | { future: number }
    | { canister_reject: null }
    | { destination_invalid: null }
    | { system_fatal: null };
export interface ErrorLog {
    result: [] | [TaskResult];
    time: Time;
    ttid: Ttid__1;
    callee: [] | [Callee__1];
}
export type ExecuteType = { fallback: null } | { send: bigint } | { sendAll: null };
export interface FeeBalance {
    value0: Amount;
    value1: Amount;
}
export interface FeeStatus {
    feeRate: number;
    feeBalance: FeeBalance;
    totalFee: FeeBalance;
}
export type From = string;
export type Gas = { token: bigint } | { cycles: bigint } | { noFee: null };
export interface ICP {
    e8s: bigint;
}
export interface IDORequirement {
    threshold: number;
    pairs: Array<{ pair: Principal; token1ToUsdRatio: number }>;
}
export interface IDOSetting {
    IDOSupplies: Array<{ supply: Amount__1; price: number }>;
    IDOWhitelistEnabled: boolean;
    IDOOpeningTime: Time;
    IDOTotalSupply: { IDOSupply: Amount__1; percentageOfTotal: number };
    IDOEnabled: boolean;
    IDOLimitPerAccount: Amount__1;
    IDOClosingTime: Time;
}
export type IcpE8s = bigint;
export interface InitArgs {
    owner: [] | [Principal];
    name: string;
    token0: Principal;
    token1: Principal;
    unitSize: bigint;
}
export interface KBar {
    kid: bigint;
    low: bigint;
    vol: Vol__2;
    high: bigint;
    close: bigint;
    open: bigint;
    updatedTs: Timestamp;
}
export type KInterval = bigint;
export interface KeepingBalance {
    token0: { locked: Amount; available: Amount };
    token1: { locked: Amount; available: Amount };
}
export interface KeepingBalance__1 {
    token0: { locked: Amount; available: Amount };
    token1: { locked: Amount; available: Amount };
}
export interface Liquidity {
    vol: Vol__1;
    shares: Amount;
    shareWeighted: {
        updateTime: Timestamp__1;
        shareTimeWeighted: bigint;
    };
    unitValue: [Amount, Amount];
    value0: Amount;
    value1: Amount;
    priceWeighted: PriceWeighted;
    swapCount: bigint;
}
export interface Liquidity2 {
    vol: Vol__1;
    shares: Amount;
    shareWeighted: {
        updateTime: Timestamp__1;
        shareTimeWeighted: bigint;
    };
    unitValue: [Amount, Amount];
    orderCount: bigint;
    token0: Amount;
    token1: Amount;
    priceWeighted: PriceWeighted;
    price: bigint;
    userCount: bigint;
    unitSize: bigint;
}
export type List = [] | [[CompTask, List]];
export type ListPage = bigint;
export type ListSize = bigint;
export type List_1 = [] | [[SagaTask, List_1]];
export type Memo = bigint;
export type Nonce = bigint;
export type Nonce__1 = bigint;
export type Nonce__2 = bigint;
export type Nonce__3 = bigint;
export type Nonce__4 = bigint;
export type Operation =
    | { approve: { allowance: bigint } }
    | {
          lockTransfer: {
              locked: bigint;
              expiration: Time__1;
              decider: AccountId__3;
          };
      }
    | {
          transfer: {
              action: { burn: null } | { mint: null } | { send: null };
          };
      }
    | { executeTransfer: { fallback: bigint; lockedTxid: Txid__4 } };
export type OperationType =
    | { AddLiquidity: null }
    | { Swap: null }
    | { Claim: null }
    | { RemoveLiquidity: null };
export interface Order {
    status: OrderStatus;
    tasks: List_1;
    callbackStatus: [] | [Status__3];
    data: [] | [Uint8Array | number[]];
    name: string;
    comps: List;
    time: Time;
    compStrategy: CompStrategy;
    allowPushing: { Opening: null } | { Closed: null };
}
export interface OrderFilled {
    time: Time;
    token0Value: BalanceChange;
    counterparty: Txid;
    token1Value: BalanceChange;
}
export interface OrderFilled__1 {
    time: Time;
    token0Value: BalanceChange;
    counterparty: Txid;
    token1Value: BalanceChange;
}
export interface OrderPrice {
    quantity: { Buy: [Quantity, Amount] } | { Sell: Quantity };
    price: Price;
}
export interface OrderPrice__1 {
    quantity: { Buy: [Quantity, Amount] } | { Sell: Quantity };
    price: Price;
}
export type OrderSide = { Buy: null } | { Sell: null };
export type OrderSide__1 = { Buy: null } | { Sell: null };
export type OrderStatus =
    | { Done: null }
    | { Todo: null }
    | { Doing: null }
    | { Recovered: null }
    | { Compensating: null }
    | { Blocking: null };
export type OrderStatusResponse =
    | { Failed: TradingOrder }
    | { None: null }
    | { Completed: TxnRecord }
    | { Pending: TradingOrder };
export type OrderType = { FAK: null } | { FOK: null } | { LMT: null } | { MKT: null };
export type OrderType__1 = { FAK: null } | { FOK: null } | { LMT: null } | { MKT: null };
export interface Order__1 {
    status: OrderStatus;
    tasks: List_1;
    callbackStatus: [] | [Status__3];
    data: [] | [Uint8Array | number[]];
    name: string;
    comps: List;
    time: Time;
    compStrategy: CompStrategy;
    allowPushing: { Opening: null } | { Closed: null };
}
export interface Participant {
    updatedTime: Time;
    used: Amount__1;
    limit: Amount__1;
    historyVol: number;
}
export type PeriodNs = bigint;
export type Price = bigint;
export interface PriceResponse {
    quantity: bigint;
    price: bigint;
}
export interface PriceWeighted {
    updateTime: Timestamp__1;
    token1TimeWeighted: bigint;
    token0TimeWeighted: bigint;
}
export type Quantity = bigint;
export type Receipt =
    | { __block: null }
    | {
          ICRC1:
              | { icrc1_balance_of: bigint }
              | { icrc1_transfer: { Ok: bigint } | { Err: TransferError } };
      }
    | {
          ICRC2:
              | {
                    icrc2_approve: { Ok: bigint } | { Err: ApproveError };
                }
              | {
                    icrc2_transfer_from: { Ok: bigint } | { Err: TransferFromError };
                };
      }
    | { This: { dip20SendComp: null } | { dip20Send: null } }
    | {
          DIP20:
              | { transferFrom: TxReceipt }
              | { approve: TxReceipt }
              | { balanceOf: bigint }
              | { transfer: TxReceipt };
      }
    | {
          DRC20:
              | { transferBatch: Array<TxnResult> }
              | { transferFrom: TxnResult }
              | { approve: TxnResult }
              | { balanceOf: Amount__3 }
              | { txnRecord: [] | [TxnRecord__2] }
              | { lockTransfer: TxnResult }
              | { transfer: TxnResult }
              | { dropAccount: null }
              | { executeTransfer: TxnResult }
              | { lockTransferFrom: TxnResult };
      }
    | {
          ICRC1New:
              | { icrc1_balance_of: bigint }
              | { icrc1_transfer: { Ok: bigint } | { Err: TransferError__1 } };
      }
    | {
          ICRC2New:
              | {
                    icrc2_approve: { Ok: bigint } | { Err: ApproveError__1 };
                }
              | {
                    icrc2_transfer_from: { Ok: bigint } | { Err: TransferFromError__1 };
                };
      }
    | { Ledger: { account_balance: ICP } | { transfer: TransferResult } }
    | { ICTokens: { burn: TxnResult } | { mint: TxnResult } }
    | { __skip: null };
export interface RoundItem {
    end: Time;
    content: string;
    isSettled: boolean;
    name: string;
    minCapital: bigint;
    start: Time;
    closedPrice: [] | [number];
    quoteToken: { token0: null } | { token1: null };
}
export type Sa = Uint8Array | number[];
export type Sa__1 = Uint8Array | number[];
export interface SagaData {
    orders: Array<[Toid__2, Order]>;
    autoClearTimeout: bigint;
    aliveOrders: Array<[Toid__2, Time]>;
    index: bigint;
    actuator: {
        tasks: [Array<[Ttid, Task__1]>, Array<[Ttid, Task__1]>];
        callees: Array<[Callee, CalleeStatus]>;
        errorLogs: Array<[bigint, ErrorLog]>;
        taskLogs: Array<[Ttid, TaskEvent]>;
        index: bigint;
        firstErrIndex: bigint;
        errIndex: bigint;
        firstIndex: bigint;
    };
    taskEvents: Array<[Toid__2, Array<Ttid>]>;
    firstIndex: bigint;
}
export interface SagaTask {
    status: Status__3;
    comp: [] | [Compensation];
    task: Task__2;
    ttid: Ttid__2;
}
export interface Setting {
    MAX_STORAGE_TRIES: bigint;
    EN_DEBUG: boolean;
    MAX_CACHE_NUMBER_PER: bigint;
    MAX_CACHE_TIME: bigint;
}
export type ShareChange = { Burn: Shares } | { Mint: Shares } | { NoChange: null };
export type Shares = bigint;
export type Spender = string;
export type Status =
    | { Failed: null }
    | { Cancelled: null }
    | { PartiallyCompletedAndCancelled: null }
    | { Completed: null }
    | { Pending: null };
export type Status__1 =
    | { Error: null }
    | { Done: null }
    | { Todo: null }
    | { Doing: null }
    | { Unknown: null };
export type Status__2 =
    | { Error: null }
    | { Done: null }
    | { Todo: null }
    | { Doing: null }
    | { Unknown: null };
export type Status__3 =
    | { Error: null }
    | { Done: null }
    | { Todo: null }
    | { Doing: null }
    | { Unknown: null };
export type SubAccount = Uint8Array | number[];
export type Subaccount = Uint8Array | number[];
export type Subaccount__1 = Uint8Array | number[];
export type Subaccount__2 = Uint8Array | number[];
export type SysMode =
    | { DisabledTrading: null }
    | { ReadOnly: null }
    | { ClosingOnly: null }
    | { GeneralTrading: null };
export interface Task {
    preTtid: Array<Ttid__1>;
    data: [] | [Uint8Array | number[]];
    time: Time;
    toid: [] | [Toid__1];
    callType: CallType;
    cycles: bigint;
    recallInterval: bigint;
    attemptsMax: Attempts;
    callee: Callee__1;
    forTtid: [] | [Ttid__1];
}
export interface TaskEvent {
    result: TaskResult;
    callbackStatus: [] | [Status__2];
    task: Task;
    time: Time;
    toid: [] | [Toid__1];
    ttid: Ttid__1;
    attempts: Attempts;
    txHash: Uint8Array | number[];
}
export type TaskResult = [Status__1, [] | [Receipt], [] | [Err]];
export interface Task__1 {
    preTtid: Array<Ttid__1>;
    data: [] | [Uint8Array | number[]];
    time: Time;
    toid: [] | [Toid__1];
    callType: CallType;
    cycles: bigint;
    recallInterval: bigint;
    attemptsMax: Attempts;
    callee: Callee__1;
    forTtid: [] | [Ttid__1];
}
export interface Task__2 {
    preTtid: Array<Ttid__1>;
    data: [] | [Uint8Array | number[]];
    time: Time;
    toid: [] | [Toid__1];
    callType: CallType;
    cycles: bigint;
    recallInterval: bigint;
    attemptsMax: Attempts;
    callee: Callee__1;
    forTtid: [] | [Ttid__1];
}
export type Tcid = bigint;
export type Time = bigint;
export type Time__1 = bigint;
export type Timeout = number;
export type Timestamp = bigint;
export type Timestamp__1 = bigint;
export type Timestamp__2 = bigint;
export type Timestamp__3 = bigint;
export interface Timestamp__4 {
    timestamp_nanos: bigint;
}
export type Timestamp__5 = bigint;
export type To = string;
export type Toid = bigint;
export type Toid__1 = bigint;
export type Toid__2 = bigint;
export type Toid__3 = bigint;
export type TokenInfo = [Principal, TokenSymbol, TokenStd];
export type TokenStd =
    | { dft: null }
    | { ext: null }
    | { icp: null }
    | { other: string }
    | { cycles: null }
    | { ledger: null }
    | { icrc1: null }
    | { dip20: null }
    | { drc20: null };
export type TokenStd__1 =
    | { dft: null }
    | { ext: null }
    | { icp: null }
    | { other: string }
    | { cycles: null }
    | { ledger: null }
    | { icrc1: null }
    | { dip20: null }
    | { drc20: null };
export type TokenSymbol = string;
export type TokenType = { Icp: null } | { Token: Principal } | { Cycles: null };
export type TokenType__1 = { Icp: null } | { Token: Principal } | { Cycles: null };
export interface TradingOrder {
    fee: { fee0: bigint; fee1: bigint };
    gas: { gas0: bigint; gas1: bigint };
    status: TradingStatus;
    toids: Array<Toid>;
    data: [] | [Uint8Array | number[]];
    time: Time;
    txid: Txid;
    icrc1Account: [] | [{ owner: Principal; subaccount: [] | [Uint8Array | number[]] }];
    orderType: OrderType__1;
    filled: Array<OrderFilled>;
    expiration: Time;
    nonce: bigint;
    account: AccountId__1;
    remaining: OrderPrice__1;
    index: bigint;
    orderPrice: OrderPrice__1;
    refund: [bigint, bigint, bigint];
}
export interface TradingOrder__1 {
    fee: { fee0: bigint; fee1: bigint };
    gas: { gas0: bigint; gas1: bigint };
    status: TradingStatus;
    toids: Array<Toid>;
    data: [] | [Uint8Array | number[]];
    time: Time;
    txid: Txid;
    icrc1Account: [] | [{ owner: Principal; subaccount: [] | [Uint8Array | number[]] }];
    orderType: OrderType__1;
    filled: Array<OrderFilled>;
    expiration: Time;
    nonce: bigint;
    account: AccountId__1;
    remaining: OrderPrice__1;
    index: bigint;
    orderPrice: OrderPrice__1;
    refund: [bigint, bigint, bigint];
}
export type TradingResult =
    | {
          ok: {
              status: TradingStatus;
              txid: Txid;
              filled: Array<OrderFilled>;
          };
      }
    | {
          err: {
              code:
                  | { NonceError: null }
                  | { InvalidAmount: null }
                  | { UndefinedError: null }
                  | { UnacceptableVolatility: null }
                  | { TransactionBlocking: null }
                  | { InsufficientBalance: null }
                  | { TransferException: null };
              message: string;
          };
      };
export type TradingStatus =
    | { Todo: null }
    | { Closed: null }
    | { Cancelled: null }
    | { Pending: null };
export interface Transaction {
    to: AccountId__3;
    value: bigint;
    data: [] | [Uint8Array | number[]];
    from: AccountId__3;
    operation: Operation;
}
export interface TransferArgs {
    to: Account;
    fee: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    from_subaccount: [] | [Subaccount];
    created_at_time: [] | [Timestamp__2];
    amount: bigint;
}
export interface TransferArgs__1 {
    to: Account__1;
    fee: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    from_subaccount: [] | [Subaccount__1];
    created_at_time: [] | [Timestamp__3];
    amount: bigint;
}
export interface TransferArgs__2 {
    to: AccountIdentifier;
    fee: ICP;
    memo: Memo;
    from_subaccount: [] | [SubAccount];
    created_at_time: [] | [Timestamp__4];
    amount: ICP;
}
export type TransferError =
    | {
          GenericError: { message: string; error_code: bigint };
      }
    | { TemporarilyUnavailable: null }
    | { BadBurn: { min_burn_amount: bigint } }
    | { Duplicate: { duplicate_of: bigint } }
    | { BadFee: { expected_fee: bigint } }
    | { CreatedInFuture: null }
    | { TooOld: { allowed_window_nanos: Duration } }
    | { InsufficientFunds: { balance: bigint } };
export type TransferError__1 =
    | {
          GenericError: { message: string; error_code: bigint };
      }
    | { TemporarilyUnavailable: null }
    | { BadBurn: { min_burn_amount: bigint } }
    | { Duplicate: { duplicate_of: bigint } }
    | { BadFee: { expected_fee: bigint } }
    | { CreatedInFuture: { ledger_time: bigint } }
    | { TooOld: null }
    | { InsufficientFunds: { balance: bigint } };
export type TransferError__2 =
    | {
          TxTooOld: { allowed_window_nanos: bigint };
      }
    | { BadFee: { expected_fee: ICP } }
    | { TxDuplicate: { duplicate_of: BlockIndex } }
    | { TxCreatedInFuture: null }
    | { InsufficientFunds: { balance: ICP } };
export interface TransferFromArgs {
    to: Account;
    fee: [] | [bigint];
    from: Account;
    memo: [] | [Uint8Array | number[]];
    created_at_time: [] | [bigint];
    amount: bigint;
}
export interface TransferFromArgs__1 {
    to: Account__1;
    fee: [] | [bigint];
    spender_subaccount: [] | [Uint8Array | number[]];
    from: Account__1;
    memo: [] | [Uint8Array | number[]];
    created_at_time: [] | [bigint];
    amount: bigint;
}
export type TransferFromError =
    | {
          GenericError: { message: string; error_code: bigint };
      }
    | { TemporarilyUnavailable: null }
    | { InsufficientAllowance: { allowance: bigint } }
    | { BadBurn: { min_burn_amount: bigint } }
    | { Duplicate: { duplicate_of: bigint } }
    | { BadFee: { expected_fee: bigint } }
    | { CreatedInFuture: { ledger_time: bigint } }
    | { TooOld: null }
    | { InsufficientFunds: { balance: bigint } };
export type TransferFromError__1 =
    | {
          GenericError: { message: string; error_code: bigint };
      }
    | { TemporarilyUnavailable: null }
    | { InsufficientAllowance: { allowance: bigint } }
    | { BadBurn: { min_burn_amount: bigint } }
    | { Duplicate: { duplicate_of: bigint } }
    | { BadFee: { expected_fee: bigint } }
    | { CreatedInFuture: { ledger_time: bigint } }
    | { TooOld: null }
    | { InsufficientFunds: { balance: bigint } };
export type TransferResult = { Ok: BlockIndex } | { Err: TransferError__2 };
export interface TrieList {
    total: bigint;
    data: Array<[Txid__1, TradingOrder__1]>;
    totalPage: bigint;
}
export interface TrieList_1 {
    total: bigint;
    data: Array<
        [
            AccountId__4,
            {
                vol: Vol;
                orders: bigint;
                commission: Vol;
                filledCount: bigint;
            },
        ]
    >;
    totalPage: bigint;
}
export interface TrieList_2 {
    total: bigint;
    data: Array<[AccountId__4, { vol: Vol; count: bigint; rate: number; commission: Vol }]>;
    totalPage: bigint;
}
export type Ttid = bigint;
export type Ttid__1 = bigint;
export type Ttid__2 = bigint;
export type TxAccount = string;
export type TxReceipt =
    | { Ok: bigint }
    | {
          Err:
              | { InsufficientAllowance: null }
              | { InsufficientBalance: null }
              | { ErrorOperationStyle: null }
              | { Unauthorized: null }
              | { LedgerTrap: null }
              | { ErrorTo: null }
              | { Other: string }
              | { BlockUsed: null }
              | { AmountTooSmall: null };
      };
export type Txid = Uint8Array | number[];
export type Txid__1 = Uint8Array | number[];
export type Txid__2 = Uint8Array | number[];
export type Txid__3 = Uint8Array | number[];
export type Txid__4 = Uint8Array | number[];
export type Txid__5 = Uint8Array | number[];
export interface TxnRecord {
    fee: { token0Fee: bigint; token1Fee: bigint };
    status: Status;
    shares: ShareChange;
    msgCaller: [] | [Principal];
    order: {
        token0Value: [] | [BalanceChange__1];
        token1Value: [] | [BalanceChange__1];
    };
    data: [] | [Data__1];
    time: Time;
    txid: Txid__2;
    orderMode: { AMM: null } | { OrderBook: null };
    orderType: [] | [{ FAK: null } | { FOK: null } | { LMT: null } | { MKT: null }];
    filled: {
        token0Value: BalanceChange__1;
        token1Value: BalanceChange__1;
    };
    token0: TokenType__1;
    token1: TokenType__1;
    nonce: Nonce__1;
    operation: OperationType;
    account: AccountId;
    details: Array<{
        time: Time;
        token0Value: BalanceChange__1;
        counterparty: Txid__2;
        token1Value: BalanceChange__1;
    }>;
    caller: AccountId;
    index: bigint;
    cyclesWallet: [] | [CyclesWallet];
}
export interface TxnRecord__1 {
    fee: { token0Fee: bigint; token1Fee: bigint };
    status: Status;
    shares: ShareChange;
    msgCaller: [] | [Principal];
    order: {
        token0Value: [] | [BalanceChange__1];
        token1Value: [] | [BalanceChange__1];
    };
    data: [] | [Data__1];
    time: Time;
    txid: Txid__2;
    orderMode: { AMM: null } | { OrderBook: null };
    orderType: [] | [{ FAK: null } | { FOK: null } | { LMT: null } | { MKT: null }];
    filled: {
        token0Value: BalanceChange__1;
        token1Value: BalanceChange__1;
    };
    token0: TokenType__1;
    token1: TokenType__1;
    nonce: Nonce__1;
    operation: OperationType;
    account: AccountId;
    details: Array<{
        time: Time;
        token0Value: BalanceChange__1;
        counterparty: Txid__2;
        token1Value: BalanceChange__1;
    }>;
    caller: AccountId;
    index: bigint;
    cyclesWallet: [] | [CyclesWallet];
}
export interface TxnRecord__2 {
    gas: Gas;
    msgCaller: [] | [Principal];
    transaction: Transaction;
    txid: Txid__4;
    nonce: bigint;
    timestamp: Time__1;
    caller: AccountId__3;
    index: bigint;
}
export interface TxnRecord__3 {
    fee: { token0Fee: bigint; token1Fee: bigint };
    status: Status;
    shares: ShareChange;
    msgCaller: [] | [Principal];
    order: {
        token0Value: [] | [BalanceChange__1];
        token1Value: [] | [BalanceChange__1];
    };
    data: [] | [Data__1];
    time: Time;
    txid: Txid__2;
    orderMode: { AMM: null } | { OrderBook: null };
    orderType: [] | [{ FAK: null } | { FOK: null } | { LMT: null } | { MKT: null }];
    filled: {
        token0Value: BalanceChange__1;
        token1Value: BalanceChange__1;
    };
    token0: TokenType__1;
    token1: TokenType__1;
    nonce: Nonce__1;
    operation: OperationType;
    account: AccountId;
    details: Array<{
        time: Time;
        token0Value: BalanceChange__1;
        counterparty: Txid__2;
        token1Value: BalanceChange__1;
    }>;
    caller: AccountId;
    index: bigint;
    cyclesWallet: [] | [CyclesWallet];
}
export type TxnResult =
    | { ok: Txid__4 }
    | {
          err: {
              code:
                  | { NonceError: null }
                  | { InsufficientGas: null }
                  | { InsufficientAllowance: null }
                  | { UndefinedError: null }
                  | { InsufficientBalance: null }
                  | { NoLockedTransfer: null }
                  | { DuplicateExecutedTransfer: null }
                  | { LockedTransferExpired: null };
              message: string;
          };
      };
export interface Vol {
    value0: Amount;
    value1: Amount;
}
export interface Vol__1 {
    value0: Amount;
    value1: Amount;
}
export interface Vol__2 {
    value0: bigint;
    value1: bigint;
}
export interface _SERVICE {
    IDO_config: ActorMethod<[IDOSetting], undefined>;
    IDO_getConfig: ActorMethod<[], [[] | [Principal], IDOSetting, [] | [IDORequirement]]>;
    IDO_qualification: ActorMethod<[[] | [Address]], Array<[Address, Participant]>>;
    IDO_removeWhitelist: ActorMethod<[Array<Address>], undefined>;
    IDO_setFunder: ActorMethod<[[] | [Principal], [] | [IDORequirement]], undefined>;
    IDO_setWhitelist: ActorMethod<[Array<[Address, Amount__1]>], undefined>;
    IDO_updateQualification: ActorMethod<[[] | [Sa]], [] | [Participant]>;
    accountBalance: ActorMethod<[Address], KeepingBalance__1>;
    accountConfig: ActorMethod<
        [{ PoolMode: { enKeepingBalance: boolean } } | { TunnelMode: null }, [] | [Sa]],
        undefined
    >;
    accountSetting: ActorMethod<[Address], AccountSetting__1>;
    backup: ActorMethod<[BackupRequest], BackupResponse>;
    brokerList: ActorMethod<[[] | [ListPage], [] | [ListSize]], TrieList_2>;
    cancel: ActorMethod<[Nonce, [] | [Sa]], undefined>;
    cancelAll: ActorMethod<
        [{ self_sa: [] | [Sa] } | { management: [] | [AccountId__4] }, [] | [OrderSide__1]],
        undefined
    >;
    cancelByTxid: ActorMethod<[Txid__1, [] | [Sa]], undefined>;
    changeOwner: ActorMethod<[Principal], boolean>;
    comp_fallback: ActorMethod<[[] | [Sa]], [Amount__1, Amount__1]>;
    comp_getPairAccount: ActorMethod<
        [Address],
        { depositing: [Account__2, Address]; balance: [Account__2, Address] }
    >;
    comp_withdraw: ActorMethod<[[] | [Sa]], [Amount__1, Amount__1]>;
    config: ActorMethod<[DexConfig], boolean>;
    count: ActorMethod<[[] | [Address]], bigint>;
    drc205_canisterId: ActorMethod<[], Principal>;
    drc205_config: ActorMethod<[Config], boolean>;
    drc205_dexInfo: ActorMethod<[], DexInfo>;
    drc205_events: ActorMethod<[[] | [Address__2]], Array<TxnRecord__3>>;
    drc205_getConfig: ActorMethod<[], Setting>;
    drc205_pool: ActorMethod<[], Array<[Txid__1, TxnRecord__3, bigint]>>;
    drc205_txn: ActorMethod<[Txid__5], [] | [TxnRecord__3]>;
    drc205_txn2: ActorMethod<[Txid__5], [] | [TxnRecord__3]>;
    drc207: ActorMethod<[], DRC207Support>;
    fallback: ActorMethod<[Nonce, [] | [Sa]], boolean>;
    fallbackByTxid: ActorMethod<[Txid__1, [] | [Sa]], boolean>;
    fee: ActorMethod<
        [],
        {
            maker: { buy: number; sell: number };
            taker: { buy: number; sell: number };
        }
    >;
    feeStatus: ActorMethod<[], FeeStatus>;
    getConfig: ActorMethod<[], DexSetting>;
    getOwner: ActorMethod<[], Principal>;
    getPairAddress: ActorMethod<[], { fees: [Account__2, Address]; pool: [Account__2, Address] }>;
    getQuotes: ActorMethod<[KInterval], Array<KBar>>;
    getTxAccount: ActorMethod<[Address], [Account__2, TxAccount, Nonce, Txid__1]>;
    ictc_TM: ActorMethod<[], string>;
    ictc_addAdmin: ActorMethod<[Principal], undefined>;
    ictc_appendTT: ActorMethod<
        [
            [] | [Uint8Array | number[]],
            Toid__3,
            [] | [Ttid__2],
            Principal,
            CallType__1,
            Array<Ttid__2>,
        ],
        Ttid__2
    >;
    ictc_blockTO: ActorMethod<[Toid__3], [] | [Toid__3]>;
    ictc_clearLog: ActorMethod<[[] | [bigint], boolean], undefined>;
    ictc_clearTTPool: ActorMethod<[], undefined>;
    ictc_completeTO: ActorMethod<[Toid__3, OrderStatus], boolean>;
    ictc_doneTO: ActorMethod<[Toid__3, OrderStatus, boolean], boolean>;
    ictc_doneTT: ActorMethod<[Toid__3, Ttid__2, boolean], [] | [Ttid__2]>;
    ictc_getAdmins: ActorMethod<[], Array<Principal>>;
    ictc_getCalleeStatus: ActorMethod<[Principal], [] | [CalleeStatus]>;
    ictc_getPool: ActorMethod<
        [],
        {
            ttPool: { total: bigint; items: Array<[Ttid__2, Task__2]> };
            toPool: {
                total: bigint;
                items: Array<[Toid__3, [] | [Order__1]]>;
            };
        }
    >;
    ictc_getTO: ActorMethod<[Toid__3], [] | [Order__1]>;
    ictc_getTOCount: ActorMethod<[], bigint>;
    ictc_getTOPool: ActorMethod<[], Array<[Toid__3, [] | [Order__1]]>>;
    ictc_getTOs: ActorMethod<
        [bigint, bigint],
        {
            total: bigint;
            data: Array<[Toid__3, Order__1]>;
            totalPage: bigint;
        }
    >;
    ictc_getTT: ActorMethod<[Ttid__2], [] | [TaskEvent]>;
    ictc_getTTByTO: ActorMethod<[Toid__3], Array<TaskEvent>>;
    ictc_getTTErrors: ActorMethod<
        [bigint, bigint],
        {
            total: bigint;
            data: Array<[bigint, ErrorLog]>;
            totalPage: bigint;
        }
    >;
    ictc_getTTPool: ActorMethod<[], Array<[Ttid__2, Task__2]>>;
    ictc_getTTs: ActorMethod<
        [bigint, bigint],
        {
            total: bigint;
            data: Array<[Ttid__2, TaskEvent]>;
            totalPage: bigint;
        }
    >;
    ictc_redoTT: ActorMethod<[Toid__3, Ttid__2], [] | [Ttid__2]>;
    ictc_removeAdmin: ActorMethod<[Principal], undefined>;
    ictc_runTO: ActorMethod<[Toid__3], [] | [OrderStatus]>;
    ictc_runTT: ActorMethod<[], boolean>;
    info: ActorMethod<
        [],
        {
            decimals: number;
            setting: DexSetting;
            owner: Principal;
            name: string;
            version: string;
            token0: TokenInfo;
            token1: TokenInfo;
            paused: boolean;
        }
    >;
    init: ActorMethod<[], undefined>;
    latestFilled: ActorMethod<[], Array<[Timestamp__5, Txid__1, OrderFilled__1, OrderSide]>>;
    level10: ActorMethod<[], [bigint, { ask: Array<PriceResponse>; bid: Array<PriceResponse> }]>;
    level100: ActorMethod<[], [bigint, { ask: Array<PriceResponse>; bid: Array<PriceResponse> }]>;
    liquidity: ActorMethod<[[] | [Address]], Liquidity>;
    liquidity2: ActorMethod<[[] | [Address]], Liquidity2>;
    makerList: ActorMethod<[[] | [ListPage], [] | [ListSize]], TrieList_1>;
    makerRebate: ActorMethod<[Address], [number, number]>;
    mergePair: ActorMethod<[Principal], boolean>;
    name: ActorMethod<[], string>;
    orderExpirationDuration: ActorMethod<[], bigint>;
    pending: ActorMethod<[[] | [Address], [] | [ListPage], [] | [ListSize]], TrieList>;
    pendingAll: ActorMethod<[[] | [ListPage], [] | [ListSize]], TrieList>;
    pendingCount: ActorMethod<[], bigint>;
    poolBalance: ActorMethod<[], { token0: Amount__1; token1: Amount__1 }>;
    prepare: ActorMethod<[Address], [TxAccount, Nonce]>;
    recovery: ActorMethod<[BackupResponse], boolean>;
    removeVipMaker: ActorMethod<[Address], undefined>;
    setOrderFail: ActorMethod<[string], boolean>;
    setPause: ActorMethod<[boolean, [] | [Time]], boolean>;
    setUpgradeMode: ActorMethod<[{ All: null } | { Base: null }], undefined>;
    setVipMaker: ActorMethod<[Address, bigint], undefined>;
    stats: ActorMethod<[], { change24h: number; vol24h: Vol; totalVol: Vol; price: number }>;
    status: ActorMethod<[Address, Nonce], OrderStatusResponse>;
    statusByTxid: ActorMethod<[Txid__1], OrderStatusResponse>;
    sync: ActorMethod<[], undefined>;
    sysMode: ActorMethod<[], { mode: SysMode; openingTime: Time }>;
    ta_ambassador: ActorMethod<[Address], [boolean, string, bigint, Vol]>;
    ta_description: ActorMethod<[], string>;
    ta_getReferrer: ActorMethod<[Address], [] | [[Address, boolean]]>;
    ta_setDescription: ActorMethod<[string], undefined>;
    ta_setReferrer: ActorMethod<[Address, [] | [string], [] | [Sa]], boolean>;
    ta_stats: ActorMethod<[[] | [string]], [bigint, bigint, Vol]>;
    timerStart: ActorMethod<[bigint], undefined>;
    timerStop: ActorMethod<[], undefined>;
    token0: ActorMethod<[], [TokenType, [] | [TokenStd]]>;
    token1: ActorMethod<[], [TokenType, [] | [TokenStd]]>;
    tpsStats: ActorMethod<[], [bigint, number, bigint, bigint, bigint, bigint]>;
    trade: ActorMethod<
        [OrderPrice, OrderType, [] | [PeriodNs], [] | [Nonce], [] | [Sa], [] | [Data]],
        TradingResult
    >;
    tradeMKT: ActorMethod<
        [DebitToken, Amount__1, [] | [Nonce], [] | [Sa], [] | [Data]],
        TradingResult
    >;
    tradeMKT_b: ActorMethod<
        [
            DebitToken,
            Amount__1,
            [] | [bigint],
            [] | [Nonce],
            [] | [Sa],
            [] | [Data],
            [] | [{ broker: Principal; rate: number }],
        ],
        TradingResult
    >;
    trade_b: ActorMethod<
        [
            OrderPrice,
            OrderType,
            [] | [PeriodNs],
            [] | [Nonce],
            [] | [Sa],
            [] | [Data],
            [] | [{ broker: Principal; rate: number }],
        ],
        TradingResult
    >;
    userCount: ActorMethod<[], bigint>;
    version: ActorMethod<[], string>;
    wallet_receive: ActorMethod<[], undefined>;
    withdraw_cycles: ActorMethod<[bigint], undefined>;
}
