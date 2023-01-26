import React from 'react';

export default function App() {
    return (
        <div>
            <h1>I am an App component</h1>
            <button onClick={() => {
                electron.notificationApi.sendNotification('My custom notification')
            }}>Notify</button>
        </div>
    )
}