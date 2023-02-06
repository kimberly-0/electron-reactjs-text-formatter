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

export default function useMultiStepForm( steps, data, lastUnformattedText, addColumnsToOptionsData, updateFields ) {

    const ipcRenderer = (window).ipcRenderer;

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    let isFirstStep = currentStepIndex === 0;
    let isLastStep = currentStepIndex === steps.length - 1;

    function detectColumns() {
        ipcRenderer.send('detectColumns', {data})
        ipcRenderer.on('columnsDetected', (args) => {
            addColumnsToOptionsData(args.columns);
        })
    }

    function formatText() {
        ipcRenderer.send('formatText', {data})
        ipcRenderer.on('textFormatted', (formattedText) => {  
            updateFields({formattedText: formattedText});
        })
    }

    function next() {
        if (isFirstStep && lastUnformattedText !== data.unformattedText) detectColumns();

        if (currentStepIndex === 1) formatText();

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
        if (isFirstStep && lastUnformattedText !== data.unformattedText) detectColumns();

        if (index === 2) formatText();
        
        setCurrentStepIndex(index);
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
            { id: 0, columnType: 'gemeente', option: 'waar', selection: 'overal'},
            { id: 1, columnType: 'snelheid', option: 'waar', selection: 'overal'},
            { id: 2, columnType: 'snelheid', option: 'nummers', selection: 0}
        ]});
        updateFields({formattedText: ""});

        goTo(0);
    }

    function onSubmit(e) {
        e.preventDefault();
        return next();
    }

    return {
        currentStepIndex,
        stepTitle: steps[currentStepIndex].props.title,
        stepContent: steps[currentStepIndex],
        steps,
        isFirstStep,
        isLastStep,
        next, 
        back,
        goTo,
        onSubmit,
        copy,
        startOver
    }

}