import { useState } from 'react';

export default function useMultiStepForm(steps) {

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    function next() {
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
        setCurrentStepIndex(index);
    }

    return {
        currentStepIndex,
        stepTitle: steps[currentStepIndex].props.title,
        stepContent: steps[currentStepIndex],
        steps,
        isFirstStep: currentStepIndex === 0,
        isLastStep: currentStepIndex === steps.length - 1,
        goTo,
        next, 
        back
    }

}