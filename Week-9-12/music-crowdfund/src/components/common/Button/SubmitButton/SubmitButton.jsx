import React from "react";
import { Spinner } from "react-bootstrap";

const SubmitButton = ({ name, disabled }) => {
    return (
        <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-400"
            disabled={disabled}
        >
            {disabled ? <Spinner /> : name}
        </button>
    )
}

export default SubmitButton;