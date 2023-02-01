import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

const Options = () => {

    // Data that was sent from Home page
    const location = useLocation();
    const text = location.state.text;
    const columns = location.state.columns;
    const source = location.state.source;

    // Options form data
    const [columnOptions, setColumnOptions] = useState([]);
    const [fullTextOptionsGemeente, setFullTextOptionsGemeente] = useState("overal");
    const [fullTextOptionsSnelheid, setFullTextOptionsSnelheid] = useState("overal");
    const [fullTextOptionsSnelheidDigits, setFullTextOptionsSnelheidDigits] = useState(0);

    // Show additional full text options
    const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
    const [gemeenteSelected, setGemeenteSelected] = useState(false);
    const [snelheidSelected, setSnelheidSelected] = useState(false);

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
                <div id={"select-field-container-" + i} className="select-field-container" key={i}>
                    <label className="options-form__label">{columns[i]}</label>
                    <div className="horizontal-line"></div>
                    <select
                        className="options-form__selectbox"
                        id={"column-" + i}
                        value={columnOptions[i]}
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
        Build form options Gemeente (conditional based on whether 'gemeente' is selected)
    */
    function buildFullTextOptionsGemeente() {
        return (
            <div className="full-text-option-container full-text-options__gemeente">
                <h4 className="options-form__full-text-options__subtitle">Gemeente</h4>
                <label className="full-text-options__gemeente__label">Waar:</label>
                <select
                    className="full-text-options__gemeente__selectbox"
                    value={fullTextOptionsGemeente}
                    onChange={(e) => setFullTextOptionsGemeente(e.target.value)}
                >
                    <option value={"overal"}>overal</option>
                    <option value={"eerste"}>alleen eerste</option>
                </select>
            </div>
        );
    }

    /*
    Build form options Snelheid (conditional based on whether 'snelheid' is selected)
    */
    function buildFullTextOptionsSnelheid() {
        return (
            <div className="full-text-option-container full-text-options__snelheid">
                <h4 className="options-form__full-text-options__subtitle">Snelheid</h4>

                <label className="full-text-options__snelheid__label">Waar:</label>
                <select
                    className="full-text-options__snelheid__selectbox"
                    value={fullTextOptionsSnelheid}
                    onChange={(e) => setFullTextOptionsSnelheid(e.target.value)}
                >
                    <option value={"overal"}>overal</option>
                    <option value={"eerste"}>alleen eerste</option>
                </select>

                <label className="full-text-options__snelheid-digits__label">Cijfers achter de komma:</label>
                <input className="full-text-options__snelheid-digits__input" type="number" name="snelheid-digits" min="0" max="4" value={fullTextOptionsSnelheidDigits} onChange={(e) => setFullTextOptionsSnelheidDigits(e.target.value)}></input>
            </div>
        );
    }

    /*
    Update select field values and state on change
    */
    function handleChange(e, i) {
        let data = [...columnOptions];
        data[i] = e.target.value;
        setColumnOptions(data);

        // Show or hide additional full text options based on what is selected
        if (data.includes("gemeente") || data.includes("snelheid")) {
            setShowAdditionalOptions(true);
            data.includes("gemeente") ? setGemeenteSelected(true) : setGemeenteSelected(false);
            data.includes("snelheid") ? setSnelheidSelected(true) : setSnelheidSelected(false);
        } else {
            setShowAdditionalOptions(false);
        }
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
        ipcRenderer.send('submit:options', {
            text, 
            source, 
            columnOptions,
            fullTextOptionsGemeente,
            fullTextOptionsSnelheid,
            fullTextOptionsSnelheidDigits
        })

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
    <div className="options-page page">
        
        <h1 className="header-title">Opties selecteren</h1>

        <form id="options-form" onSubmit={handleSubmit}>

            <div className="options-form__container">

                <div className="options-form__container__column-options">
                    { buildColumnOptions() } {/* Select field for each column */}
                </div>

                {showAdditionalOptions &&
                    <div className="options-form__container__full-text-options">

                        {/* Als gemeente geselecteerd is -> overal of alleen eerste */}
                        {gemeenteSelected && buildFullTextOptionsGemeente()}

                        {/* Als snelheid geselecteerd is -> overal of alleen eerste + hoeveel cijvers achter de komma */}
                        {snelheidSelected && buildFullTextOptionsSnelheid()}

                    </div>
                }

            </div>

            <button className="options-form__button" type="submit">Verwerk</button> 
        </form> 

    </div>
)}

export default Options;