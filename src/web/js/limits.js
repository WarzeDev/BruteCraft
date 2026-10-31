import { options } from './options.js';

const limits = ['dura', 'strReq', 'dexReq', 'intReq', 'defReq', 'agiReq', 'charges'];

const limitNames = {
    'dura': 'Min. Durability',
    'strReq': 'Max. Strength',
    'dexReq': 'Max. Dexterity',
    'intReq': 'Max. Intelligence',
    'defReq': 'Max. Defense',
    'agiReq': 'Max. Agility',
    'charges': 'Min. Charges'
};

limits.forEach((limit) => {
    const container = document.createElement('div');
    container.classList.add('limitItem');
    container.id = limit;
    if (limit.endsWith('Req')) {
        container.classList.add('spReq');
    }
    if (limit === 'charges') {
        container.style.display = 'none';
    }
    
    const idName = document.createElement('span');
    idName.textContent = limitNames[limit];
    idName.id = 'name_' + limit;
    container.appendChild(idName);
    
    const idValueRange = document.createElement('input');
    idValueRange.type = 'number';
    let defaultValue;
    const limits = {};
    if (limit === 'dura') {
        limits.min = 1;
        limits.max = 9999;
        defaultValue = 100;
    } else if (limit === 'charges') {
        limits.min = 1;
        limits.max = 99;
        defaultValue = 1;
    } else {
        limits.min = -99;
        limits.max = 9999;
        defaultValue = 100;
    }
    idValueRange.min = limits.min;
    idValueRange.max = limits.max;
    idValueRange.value = defaultValue;
    container.appendChild(idValueRange);
    const newEntry = {};

    // Durability, Duration and Charges make it so their value is used as a minimum for the recipe.
    const limitType = ['dura', 'charges'].includes(limit) ? 'min' : 'max';
    newEntry.id = limit;
    newEntry[limitType] = defaultValue;
    options.scoringLimits.push(newEntry);

    idValueRange.addEventListener('input', () => {
        if (idValueRange.value < limits.min) {
            idValueRange.value = limits.min;
        } else if (idValueRange.value > limits.max) {
            idValueRange.value = limits.max;
        }

        const entry = options.scoringLimits.find(entry => entry.id === limit);
        entry[limitType] = idValueRange.value;
    });

    document.getElementById('limitItems').appendChild(container);
});