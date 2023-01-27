import React from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import Menu from '../components/Menu';


const Result = () => {

    // Data that was sent from Options page
    const location = useLocation();
    let formattedText = location.state.formattedText;

return (
    <div className="options-page">
        <h1>Result page</h1>

        <h5>Formatted text: { formattedText }</h5>

        <Menu />

    </div>
)}

export default Result;