import { updateMaterialPreview } from "./materialpreview.js";
import { options } from "./options.js";

const maximumMaterialQuality = 3;

for (let materialType = 0; materialType < 2; materialType ++) {
    const materialQualityTierContainer = document.createElement('div');
    materialQualityTierContainer.classList.add('materialQualityTierContainer');

    const materialPreview = document.createElement('div');
    materialPreview.classList.add('materialPreview');
    materialPreview.id = `materialPreview${materialType}`;

    const materialPreviewBackground = document.createElement('img');
    materialPreviewBackground.src = 'src/web/images/tiers/tier3bg.png';
    materialPreviewBackground.classList.add('materialPreviewBackground');
    materialPreview.appendChild(materialPreviewBackground);

    const materialPreviewItem = document.createElement('img');
    materialPreviewItem.classList.add('materialPreviewItem');
    materialPreviewItem.id = `materialItem${materialType}`;
    materialPreview.appendChild(materialPreviewItem);

    const materialPreviewCount = document.createElement('span');
    materialPreviewCount.classList.add('materialPreviewCount');
    materialPreviewCount.innerText = materialType === 0 ? 12 : 6;
    materialPreviewCount.id = `materialCount${materialType}`;
    materialPreview.appendChild(materialPreviewCount);

    materialQualityTierContainer.appendChild(materialPreview);

    for (let materialQualityTier = 1; materialQualityTier <= maximumMaterialQuality; materialQualityTier++) {
        const button = document.createElement('button');
    
        // Each tier is identified by the amount of stars
        for (let j = 0; j < materialQualityTier; j++) {
            const image = document.createElement('img');
            image.src = `src/web/images/star.png`;
            button.appendChild(image);
        }
    
        materialQualityTierContainer.appendChild(button);
    
        // Maximum material quality is the default
        if (materialQualityTier === maximumMaterialQuality) {
            button.classList.add('selected');
        }
    
        button.addEventListener('click', () => {
            options.matTiers[materialType] = materialQualityTier;

            materialPreviewBackground.src = `src/web/images/tiers/tier${materialQualityTier}bg.png`;

            updateMaterialPreview();
    
            // De-select all other buttons
            button.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
    
            button.classList.add('selected');
        });
    }

    document.getElementById('materialQuality').appendChild(materialQualityTierContainer);
}

updateMaterialPreview();