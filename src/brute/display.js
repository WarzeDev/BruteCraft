import { getTranslatedById } from "./ids.js";
import { capitalize } from "../web/js/utils.js";

function displayStat(id, stat) {
    if (stat.min === 0 && stat.max === 0) return;
    let name = getTranslatedById(id);
    let numPostfix = '';
    // Some stats start or end with a %, which is ugly so we remove it and add it after each numeric stat
    if (name.startsWith("% ")) {
        name = name.slice(2);
        numPostfix = '%';
    } else if (name.endsWith(" %")) {
        name = name.slice(0, -2);
        numPostfix = '%';
    }
    let [min, max] = [stat.min, stat.max];
    if (min > max) {
        // Flip it around so it's always min-max
        [min, max] = [max, min];
    }
    return `${name}: ${min}${numPostfix} - ${max}${numPostfix}`;
}

function displayReq(id, req) {
    if (req === 0) return; // Don't display 0 stats at all
    let name = getTranslatedById(id);
    let postfix = '';
    // Example: Req Strength -> Strength Min
    if (name.startsWith("Req")) {
        name = name.slice(4);
        postfix = ' Min';
    }
    // Range stats are displayed with a dash
    if (typeof req === 'object') {
        req = req.min + ' - ' + req.max;
    }
    return `${name}${postfix}: ${req}`;
}

export function displayRecipeStats(recipeStats) {
    let allStatStr = '';
    Object.entries(recipeStats.stats).forEach(([id, stat]) => {
        const displayedStat = displayStat(id, stat);
        if (displayedStat) allStatStr += displayedStat + '\n';
    });
    Object.entries(recipeStats.reqs).forEach(([id, req]) => {
        const reqStr = displayReq(id, req);
        if (!reqStr) return;
        allStatStr += reqStr + '\n';
    });
    return allStatStr;
}

export function displayRecipeMats(recipeBase, matTiers) {
    const [mat1, mat2] = recipeBase.materials;
    const displayedMat1 = mat1.item.replace('Refined ', '');
    const displayedMat2 = mat2.item.replace('Refined ', '');
    return `${mat1.amount}x ${displayedMat1} [${'*'.repeat(matTiers[0])}] + ${mat2.amount}x ${displayedMat2} [${'*'.repeat(matTiers[1])}]`;
}

function displayPlusMinus(value) {
    if (value === 0) return '';
    return value > 0 ? '+' + value : value;
}

export function displayIngredient(ingredient) {
    const { name, lvl, ids, consumableIDs, skills, tier, posMods, itemIDs } = ingredient;
    let text = `${name} [${'*'.repeat(tier)}]<br>
    <span class="gray">Level ${lvl} Crafting Ingredient</span><br>
    <br>`;

    let hasID = false;
    Object.entries(ids).forEach(([id, stat]) => {
        hasID = true;
        let idName = getTranslatedById(id);
        const color = stat.minimum > 0 ? 'green' : 'red';
        let postfix = '';
        if (idName.startsWith('%')) {
            idName = idName.slice(2);
            postfix = '%';
        }
        if (idName.endsWith('%')) {
            idName = idName.slice(0, -2);
            postfix = '%';
        }
        text += `${idName}: <span class="${color}">${stat.minimum}${postfix} - ${stat.maximum}${postfix}</span><br>`;
    });
    if (hasID) {
        text += '<br>';
    }

    let hasPosMod = false;
    Object.entries(posMods).forEach(([posMod, value]) => {
        if (value === 0) return;
        hasPosMod = true;
        const color = value > 0 ? 'green' : 'red';
        const posModName = getTranslatedById(posMod);
        text += `${posModName}: <span class="${color}">${value}%</span><br>`;
    });
    if (hasPosMod) {
        text += '<br>';
    }

    let hasItemID = false;
    Object.entries(itemIDs).forEach(([itemID, value]) => {
        if (value === 0) return;
        hasItemID = true;
        if (itemID === 'dura') {
            const color = value > 0 ? 'green' : 'red';
            const displayValue = displayPlusMinus(value);
            const itemName = getTranslatedById(itemID);
            text += `<span class="${color}">${displayValue} ${itemName}</span><br>`;
        } else {
            const color = value > 0 ? 'red' : 'green';
            const displayValue = displayPlusMinus(value);
            let itemName = getTranslatedById(itemID);
            if (itemName.startsWith('Req')) {
                itemName = itemName.slice(4);
                itemName += ' Min.';
            }
            text += `<span class="${color}">${displayValue} ${itemName}</span><br>`;
        }
    });
    if (hasItemID) {
        text += '<br>';
    }

    let hasConsuID = false;
    Object.entries(consumableIDs).forEach(([consumableID, value]) => {
        if (value === 0) return;
        hasConsuID = true;
        const color = value > 0 ? 'green' : 'red';
        const displayValue = displayPlusMinus(value);
        let itemName = getTranslatedById(consumableID);
        let postfix = '';
        if (itemName === 'Durability') {
            itemName = 'Duration';
            postfix = 's';
        }
        text += `<span class="${color}">${displayValue}${postfix} ${itemName}</span><br>`;
    });
    if (hasConsuID) {
        text += '<br>';
    }

    if (skills.length === 8) {
        text += 'All Professions';
    } else {
        text += skills.map(skill => capitalize(skill)).join(', ');
    }

    return text;
}