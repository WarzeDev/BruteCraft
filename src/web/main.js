import { bruteForce } from "../brute/bruteforce.js";
import { displayRecipeStats, displayIngredient } from "../brute/display.js";
import { getProfessionFromRecipeType, isConsumableProfession } from "../brute/recipes.js";
import { timeDisplay, timeout } from "./js/utils.js";
import { generateWynnBuilderURL } from "./js/wynnbuilder.js";
import { options } from "./js/options.js";
import { createStatElement, createReqElement } from './js/itemstats.js';
import { getIngredientByName } from "../brute/ingred.js";
import './js/professions.js';
import './js/recipelevel.js';
import './js/materialquality.js';
import './js/identifications.js';
import './js/bannedingredients.js';
import './js/scoringsystem.js';
import './js/limits.js';
import './js/advanced.js';
import './js/tooltip.js';

const startButton = document.getElementById('startButton');
let buttonLock = false;
startButton.addEventListener('click', async () => {
    const recipeResult = document.getElementById('recipeResult');
    recipeResult.innerHTML = '';
    recipeResult.style.display = 'none';

    // Already generating something...
    if (buttonLock) return;

    buttonLock = true;
    startButton.innerText = 'Generating...';

    await timeout(30);

    const progressContainer = document.getElementById('progress');

    const results = await bruteForce(options, ({ generation, generations, bestScore, recipe }) => {
        progressContainer.innerHTML = `
            <div>Generation ${generation}/${generations}</div>
            <div>Best Score: ${bestScore.toFixed(3)}</div>
            <div>
                ${recipe
                    .reduce((rows, ing, i) => {
                        if (i % 2 === 0) rows.push([ing]);
                        else rows[rows.length - 1].push(ing);
                        return rows;
                    }, [])
                    .map(row => row.join(', '))
                    .join('<br>')
                }
            </div>
        `;
    });

    buttonLock = false;
    startButton.innerText = 'Start!';
    recipeResult.style.display = 'block';
    progressContainer.innerHTML = '';

    if (!results || results.score <= 0) {
        console.error('Failed to find any recipe.');
        recipeResult.innerText = 'Failed to find any recipe.';
        return;
    }

    const { recipeBase, recipeIngNames, recipeStats } = results;

    document.querySelectorAll('.materialPreview').forEach((materialPreview) => {
        recipeResult.appendChild(materialPreview.cloneNode(true));
    });

    const ingredientsContainer = document.createElement('div');
    ingredientsContainer.classList.add('ingredients');
    recipeResult.appendChild(ingredientsContainer);

    recipeIngNames.forEach((ing) => {
        const ingredientContainer = document.createElement('a');
        ingredientContainer.classList.add('ingredient');
        ingredientContainer.innerText = ing;
        ingredientContainer.dataset.tooltip = displayIngredient(getIngredientByName(ing));
        if (ing === 'No Ingredient') {
            ingredientContainer.classList.add('noIngredient');
        } else {
            const ingLink = ing.replaceAll(' ', '_').replaceAll('֎', '')
            ingredientContainer.target = '_blank';
            ingredientContainer.href = `https://wynncraft.wiki.gg/wiki/${ingLink}`;
        }
        ingredientsContainer.appendChild(ingredientContainer);
    });

    const statsStr = displayRecipeStats(recipeStats);
    const statsContainer = document.createElement('div');
    statsContainer.classList.add('stats');
    
    const profession = getProfessionFromRecipeType(options.recipeType);
    const isConsumable = isConsumableProfession(profession);

    statsStr.split('\n').forEach((statStr) => {
        if (!statStr) return;
        const [statName, statRange] = statStr.split(': ');
        const [min, max] = statRange.split(' - ');
        let statElement;
        if (statStr.startsWith('Durability: ') && isConsumable) {
            statElement = createStatElement('Duration', timeDisplay(min), timeDisplay(max));
        } else if (statStr.includes('Min:')) {
            // Consumables don't have requirements
            if (isConsumable) return;
            statElement = createReqElement(statName, min);
        } else {
            statElement = createStatElement(statName, min, max);
        }
        statsContainer.appendChild(statElement);
    });

    // Generate link to wynncrafter at the bottom of the recipe
    const { cr, url } = generateWynnBuilderURL(recipeIngNames, recipeBase, options.matTiers);
    const craftingLink = document.createElement('a');
    craftingLink.href = url;
    craftingLink.classList.add('wynnBuilderLink');
    craftingLink.target = '_blank';
    craftingLink.innerText = cr;
    statsContainer.appendChild(craftingLink);

    recipeResult.appendChild(statsContainer);
});