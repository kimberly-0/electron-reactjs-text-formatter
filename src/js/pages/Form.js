import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import useMultiStepForm from '../components/form/useMultiStepForm';
import OptionsForm from "../components/form/Optionsform";
import TextForm from "../components/form/Textform";

const INITIAL_DATA = {
    unformattedText: "",
    source: "",
    columnsOptions: [
        { id: 4, content: 'xxx', columnType: 'yes' }
    ],
    fullTextOptions: [
        { id: 0, columnType: 'gemeente', option: 'waar', selection: 'overal'},
        { id: 1, columnType: 'snelheid', option: 'waar', selection: 'overal'},
        { id: 2, columnType: 'snelheid', option: 'nummers', selection: 0}
    ]
}

let lastUnformattedText = "";

export default function Form() {

    /*
    Manage data
    */

    const [data, setData] = useState(INITIAL_DATA);

    const [gemeenteSelected, setGemeenteSelected] = useState(false);
    const [snelheidSelected, setSnelheidSelected] = useState(false);

    function updateFields(fields) {
        setData(prev => {
            return { ...prev, ...fields }
        })
    }

    function addColumnsToOptionsData(columns) {
        const newColumns = [];
        for (let i = 0; i < columns.length; i++) {
            newColumns.push({ id: i, content: columns[i], columnType: '' });
        }
        // Add detected columns to data to dynamically show in form
        updateFields({columnsOptions: newColumns});
        // Reset full text options data to default
        updateFullTextOptions(0, 'overal');
        updateFullTextOptions(1, 'overal');
        updateFullTextOptions(2, 0);
        // Reset column options selected values to hide full text options
        setGemeenteSelected(false);
        setSnelheidSelected(false);
    }

    function updateColumnType(index, columnType) {
        const newColumnsOptions = [...data.columnsOptions];
        newColumnsOptions[index].columnType = columnType;
        updateFields({columnsOptions: newColumnsOptions});

        // Show or hide additional full text options based on column options selected
        setGemeenteSelected(data.columnsOptions.filter(e => e.columnType === 'gemeente').length > 0 ? true : false);
        setSnelheidSelected(data.columnsOptions.filter(e => e.columnType === 'snelheid').length > 0 ? true : false);
    }

    function updateFullTextOptions(index, selection) {
        const newFullTextOptions = [...data.fullTextOptions];
        newFullTextOptions[index].selection = selection;
        updateFields({fullTextOptions: newFullTextOptions});
    }

    /*
    Implement form steps and content
    */

    const { steps, currentStepIndex, stepTitle, stepContent, isFirstStep, isLastStep, back, next} = useMultiStepForm([
        <TextForm 
            {...data} 
            title={'Tekst invoeren'} 
            updateFields={updateFields} 
        />, 
        <OptionsForm 
            {...data} 
            title={'Opties selecteren'} 
            updateColumnType={updateColumnType}
            updateFullTextOptions={updateFullTextOptions}
            snelheidSelected={snelheidSelected} 
            gemeenteSelected={gemeenteSelected} 
            setGemeenteSelected={setGemeenteSelected} 
            setSnelheidSelected={setSnelheidSelected} 
        />
    ]);

    /*
    Handle navigation and form submission
    */

    const ipcRenderer = (window).ipcRenderer;
    const navigate = useNavigate(); // TO DELETE !!!!!!!!!!!!!

    function onSubmit(e) {
        e.preventDefault();

        if (!isLastStep) {

            // If unformattedText has changed, update columns and full text options
            if (isFirstStep && lastUnformattedText !== data.unformattedText) { 
                ipcRenderer.send('detectColumns', {data})
                ipcRenderer.on('columnsDetected', (args) => {
                    addColumnsToOptionsData(args.columns);
                    lastUnformattedText = data.unformattedText;
                })
            }

            return next();

        } else {

            // Send text to main process
            ipcRenderer.send('formatText', {data})

            // Get formatted text from main process 
            // + navigate to Results page
            ipcRenderer.on('textFormatted', (formattedText) => {                
                navigate("../result", {
                    state: {
                        formattedText: formattedText // MAKE PART OF MULTI STEP FORM !!!!!!!!!!!!!
                    }
                })
            })

            console.log("Succesful submit"); // REPLACE WITH SENCIND DATA TO MAIN PROCESS !!!!!
        } 
    }

return (
    <div className="form-page page">

        <h1 className="header-title">{stepTitle}</h1>

        <form id="text-form" onSubmit={onSubmit}>

            {stepContent}

            <div className="buttonsContainer">
                {!isFirstStep && (<button type="button" onClick={back}>Terug</button>)}
                <button type="submit">{isLastStep ? "Verwerk" : "Volgende" }</button>
            </div>
        </form>

    </div>
)}