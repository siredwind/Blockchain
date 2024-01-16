import PropTypes from 'prop-types';

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

const ThankYouMessage = ({ isOpen, onClose }) => {
    return isOpen ? (
        <div style={modalOverlayStyle}>
            <div style={modalStyle} onClick={onClose}>
                <div>Thank you for the support!</div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    ) : null;
}

ThankYouMessage.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ThankYouMessage;