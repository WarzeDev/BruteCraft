import { recipes } from '../data/recipes.js';
import { options } from '../web/js/options.js';

export const levelTypes = ["1-3","3-5","5-7","7-9","10-13","13-15","15-17","17-19","20-23","23-25","25-27","27-29","30-33","33-35","35-37","37-39","40-43","43-45","45-47","47-49","50-53","53-55","55-57","57-59","60-63","63-65","65-67","67-69","70-73","73-75","75-77","77-79","80-83","83-85","85-87","87-89","90-93","93-95","95-97","97-99","100-103","103-105","105-107","107-109","110-113","113-115","115-117","117-119"];

export function getRecipeBase(skill, type, level) {
    if (!levelTypes.includes(level)) {
        throw new Error(`Invalid level type: ${level}`);
    }
    const [min, max] = level.split('-').map(Number);
    const validSkillRecipes = recipes.recipes.filter(r => r.skill === skill);
    const validRecipes = validSkillRecipes.filter(r => r.lvl.minimum === min && r.lvl.maximum === max);
    return validRecipes.find(r => r.type === type);
}

export function getProfessionFromRecipeType(recipeType) {
    return {
        'BOOTS': 'TAILORING',
        'LEGGINGS': 'TAILORING',
        'CHESTPLATE': 'ARMOURING',
        'HELMET': 'ARMOURING',
        'RING': 'JEWELING',
        'BRACELET': 'JEWELING',
        'NECKLACE': 'JEWELING',
        'FOOD': 'COOKING',
        'SCROLL': 'SCRIBING',
        'POTION': 'ALCHEMISM',
        'WAND': 'WOODWORKING',
        'RELIK': 'WOODWORKING',
        'BOW': 'WOODWORKING',
        'SPEAR': 'WEAPONSMITHING',
        'DAGGER': 'WEAPONSMITHING',
    }[recipeType];
}

export function getExampleRecipeTypeFromProfession(profession) {
    return {
        'TAILORING': 'BOOTS',
        'ARMOURING': 'CHESTPLATE',
        'JEWELING': 'RING',
        'COOKING': 'FOOD',
        'SCRIBING': 'SCROLL',
        'ALCHEMISM': 'POTION',
        'WOODWORKING': 'WAND',
        'WEAPONSMITHING': 'SPEAR',
    }[profession];
}

export function getAllRecipeTypesFromProfession(profession) {
    return {
        'TAILORING': ['BOOTS', 'LEGGINGS'],
        'ARMOURING': ['CHESTPLATE', 'HELMET'],
        'JEWELING': ['RING', 'BRACELET', 'NECKLACE'],
        'COOKING': ['FOOD'],
        'SCRIBING': ['SCROLL'],
        'ALCHEMISM': ['POTION'],
        'WOODWORKING': ['WAND', 'RELIK', 'BOW'],
        'WEAPONSMITHING': ['SPEAR', 'DAGGER'],
    }[profession];
}

export function isConsumableProfession(profession) {
    return ['ALCHEMISM', 'COOKING', 'SCRIBING'].includes(profession.toUpperCase());
}