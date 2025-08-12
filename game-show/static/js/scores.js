/**
 * Scores Interface JavaScript
 * Handles score board functionality and player score management
 * Now with persistent state storage using localStorage
 */

// Score board specific variables
let scoreUpdateQueue = [];
let isProcessingUpdates = false;
let isInitialized = false;

// Constants
const DEFAULT_FAVOR = 100;
const UPDATE_DELAY = 100;
const STORAGE_KEYS = {
    PLAYER_NAMES: 'gameShow_playerNames',
    PLAYER_SCORES: 'gameShow_playerScores',
    LAST_SYNC: 'gameShow_lastSync'
};

// Initialize scores page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    waitForGameShow();
});

// Handle page visibility changes (when navigating back to the page)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && window.GameShow && window.GameShow.currentScores) {
        console.log('Page became visible, restoring state from localStorage');
        restoreStateFromStorage();
        updateScoreDisplay();
        
        // Also sync any input fields that might have been modified
        syncInputFieldsWithScores();
    }
});

function waitForGameShow() {
    console.log('waitForGameShow called:', {
        GameShowExists: typeof window.GameShow !== 'undefined',
        currentScoresExists: window.GameShow?.currentScores !== undefined,
        GameShowUtilsExists: typeof window.GameShowUtils !== 'undefined',
        isInitialized: isInitialized
    });
    
    if (typeof window.GameShow !== 'undefined' && 
        window.GameShow.currentScores !== undefined && 
        typeof window.GameShowUtils !== 'undefined' &&
        !isInitialized) {
        console.log('Initializing scores page...');
        initializeScoreBoard();
        setupEditableNames();
        setupFavorControls();
        setupRefreshButton();
        isInitialized = true;
    } else if (!isInitialized) {
        setTimeout(waitForGameShow, 100);
    }
}

function initializeScoreBoard() {
    console.log('initializeScoreBoard called');
    
    if (typeof GameShow === 'undefined' || !GameShow.currentScores) {
        console.warn('GameShow object not ready, retrying...');
        setTimeout(initializeScoreBoard, 100);
        return;
    }
    
    // First, try to restore state from localStorage
    restoreStateFromStorage();
    
    // Always update the display to reflect current values
    updateScoreDisplay();
    
    // If we don't have any scores yet, fetch from server
    if (Object.keys(GameShow.currentScores).length === 0) {
        console.log('No scores found, fetching from server...');
        fetchAndUpdateScores();
    } else {
        console.log('Using current scores:', GameShow.currentScores);
    }
}

function restoreStateFromStorage() {
    try {
        // Restore player names
        const savedNames = localStorage.getItem(STORAGE_KEYS.PLAYER_NAMES);
        if (savedNames) {
            const playerNames = JSON.parse(savedNames);
            Object.entries(playerNames).forEach(([playerId, name]) => {
                const nameInput = document.querySelector(`.player-name-input[data-player-id="${playerId}"]`);
                if (nameInput) {
                    nameInput.value = name;
                    nameInput.dataset.originalValue = name;
                }
            });
            console.log('Restored player names:', playerNames);
        }
        
        // Restore player scores
        const savedScores = localStorage.getItem(STORAGE_KEYS.PLAYER_SCORES);
        if (savedScores) {
            const playerScores = JSON.parse(savedScores);
            // Update GameShow.currentScores with the restored scores
            GameShow.currentScores = playerScores;
            console.log('Restored player scores:', playerScores);
        } else {
            // If no saved scores, initialize with defaults
            GameShow.currentScores = { 'Player 1': DEFAULT_FAVOR, 'Player 2': DEFAULT_FAVOR, 'Player 3': DEFAULT_FAVOR };
            console.log('No saved scores found, using defaults:', GameShow.currentScores);
        }
        
        // Update last sync timestamp
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
        
    } catch (error) {
        console.warn('Error restoring state from localStorage:', error);
        // Fallback to defaults if restoration fails
        GameShow.currentScores = { 'Player 1': DEFAULT_FAVOR, 'Player 2': DEFAULT_FAVOR, 'Player 3': DEFAULT_FAVOR };
        console.log('Using fallback default scores:', GameShow.currentScores);
    }
}

