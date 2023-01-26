import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
return (
    <div className="home-page">
        <h1>I am an App component</h1>
        <button onClick={()=> {
            electron.notificationApi.sendNotification('My custom notification')
            }}>Notify</button>

        <Link to="/options">Options</Link>

    </div>
)}