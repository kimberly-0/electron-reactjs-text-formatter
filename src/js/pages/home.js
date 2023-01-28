import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import Header from '../components/Header';

const Home = () => {

    // Text form data
    const [text, setText] = useState('');
    const [source, setSource] = useState('');

    /*
    Handle form submit
    */
    const navigate = useNavigate();
    const ipcRenderer = (window).ipcRenderer;
    const handleSubmit = (e) => {
        // Prevent page from refreshing
        e.preventDefault();

        // Send text to main process
        ipcRenderer.send('submit:text', {text, source})

        // Get first line columns from main process 
        // + navigate to Options page
        ipcRenderer.on('columns:detected', (columns) => {
            navigate("../options", {
                state: {
                    text: text,
                    source: source,
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

            <div className="select-field-container">
                <label className="text-form__label">Bron van uitslag:</label>
                <select
                    className="text-form__selectbox"
                    id="source"
                    value ={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                >
                    <option disabled value={""}> -- selecteer -- </option>
                    <option value={"kbdb"}>KBDB</option>
                    <option value={"compuclub"}>Compuclub</option>
                </select>
            </div>

            <button className="text-form__button" type="submit">Volgende</button> 
        </form> 

    </div>
)}

export default Home;