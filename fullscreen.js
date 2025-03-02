document.addEventListener('DOMContentLoaded', function() {
    checkWindowWidth();
    
    window.addEventListener('resize', checkWindowWidth);
    
    document.getElementById('alert-close-btn').addEventListener('click', function() {
        const alertElement = document.getElementById('resolution-alert');
        alertElement.classList.add('alert-closing');
        
        setTimeout(function() {
            alertElement.classList.add('hidden');
            alertElement.classList.remove('alert-closing');
        }, 300);
    });
});

function checkWindowWidth() {
    const minWidth = 1280;
    const currentWidth = window.innerWidth;
    
    if (currentWidth < minWidth) {
        showResolutionAlert(currentWidth);
    } else {
        hideResolutionAlert();
    }
}

function showResolutionAlert(currentWidth) {
    const alertElement = document.getElementById('resolution-alert');
    const currentWidthElement = document.getElementById('current-width');
    
    currentWidthElement.textContent = `현재 브라우저 크기: ${currentWidth}px`;
    
    if (alertElement.classList.contains('hidden')) {
        alertElement.classList.remove('hidden');
    }
}

function hideResolutionAlert() {
    const alertElement = document.getElementById('resolution-alert');
    if (!alertElement.classList.contains('hidden')) {
        alertElement.classList.add('alert-closing');
        
        setTimeout(function() {
            alertElement.classList.add('hidden');
            alertElement.classList.remove('alert-closing');
        }, 300);
    }
}