/**
 * Main Game Show JavaScript
 * Common functionality and utilities
 */

// Global variables
let gameShowScores = {};
let isUpdating = false;

// Utility functions
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed game-show-notification`;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);
    
    // Bootstrap alert functionality
    const bsAlert = new bootstrap.Alert(notification);
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// API utility functions
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        showNotification(`Error: ${error.message}`, 'danger');
        throw error;
    }
}

// Score management functions
async function fetchScores() {
    try {
        console.log('fetchScores called - fetching from server...');
        const data = await apiCall('/api/scores');
        console.log('fetchScores received data:', data);
        gameShowScores = data.scores;
        console.log('fetchScores updated gameShowScores to:', gameShowScores);
        return data;
    } catch (error) {
        console.error('Failed to fetch scores:', error);
        return null;
    }
}

async function updateScore(playerId, points) {
    if (isUpdating) return;
    
    isUpdating = true;
    
    try {
        const data = await apiCall('/api/scores/update', {
            method: 'POST',
            body: JSON.stringify({ player_id: playerId, points: points })
        });
        
        if (data.success) {
            gameShowScores = data.scores;
            updateScoreDisplay();
            
            // Save to localStorage
            try {
                localStorage.setItem('gameShow_playerScores', JSON.stringify(gameShowScores));
                console.log('Scores saved to localStorage after update');
            } catch (error) {
                console.warn('Failed to save scores to localStorage:', error);
            }
        }
    } catch (error) {
        GameShowUtils.handleError(error, 'Updating score');
    } finally {
        isUpdating = false;
    }
}

function updateScoreDisplay() {
    // Update all score displays
    Object.entries(gameShowScores).forEach(([player, score]) => {
        const scoreElements = GameShowUtils.getAllElements(`[id^="score-"][id$="${player}"]`);
        scoreElements.forEach(element => {
            element.textContent = score;
        });
    });
}

// Navigation functions
function navigateToScores() {
    window.location.href = '/';
}

function navigateToWheel() {
    window.location.href = '/wheel';
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Prevent default for function keys
    if (event.key.startsWith('F') && event.key !== 'F5') {
        event.preventDefault();
    }
    
    switch(event.key) {
        case 'F1':
            navigateToScores();
            break;
        case 'F2':
            navigateToWheel();
            break;
        case 'Escape':
            // Close any open modals
            const modals = GameShowUtils.getAllElements('.modal.show');
            modals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
            break;
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('main.js DOMContentLoaded - current scores:', gameShowScores);
    
    // Try to restore scores from localStorage first
    const savedScores = localStorage.getItem('gameShow_playerScores');
    if (savedScores) {
        try {
            gameShowScores = JSON.parse(savedScores);
            console.log('Restored scores from localStorage:', gameShowScores);
        } catch (error) {
            console.warn('Error parsing saved scores:', error);
        }
    }
    
    // Only fetch initial scores if we don't have any yet
    if (!gameShowScores || Object.keys(gameShowScores).length === 0) {
        console.log('No scores found, fetching from server...');
        fetchScores();
    } else {
        console.log('Scores already exist, skipping fetch:', gameShowScores);
    }
});

// Export functions for use in other modules
window.GameShow = {
    showNotification,
    formatNumber,
    apiCall,
    fetchScores,
    updateScore,
    updateScoreDisplay,
    navigateToScores,
    navigateToWheel,
    get currentScores() { return gameShowScores; }
};

console.log('GameShow object exported to window:', window.GameShow);
