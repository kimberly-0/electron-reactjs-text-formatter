import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
return(
    <>
        <div className="spacer"></div>

        <div className="menu">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/options">Options</Link></li>
                <li><Link to="/result">Result</Link></li>
            </ul>
        </div>
    </>
)}

export default Menu;