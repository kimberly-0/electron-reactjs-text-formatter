import React from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Result = () => {

    // Data that was sent from Options page
    const location = useLocation();
    let formattedText = location.state.formattedText;

    // Result form data
    const [result, setResult] = useState(formattedText);

    /*
    Handle form submit (copy to clipboard)
    */
    const copyValue = (e) => {
        // Prevent page from refreshing
        e.preventDefault();

        // Send value of text field to main process
        ipcRenderer.send('copy:result', result)

        // Catch the copy:done event
        ipcRenderer.on('copy:done', () => {
            alertSuccess("Gekopiëerd");
        })
    }

    // Show success alert
    const alertSuccess = (message) => toast.success(message, {
        toastId: 'success1',
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

return (
    <div className="result-page">
        <h1>Result page</h1>

        <form id="result-form" onSubmit={copyValue}>

            <label>Resultaat:</label>
            <textarea 
                name="result" 
                value={result} 
                onChange ={(e) => setResult(e.target.value)}
                spellCheck="false"
                required 
            />

            <button id="result-form-copy-button" type="submit">Kopiëer</button> 
        </form> 

        <div className="start-again-button-container">
            <Link to="/">Begin opnieuw</Link>
        </div>

        <ToastContainer />

    </div>
)}

export default Result;