import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

const Options = () => {

    // Data that was sent from Home page
    const location = useLocation();
    let columns = location.state.columns;
    const text = location.state.text;

    // Options form data
    const [columnOptions, setColumnOptions] = useState([]);

    /*
    Set initial select values 
    (with useEffect to update state only one time when the component mounts)
    */
    useEffect(() => {
        let data = [...columnOptions];
        for (let i = 0; i < columns.length; i++) {
            data[i] = "";
        }
        setColumnOptions(data);
    }, [])

    /*
    Build form components for each column
    */
    function buildColumnOptions() {
        
        const arr = [];
        for (let i = 0; i < columns.length; i++) {

            arr.push(
                <div className="column-option-container" key={i}>
                    <label>{columns[i]}</label>
                    <select
                        id={"column-" + i}
                        value = {columnOptions[i]}
                        onChange={(e) => handleChange(e, i)}
                        // required
                    >
                        <option value={""}> -- verwijder -- </option>
                        <option value={"plaats"}>plaats</option>
                        <option value={"naam"}>naam</option>
                        <option value={"gemeente"}>gemeente</option>
                        <option value={"snelheid"}>snelheid</option>
                    </select>
                </div>
            );
        }
        return arr;
    }

    /*
    Update select field values and state on change
    */
    function handleChange(e, i) {
        let data = [...columnOptions];
        data[i] = e.target.value;
        console.log('data: ' + data);
        setColumnOptions(data);
    }

    /*
    Handle form submit
    */
    const navigate = useNavigate();
    const ipcRenderer = (window).ipcRenderer;
    const handleSubmit = (e) => {
        // Prevent page from refreshing
        e.preventDefault();

        // console.log("text: " + text); // TO DELETE LATER
        console.log("column options: " + columnOptions); // TO DELETE LATER

        // Send text to main process
        ipcRenderer.send('submit:options', {text, columnOptions})

        // Get formatted text from main process 
        // + navigate to Results page
        ipcRenderer.on('text:formatted', (formattedText) => {
            navigate("../result", {
                state: {
                    formattedText: formattedText
                }
            })
        })
    }

return (
    <div className="options-page">
        <h1>Options page</h1>

        <h5>Columns: { columns }</h5>

        <form id="options-form" onSubmit={handleSubmit}>

            { buildColumnOptions() } {/* Select field for each column */}

            <button id="options-form-submit-button" type="submit">Formateer</button> 
        </form> 

    </div>
)}

export default Options;