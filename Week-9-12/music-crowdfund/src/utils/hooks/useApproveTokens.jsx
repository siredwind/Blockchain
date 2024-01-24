import { useContractWrite } from 'wagmi';
import useContract from './useContract';

const useApproveTokens = ({ spender, amount }) => {
    const { contract: tokenContract } = useContract('Token');

    const { write, isLoading, isError } = useContractWrite({
        ...tokenContract,
        functionName: 'approve',
        args: [spender, amount],
    });

    return write;
};

export default useApproveTokens;