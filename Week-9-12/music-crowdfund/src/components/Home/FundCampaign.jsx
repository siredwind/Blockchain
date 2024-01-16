import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import ThankYouMessage from './ThankYouMessage';

// Utils
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import useMusicCrowdfundingContract from '../../utils/hooks/useMusicCrowdfundingContract';
import { MusicCrowdfundingFunctions } from '../../utils/constants';

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
    const [amountInWei, setAmountInWei] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false);
    const modalRef = useRef();

    const musicCrowdFundingContract = useMusicCrowdfundingContract();

    const { write } = useContractWrite({
        ...musicCrowdFundingContract,
        functionName: MusicCrowdfundingFunctions.FUND_CAMPAIGN,
        args: [campaignId, amountInWei]
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
        setAmountInWei(ethers.utils.parseUnits(amount, 'ether'))
    }, [amount])

    useEffect(() => {
        const keyPress = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', keyPress);
        return () => document.removeEventListener('keydown', keyPress);
    }, [isOpen, onClose]);

    const handleFormSubmit = (e) => {
        e.preventDefault();  // Prevent the default form submission action

        // Assuming write is a function that triggers the smart contract call
        write?.();

        onSubmit(amountInWei); // Handle the form submission
        onClose(); // Close the modal

        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 3000); // Hide the message after 3 seconds
    };

    const handleChange = (e) => {
        const newAmount = e.target.value;
        setAmount(newAmount); // Update the amount state
    };

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

