import { useState, useEffect } from "react";
import { useNetwork } from "wagmi";

// ABIs 
import MusicCrowdfunding_ABI from "../../abis/MusicCrowdfunding.json";

// Config
import config from "../../config.json"

const useMusicCrowdfundingContract = () => {
    const { chain } = useNetwork();

    const [contract, setContract] = useState({
        address: '0x',
        abi: ''
    });

    useEffect(() => {
        const musicCrowdFundingContract = {
            address: config[chain.id].mc.address,
            abi: MusicCrowdfunding_ABI,
        }

        setContract(musicCrowdFundingContract);
    }, [chain.id, MusicCrowdfunding_ABI])

    return contract;
}

export default useMusicCrowdfundingContract;