export const idlFactory = ({ IDL }: any) => {
    const DetailValue = IDL.Rec();
    const Settlement = IDL.Record({
        subaccount: IDL.Vec(IDL.Nat8),
        seller: IDL.Principal,
        buyer: IDL.Text,
        price: IDL.Nat64,
    });
    const User = IDL.Variant({
        principal: IDL.Principal,
        address: IDL.Text,
    });
    const AllowanceArgs = IDL.Record({
        token: IDL.Text,
        owner: User,
        spender: IDL.Principal,
    });
    const CommonError = IDL.Variant({
        InvalidToken: IDL.Text,
        Other: IDL.Text,
    });
    const MotokoResult = IDL.Variant({ ok: IDL.Nat, err: CommonError });
    const ApproveArgs = IDL.Record({
        token: IDL.Text,
        subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        allowance: IDL.Nat,
        spender: IDL.Principal,
    });
    const BalanceArgs = IDL.Record({ token: IDL.Text, user: User });
    const MotokoResult_1 = IDL.Variant({ ok: IDL.Text, err: CommonError });
    const Listing = IDL.Record({
        locked: IDL.Opt(IDL.Int),
        seller: IDL.Principal,
        price: IDL.Nat64,
    });
    const MotokoResult_2 = IDL.Variant({
        ok: IDL.Tuple(IDL.Text, IDL.Opt(Listing)),
        err: CommonError,
    });
    const NftView = IDL.Record({
        id: IDL.Nat32,
        owner: IDL.Text,
        approved: IDL.Opt(IDL.Principal),
    });
    const Disbursement = IDL.Record({
        fee: IDL.Nat64,
        price_decimals: IDL.Nat64,
        subaccount: IDL.Vec(IDL.Nat8),
        address: IDL.Text,
        index: IDL.Nat32,
        price: IDL.Nat64,
        price_currency: IDL.Text,
    });
    const Transaction = IDL.Record({
        token: IDL.Text,
        time: IDL.Int,
        seller: IDL.Principal,
        buyer: IDL.Text,
        price: IDL.Nat64,
    });
    const EntrepotConfig = IDL.Record({
        escrow_delay: IDL.Nat64,
        sale_ended: IDL.Bool,
        sale_fees: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64)),
        next_subaccount: IDL.Nat,
        marketplace_open: IDL.Int,
    });
    const EntrepotData = IDL.Record({
        token_settlements: IDL.Vec(IDL.Tuple(IDL.Nat32, Settlement)),
        disbursements: IDL.Vec(Disbursement),
        transactions: IDL.Vec(Transaction),
        config: EntrepotConfig,
        token_listings: IDL.Vec(IDL.Tuple(IDL.Nat32, Listing)),
    });
    const YumiConfig = IDL.Record({
        yumi_canister_id: IDL.Opt(IDL.Text),
        next_yumi_id: IDL.Nat64,
    });
    const CapEvent = IDL.Variant({
        Approve: IDL.Record({
            balance: IDL.Nat64,
            owner: IDL.Text,
            index: IDL.Nat64,
            spender: IDL.Text,
        }),
        Mint: IDL.Record({
            balance: IDL.Nat64,
            owner: IDL.Text,
            from: IDL.Text,
            index: IDL.Nat64,
        }),
        Sale: IDL.Record({
            balance: IDL.Nat64,
            owner: IDL.Text,
            price_decimals: IDL.Nat64,
            index: IDL.Nat64,
            price: IDL.Nat64,
            price_currency: IDL.Text,
            receiver: IDL.Text,
        }),
        Disbursement: IDL.Record({
            to: IDL.Text,
            block_index: IDL.Nat64,
            price_decimals: IDL.Nat64,
            from: IDL.Text,
            subaccount: IDL.Vec(IDL.Nat8),
            error: IDL.Text,
            account: IDL.Text,
            index: IDL.Nat64,
            price: IDL.Nat64,
            price_currency: IDL.Text,
        }),
        Transfer: IDL.Record({
            balance: IDL.Nat64,
            owner: IDL.Text,
            memo: IDL.Vec(IDL.Nat8),
            index: IDL.Nat64,
            receiver: IDL.Text,
        }),
    });
    const HeartbeatData = IDL.Record({
        last: IDL.Nat64,
        yumi_config: YumiConfig,
        cap_events: IDL.Vec(CapEvent),
        sleep: IDL.Nat64,
        ledger_canister_id: IDL.Opt(IDL.Text),
        changed: IDL.Bool,
    });
    const TokenMetadata = IDL.Variant({
        fungible: IDL.Record({
            decimals: IDL.Nat8,
            metadata: IDL.Opt(IDL.Vec(IDL.Nat8)),
            name: IDL.Text,
            symbol: IDL.Text,
        }),
        nonfungible: IDL.Record({ metadata: IDL.Opt(IDL.Vec(IDL.Nat8)) }),
    });
    const MetadataValue = IDL.Variant({
        Nat: IDL.Nat,
        Nat16: IDL.Nat16,
        Nat32: IDL.Nat32,
        Nat64: IDL.Nat64,
        Blob: IDL.Vec(IDL.Nat8),
        Nat8: IDL.Nat8,
        Text: IDL.Text,
    });
    const Metadata = IDL.Record({
        data: IDL.Vec(IDL.Nat8),
        header: IDL.Vec(IDL.Tuple(IDL.Text, MetadataValue)),
    });
    DetailValue.fill(
        IDL.Variant({
            I64: IDL.Int64,
            U64: IDL.Nat64,
            Vec: IDL.Vec(DetailValue),
            Slice: IDL.Vec(IDL.Nat8),
            TokenIdU64: IDL.Nat64,
            Text: IDL.Text,
            True: IDL.Null,
            False: IDL.Null,
            Float: IDL.Float64,
            Principal: IDL.Principal,
        }),
    );
    const Event = IDL.Record({
        time: IDL.Nat64,
        operation: IDL.Text,
        details: IDL.Vec(IDL.Tuple(IDL.Text, DetailValue)),
        caller: IDL.Principal,
    });
    const HttpRequest = IDL.Record({
        url: IDL.Text,
        method: IDL.Text,
        body: IDL.Vec(IDL.Nat8),
        headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    });
    const HttpResponse = IDL.Record({
        body: IDL.Vec(IDL.Nat8),
        headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
        status_code: IDL.Nat16,
    });
    const ListingArgs = IDL.Record({
        token: IDL.Text,
        from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        price: IDL.Opt(IDL.Nat64),
    });
    const MotokoResult_3 = IDL.Variant({ ok: IDL.Null, err: CommonError });
    const MotokoResult_4 = IDL.Variant({
        ok: TokenMetadata,
        err: CommonError,
    });
    const MintArgs = IDL.Record({
        to: User,
        metadata: IDL.Opt(IDL.Vec(IDL.Nat8)),
    });
    const Picture = IDL.Record({
        data: IDL.Vec(IDL.Nat8),
        content_type: IDL.Text,
    });
    const NftMetadataArgsBySlice = IDL.Record({
        no: IDL.Nat32,
        first: IDL.Bool,
        token: IDL.Text,
        data: IDL.Vec(IDL.Nat8),
        finished: IDL.Bool,
        header: IDL.Vec(IDL.Tuple(IDL.Text, MetadataValue)),
    });
    const MotokoResult_5 = IDL.Variant({
        ok: IDL.Vec(IDL.Nat32),
        err: CommonError,
    });
    const MotokoResult_6 = IDL.Variant({
        ok: IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Opt(Listing), IDL.Opt(IDL.Vec(IDL.Nat8)))),
        err: CommonError,
    });
    const TransferArgs = IDL.Record({
        to: User,
        token: IDL.Text,
        notify: IDL.Bool,
        from: User,
        memo: IDL.Vec(IDL.Nat8),
        subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        amount: IDL.Nat,
    });
    const TransferError = IDL.Variant({
        CannotNotify: IDL.Text,
        InsufficientBalance: IDL.Null,
        InvalidToken: IDL.Text,
        Rejected: IDL.Null,
        Unauthorized: IDL.Text,
        Other: IDL.Text,
    });
    const MotokoResult_7 = IDL.Variant({ ok: IDL.Nat, err: TransferError });
    return IDL.Service({
        __get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ['query']),
        acceptCycles: IDL.Func([], [], []),
        allPayments: IDL.Func(
            [],
            [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(IDL.Vec(IDL.Nat8))))],
            ['query'],
        ),
        allSettlements: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat32, Settlement))], ['query']),
        allowance: IDL.Func([AllowanceArgs], [MotokoResult], ['query']),
        approve: IDL.Func([ApproveArgs], [IDL.Bool], []),
        availableCycles: IDL.Func([], [IDL.Nat], ['query']),
        balance: IDL.Func([BalanceArgs], [MotokoResult], ['query']),
        bearer: IDL.Func([IDL.Text], [MotokoResult_1], ['query']),
        calcAccountId: IDL.Func([IDL.Text], [IDL.Text], ['query']),
        calcTokenIdentifier: IDL.Func([IDL.Nat32], [IDL.Text], ['query']),
        clearPayments: IDL.Func([IDL.Principal, IDL.Vec(IDL.Vec(IDL.Nat8))], [], []),
        cronDisbursements: IDL.Func([], [], []),
        cronSettlements: IDL.Func([], [], []),
        details: IDL.Func([IDL.Text], [MotokoResult_2], ['query']),
        extensions: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
        getAllTokens: IDL.Func([], [IDL.Vec(NftView)], ['query']),
        getAllowances: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Principal))], ['query']),
        getDataCertificate: IDL.Func([], [IDL.Opt(IDL.Vec(IDL.Nat8))], ['query']),
        getEntrepotData: IDL.Func([], [EntrepotData], ['query']),
        getHashes: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Nat8)))], ['query']),
        getHeartbeatData: IDL.Func([], [HeartbeatData], ['query']),
        getMetadata: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat32, TokenMetadata))], ['query']),
        getMinter: IDL.Func([], [IDL.Principal], ['query']),
        getMinters: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        getName: IDL.Func([], [IDL.Text], ['query']),
        getNextCapEventId: IDL.Func([], [IDL.Nat64], ['query']),
        getNftMetadata: IDL.Func([IDL.Text, IDL.Nat32], [IDL.Opt(Metadata)], ['query']),
        getNftRarity: IDL.Func([IDL.Text], [IDL.Text], ['query']),
        getProperties: IDL.Func(
            [],
            [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))))],
            ['query'],
        ),
        getRegistry: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Text))], ['query']),
        getSymbol: IDL.Func([], [IDL.Text], ['query']),
        getTemporaryData: IDL.Func([], [IDL.Vec(IDL.Nat8)], ['query']),
        getTokens: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat32, TokenMetadata))], ['query']),
        getTokensByIds: IDL.Func(
            [IDL.Vec(IDL.Nat32)],
            [IDL.Vec(IDL.Tuple(IDL.Nat32, TokenMetadata))],
            ['query'],
        ),
        getTransactionById: IDL.Func([IDL.Nat64], [Event], []),
        http_request: IDL.Func([HttpRequest], [HttpResponse], ['query']),
        initCap: IDL.Func([IDL.Nat64, IDL.Opt(IDL.Principal)], [], []),
        isMaintaining: IDL.Func([], [IDL.Bool], ['query']),
        isMinter: IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
        list: IDL.Func([ListingArgs], [MotokoResult_3], []),
        listings: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat32, Listing, TokenMetadata))], ['query']),
        lock: IDL.Func([IDL.Text, IDL.Nat64, IDL.Text, IDL.Vec(IDL.Nat8)], [MotokoResult_1], []),
        manualHeartbeat: IDL.Func([], [IDL.Opt(IDL.Vec(CapEvent))], []),
        metadata: IDL.Func([IDL.Text], [MotokoResult_4], ['query']),
        mintNFT: IDL.Func([MintArgs], [], []),
        mintNFTsWithoutCap: IDL.Func([User, IDL.Nat32], [], []),
        payments: IDL.Func([], [IDL.Opt(IDL.Vec(IDL.Vec(IDL.Nat8)))], ['query']),
        pendingCronJobs: IDL.Func([], [IDL.Vec(IDL.Nat)], ['query']),
        refreshNftsContent: IDL.Func([IDL.Nat32, IDL.Nat32, IDL.Vec(IDL.Text)], [], []),
        refreshNftsHashes: IDL.Func([IDL.Nat32, IDL.Nat32, IDL.Opt(IDL.Nat32)], [], []),
        removeMinter: IDL.Func([IDL.Principal], [], []),
        setEscrowDelay: IDL.Func([IDL.Nat64], [], []),
        setHeartbeatData: IDL.Func(
            [IDL.Bool, IDL.Nat64, IDL.Opt(IDL.Text), IDL.Nat64],
            [HeartbeatData],
            [],
        ),
        setLedgerCanisterIdOnlyForLocalTest: IDL.Func([IDL.Opt(IDL.Text)], [], []),
        setLogo: IDL.Func([IDL.Opt(Picture)], [], []),
        setMaintaining: IDL.Func([IDL.Bool], [], []),
        setMinter: IDL.Func([IDL.Principal], [], []),
        setName: IDL.Func([IDL.Text], [], []),
        setNextCapEventId: IDL.Func([IDL.Nat64], [], []),
        setNftContent: IDL.Func([IDL.Text, IDL.Opt(IDL.Vec(IDL.Nat8))], [IDL.Bool], []),
        setNftMetadata: IDL.Func([IDL.Text, IDL.Nat32, IDL.Opt(Metadata)], [IDL.Bool], []),
        setNftMetadataBySlice: IDL.Func([NftMetadataArgsBySlice], [IDL.Bool], []),
        setNftRarity: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
        setNftThumbnail: IDL.Func([IDL.Nat32, IDL.Opt(Picture)], [], []),
        setSaleFees: IDL.Func([IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64))], [], []),
        setSymbol: IDL.Func([IDL.Text], [], []),
        setUpdatingPicture: IDL.Func([IDL.Opt(Picture)], [], []),
        setUpdatingPictureBySlice: IDL.Func([Picture, IDL.Bool, IDL.Bool], [], []),
        settle: IDL.Func([IDL.Text], [MotokoResult_3], []),
        settlements: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Text, IDL.Nat64))], ['query']),
        stats: IDL.Func(
            [],
            [IDL.Nat64, IDL.Nat64, IDL.Nat64, IDL.Nat64, IDL.Nat, IDL.Nat, IDL.Nat],
            ['query'],
        ),
        supply: IDL.Func([IDL.Text], [MotokoResult], ['query']),
        toAddress: IDL.Func([IDL.Text, IDL.Nat], [IDL.Text], ['query']),
        tokens: IDL.Func([IDL.Text], [MotokoResult_5], ['query']),
        tokens_ext: IDL.Func([IDL.Text], [MotokoResult_6], ['query']),
        transactions: IDL.Func([], [IDL.Vec(Transaction)], ['query']),
        transfer: IDL.Func([TransferArgs], [MotokoResult_7], []),
        transferWithPrice: IDL.Func(
            [TransferArgs, IDL.Nat64, IDL.Nat64, IDL.Text],
            [MotokoResult_7],
            [],
        ),
        viewDisbursements: IDL.Func([], [IDL.Vec(Disbursement)], ['query']),
    });
};
