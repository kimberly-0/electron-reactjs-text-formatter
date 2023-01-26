import React from 'react';
import { Link } from 'react-router-dom';

export default function Options() {
return (
    <div className="options-page">
        <h1>Result page</h1>

        <div className="menu">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/options">Options</Link></li>
            </ul>
        </div>

    </div>
)}