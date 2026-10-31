import { getPossibleIngredients } from "../../brute/bruteforce.js";
import { displayIngredient } from "../../brute/display.js";
import { options } from './options.js';
import { getIngredientByName } from "../../brute/ingred.js";

export function updateBannedIngList() {
    const bannedIngItems = document.getElementById('bannedIngItems');
    bannedIngItems.innerHTML = '';

    const possibleIngs = getPossibleIngredients(options).sort();

    possibleIngs.forEach((ing) => {
        const container = document.createElement('div');
        container.dataset.tooltip = displayIngredient(getIngredientByName(ing));

        container.classList.add('bannedIngItem');
        if (options.bannedIngs.includes(ing)) {
            container.classList.add('disabled');
        }

        const ingNameSpan = document.createElement('span');
        ingNameSpan.textContent = ing;
        container.appendChild(ingNameSpan);

        const containerRight = document.createElement('div');
        container.appendChild(containerRight);

        container.addEventListener('click', () => {
            if (container.classList.contains('disabled')) {
                container.classList.remove('disabled');
                options.bannedIngs = options.bannedIngs.filter(bannedIng => bannedIng !== ing);
            } else {
                options.bannedIngs.push(ing);
                container.classList.add('disabled');
            }
        });

        bannedIngItems.appendChild(container);
    });
}

updateBannedIngList();