// Default options when loading the page
export const options = {
    recipeLevel: '117-119',
    matTiers: [3, 3],
    recipeType: 'CHESTPLATE',
    scoringSystem: {},
    scoringLimits: [],
    customLimits: {},
    bannedIngs: [],
    subjectsPerEvolution: 1000,
    generations: 300,
    assumePerfectRollsForScoring: false,
    considerChargesForDurationScoring: true,
    onlyAllowSpecifiedIDs: false,
    filterOutWeakIngs: false,
};

// Add to the window to make it accessible through devtools
// window.o = options;