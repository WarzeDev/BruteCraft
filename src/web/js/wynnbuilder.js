import { getIngredientByName } from "../../brute/ingred.js";
import { fromIntN } from "../../brute/base64.js";

export function generateWynnBuilderURL(ingNameList, recipeBase, matTiers) {
    let url = 'https://wynnbuilder-beta.github.io/crafter/#';
    let cr = 'CR-';
    let hash = '1';
    ingNameList.forEach(ingName => {
        hash += fromIntN(getIngredientByName(ingName).id, 2);
    });
    hash += fromIntN(recipeBase.id, 2);
    hash += matTiers[0] + (matTiers[1] - 1) * 3;
    hash += 0; // Attack speed
    url += hash;
    cr += hash;
    return { hash, url, cr };
}
