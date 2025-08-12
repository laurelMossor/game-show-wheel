/**
 * Main Game Show JavaScript
 * Common functionality and utilities
 */

// Global variables
let currentScores = {};
let isUpdating = false;

// Utility functions
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
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
        const data = await apiCall('/api/scores');
        currentScores = data.scores;
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
            currentScores = data.scores;
            updateScoreDisplay();
            showNotification(`Score updated! ${points > 0 ? '+' : ''}${points} points`, 'success');
            
            // Add animation class
            const scoreElement = document.getElementById(`score-${playerId}`);
            if (scoreElement) {
                scoreElement.classList.add(points > 0 ? 'score-change-positive' : 'score-change-negative');
                setTimeout(() => {
                    scoreElement.classList.remove('score-change-positive', 'score-change-negative');
                }, 800);
            }
        }
    } catch (error) {
        console.error('Failed to update score:', error);
    } finally {
        isUpdating = false;
    }
}

function updateScoreDisplay() {
    // Update all score displays
    Object.entries(currentScores).forEach(([player, score]) => {
        const scoreElements = document.querySelectorAll(`[id^="score-"][id$="${player}"]`);
        scoreElements.forEach(element => {
            element.textContent = score;
        });
    });
    
    // Check for winner
    checkWinner();
}

function checkWinner() {
    if (!currentScores || Object.keys(currentScores).length === 0) return;
    
    const maxScore = Math.max(...Object.values(currentScores));
    const winners = Object.entries(currentScores)
        .filter(([player, score]) => score === maxScore)
        .map(([player]) => player);
    
    const winnerSection = document.getElementById('winner-section');
    const winnerName = document.getElementById('winner-name');
    
    if (winners.length === 1 && maxScore > 0) {
        winnerName.textContent = winners[0];
        winnerSection.style.display = 'block';
        winnerSection.classList.add('fade-in');
    } else {
        winnerSection.style.display = 'none';
    }
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
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
            break;
    }
});

// Auto-refresh scores every 30 seconds
setInterval(fetchScores, 30000);

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Fetch initial scores
    fetchScores();
    
    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('btn-loading')) return;
            
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="loading-spinner"></span> Loading...';
            this.classList.add('btn-loading');
            this.disabled = true;
            
            // Remove loading state after a delay (or when API call completes)
            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.remove('btn-loading');
                this.disabled = false;
            }, 2000);
        });
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Export functions for use in other modules
window.GameShow = {
    showNotification,
    formatNumber,
    apiCall,
    fetchScores,
    updateScore,
    updateScoreDisplay,
    checkWinner,
    navigateToScores,
    navigateToWheel,
    get currentScores() { return currentScores; }
};

console.log('GameShow object exported to window:', window.GameShow);
