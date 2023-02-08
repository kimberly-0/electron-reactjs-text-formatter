import React from 'react';

export default function OptionsForm({ columnsOptions, fullTextOptions, updateColumnType, updateFullTextOptions, naamSelected, gemeenteSelected, snelheidSelected }) {
    return (
        <div className="options-form__container">

            <div className="options-form__container__column-options">

                {columnsOptions.map((column, index) => (
                    <div key={column.id} className="select-field-container">
                        <label className="options-form__label">{column.content}</label>
                        <div className="horizontal-line"></div>
                        <select
                            className="options-form__selectbox"
                            id={column.id}
                            value={column.columnType}
                            onChange={(e) => updateColumnType(index, e.target.value)}
                        >
                            <option value={""}> -- verwijder -- </option>
                            <option value={"plaats"}>plaats</option>
                            <option value={"naam"}>naam</option>
                            <option value={"gemeente"}>gemeente</option>
                            <option value={"snelheid"}>snelheid</option>
                        </select>
                    </div>
                ))}

            </div>


            {(gemeenteSelected || snelheidSelected) && <div className="options-form__container__full-text-options">

                {/* {naamSelected && <div className="full-text-option-container full-text-options__naam">
                    <h4 className="options-form__full-text-options__subtitle">Naam</h4>
                    <label className="full-text-options__naam__label">Land:</label>
                    <select
                        className="full-text-options__naam__selectbox"
                        value={fullTextOptions[0].selection}
                        onChange={(e) => updateFullTextOptions(0, e.target.value)}
                    >
                        <option value={"BE"}>BE</option>
                        <option value={"NL"}>NL</option>
                    </select>
                </div>} */}

                {gemeenteSelected && <div className="full-text-option-container full-text-options__gemeente">
                    <h4 className="options-form__full-text-options__subtitle">Gemeente</h4>
                    <label className="full-text-options__gemeente__label">Waar:</label>
                    <select
                        className="full-text-options__gemeente__selectbox"
                        value={fullTextOptions[1].selection}
                        onChange={(e) => updateFullTextOptions(1, e.target.value)}
                    >
                        <option value={"overal"}>overal</option>
                        <option value={"eerste"}>alleen eerste</option>
                    </select>
                </div>}

                {snelheidSelected && <div className="full-text-option-container full-text-options__snelheid">
                    <h4 className="options-form__full-text-options__subtitle">Snelheid</h4>

                    <label className="full-text-options__snelheid__label">Waar:</label>
                    <select
                        className="full-text-options__snelheid__selectbox"
                        value={fullTextOptions[2].selection}
                        onChange={(e) => updateFullTextOptions(2, e.target.value)}
                    >
                        <option value={"overal"}>overal</option>
                        <option value={"eerste"}>alleen eerste</option>
                    </select>

                    <label className="full-text-options__snelheid-digits__label">Cijfers achter de komma:</label>
                    <input className="full-text-options__snelheid-digits__input" type="number" name="snelheid-digits" min="0" max="4" value={fullTextOptions[3].selection} onChange={(e) => updateFullTextOptions(3, e.target.value)}></input>
                </div>}

            </div>}
            
        </div>
    )
}