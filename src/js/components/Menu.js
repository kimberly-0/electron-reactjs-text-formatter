import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Menu = ({ steps, currentStepIndex, goTo }) => {

    const pagesActive = [
        true, 
        currentStepIndex >= 1 ? true : false, 
        currentStepIndex >= 2 ? true : false
    ];

    function navigateTo(stepIndex) {
        console.log("CLICK " + stepIndex);

        // On submit for changes? and required fields??

        goTo(stepIndex);
    }

    function buildMenuItems() {
        const menuItems = [];

        for (let i = 0; i < steps.length; i++) {

            menuItems.push(
                <li key={i} className={`${pagesActive[i] ? "active" : ""}`}>
                    <Link onClick={(e) => navigateTo(i)} >
                        {`${i+1}    ${steps[i].props.title}`}
                    </Link>
                </li>
            )

            if (i < steps.length - 1) {
                menuItems.push(
                    <div key={`${i}b`} className={`vertical-progress-line ${pagesActive[i+1] ? "active" : ""}`}></div>
                )
            }
        
        }

        return menuItems;
    }

return(
    <>
        <div className="menu">
            <ul>
                { buildMenuItems() }
            </ul>
        </div>
    </>
)}

export default Menu;