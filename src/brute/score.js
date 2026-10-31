import { options } from "../web/js/options.js";

export function evaluateScore(recipeStats, scoringSystem) {
    let finalScore = 0;
    Object.entries(recipeStats.stats).forEach(([id, stat]) => {
        if (id in scoringSystem) {
            // Multiply the score by the value of the stat
            const minScore = scoringSystem[id] * stat.min;
            const maxScore = scoringSystem[id] * stat.max;
            if (options.assumePerfectRollsForScoring) {
                // Only choose the value that matters more
                finalScore += Math.max(minScore, maxScore);
            } else {
                // Add the average of the two values
                finalScore += (minScore + maxScore) / 2;
            }
        }
    });
    // Add the slightest bit of score for durability to encourage higher dura
    const duraScore = Math.max(1, recipeStats.reqs.dura.min) / 1000;
    const charges = recipeStats.reqs.charges;
    if (charges && options.considerChargesForDurationScoring) {
        finalScore += duraScore * charges;
    } else {
        finalScore += duraScore;
    }
    return finalScore;
}