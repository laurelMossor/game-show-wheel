/**
 * Game Show Utilities
 * Shared functions and utilities across all modules
 */

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout, wait);
        timeout = setTimeout(later, wait);
    };
}

// Button state management
function setButtonState(button, isLoading, loadingText = 'Loading...', defaultText = null) {
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = `<span class="loading-spinner"></span> ${loadingText}`;
        button.classList.add('btn-loading');
    } else {
        button.disabled = false;
        button.innerHTML = defaultText || button.dataset.originalText || button.innerHTML;
        button.classList.remove('btn-loading');
    }
}

// Initialize button state tracking
function initializeButtonState(button) {
    if (button && !button.dataset.originalText) {
        button.dataset.originalText = button.innerHTML;
    }
}

// Error handling utility
function handleError(error, context = 'Operation', fallbackAlert = true) {
    console.error(`${context} failed:`, error);
    
    if (typeof GameShow !== 'undefined' && GameShow.showNotification) {
        GameShow.showNotification(`${context} failed: ${error.message}`, 'danger');
    } else if (fallbackAlert) {
        alert(`${context} failed: ${error.message}`);
    }
}

// DOM utility functions
function getElement(selector, context = document) {
    return context.querySelector(selector);
}

function getAllElements(selector, context = document) {
    return context.querySelectorAll(selector);
}

function addClass(element, className) {
    if (element) element.classList.add(className);
}

function removeClass(element, className) {
    if (element) element.classList.remove(className);
}

function toggleClass(element, className, condition) {
    if (element) {
        if (condition) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    }
}

// Animation utilities
function animateElement(element, animationClass, duration = 600) {
    if (!element) return;
    
    addClass(element, animationClass);
    setTimeout(() => removeClass(element, animationClass), duration);
}

// Validation utilities
function isValidPlayerId(playerId) {
    return playerId >= 0 && playerId <= 2;
}

function isValidPoints(points) {
    return typeof points === 'number' && !isNaN(points);
}

// Export for browser environment
window.GameShowUtils = {
    debounce,
    setButtonState,
    initializeButtonState,
    handleError,
    getElement,
    getAllElements,
    addClass,
    removeClass,
    toggleClass,
    animateElement,
    isValidPlayerId,
    isValidPoints
};
