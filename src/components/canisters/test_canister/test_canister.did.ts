export const idlFactory = ({ IDL }: any) => {
    return IDL.Service({
        __get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ['query']),
        exchange: IDL.Func([IDL.Nat, IDL.Nat], [IDL.Nat, IDL.Nat], ['query']),
        getName: IDL.Func([], [IDL.Text], ['query']),
        hello: IDL.Func([IDL.Text], [IDL.Text], []),
        negative: IDL.Func([IDL.Int], [IDL.Int], ['query']),
        now: IDL.Func([], [IDL.Nat64], ['query']),
        setName: IDL.Func([IDL.Text], [], ['query']),
    });
};
