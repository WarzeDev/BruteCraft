import { getRecipeBase, getProfessionFromRecipeType} from "../../brute/recipes.js";
import { options } from "./options.js";

const itemImageNames = {
    paper: {
        oak: 'paper_oak',
        birch: 'paper_birch',
        willow: 'paper_willow',
        acacia: 'paper_acacia',
        spruce: 'paper_spruce',
        jungle: 'paper_jungle',
        dark: 'paper_dark',
        light: 'paper_light',
        pine: 'paper_pine',
        avo: 'paper_avo',
        sky: 'paper_sky',
        dernic: 'paper_dernic',
        maple: 'paper_maple',
        redwood: 'paper_redwood',
    },
    wood: {
        oak: 'plank_oak',
        birch: 'plank_birch',
        willow: 'plank_willow',
        acacia: 'plank_acacia',
        spruce: 'plank_spruce',
        jungle: 'plank_jungle',
        dark: 'plank_dark',
        light: 'plank_light',
        pine: 'plank_pine',
        avo: 'plank_avo',
        sky: 'plank_sky',
        dernic: 'plank_dernic',
        maple: 'plank_maple',
        redwood: 'plank_redwood',
    },
    ingot: {
        cobalt: 'ingot_cobalt',
        copper: 'ingot_copper',
        dernic: 'ingot_dernic',
        diamond: 'ingot_diamond',
        gold: 'ingot_gold',
        granite: 'ingot_granite',
        iron: 'ingot_iron',
        kanderstone: 'ingot_kanderstone',
        molten: 'ingot_molten',
        sandstone: 'ingot_sandstone',
        silver: 'ingot_silver',
        voidstone: 'ingot_void',
        titanium: 'ingot_titanium',
        cinnabar: 'ingot_cinnabar',
    },
    gem: {
        cobalt: 'gem_cobalt',
        copper: 'gem_copper',
        dernic: 'gem_dernic',
        diamond: 'gem_diamond',
        gold: 'gem_gold',
        granite: 'gem_granite',
        iron: 'gem_iron',
        kanderstone: 'gem_kander',
        molten: 'gem_molten',
        sandstone: 'gem_sandstone',
        silver: 'gem_silver',
        voidstone: 'gem_void',
        titanium: 'gem_titanium',
        cinnabar: 'gem_cinnabar',
    },
    oil: {
        gudgeon: 'oil_gudgeon',
        trout: 'oil_trout',
        salmon: 'oil_salmon',
        carp: 'oil_carp',
        icefish: 'oil_ice',
        piranha: 'oil_piranha',
        koi: 'oil_koi',
        gylia: 'oil_gylia',
        bass: 'oil_bass',
        molten: 'oil_molten',
        starfish: 'oil_starfish',
        dernic: 'oil_dernic',
        sturgeon: 'oil_sturgeon',
        mahseer: 'oil_mahseer',
    },
    meat: {
        gudgeon: 'meat_gudgeon',
        trout: 'meat_trout',
        salmon: 'meat_salmon',
        carp: 'meat_carp',
        icefish: 'meat_ice',
        piranha: 'meat_piranha',
        koi: 'meat_koi',
        gylia: 'meat_gylia',
        bass: 'meat_bass',
        molten: 'meat_molten',
        starfish: 'meat_starfish',
        dernic: 'meat_dernic',
        sturgeon: 'meat_sturgeon',
        mahseer: 'meat_mahseer',
    },
    string: {
        wheat: 'string_wheat',
        barley: 'string_barley',
        oat: 'string_oat',
        malt: 'string_wheat',
        hops: 'string_hops',
        rye: 'string_rye',
        millet: 'string_millet',
        decay: 'string_decay',
        rice: 'string_rice',
        sorghum: 'string_sorghum',
        hemp: 'string_hemp',
        dernic: 'string_dernic',
        jute: 'string_jute',
        heather: 'string_heather',
    },
    grains: {
        wheat: 'grain_wheat',
        barley: 'grain_barley',
        oat: 'grain_oat',
        malt: 'grain_malt',
        hops: 'grain_hops',
        rye: 'grain_rye',
        millet: 'grain_millet',
        decay: 'grain_decay',
        rice: 'grain_rice',
        sorghum: 'grain_sorghum',
        hemp: 'grain_hemp',
        dernic: 'grain_dernic',
        jute: 'grain_jute',
        heather: 'grain_heather',
    }
}

function getItemImageByName(name) {
    const [tier, type] = name.replace('Refined ', '').split(' ').map(x => x.toLowerCase());
    const url = `src/web/images/items/${type}/${itemImageNames[type][tier]}.png`;
    return url;
}

export function updateMaterialPreview() {
    const { recipeType, recipeLevel, matTiers } = options;
    const skill = getProfessionFromRecipeType(recipeType);
    const recipeBase = getRecipeBase(skill, recipeType, recipeLevel);

    for (let material = 0; material < 2; material ++) {
        const materialName = recipeBase.materials[material].item.replace('Refined ', '');
        const materialCount = recipeBase.materials[material].amount;
        document.getElementById(`materialPreview${material}`).dataset.tooltip = `${materialCount}x ${materialName} [${'*'.repeat(matTiers[material])}]`;
        document.getElementById(`materialCount${material}`).innerText = materialCount;
        document.getElementById(`materialItem${material}`).src = getItemImageByName(recipeBase.materials[material].item);
    }
}