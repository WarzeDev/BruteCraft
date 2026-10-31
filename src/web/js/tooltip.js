const tooltip = document.getElementById('tooltip');

const isMobile = 'ontouchstart' in window;

function showTooltip(text) {
    if (isMobile) return; // Don't show on mobile
    tooltip.innerHTML = text;
    tooltip.style.display = 'block';
}

function hideTooltip() {
    tooltip.style.display = 'none';
}

function updateTooltip(e) {
    const tooltipText = e.target.dataset.tooltip;
    if (tooltipText) {
        showTooltip(tooltipText);
    } else {
        hideTooltip();
    }

    tooltip.style.left = `${e.pageX + 20}px`;
    tooltip.style.top = `${e.pageY}px`;
    
    // Move left if it would go off the screen
    const boundingRect = tooltip.getBoundingClientRect();
    if (e.pageX + 20 + boundingRect.width > window.innerWidth) {
        if (e.pageX - boundingRect.width - 5 < 0) {
            // Snap to right side if it would go off the screen on the left
            tooltip.style.left = `${window.innerWidth - boundingRect.width - 5}px`;
        } else {
            tooltip.style.left = `${e.pageX - boundingRect.width - 5}px`;
        }
    }
}

document.addEventListener('mousemove', (e) => {
    updateTooltip(e);
});

document.addEventListener('click', (e) => {
    updateTooltip(e);
}); 