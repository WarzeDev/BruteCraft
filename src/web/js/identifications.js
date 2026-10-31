import { translateMappings } from "../../brute/ids.js";

export const identifications = Object.keys(translateMappings).filter(id => {
    return !id.includes('Durability') &&
    !id.includes('Duration') &&
    !id.includes('Effectiveness') &&
    !id.includes('Cost') &&
    !id.startsWith('Req') &&
    !['Charges', 'Combat Level', 'Weaken Enemy', 'Slow Enemy', 'Soul Point Regen'].includes(id)
});

identifications.forEach((id) => {
    const inputSuggestion = document.createElement('option');
    inputSuggestion.value = id;
    inputSuggestion.text = id;
    inputSuggestion.innerText = id;

    const dropdownItemContainer = document.getElementById('identificationsDropdownList');
    dropdownItemContainer.appendChild(inputSuggestion.cloneNode(true));

    const inputSuggestionContainer = document.getElementById('identificationsInputList');
    inputSuggestionContainer.appendChild(inputSuggestion.cloneNode(true));
});