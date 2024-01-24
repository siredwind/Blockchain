import { useState, useEffect } from "react";
import { useNetwork } from "wagmi";

// ABIs 
import MusicCrowdfunding_ABI from "../../abis/MusicCrowdfunding.json";
import Token_ABI from "../../abis/Token.json";

// Config
import config from "../../config.json"

const useContract = (contractName) => {
    const { chain } = useNetwork();

    const [contract, setContract] = useState({
        address: '0x',
        abi: ''
    });

    const [error, setError] = useState("");

    useEffect(() => {
        if (chain && chain.id) {
            if (contractName.toString().toLowerCase() === 'token') {
                const tokenContract = {
                    address: config[chain?.id].token.address,
                    abi: Token_ABI,
                }

                setContract(tokenContract);
            }
            else if (contractName.toString().toLowerCase() === 'musiccrowdfunding') {
                const musicCrowdFundingContract = {
                    address: config[chain?.id].mc.address,
                    abi: MusicCrowdfunding_ABI,
                }

                setContract(musicCrowdFundingContract);
            }
            else {
                setError(`No contract found with name ${contractName}.`);
            }
            
        }
        else {
            setError(`Current chain not available.`);
        }
    }, [chain, MusicCrowdfunding_ABI])

    return { contract: contract, error: error };
}

export default useContract;