import { ingred } from '../data/ingred.js';
import { getRandom } from './random.js';
import { options } from '../web/js/options.js';

export function getAllIngredients() {
    return ingred;
}

function getIngredientsBySkill(skill) {
    return ingred.filter(i => i.skills.includes(skill));
}

export function getIngredientByName(name) {
    if (name === 'No Ingredient') return getNoIngredient();
    return ingred.find(i => [i.displayName, i.name].includes(name));
}

export function getRandomIngredient(skill) {
    const ingredients = getIngredientsBySkill(skill);
    return getRandom(ingredients);
}

export function getRandomIngredientName(skill) {
    return getRandomIngredient(skill).displayName;
}

export function getIngredientByStats(skill, stats) {
    return getIngredientsBySkill(skill)
        .filter(ingredient => Object.keys(ingredient.ids).some(id => stats.includes(id)));
}

export function getIngredientsByMeta(skill) {
    return getIngredientsBySkill(skill).filter(i => {
        // Check if any posMods are not 0, which indicates that the ingredient is a meta ingredient
        const posMods = Object.values(i.posMods);
        return posMods.some(v => v !== 0);
    });
}

export function getIngredientsWithPositiveDura(skill) {
    return getIngredientsBySkill(skill).filter(i => {
        return (i.itemIDs.dura > 0 || i.consumableIDs.dura > 0);
    });
}

export function getNoIngredient() {
    return {
        name: "No Ingredient",
        displayName: "No Ingredient",
        tier: 0,
        lvl: 0,
        skills: ["ARMOURING", "TAILORING", "WEAPONSMITHING", "WOODWORKING", "JEWELING", "COOKING", "ALCHEMISM", "SCRIBING"],
        ids: {},
        itemIDs: {"dura": 0, "strReq": 0, "dexReq": 0,"intReq": 0,"defReq": 0,"agiReq": 0,},
        consumableIDs: {"dura": 0, "charges": 0},
        posMods: {"left": 0, "right": 0, "above": 0, "under": 0, "touching": 0, "notTouching": 0},
        id: 4000
    };
}

export function combineStatAndMetaIngredients(skill, stats) {
    const { onlyAllowSpecifiedIDs, scoringSystem } = options;

    let allIngredients = Array.from(new Set([
        ...getIngredientsByMeta(skill),
        ...getIngredientByStats(skill, stats),
        ...getIngredientsWithPositiveDura(skill),
        getNoIngredient(),
    ]));

    if (onlyAllowSpecifiedIDs) {
        allIngredients = allIngredients.filter(ingredient => {
            const isMetaIngredient = Object.values(ingredient.posMods)
                .some(v => v !== 0);

            if (isMetaIngredient) {
                return true;
            }

            const allIds = Object.keys(ingredient.ids);
            return allIds.length === 0 || allIds.every(id =>
                Object.prototype.hasOwnProperty.call(scoringSystem, id)
            );
        });
    }

    return allIngredients.map(ing => ing.displayName);
}

export function isTouching(ingPosA, ingPosB) {
    return (
        (ingPosA % 2 === 0 && ingPosB === ingPosA + 1) ||
        (ingPosA % 2 === 1 && ingPosB === ingPosA - 1) ||
        (ingPosA === ingPosB - 2) ||
        (ingPosA === ingPosB + 2)
    );
}

export function isNotTouching(ingPosA, ingPosB) {
    // Can't be touching with itself
    if (ingPosA === ingPosB) return false;
    return !isTouching(ingPosA, ingPosB);
}