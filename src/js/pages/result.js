import React from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import Menu from '../components/Menu';


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

        console.log(typeof result);
        console.log(result);

        // Send value of text field to main process
        ipcRenderer.send('copy:result', result)

        // Catch the copy:done event
        ipcRenderer.on('copy:done', () => {
            // alertSucces('Gekopiëerd');
            console.log('Gekopiëerd');
        })
    }

return (
    <div className="result-page">
        <h1>Result page</h1>

        <form id="result-form" onSubmit={copyValue}>

            <label>Resultaat:</label>
            <textarea 
                name="result" 
                value={result} 
                onChange ={(e) => setResult(e.target.value)}
                required 
            />

            <button id="result-form-copy-button" type="submit">Kopiëer</button> 
        </form> 

        <Menu />

    </div>
)}

export default Result;