import { useState } from 'react';
import { useContractRead } from 'wagmi';

const useCheckAllowance = ({ owner, spender }) => {
    const [allowance, setAllowance] = useState(0);
    const [error, setError] = useState(null);

    const { contract: TokenContract } = useContractRead('Token');

    const { data, isError } = useContractRead({
        ...TokenContract,
        functionName: 'allowance',
        args: [owner, spender],
    });

    if (data) setAllowance(parseInt(data?.toString()));
    if (isError) setError(isError);

    return { allowance: allowance, error: error };
};

export default useCheckAllowance;