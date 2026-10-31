import { isNotTouching, isTouching } from "./ingred.js";

export function getRecipeEffectiveness(ingList) {
    // All ingredients have 100% effectiveness by default
    const ingEffectiveness = new Array(6).fill(100);

    ingList.forEach((ing, i) => {
        Object.entries(ing.posMods).forEach(([pos, mod]) => {
            if (pos === "left" && i % 2 === 1) {
                ingEffectiveness[i - 1] += mod;
            } else if (pos === "right" && i % 2 === 0) {
                ingEffectiveness[i + 1] += mod;
            } else if (pos === "above" && i >= 2) {
                // Affect both items above the ingredient in the column
                ingEffectiveness[i - 2] += mod;
                if (i >= 4) {
                    ingEffectiveness[i - 4] += mod;
                }
            } else if (pos === "under" && i <= 3) {
                // Affect both items under the ingredient in the column
                ingEffectiveness[i + 2] += mod;
                if (i <= 1) {
                    ingEffectiveness[i + 4] += mod;
                }
            } else if (pos === "touching") {
                ingEffectiveness.forEach((_, j) => {
                    if (isTouching(i, j)) {
                        ingEffectiveness[j] += mod;
                    }
                });
            } else if (pos === "notTouching") {
                ingEffectiveness.forEach((_, j) => {
                    if (isNotTouching(i, j)) {
                        ingEffectiveness[j] += mod;
                    }
                });
            }
        });
    });

    return ingEffectiveness;
}