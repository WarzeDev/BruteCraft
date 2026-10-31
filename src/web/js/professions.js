import { getAllRecipeTypesFromProfession, getExampleRecipeTypeFromProfession, isConsumableProfession } from "../../brute/recipes.js";
import { options } from "./options.js";
import { updateMaterialPreview } from "./materialpreview.js";
import { updateBannedIngList } from "./bannedingredients.js";
import { capitalize } from "./utils.js";

const professions = [
    'armouring',
    'jeweling',
    'tailoring',
    'weaponsmithing',
    'woodworking',
    'alchemism',
    'cooking',
    'scribing',
];

const professionContainer = document.getElementById('professionContainer');
const professionParentContainer = document.getElementById('profession');

professions.forEach((profession) => {
    const button = document.createElement('button');
    button.dataset.tooltip = capitalize(profession);
    
    const image = document.createElement('img');
    image.src = `src/web/images/professions/${profession}.png`;
    button.appendChild(image);
    
    professionContainer.appendChild(button);

    if (profession === 'armouring') {
        button.classList.add('selected');
    }

    button.addEventListener('click', () => {
        const exampleRecipeType = getExampleRecipeTypeFromProfession(profession.toUpperCase());
        options.recipeType = exampleRecipeType;
        updateMaterialPreview();

        button.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('selected'));

        button.classList.add('selected');

        const isConsu = isConsumableProfession(profession);
        const charges = document.querySelector('.limitItem#charges');
        const spReqs = document.querySelectorAll('.limitItem.spReq');
        const duraName = document.getElementById('name_dura');

        if (isConsu) {
            charges.style.display = 'flex';
            spReqs.forEach(spReq => spReq.style.display = 'none');
            duraName.innerText = 'Min. Duration (in seconds)';
        } else {
            charges.style.display = 'none';
            spReqs.forEach(spReq => spReq.style.display = 'flex');
            duraName.innerText = 'Min. Durability';
        }

        // Hide all recipe types except the one for the selected profession
        const recipeTypeContainers = document.querySelectorAll('.recipeTypeContainer');
        recipeTypeContainers.forEach(container => {
            if (container.id === profession) {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });

        // De-select all recipe types
        document.querySelectorAll('.recipeTypeContainer button').forEach(button => button.classList.remove('selected'));

        // Select the example recipe type for the selected profession
        document.getElementById(exampleRecipeType).classList.add('selected');

        updateBannedIngList();
    });

    const recipeTypeContainer = document.createElement('div');
    recipeTypeContainer.classList.add('recipeTypeContainer');
    recipeTypeContainer.id = profession;

    // Armouring is selected by default
    if (profession === 'armouring') {
        recipeTypeContainer.style.display = 'block';
    } else {
        recipeTypeContainer.style.display = 'none';
    }

    professionParentContainer.appendChild(recipeTypeContainer);

    const recipeTypes = getAllRecipeTypesFromProfession(profession.toUpperCase());
    recipeTypes.forEach((recipeType) => {
        const button = document.createElement('button');
        button.innerText = recipeType.toLowerCase();
        button.id = recipeType;
        button.addEventListener('click', () => {
            options.recipeType = recipeType;
            updateMaterialPreview();

            button.parentElement.querySelectorAll('.recipeTypeContainer button').forEach(b => b.classList.remove('selected'));
            button.classList.add('selected');
        });

        if (profession === 'armouring' && recipeType === 'CHESTPLATE') {
            button.classList.add('selected');
        }

        recipeTypeContainer.appendChild(button);
    });
});