import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AllowanceArgs {
  'token' : string,
  'owner' : User,
  'spender' : Principal,
}
export interface ApproveArgs {
  'token' : string,
  'subaccount' : [] | [Uint8Array],
  'allowance' : bigint,
  'spender' : Principal,
}
export interface BalanceArgs { 'token' : string, 'user' : User }
export type CapEvent = {
    'Approve' : {
      'balance' : bigint,
      'owner' : string,
      'index' : bigint,
      'spender' : string,
    }
  } |
  {
    'Mint' : {
      'balance' : bigint,
      'owner' : string,
      'from' : string,
      'index' : bigint,
    }
  } |
  {
    'Sale' : {
      'balance' : bigint,
      'owner' : string,
      'price_decimals' : bigint,
      'index' : bigint,
      'price' : bigint,
      'price_currency' : string,
      'receiver' : string,
    }
  } |
  {
    'Disbursement' : {
      'to' : string,
      'block_index' : bigint,
      'price_decimals' : bigint,
      'from' : string,
      'subaccount' : Uint8Array,
      'error' : string,
      'account' : string,
      'index' : bigint,
      'price' : bigint,
      'price_currency' : string,
    }
  } |
  {
    'Transfer' : {
      'balance' : bigint,
      'owner' : string,
      'memo' : Uint8Array,
      'index' : bigint,
      'receiver' : string,
    }
  };
export type CommonError = { 'InvalidToken' : string } |
  { 'Other' : string };
export type DetailValue = { 'I64' : bigint } |
  { 'U64' : bigint } |
  { 'Vec' : Array<DetailValue> } |
  { 'Slice' : Uint8Array } |
  { 'TokenIdU64' : bigint } |
  { 'Text' : string } |
  { 'True' : null } |
  { 'False' : null } |
  { 'Float' : number } |
  { 'Principal' : Principal };
export interface Disbursement {
  'fee' : bigint,
  'price_decimals' : bigint,
  'subaccount' : Uint8Array,
  'address' : string,
  'index' : number,
  'price' : bigint,
  'price_currency' : string,
}
export interface EntrepotConfig {
  'escrow_delay' : bigint,
  'sale_ended' : boolean,
  'sale_fees' : Array<[string, bigint]>,
  'next_subaccount' : bigint,
  'marketplace_open' : bigint,
}
export interface EntrepotData {
  'token_settlements' : Array<[number, Settlement]>,
  'disbursements' : Array<Disbursement>,
  'transactions' : Array<Transaction>,
  'config' : EntrepotConfig,
  'token_listings' : Array<[number, Listing]>,
}
export interface Event {
  'time' : bigint,
  'operation' : string,
  'details' : Array<[string, DetailValue]>,
  'caller' : Principal,
}
export interface HeartbeatData {
  'last' : bigint,
  'yumi_config' : YumiConfig,
  'cap_events' : Array<CapEvent>,
  'sleep' : bigint,
  'ledger_canister_id' : [] | [string],
  'changed' : boolean,
}
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Uint8Array,
  'headers' : Array<[string, string]>,
}
export interface HttpResponse {
  'body' : Uint8Array,
  'headers' : Array<[string, string]>,
  'status_code' : number,
}
export interface Listing {
  'locked' : [] | [bigint],
  'seller' : Principal,
  'price' : bigint,
}
export interface ListingArgs {
  'token' : string,
  'from_subaccount' : [] | [Uint8Array],
  'price' : [] | [bigint],
}
export interface Metadata {
  'data' : Uint8Array,
  'header' : Array<[string, MetadataValue]>,
}
export type MetadataValue = { 'Nat' : bigint } |
  { 'Nat16' : number } |
  { 'Nat32' : number } |
  { 'Nat64' : bigint } |
  { 'Blob' : Uint8Array } |
  { 'Nat8' : number } |
  { 'Text' : string };
export interface MintArgs { 'to' : User, 'metadata' : [] | [Uint8Array] }
export type MotokoResult = { 'ok' : bigint } |
  { 'err' : CommonError };
export type MotokoResult_1 = { 'ok' : string } |
  { 'err' : CommonError };
export type MotokoResult_2 = { 'ok' : [string, [] | [Listing]] } |
  { 'err' : CommonError };
export type MotokoResult_3 = { 'ok' : null } |
  { 'err' : CommonError };
