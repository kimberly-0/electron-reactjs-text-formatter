import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import Header from '../components/Header';

const Home = () => {

    // Text form data
    const [text, setText] = useState('');

    /*
    Handle form submit
    */
    const navigate = useNavigate();
    const ipcRenderer = (window).ipcRenderer;
    const handleSubmit = (e) => {
        // Prevent page from refreshing
        e.preventDefault();

        // Send text to main process
        ipcRenderer.send('submit:text', text)

        // Get first line columns from main process 
        // + navigate to Options page
        ipcRenderer.on('columns:detected', (columns) => {
            navigate("../options", {
                state: {
                    text: text,
                    columns: columns
                }
            })
        })
    }

return (
    <div className="home-page">
        <Header />

        <form id="text-form" onSubmit={handleSubmit}>
            <label className="text-form__label">Onopgemaakte uitslag:</label>
            <textarea 
                className="text-form__textfield"
                name="text" 
                value={text} 
                onChange ={(e) => setText(e.target.value)}
                spellCheck="false"
                required 
            />

            <button className="text-form__button" type="submit">Volgende</button> 
        </form> 

    </div>
)}

export default Home;