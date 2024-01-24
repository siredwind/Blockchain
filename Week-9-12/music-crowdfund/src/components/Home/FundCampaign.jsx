import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import ThankYouMessage from './ThankYouMessage';

// Utils
import { useAccount } from 'wagmi';
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import useContract from '../../utils/hooks/useContract';
import { MusicCrowdfundingFunctions } from '../../utils/constants';
import useCheckAllowance from '../../utils/hooks/useCheckAllowance';
import useApproveTokens from '../../utils/hooks/useApproveTokens';

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure it's above other content
};

const modalStyle = {
    background: '#282c34', // Dark background color
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    color: 'white', // Light text for dark background
    zIndex: 1001
};

const inputStyle = {
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '5px',
    width: 'calc(100% - 20px)', // Full width minus padding
    borderColor: 'black',
    backgroundColor: 'black'
};

const FundCampaign = ({ campaignId, isOpen, onClose, onSubmit }) => {
    const [amount, setAmount] = useState('1');
    const [showThankYou, setShowThankYou] = useState(false);
    const modalRef = useRef();

    const { data: userAccount } = useAccount();

    const { contract: musicCrowdFundingContract } = useContract('MusicCrowdfunding');

    const { allowance } = useCheckAllowance({
        owner: userAccount?.address,
        spender: musicCrowdFundingContract?.address
    });

    const writeApprove = useApproveTokens({
        spender: musicCrowdFundingContract?.address,
        amount: tokens(amount)
    })

    const { write } = useContractWrite({
        ...musicCrowdFundingContract,
        functionName: MusicCrowdfundingFunctions.FUND_CAMPAIGN,
        args: [campaignId, tokens(amount)]
    })

    const handleClose = useCallback(
        (e) => {
            if (modalRef.current === e.target) {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        const keyPress = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', keyPress);
        return () => document.removeEventListener('keydown', keyPress);
    }, [isOpen, onClose]);

    const handleFormSubmit = async (e) => {
        // Prevent the default form submission action
        e.preventDefault();

        if (parseFloat(ethers.utils.formatUnits(allowance, 'ether')) < parseFloat(amount)) {
            // Execute token approval and wait for it to complete
            try {
                const approvalTx = await writeApprove();
                console.log(approvalTx, "@@@@tx")
                if (approvalTx) {
                    // Wait for the approval transaction to be mined
                    await approvalTx.wait(); 
                    console.log("HERE@@@@@")
                    // After approval, execute the fund campaign transaction
                    write?.();
                }
            } catch (error) {
                console.error('Approval failed', error);
                return; // Exit the function if approval fails
            }
        } else {
            // If sufficient allowance is already there, directly execute the fund campaign transaction
            write?.();
        }

        // Close the modal
        onClose();

        setShowThankYou(true);

        // Hide the message after 3 seconds
        setTimeout(() => setShowThankYou(false), 3000);
    };

    const handleChange = (e) => {
        const newAmount = e.target.value;
        setAmount(newAmount); // Update the amount state
        console.log(newAmount, "@@@@newAmount")
    };
    // console.log(amount, "@@@@amount")
    // console.log(amountInWei, "@@@@wei")
    return isOpen ? (
        <div style={modalOverlayStyle} ref={modalRef} onClick={handleClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <form>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Amount (ETH):
                        <input
                            style={inputStyle}
                            type="number"
                            value={amount}
                            onChange={handleChange}
                        />
                    </label>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-12"
                        disabled={!write}
                        onClick={handleFormSubmit}
                    >
                        Fund Artist's Campaign
                    </button>
                </form>
            </div>
            <ThankYouMessage isOpen={showThankYou} onClose={() => setShowThankYou(false)} />
        </div >
    ) : null;
};

FundCampaign.propTypes = {
    campaignId: PropTypes.number.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default FundCampaign;

