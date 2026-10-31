import { isConsumableProfession } from "./recipes.js";

const matTierToMult = [null, 1, 1.25, 1.4];

export function getRecipeStats(recipe, recipeEffectiveness, recipeBase, matTiers) {
    const stats = {};
    const { minimum, maximum } = recipeBase.durability || recipeBase.duration;
    const [ mat1, mat2 ] = recipeBase.materials.map(mat => mat.amount);
    const duraMultiplier = (mat1 * matTierToMult[matTiers[0]] + mat2 * matTierToMult[matTiers[1]]) / (mat1 + mat2);
    const reqs = {
        dura: {
            min: Math.round(minimum * duraMultiplier),
            max: Math.round(maximum * duraMultiplier),
        }
    };
    if (recipeBase.duration) {
        reqs.charges = 3;
    }

    recipe.forEach((ing, i) => {
        const effectiveness = recipeEffectiveness[i] / 100;
        Object.entries(ing.ids).forEach(([idName, idObj]) => {
            const min = Math.floor(idObj.minimum * effectiveness);
            const max = Math.floor(idObj.maximum * effectiveness);
            if (idName in stats) {
                stats[idName].min += min;
                stats[idName].max += max;
            } else {
                stats[idName] = { min, max };
            }
        });
        let ids = Object.entries(ing.itemIDs);
        if (isConsumableProfession(recipeBase.skill)) {
            // Remove the ID dura, as it doesn't apply to consumables. Instead use the Consumable ID dura
            ids = ids.filter(([idName]) => idName !== 'dura');
            ids = ids.concat(Object.entries(ing.consumableIDs));
        }
        ids.forEach(([idName, reqBase]) => {
            let req;
            if (["dura", "charges"].includes(idName)) {
                // Recipe effectiveness does not affect dura or charges
                req = reqBase;
            } else {
                req = Math.round(reqBase * effectiveness);
            }
            if (idName === "dura") {
                reqs.dura.min += req;
                reqs.dura.max += req;
            } else if (idName in reqs) {
                reqs[idName] += req;
            } else {
                reqs[idName] = req;
            }
        });
    });

    return { stats, reqs };
}