export type MotokoResult_4 = { 'ok' : TokenMetadata } |
  { 'err' : CommonError };
export type MotokoResult_5 = { 'ok' : Uint32Array } |
  { 'err' : CommonError };
export type MotokoResult_6 = {
    'ok' : Array<[number, [] | [Listing], [] | [Uint8Array]]>
  } |
  { 'err' : CommonError };
export type MotokoResult_7 = { 'ok' : bigint } |
  { 'err' : TransferError };
export interface NftMetadataArgsBySlice {
  'no' : number,
  'first' : boolean,
  'token' : string,
  'data' : Uint8Array,
  'finished' : boolean,
  'header' : Array<[string, MetadataValue]>,
}
export interface NftView {
  'id' : number,
  'owner' : string,
  'approved' : [] | [Principal],
}
export interface Picture { 'data' : Uint8Array, 'content_type' : string }
export interface Settlement {
  'subaccount' : Uint8Array,
  'seller' : Principal,
  'buyer' : string,
  'price' : bigint,
}
export type TokenMetadata = {
    'fungible' : {
      'decimals' : number,
      'metadata' : [] | [Uint8Array],
      'name' : string,
      'symbol' : string,
    }
  } |
  { 'nonfungible' : { 'metadata' : [] | [Uint8Array] } };
export interface Transaction {
  'token' : string,
  'time' : bigint,
  'seller' : Principal,
  'buyer' : string,
  'price' : bigint,
}
export interface TransferArgs {
  'to' : User,
  'token' : string,
  'notify' : boolean,
  'from' : User,
  'memo' : Uint8Array,
  'subaccount' : [] | [Uint8Array],
  'amount' : bigint,
}
export type TransferError = { 'CannotNotify' : string } |
  { 'InsufficientBalance' : null } |
  { 'InvalidToken' : string } |
  { 'Rejected' : null } |
  { 'Unauthorized' : string } |
  { 'Other' : string };
export type User = { 'principal' : Principal } |
  { 'address' : string };
