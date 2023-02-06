import React from 'react';

export default function ResultForm({ formattedText, updateFields }) {
    return (
        <>
            <label>Opgemaakte uitslag:</label>
            <textarea 
                value={formattedText} 
                onChange={(e) => updateFields({formattedText: e.target.value})}
                spellCheck="false"
            />
        </>
    )
}