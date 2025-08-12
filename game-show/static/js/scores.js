/**
 * Scores Interface JavaScript
 * Handles score board functionality and player score management
 */

// Score board specific variables
let scoreUpdateQueue = [];
let isProcessingUpdates = false;

// Initialize scores page
document.addEventListener('DOMContentLoaded', function() {
    initializeScoreBoard();
    setupScoreControls();
    setupGameControls();
});

function initializeScoreBoard() {
    // Fetch initial scores
    GameShow.fetchScores().then(data => {
        if (data) {
            updateScoreDisplay();
            highlightHighScore();
        }
    });
    
    // Set up auto-refresh
    setInterval(() => {
        GameShow.fetchScores().then(data => {
            if (data) {
                updateScoreDisplay();
                highlightHighScore();
            }
        });
    }, 10000); // Refresh every 10 seconds
}

function setupScoreControls() {
    // Add event listeners to score buttons
    GameShowUtils.getAllElements('.score-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const playerCard = this.closest('.player-score-card');
            const playerId = parseInt(playerCard.dataset.playerId);
            const points = parseInt(this.textContent.match(/[+-]?\d+/)[0]);
            
            // Add to update queue
            addToUpdateQueue(playerId, points);
        });
    });
}

function setupGameControls() {
    // Reset scores button
    const resetButton = GameShowUtils.getElement('button[onclick="resetScores()"]');
    if (resetButton) {
        GameShowUtils.initializeButtonState(resetButton);
        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            resetScores();
        });
    }
    
    // Spin wheel button
    const wheelButton = GameShowUtils.getElement('button[onclick*="wheel"]');
    if (wheelButton) {
        GameShowUtils.initializeButtonState(wheelButton);
        wheelButton.addEventListener('click', function(e) {
            e.preventDefault();
            GameShow.navigateToWheel();
        });
    }
}

function addToUpdateQueue(playerId, points) {
    if (!GameShowUtils.isValidPlayerId(playerId) || !GameShowUtils.isValidPoints(points)) {
        console.warn('Invalid player ID or points:', { playerId, points });
        return;
    }
    
    scoreUpdateQueue.push({ playerId, points });
    
    if (!isProcessingUpdates) {
        processUpdateQueue();
    }
}

async function processUpdateQueue() {
    if (isProcessingUpdates || scoreUpdateQueue.length === 0) return;
    
    isProcessingUpdates = true;
    
    while (scoreUpdateQueue.length > 0) {
        const update = scoreUpdateQueue.shift();
        
        try {
            await GameShow.updateScore(update.playerId, update.points);
            
            // Add visual feedback
            const scoreElement = GameShowUtils.getElement(`#score-${update.playerId}`);
            if (scoreElement) {
                GameShowUtils.animateElement(scoreElement, 'score-update');
            }
            
            // Small delay between updates
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            GameShowUtils.handleError(error, 'Processing score update');
        }
    }
    
    isProcessingUpdates = false;
}

function updateScoreDisplay() {
    // Update all score displays
    Object.entries(GameShow.currentScores || {}).forEach(([player, score]) => {
        const scoreElements = GameShowUtils.getAllElements(`[id^="score-"][id$="${player}"]`);
        scoreElements.forEach(element => {
            element.textContent = GameShow.formatNumber(score);
        });
    });
    
    // Update modal scores if modal exists
    updateModalScores();
    
    // Check for winner
    GameShow.checkWinner();
}

function updateModalScores() {
    Object.entries(GameShow.currentScores || {}).forEach(([player, score]) => {
        const modalScoreElement = GameShowUtils.getElement(`#modal-score-${player}`);
        if (modalScoreElement) {
            modalScoreElement.textContent = GameShow.formatNumber(score);
        }
    });
}

function highlightHighScore() {
    if (!GameShow.currentScores || Object.keys(GameShow.currentScores).length === 0) return;
    
    // Remove previous highlights
    GameShowUtils.getAllElements('.player-score-card').forEach(card => {
        GameShowUtils.removeClass(card, 'high-score');
    });
    
    // Find highest score
    const maxScore = Math.max(...Object.values(GameShow.currentScores));
    const highScorers = Object.entries(GameShow.currentScores)
        .filter(([player, score]) => score === maxScore)
        .map(([player]) => player);
    
    // Highlight high scorers
    highScorers.forEach(player => {
        const playerCard = GameShowUtils.getElement(`[data-player-id="${player}"]`);
        if (playerCard) {
            GameShowUtils.addClass(playerCard, 'high-score');
        }
    });
}

async function resetScores() {
    if (!confirm('Are you sure you want to reset all scores to zero?')) {
        return;
    }
    
    try {
        // Reset each player's score to 0
        const players = Object.keys(GameShow.currentScores || {});
        for (const player of players) {
            const playerId = players.indexOf(player);
            const currentScore = GameShow.currentScores[player];
            if (currentScore !== 0) {
                await GameShow.updateScore(playerId, -currentScore);
            }
        }
        
        GameShow.showNotification('All scores have been reset!', 'info');
        
        // Update display
        updateScoreDisplay();
        highlightHighScore();
        
    } catch (error) {
        GameShowUtils.handleError(error, 'Resetting scores');
    }
}

// Override the onclick functions to use our event handlers
window.updateScore = function(playerId, points) {
    addToUpdateQueue(playerId, points);
};

window.resetScores = function() {
    resetScores();
};

// Add keyboard shortcuts for score updates
document.addEventListener('keydown', function(event) {
    // Only handle if we're on the scores page
    if (window.location.pathname !== '/') return;
    
    const playerId = event.key === '1' ? 0 : 
                    event.key === '2' ? 1 : 
                    event.key === '3' ? 2 : null;
    
    if (playerId !== null) {
        let points = 0;
        
        // Shift + number = add points, Ctrl + number = subtract points
        if (event.shiftKey) {
            points = 100;
        } else if (event.ctrlKey) {
            points = -100;
        }
        
        if (points !== 0) {
            event.preventDefault();
            addToUpdateQueue(playerId, points);
            GameShow.showNotification(
                `${points > 0 ? '+' : ''}${points} points for Player ${playerId + 1}`,
                points > 0 ? 'success' : 'warning'
            );
        }
    }
    
    // R key to reset scores
    if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        resetScores();
    }
});

// Add visual feedback for score changes
function addScoreChangeIndicator(playerId, points) {
    const playerCard = GameShowUtils.getElement(`[data-player-id="${playerId}"]`);
    if (!playerCard) return;
    
    const indicator = document.createElement('div');
    indicator.className = `score-change-indicator ${points > 0 ? 'positive' : 'negative'}`;
    indicator.textContent = `${points > 0 ? '+' : ''}${points}`;
    
    playerCard.appendChild(indicator);
    
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.remove();
        }
    }, 1000);
}
