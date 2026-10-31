import { getRecipeBase, getProfessionFromRecipeType, isConsumableProfession } from "./recipes.js";
import { evaluateScore } from "./score.js";
import { getRandom } from "./random.js";
import { getIngredientByName, combineStatAndMetaIngredients } from "./ingred.js";
import { getRecipeEffectiveness } from "./recipeeffectiveness.js";
import { getRecipeStats } from "./recipestats.js";
import { weakIngredients } from '../data/weakingreds.js';

function iteration(recipeBase, matTiers, possibleIngs, scoringSystem, scoringLimits, customLimits, previousRecipe = null, deviationChance = 0.5) {
    const recipeIngNames = [];

    if (previousRecipe === null) {
        for (let i = 0; i < 6; i++) {
            recipeIngNames.push(getRandom(possibleIngs));
        }
    } else {
        for (let i = 0; i < 6; i++) {
            if (Math.random() < deviationChance) {
                recipeIngNames[i] = getRandom(possibleIngs);
            } else {
                recipeIngNames[i] = previousRecipe[i].name;
            }
        }

        // Copy mutation
        if (Math.random() < deviationChance) {
            const from = Math.floor(Math.random() * 6);
            const to = Math.floor(Math.random() * 6);

            if (from !== to) {
                recipeIngNames[to] = recipeIngNames[from];
            }
        }

        // Move mutation
        if (Math.random() < deviationChance) {
            const from = Math.floor(Math.random() * 6);
            let to = Math.floor(Math.random() * 6);

            while (to === from) {
                to = Math.floor(Math.random() * 6);
            }

            const ing = recipeIngNames[from];
            recipeIngNames[from] = getRandom(possibleIngs); // or previousRecipe[from].name
            recipeIngNames[to] = ing;
        }

        // Optional swap mutation (often useful in genetic algorithms)
        if (Math.random() < deviationChance) {
            const a = Math.floor(Math.random() * 6);
            let b = Math.floor(Math.random() * 6);

            while (b === a) {
                b = Math.floor(Math.random() * 6);
            }

            [recipeIngNames[a], recipeIngNames[b]] = [recipeIngNames[b], recipeIngNames[a]];
        }
    }

    const recipe = recipeIngNames.map(getIngredientByName);

    const recipeEffectiveness = getRecipeEffectiveness(recipe);
    const recipeStats = getRecipeStats(recipe, recipeEffectiveness, recipeBase, matTiers);

    let score = evaluateScore(recipeStats, scoringSystem);

    const isConsu = isConsumableProfession(recipeBase.skill);

    scoringLimits.forEach((scoringLimit) => {
        const { id, min, max } = scoringLimit;
        let value = recipeStats.reqs[id];
        // Always ensure durability is atleast 1 or higher
        if (id === 'dura') {
            value.min = Math.max(value.min, 1);
            value.max = Math.max(value.max, 1);
        } else if (id === 'charges') {
            value = Math.max(value, 1);
        }
        const valueInt = typeof value === 'object' ? value.min : value;
        if (isConsu) {
            if (id.endsWith('Req')) return;
        } else {
            if (id === 'charges') return;
        }
        // If a requirement is not met for a recipe, disqualify it
        if (min !== undefined && valueInt < min) {
            score = -1;
        }
        if (max !== undefined && valueInt > max) {
            score = -1;
        }
    });

    const discouragementFactor = 4;

    // Disqualify recipes that don't meet all scoring system requirements
    Object.entries(scoringSystem).forEach(([id, scoringValue]) => {
        if (scoringValue === 0) {
            if (recipeStats.stats[id]) {
                score = -1;
            }
        } else {
            const stat = recipeStats.stats[id];

            if (!stat) {
                score = -1;
                return;
            }

            const minStat = Math.min(stat.min, stat.max);
            const maxStat = Math.max(stat.min, stat.max);

            if (
                (minStat <= 0 && scoringValue > 0) ||
                (minStat >= 0 && scoringValue < 0)
            ) {
                score /= discouragementFactor;
            }

            const customLimit = customLimits[id];

            if (customLimit.min !== null) {
                if (minStat < customLimit.min) {
                    score /= discouragementFactor;
                }
            }
            if (customLimit.max !== null) {
                if (maxStat > customLimit.max) {
                    score -= Math.abs((maxStat - customLimit.max) * scoringValue * discouragementFactor);
                }
            }
            if (customLimit.inc !== null) {
                if (minStat > customLimit.inc) {
                    score -= Math.abs((maxStat - customLimit.inc) * scoringValue * discouragementFactor);
                } else if (maxStat < customLimit.inc) {
                    score /= discouragementFactor;
                }
            }
        }
    });

    return { recipe, score, recipeStats };
}

