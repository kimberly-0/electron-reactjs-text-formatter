import { useState } from 'react';
import { toast } from 'react-toastify';

const alertSuccess = (message) => toast.success(message, {
    toastId: 'success1',
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
});

const alertError = (message) => toast.error(message, {
    toastId: 'error1',
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
});

export default function useMultiStepForm( steps, data, lastUnformattedText, lastSource, addColumnsToOptionsData, updateFields ) {

    const ipcRenderer = (window).ipcRenderer;

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    let isFirstStep = currentStepIndex === 0;
    let isLastStep = currentStepIndex === steps.length - 1;

    function onSubmit(e) {
        e.preventDefault();
        return next();
    }

    function next() {

        if (isFirstStep && (lastUnformattedText !== data.unformattedText || lastSource !== data.source)) {
            detectColumns();
        }

        setCurrentStepIndex(i => {
            if (i >= steps.length - 1) return i;
            return i + 1
        })
    }

    function back() {
        setCurrentStepIndex(i => {
            if (i <= 0) return i;
            return i - 1
        })
    }

    function goTo(index) {
        if (isFirstStep && (lastUnformattedText !== data.unformattedText || lastSource !== data.source)) {
            detectColumns();
        }

        if (index === 2) {
           return formatText();
        }
        
        setCurrentStepIndex(index);
    }

    function detectColumns() {
        ipcRenderer.send('detectColumns', {data})
        ipcRenderer.on('columnsDetected', (args) => {
            addColumnsToOptionsData(args.columns);
        })
    }

    function formatText() {
        ipcRenderer.send('formatText', {data})

        ipcRenderer.on('displayError', (errorMessage) => {
            alertError(errorMessage);
        })

        ipcRenderer.on('textFormatted', (formattedText) => {  
            updateFields({formattedText: formattedText});
            return next();
        })
    }

    function copy() {
        ipcRenderer.send('copy:result', data.formattedText)
        ipcRenderer.on('copy:done', () => {
            alertSuccess("Gekopiëerd");
        })
    }

    function startOver() {
        updateFields({unformattedText: ""});
        updateFields({source: ""});
        updateFields({columnsOptions: []});
        updateFields({fullTextOptions: [
            { id: 0, columnType: 'naam', option: 'land', selection: 'BE'},
            { id: 1, columnType: 'gemeente', option: 'waar', selection: 'overal'},
            { id: 2, columnType: 'snelheid', option: 'waar', selection: 'overal'},
            { id: 3, columnType: 'snelheid', option: 'nummers', selection: 0}
        ]});
        updateFields({formattedText: ""});

        goTo(0);
    }

    return {
        currentStepIndex,
        stepTitle: steps[currentStepIndex].props.title,
        stepContent: steps[currentStepIndex],
        steps,
        isFirstStep,
        isLastStep,
        onSubmit,
        next, 
        back,
        goTo,
        formatText,
        copy,
        startOver
    }

}