import { translateMappings } from "../../brute/ids.js";
import { identifications } from "./identifications.js";
import { options } from './options.js';
import { updateBannedIngList } from "./bannedingredients.js";

// Returns true if it was a valid scoring item
function addItemToScoringSystem(id) {
    if (!identifications.includes(id)) return false;

    const shortId = translateMappings[id];

    // Item already exists in the scoring system
    if (options.scoringSystem[shortId]) return false;

    // Score "1" is the default
    options.scoringSystem[shortId] = 1;

    const superContainer = document.createElement('div');
    superContainer.classList.add('scoringItemContainer');

    const container = document.createElement('div');
    container.classList.add('scoringItem');
    superContainer.appendChild(container);
    
    const idName = document.createElement('span');
    idName.textContent = id;
    container.appendChild(idName);

    const containerRight = document.createElement('div');
    containerRight.classList.add('scoringItemRight');
    container.appendChild(containerRight);

    const idLimitButton = document.createElement('button');
    idLimitButton.innerText = '[]';
    idLimitButton.dataset.tooltip = 'Edit Custom Limits';

    options.customLimits[shortId] = {
        min: null,
        max: null,
        inc: null,
    };

    const idValue = document.createElement('input');
    idValue.type = 'number';

    idLimitButton.addEventListener('click', () => {
        const customLimitContainer = document.createElement('div');
        customLimitContainer.classList.add('customLimitContainer');

        idLimitButton.remove();

        const customLimits = [
            {
                label: 'Minimum',
                tooltip: `
                Minimum stat must be <span class="green">greater than</span> this value.<br>
                If not, the recipe will receive less score.<br>
                If it remains below, <span class="green">increase</span> the scoring value.`,
                id: 'min',
            },
            {
                label: 'Including',
                tooltip: `This value must be <span class="yellow">within</span> the range of the stats.<br>
                If not, the recipe will receive less score.<br>
                If it remains outside, <span class="green">increase</span> or <span class="red">decrease</span> the scoring value.`,
                id: 'inc',
            },
            {
                label: 'Maximum',
                tooltip: `Maximum stat must be <span class="red">less than</span> this value.<br>
                If not, the recipe will receive less score.<br>
                If it remains above, <span class="red">decrease</span> the scoring value.`,
                id: 'max',
            },
        ];

        customLimits.forEach(limit => {
            const customStatContainer = document.createElement('div');
            customStatContainer.classList.add('customLimitContainer');
            
            const customLimitLabel = document.createElement('span');
            customLimitLabel.textContent = `${limit.label}:`;
            customLimitLabel.dataset.tooltip = limit.tooltip;
            customStatContainer.appendChild(customLimitLabel);

            const customLimitInput = document.createElement('input');
            customLimitInput.type = 'number';
            customLimitInput.min = -1000;
            customLimitInput.max = 1000;
            customLimitInput.placeholder = 'None';
            customLimitInput.addEventListener('input', () => {
                const rawValue = customLimitInput.value;
                const parsedValue = rawValue === '' ? null : parseInt(rawValue);
                options.customLimits[shortId][limit.id] = parsedValue;

                // Make sure the score value points in the same direction as the custom limit
                if (parsedValue < 0 && idValue.value >= 0) {
                    idValue.value = -1;
                    options.scoringSystem[shortId] = -1;
                } else if (parsedValue > 0 && idValue.value <= 0) {
                    idValue.value = 1;
                    options.scoringSystem[shortId] = 1;
                }
            });
            customStatContainer.appendChild(customLimitInput);

            customLimitContainer.appendChild(customStatContainer);
        });
        
        superContainer.appendChild(customLimitContainer);
    });
    containerRight.appendChild(idLimitButton);
    
    const limits = {
        min: -1000,
        max: 1000,
    };
    idValue.min = limits.min;
    idValue.max = limits.max;
    idValue.value = 1;
    idValue.dataset.tooltip = `
    Scoring Weight<br>
    <span class='gray'>
    Set <span class='green'>above 0</span> to encourage <span class='green'>positive rolls</span><br>
    Set <span class='red'>below 0</span> to encourage <span class='red'>negative rolls</span><br>
    Set <span class='yellow'>to 0</span> to <span class='yellow'>ban stat</span> from showing up
    </span>
    `;
    idValue.id = shortId;
    containerRight.appendChild(idValue);

    const idDelete = document.createElement('button');
    idDelete.innerText = 'X';
    idDelete.dataset.tooltip = 'Delete';
    idDelete.addEventListener('click', () => {
        delete options.scoringSystem[shortId];
        superContainer.remove();
        updateBannedIngList();
    });
    containerRight.appendChild(idDelete);

    idValue.addEventListener('input', () => {
        if (idValue.value < limits.min) {
            idValue.value = limits.min;
        } else if (idValue.value > limits.max) {
            idValue.value = limits.max;
        }
        options.scoringSystem[shortId] = parseInt(idValue.value);
    });

    document.getElementById('scoringItems').appendChild(superContainer);

    updateBannedIngList();

    return true;
}

scoringSystemInput.addEventListener('input', () => {
    const id = scoringSystemInput.value;
    
    const isValid = addItemToScoringSystem(id);

    if (!isValid) return;

    scoringSystemInput.value = '';
});

identificationsDropdownList.addEventListener('input', () => {
    const id = identificationsDropdownList.value;

    addItemToScoringSystem(id);
});

const isMobile = 'ontouchstart' in window;

const dropdownContainer = document.getElementById('scoringSystemDropdownContainer');
const dropdownElement = document.getElementById('identificationsDropdownList');
const inputContainer = document.getElementById('scoringSystemInputContainer');
if (isMobile) {
    // Dropdown menu only is prefered on mobile due to input suggestions sometimes not being a thing
    inputContainer.style.display = 'none';
    dropdownContainer.style.display = 'block';
    dropdownElement.style.width = '';
} else {
    inputContainer.style.display = 'inline-block';
    dropdownContainer.style.display = 'inline-block';
    dropdownElement.style.width = '20px';
}