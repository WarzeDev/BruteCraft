import { levelTypes } from '../../brute/recipes.js';
import { options } from './options.js';
import { updateMaterialPreview } from './materialpreview.js';
import { updateBannedIngList } from './bannedingredients.js';

recipeLevelRange.max = levelTypes.length - 1;
recipeLevelRange.value = levelTypes.length - 1;

recipeLevelRange.addEventListener('input', () => {
    const newLevel = levelTypes[recipeLevelRange.value];
    recipeLevelText.innerText = newLevel;
    options.recipeLevel = newLevel;
    updateMaterialPreview();
    updateBannedIngList();
});