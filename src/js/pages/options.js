import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import Header from '../components/Header';

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
                <div className="select-field-container" key={i}>
                    <label className="options-form__label">{columns[i]}</label>
                    <select
                        className="options-form__selectbox"
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
        <Header />

        {/* <h5>Voorbeeld: { columns.join(' ') }</h5> */}

        <h5>Selecteer opties</h5>

        <form id="options-form" onSubmit={handleSubmit}>

            { buildColumnOptions() } {/* Select field for each column */}

            <button className="options-form__button" type="submit">Verwerk</button> 
        </form> 

    </div>
)}

export default Options;