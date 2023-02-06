import React from 'react';

export default function TextForm({ unformattedText, source, updateFields }) {
    return (
        <>
            <label>Onopgemaakte uitslag:</label>
            <textarea 
                value={unformattedText} 
                onChange={(e) => updateFields({unformattedText: e.target.value})}
                spellCheck="false"
                required 
            />

            <div className="select-field-container">
                <label>Bron van uitslag:</label>
                <select
                    value ={source}
                    onChange={(e) => updateFields({source: e.target.value})}
                    required
                >
                    <option disabled value={""}> -- selecteer -- </option>
                    <option value={"kbdb"}>KBDB</option>
                    <option value={"compuclub"}>Compuclub</option>
                </select>
            </div>
        </>
    )
}