const defaultDeviationChance = 0.4;

export function getPossibleIngredients(options) {
    const { recipeType, scoringSystem, recipeLevel, filterOutWeakIngs } = options;

    const skill = getProfessionFromRecipeType(recipeType);

    const maxIngLevel = parseInt(recipeLevel.split('-')[1]);

    // This will get a large list combining every suitable ingredient for this skill.
    // It will include all meta ingredients as well as ingredients that boost durability.
    let possibleIngs = combineStatAndMetaIngredients(skill, Object.keys(scoringSystem))
        // Remove any ingredients from this list that are too high level
        .filter(ing => getIngredientByName(ing).lvl <= maxIngLevel)

    if (filterOutWeakIngs) {
        possibleIngs = possibleIngs.filter(ing => !weakIngredients.includes(ing));
    }

    return possibleIngs;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export async function bruteForce(options, onProgress = () => {}) {
    const {
        matTiers,
        recipeType,
        scoringSystem,
        bannedIngs,
        scoringLimits,
        customLimits,
        subjectsPerEvolution,
        generations,
        recipeLevel
    } = options;

    const skill = getProfessionFromRecipeType(recipeType);

    const possibleIngs = getPossibleIngredients(options)
        .filter(ing => !bannedIngs.includes(ing));

    if (possibleIngs.length === 0) return;

    const recipeBase = getRecipeBase(skill, recipeType, recipeLevel);

    const subjects = [];

    for (let i = 0; i < subjectsPerEvolution; i++) {
        const { recipe, score, recipeStats } = iteration(
            recipeBase,
            matTiers,
            possibleIngs,
            scoringSystem,
            scoringLimits,
            customLimits
        );

        subjects.push({ recipe, score, recipeStats });
    }

    let deviationChance = defaultDeviationChance;
    let previousBestScore = 0;

    for (let generation = 0; generation < generations; generation++) {
        const recipeTable = new Set();

        for (let i = 0; i < subjects.length; i++) {
            const subject = subjects[i];
            const recipe = subject.recipe.map((ing) => ing.name).join('|');

            if (recipeTable.has(recipe)) {
                subjects.splice(i, 1);
                i--;
            } else {
                recipeTable.add(recipe);
            }
        }

        const amountThisGeneration = subjects.length;
        const toGenerateNow = subjectsPerEvolution - amountThisGeneration;

        for (let i = 0; i < toGenerateNow; i++) {
            const previousRecipe =
                subjects[Math.floor(Math.random() * amountThisGeneration)].recipe;

            const { recipe, score, recipeStats } = iteration(
                recipeBase,
                matTiers,
                possibleIngs,
                scoringSystem,
                scoringLimits,
                customLimits,
                previousRecipe,
                deviationChance
            );

            subjects.push({ recipe, score, recipeStats });
        }

        subjects.sort((a, b) => a.score - b.score);
        subjects.splice(0, Math.floor(subjectsPerEvolution / 2));

        const bestSubject = subjects[subjects.length - 1];
        const bestScore = bestSubject.score;

        if (bestScore === previousBestScore) {
            deviationChance += 0.01 * (1 - deviationChance);
        } else {
            deviationChance = defaultDeviationChance;
        }

        previousBestScore = bestScore;

        // Update UI every 3 generations
        if (generation % 3 === 0 || generation === generations - 1) {
            onProgress({
                generation: generation + 1,
                generations,
                bestScore,
                recipe: bestSubject.recipe.map(i => i.name)
            });

            await sleep(1);
        }
    }

    const bestRecipe = subjects[subjects.length - 1];

    return {
        recipeBase,
        recipeIngNames: bestRecipe.recipe.map((ing) => ing.name),
        recipeStats: bestRecipe.recipeStats,
        score: bestRecipe.score
    };
}