function saveStateToStorage() {
    try {
        // Save player names
        const playerNames = {};
        document.querySelectorAll('.player-name-input').forEach(input => {
            const playerId = input.dataset.playerId;
            playerNames[playerId] = input.value;
        });
        localStorage.setItem(STORAGE_KEYS.PLAYER_NAMES, JSON.stringify(playerNames));
        
        // Save player scores
        if (GameShow.currentScores) {
            localStorage.setItem(STORAGE_KEYS.PLAYER_SCORES, JSON.stringify(GameShow.currentScores));
        }
        
        // Update last sync timestamp
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
        
        console.log('State saved to localStorage:', { playerNames, scores: GameShow.currentScores });
    } catch (error) {
        console.warn('Error saving state to localStorage:', error);
    }
}

function setupRefreshButton() {
    const refreshBtn = document.getElementById('refresh-scores-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            console.log('Manual refresh requested');
            fetchAndUpdateScores(true); // Force refresh
        });
    }
}

function fetchAndUpdateScores(forceRefresh = false) {
    // Check if we should fetch from server (avoid too frequent requests)
    const lastSync = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || '0');
    const timeSinceLastSync = Date.now() - lastSync;
    const minSyncInterval = 5000; // 5 seconds minimum between syncs
    
    if (!forceRefresh && timeSinceLastSync < minSyncInterval) {
        console.log('Skipping server sync, too soon since last sync');
        return;
    }
    
    console.log('Fetching scores from server...');
    GameShow.fetchScores().then(data => {
        if (data && data.scores) {
            const currentScores = GameShow.currentScores || {};
            const newScores = data.scores;
            
            // Update the GameShow scores with the server data
            GameShow.currentScores = newScores;
            
            // Update the display to show the new scores
            updateScoreDisplay();
            
            // Save the new state to localStorage
            saveStateToStorage();
            
            console.log('Scores updated from server:', newScores);
        }
    }).catch(error => {
        console.warn('Failed to fetch scores from server, using local state:', error);
    });
}

function setupEditableNames() {
    setupInputControls('.player-name-input', savePlayerName);
}

function setupFavorControls() {
    setupInputControls('.favor-value-input', saveFavorValue, true);
}

function setupInputControls(selector, saveFunction, isNumeric = false) {
    GameShowUtils.getAllElements(selector).forEach(input => {
        input.addEventListener('click', () => input.select());
        input.addEventListener('keydown', (e) => handleKeyDown(e, input, saveFunction));
        input.addEventListener('blur', () => saveFunction(input));
        
        if (isNumeric) {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/[^0-9-]/g, '');
            });
        }
    });
}

function handleKeyDown(event, input, saveFunction) {
    if (event.key === 'Enter') {
        input.blur();
        saveFunction(input);
    } else if (event.key === 'Escape') {
        if (input.classList.contains('favor-value-input')) {
            const playerId = parseInt(input.dataset.playerId);
            const playerName = getPlayerNameFromId(playerId);
            input.value = playerName ? (GameShow.currentScores[playerName] || DEFAULT_FAVOR) : DEFAULT_FAVOR;
        } else {
            input.value = input.dataset.originalValue;
        }
        input.blur();
    }
}

function savePlayerName(input) {
    const playerId = parseInt(input.closest('.player-score-card').dataset.playerId);
    const newName = input.value.trim();
    
    if (newName === '') {
        input.value = input.dataset.originalValue;
        return;
    }
    
    input.dataset.originalValue = newName;
    console.log(`Player ${playerId + 1} name changed to: ${newName}`);
    
    // Save state immediately when name changes
    saveStateToStorage();
}

function saveFavorValue(input) {
    const playerId = parseInt(input.dataset.playerId);
    const newValue = parseInt(input.value) || DEFAULT_FAVOR;
    updateFavorValue(playerId, newValue);
}

function updateFavorValue(playerId, newValue) {
    if (!GameShowUtils.isValidPlayerId(playerId)) {
        console.warn('Invalid player ID:', playerId);
        return;
    }
    
    // Get the player name from the ID
    const playerName = getPlayerNameFromId(playerId);
    if (!playerName) {
        console.warn('Could not find player name for ID:', playerId);
        return;
    }
    
    const currentValue = GameShow.currentScores[playerName] || DEFAULT_FAVOR;
    const difference = newValue - currentValue;
    
    if (difference !== 0) {
        // Update the local score immediately
        GameShow.currentScores[playerName] = newValue;
        updateScoreDisplay();
        saveStateToStorage();
        
        // Queue the update to the server
        addToUpdateQueue(playerId, difference);
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
            await new Promise(resolve => setTimeout(resolve, UPDATE_DELAY));
        } catch (error) {
            GameShowUtils.handleError(error, 'Processing score update');
        }
    }
    
    isProcessingUpdates = false;
}