export interface YumiConfig {
  'yumi_canister_id' : [] | [string],
  'next_yumi_id' : bigint,
}
export interface _SERVICE {
  '__get_candid_interface_tmp_hack' : ActorMethod<[], string>,
  'acceptCycles' : ActorMethod<[], undefined>,
  'allPayments' : ActorMethod<[], Array<[Principal, Array<Uint8Array>]>>,
  'allSettlements' : ActorMethod<[], Array<[number, Settlement]>>,
  'allowance' : ActorMethod<[AllowanceArgs], MotokoResult>,
  'approve' : ActorMethod<[ApproveArgs], boolean>,
  'availableCycles' : ActorMethod<[], bigint>,
  'balance' : ActorMethod<[BalanceArgs], MotokoResult>,
  'bearer' : ActorMethod<[string], MotokoResult_1>,
  'calcAccountId' : ActorMethod<[string], string>,
  'calcTokenIdentifier' : ActorMethod<[number], string>,
  'clearPayments' : ActorMethod<[Principal, Array<Uint8Array>], undefined>,
  'cronDisbursements' : ActorMethod<[], undefined>,
  'cronSettlements' : ActorMethod<[], undefined>,
  'details' : ActorMethod<[string], MotokoResult_2>,
  'extensions' : ActorMethod<[], Array<string>>,
  'getAllTokens' : ActorMethod<[], Array<NftView>>,
  'getAllowances' : ActorMethod<[], Array<[number, Principal]>>,
  'getDataCertificate' : ActorMethod<[], [] | [Uint8Array]>,
  'getEntrepotData' : ActorMethod<[], EntrepotData>,
  'getHashes' : ActorMethod<[], Array<[string, Uint8Array]>>,
  'getHeartbeatData' : ActorMethod<[], HeartbeatData>,
  'getMetadata' : ActorMethod<[], Array<[number, TokenMetadata]>>,
  'getMinter' : ActorMethod<[], Principal>,
  'getMinters' : ActorMethod<[], Array<Principal>>,
  'getName' : ActorMethod<[], string>,
  'getNextCapEventId' : ActorMethod<[], bigint>,
  'getNftMetadata' : ActorMethod<[string, number], [] | [Metadata]>,
  'getNftRarity' : ActorMethod<[string], string>,
  'getProperties' : ActorMethod<[], Array<[string, Array<[string, bigint]>]>>,
  'getRegistry' : ActorMethod<[], Array<[number, string]>>,
  'getSymbol' : ActorMethod<[], string>,
  'getTemporaryData' : ActorMethod<[], Uint8Array>,
  'getTokens' : ActorMethod<[], Array<[number, TokenMetadata]>>,
  'getTokensByIds' : ActorMethod<[Uint32Array], Array<[number, TokenMetadata]>>,
  'getTransactionById' : ActorMethod<[bigint], Event>,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'initCap' : ActorMethod<[bigint, [] | [Principal]], undefined>,
  'isMaintaining' : ActorMethod<[], boolean>,
  'isMinter' : ActorMethod<[Principal], boolean>,
  'list' : ActorMethod<[ListingArgs], MotokoResult_3>,
  'listings' : ActorMethod<[], Array<[number, Listing, TokenMetadata]>>,
  'lock' : ActorMethod<[string, bigint, string, Uint8Array], MotokoResult_1>,
  'manualHeartbeat' : ActorMethod<[], [] | [Array<CapEvent>]>,
  'metadata' : ActorMethod<[string], MotokoResult_4>,
  'mintNFT' : ActorMethod<[MintArgs], undefined>,
  'mintNFTsWithoutCap' : ActorMethod<[User, number], undefined>,
  'payments' : ActorMethod<[], [] | [Array<Uint8Array>]>,
  'pendingCronJobs' : ActorMethod<[], Array<bigint>>,
  'refreshNftsContent' : ActorMethod<
    [number, number, Array<string>],
    undefined
  >,
  'refreshNftsHashes' : ActorMethod<[number, number, [] | [number]], undefined>,
  'removeMinter' : ActorMethod<[Principal], undefined>,
  'setEscrowDelay' : ActorMethod<[bigint], undefined>,
  'setHeartbeatData' : ActorMethod<
    [boolean, bigint, [] | [string], bigint],
    HeartbeatData
  >,
  'setLedgerCanisterIdOnlyForLocalTest' : ActorMethod<
    [[] | [string]],
    undefined
  >,
  'setLogo' : ActorMethod<[[] | [Picture]], undefined>,
  'setMaintaining' : ActorMethod<[boolean], undefined>,
  'setMinter' : ActorMethod<[Principal], undefined>,
  'setName' : ActorMethod<[string], undefined>,
  'setNextCapEventId' : ActorMethod<[bigint], undefined>,
  'setNftContent' : ActorMethod<[string, [] | [Uint8Array]], boolean>,
  'setNftMetadata' : ActorMethod<[string, number, [] | [Metadata]], boolean>,
  'setNftMetadataBySlice' : ActorMethod<[NftMetadataArgsBySlice], boolean>,
  'setNftRarity' : ActorMethod<[string, string], boolean>,
  'setNftThumbnail' : ActorMethod<[number, [] | [Picture]], undefined>,
  'setSaleFees' : ActorMethod<[Array<[string, bigint]>], undefined>,
  'setSymbol' : ActorMethod<[string], undefined>,
  'setUpdatingPicture' : ActorMethod<[[] | [Picture]], undefined>,
  'setUpdatingPictureBySlice' : ActorMethod<
    [Picture, boolean, boolean],
    undefined
  >,
  'settle' : ActorMethod<[string], MotokoResult_3>,
  'settlements' : ActorMethod<[], Array<[number, string, bigint]>>,
  'stats' : ActorMethod<
    [],
    [bigint, bigint, bigint, bigint, bigint, bigint, bigint]
  >,
  'supply' : ActorMethod<[string], MotokoResult>,
  'toAddress' : ActorMethod<[string, bigint], string>,
  'tokens' : ActorMethod<[string], MotokoResult_5>,
  'tokens_ext' : ActorMethod<[string], MotokoResult_6>,
  'transactions' : ActorMethod<[], Array<Transaction>>,
  'transfer' : ActorMethod<[TransferArgs], MotokoResult_7>,
  'transferWithPrice' : ActorMethod<
    [TransferArgs, bigint, bigint, string],
    MotokoResult_7
  >,
  'viewDisbursements' : ActorMethod<[], Array<Disbursement>>,
}
