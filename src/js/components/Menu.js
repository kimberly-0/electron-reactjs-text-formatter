import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Menu = () => {

    const location = useLocation();

    // let page_1_home = true;
    let page_2_options_active = false;
    let page_3_result_active = false;

    if (location.pathname === "/options") {
        page_2_options_active = true;
    } else if (location.pathname === "/result") {
        page_2_options_active = true;
        page_3_result_active = true;
    }
   
    /*
    Change this to dynamic based on steps in the form
        get title
        get whether index is currentindex
        get link
    */

return(
    <>
        <div className="menu">
            <ul>
                <li className="active"><Link to="/">1    Tekst invoeren</Link></li>

                <div className={`vertical-progress-line ${page_2_options_active ? "active" : ""}`}></div>

                <li className={`${page_2_options_active ? "active" : ""}`}><Link to="/options">2    Opties selecteren</Link></li>

                <div className={`vertical-progress-line ${page_3_result_active ? "active" : ""}`}></div>

                <li className={`${page_3_result_active ? "active" : ""}`}><Link to="/result">3    Resultaat</Link></li>
            </ul>
        </div>
    </>
)}

export default Menu;