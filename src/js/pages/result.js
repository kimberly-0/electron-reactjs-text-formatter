import React from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Result = () => {

    const navigate = useNavigate();

    // Data that was sent from Options page
    const location = useLocation();
    let formattedText = location.state.formattedText;

    // Result - form data
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
        draggable: false,
        progress: undefined,
        theme: "light",
    });

return (
    <div className="result-page page">
        
        <h1 className="header-title">Resultaat</h1>

        <form id="result-form" onSubmit={copyValue}>

            <label className="result-form__label">Opgemaakte uitslag:</label>
            <textarea 
                className="result-form__textfield"
                name="result" 
                value={result} 
                onChange ={(e) => setResult(e.target.value)}
                spellCheck="false"
                required 
            />

            <button className="result-form__button" type="submit">Kopiëer</button> 
            <button className="start-again__button" onClick={() => {navigate("../")}}>Begin opnieuw</button> 
        </form> 

        <ToastContainer />

    </div>
)}

export default Result;