function logCurrentState() {
    console.log('=== CURRENT STATE DEBUG ===');
    console.log('GameShow.currentScores:', GameShow.currentScores);
    console.log('Input field values:');
    document.querySelectorAll('.favor-value-input').forEach(input => {
        const playerId = input.dataset.playerId;
        const value = input.value;
        console.log(`  Player ${playerId}: ${value}`);
    });
    console.log('localStorage scores:', localStorage.getItem(STORAGE_KEYS.PLAYER_SCORES));
    console.log('==========================');
}

// Add debug logging to key functions
function updateScoreDisplay() {
    console.log('updateScoreDisplay called with scores:', GameShow.currentScores);
    
    if (GameShow.currentScores) {
        Object.entries(GameShow.currentScores).forEach(([playerName, score]) => {
            // Map player names to player IDs for the input fields
            const playerId = getPlayerIdFromName(playerName);
            if (playerId !== null) {
                const favorInputs = GameShowUtils.getAllElements(`.favor-value-input[data-player-id="${playerId}"]`);
                favorInputs.forEach(element => {
                    // Always update the input field to match the current score
                    element.value = GameShow.formatNumber(score);
                });
            }
        });
    }
    
    // Only update modal scores if we're on a page that has modals
    if (window.location.pathname !== '/') {
        updateModalScores();
    }
    
    logCurrentState();
}

function getPlayerIdFromName(playerName) {
    // Map player names to numeric IDs
    const playerMap = {
        'Player 1': 0,
        'Player 2': 1,
        'Player 3': 2
    };
    return playerMap[playerName] || null;
}

function getPlayerNameFromId(playerId) {
    // Map numeric IDs to player names
    const playerMap = {
        0: 'Player 1',
        1: 'Player 2',
        2: 'Player 3'
    };
    return playerMap[playerId] || null;
}

function updateModalScores() {
    if (GameShow.currentScores) {
        Object.entries(GameShow.currentScores).forEach(([player, score]) => {
            try {
                const playerId = parseInt(player);
                if (!isNaN(playerId) && playerId >= 0 && playerId <= 2) {
                    const modalScoreElement = GameShowUtils.getElement(`#modal-score-${playerId}`);
                    if (modalScoreElement) {
                        modalScoreElement.textContent = GameShow.formatNumber(score);
                    }
                }
            } catch (error) {
                console.warn(`Error updating modal score for player ${player}:`, error);
            }
        });
    }
}

function syncInputFieldsWithScores() {
    if (GameShow.currentScores) {
        Object.entries(GameShow.currentScores).forEach(([playerName, score]) => {
            const playerId = getPlayerIdFromName(playerName);
            if (playerId !== null) {
                const favorInputs = GameShowUtils.getAllElements(`.favor-value-input[data-player-id="${playerId}"]`);
                favorInputs.forEach(element => {
                    // Always sync the input field with the current score
                    element.value = GameShow.formatNumber(score);
                });
            }
        });
    }
}

// Keyboard shortcuts for favor updates
document.addEventListener('keydown', function(event) {
    if (window.location.pathname !== '/') return;
    
    const playerId = event.key === '1' ? 0 : 
                    event.key === '2' ? 1 : 
                    event.key === '3' ? 2 : null;
    
    if (playerId !== null) {
        let points = 0;
        
        if (event.shiftKey) {
            points = 100;
        } else if (event.ctrlKey) {
            points = -100;
        }
        
        if (points !== 0) {
            event.preventDefault();
            const playerName = getPlayerNameFromId(playerId);
            if (playerName) {
                const currentScore = GameShow.currentScores[playerName] || DEFAULT_FAVOR;
                updateFavorValue(playerId, currentScore + points);
            }
        }
    }
});

// Auto-save state periodically and before page unload
setInterval(saveStateToStorage, 10000); // Save every 10 seconds

window.addEventListener('beforeunload', function() {
    saveStateToStorage();
});
