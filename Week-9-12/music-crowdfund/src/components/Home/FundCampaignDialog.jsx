import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';

// Components
import ThankYouMessage from './ThankYouMessage';

// Redux
import { useDispatch, useSelector } from 'react-redux';

// Store
import { selectMC, selectProvider, selectToken } from '../../store/selectors';
import { fundCampaign } from '../../store/interactions';

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

const FundCampaignDialog = ({ campaignId, isOpen, onClose }) => {
    const [amount, setAmount] = useState('1');
    const [showThankYou, setShowThankYou] = useState(false);
    const modalRef = useRef();

    const dispatch = useDispatch();

    const provider = useSelector(selectProvider);
    const mc = useSelector(selectMC);
    const token = useSelector(selectToken);

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

        // Fund campaign
        fundCampaign(
            provider,
            mc,
            token,
            campaignId,
            tokens(amount),
            dispatch
        );

        // Close the modal
        onClose();

        setShowThankYou(true);

        // Hide the message after 3 seconds
        setTimeout(() => setShowThankYou(false), 3000);
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
                        Amount (DAPP): <input
                            style={inputStyle}
                            type="number"
                            value={amount}
                            onChange={handleChange}
                        />
                    </label>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-12"
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

FundCampaignDialog.propTypes = {
    campaignId: PropTypes.number.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default FundCampaignDialog;

