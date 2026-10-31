import { options } from './options.js';
import { updateBannedIngList } from './bannedingredients.js';

const genCount = document.getElementById('genCount');
genCount.addEventListener('input', () => {
    options.generations = genCount.value;
    genCount.parentElement.querySelector('span').innerText = options.generations;
    updateApprox();
});

const subjectsPerGen = document.getElementById('subjectsPerGen');
subjectsPerGen.addEventListener('input', () => {
    options.subjectsPerEvolution = subjectsPerGen.value;
    subjectsPerGen.parentElement.querySelector('span').innerText = subjectsPerGen.value;
    updateApprox();
});

const approxTime = document.getElementById('approxTime');
const recipeCountText = document.getElementById('recipeCount');
function updateApprox() {
    // This is entirely approximated and can vary depending on browser and device
    const subjectsPerSecond = 50000;
    const recipeCount = options.generations * options.subjectsPerEvolution;
    approxTime.innerText = Math.round(recipeCount / subjectsPerSecond);
    recipeCountText.innerText = recipeCount;
}

const assumeBestRollsOption = document.getElementById('assumeBestRolls');
assumeBestRollsOption.addEventListener('input', () => {
    options.assumePerfectRollsForScoring = assumeBestRollsOption.checked;
});
assumeBestRollsOption.checked = false;

const considerChargesOption = document.getElementById('considerCharges');
considerChargesOption.addEventListener('input', () => {
    options.considerChargesForDurationScoring = considerChargesOption.checked;
});
considerChargesOption.checked = true;

const onlyAllowSpecifiedIDsOption = document.getElementById('onlyAllowSpecifiedIDs');
onlyAllowSpecifiedIDsOption.addEventListener('input', () => {
    options.onlyAllowSpecifiedIDs = onlyAllowSpecifiedIDsOption.checked;
    updateBannedIngList();
});
onlyAllowSpecifiedIDsOption.checked = false;

const filterOutWeakIngsOption = document.getElementById('filterOutWeakIngs');
filterOutWeakIngsOption.addEventListener('input', () => {
    options.filterOutWeakIngs = filterOutWeakIngsOption.checked;
    updateBannedIngList();
});
filterOutWeakIngsOption.checked = false;