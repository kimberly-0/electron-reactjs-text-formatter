import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
return (
    <div className="home-page">
        <h1>Home page</h1>

        <button onClick={()=> {
            electron.notificationApi.sendNotification('My custom notification')
            }}>Notify</button>

        <div className="menu">
            <ul>
                <li><Link to="/options">Options</Link></li>
                <li><Link to="/result">Result</Link></li>
            </ul>
        </div>

    </div>
)}