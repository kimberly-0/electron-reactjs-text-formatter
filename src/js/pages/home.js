import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import Menu from '../components/Menu';

const Home = () => {

    const [text, setText] = useState('');
    const navigate = useNavigate();
    const ipcRenderer = (window).ipcRenderer;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(text); // to delete later
        ipcRenderer.send('submit:text', text)
        // navigate("../options");
    }

return (
    <div className="home-page">
        <h1>Home page</h1>

        <form id="text-form" onSubmit={handleSubmit}>
            <label>Tekst:</label>
            <textarea 
                name="text" 
                value={text} 
                onChange ={(e) => setText(e.target.value)}
                required 
            />

            <button id="text-form-submit-button" type="submit">Volgende</button> 
        </form> 

        <Menu />

    </div>
)}

export default Home;