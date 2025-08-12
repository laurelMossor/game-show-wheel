/**
 * Wheel Interface JavaScript
 * Handles spinning wheel mechanics and canvas rendering
 */

// Wheel state variables
let wheelCanvas;
let wheelContext;
let wheelSegments = [];
let isSpinning = false;
let currentRotation = 0;

// Initialize wheel page
document.addEventListener('DOMContentLoaded', function() {
    // Wait for GameShow object to be available
    function waitForGameShow() {
        if (typeof window.GameShow !== 'undefined' && window.GameShow.apiCall) {
            initializeWheel();
            setupWheelControls();
            loadWheelSegments();
        } else {
            setTimeout(waitForGameShow, 50);
        }
    }
    
    waitForGameShow();
});

function initializeWheel() {
    wheelCanvas = document.getElementById('wheel-canvas');
    if (!wheelCanvas) return;
    
    wheelContext = wheelCanvas.getContext('2d');
    if (!wheelContext) return;
    
    // Set canvas size - now 600x600 for TV display
    const size = 600;
    wheelCanvas.width = size;
    wheelCanvas.height = size;
    
    // Draw initial wheel
    drawWheel();
}

function setupWheelControls() {
    // Spin button
    const spinButton = document.querySelector('#spin-button');
    if (spinButton) {
        spinButton.addEventListener('click', function(e) {
            e.preventDefault();
            spinWheel();
        });
    }
}

async function loadWheelSegments() {
    try {
        // Check if GameShow object is available
        if (typeof GameShow === 'undefined' || !GameShow.apiCall) {
            // Try to use fetch directly as fallback
            if (typeof fetch !== 'undefined') {
                try {
                    const response = await fetch('/api/wheel/segments');
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    wheelSegments = data.segments;
                    // Apply medieval colors to API segments
                    applyMedievalColors();
                    drawWheel();
                    return;
                } catch (fetchError) {
                    throw new Error('Both GameShow and fetch fallback failed');
                }
            }
            
            throw new Error('GameShow system not ready and no fetch fallback');
        }
        
        const data = await GameShow.apiCall('/api/wheel/segments');
        wheelSegments = data.segments;
        // Apply medieval colors to API segments
        applyMedievalColors();
        drawWheel();
    } catch (error) {
        // Use default segments if API fails
        wheelSegments = [
            { id: 0, text: "New Rule", action: "new_rule", angle: 0 },
            { id: 1, text: "New Rule", action: "new_rule", angle: 30 },
            { id: 2, text: "New Rule", action: "new_rule", angle: 60 },
            { id: 3, text: "Modify: Audience Choice", action: "audience_choice", angle: 90 },
            { id: 4, text: "Modify: Audience Choice", action: "audience_choice", angle: 120 },
            { id: 5, text: "Challenge", action: "challenge", angle: 150 },
            { id: 6, text: "Challenge", action: "challenge", angle: 180 },
            { id: 7, text: "Challenge", action: "challenge", angle: 210 },
            { id: 8, text: "Modify: Duplicate", action: "duplicate", angle: 240 },
            { id: 9, text: "Modify: Reverse", action: "reverse", angle: 270 },
            { id: 10, text: "Modify: Swap", action: "swap", angle: 300 }
        ];
        
        // Apply colors to fallback segments
        applyMedievalColors();
        drawWheel();
    }
}

// Function to get CSS variable value
function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Function to get color based on segment action
function getColorForAction(action) {
    const actionColors = {
        'new_rule': getCSSVariable('--accent-color'),           // Crimson
        'audience_choice': getCSSVariable('--muted-green'),     // Muted Green
        'challenge': getCSSVariable('--deep-brown'),            // Deep Brown
        'duplicate': getCSSVariable('--primary-color'),         // Saddle Brown
        'reverse': getCSSVariable('--secondary-color'),         // Dark Olive Green
        'swap': getCSSVariable('--info-color')                  // Steel Blue
    };
    
    return actionColors[action] || getCSSVariable('--tan-color');
}

// Function to apply medieval colors to wheel segments
function applyMedievalColors() {
    // Apply colors based on segment actions
    wheelSegments.forEach((segment, index) => {
        segment.color = getColorForAction(segment.action);
    });
}

function drawWheel() {
    if (!wheelContext || !wheelSegments.length) return;
    
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    // Clear canvas
    wheelContext.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    
    // Draw segments
    const segmentAngle = (2 * Math.PI) / wheelSegments.length;
    
    wheelSegments.forEach((segment, index) => {
        const startAngle = index * segmentAngle + currentRotation;
        const endAngle = (index + 1) * segmentAngle + currentRotation;
        
        // Draw segment
        wheelContext.beginPath();
        wheelContext.moveTo(centerX, centerY);
        wheelContext.arc(centerX, centerY, radius, startAngle, endAngle);
        wheelContext.closePath();
        
        // Fill segment
        wheelContext.fillStyle = segment.color;
        wheelContext.fill();
        
        // Draw segment border
        wheelContext.strokeStyle = '#ffffff';
        wheelContext.lineWidth = 2;
        wheelContext.stroke();
        
        // Draw text
        const textAngle = startAngle + segmentAngle / 2;
        const textRadius = radius * 0.7;
        const textX = centerX + Math.cos(textAngle) * textRadius;
        const textY = centerY + Math.sin(textAngle) * textRadius;
        
        wheelContext.save();
        wheelContext.translate(textX, textY);
        // Rotate text to be vertical like a wheel spoke (from center to edge)
        wheelContext.rotate(textAngle);
        
        // Text styling with medieval font
        wheelContext.fillStyle = '#ffffff';
        wheelContext.font = 'bold 16px "Cinzel", serif';
        wheelContext.textAlign = 'center';
        wheelContext.textBaseline = 'middle';
        
        // Draw text with shadow
        wheelContext.shadowColor = 'rgba(0, 0, 0, 0.7)';
        wheelContext.shadowBlur = 4;
        wheelContext.shadowOffsetX = 2;
        wheelContext.shadowOffsetY = 2;
        
        // Handle long text by splitting into multiple lines
        const words = segment.text.split(' ');
        const lineHeight = 20;
        
        if (words.length > 2) {
            // Split into multiple lines
            let currentLine = '';
            let lineCount = 0;
            
            for (let i = 0; i < words.length; i++) {
                const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
                if (testLine.length > 8 && currentLine) {
                    // Draw current line
                    wheelContext.fillText(currentLine, 0, lineCount * lineHeight - (words.length - 1) * lineHeight / 2);
                    lineCount++;
                    currentLine = words[i];
                } else {
                    currentLine = testLine;
                }
            }
            // Draw last line
            if (currentLine) {
                wheelContext.fillText(currentLine, 0, lineCount * lineHeight - (words.length - 1) * lineHeight / 2);
            }
        } else {
            wheelContext.fillText(segment.text, 0, 0);
        }
        
        wheelContext.restore();
    });
    
    // Draw center circle
    wheelContext.beginPath();
    wheelContext.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    wheelContext.fillStyle = '#ffffff';
    wheelContext.fill();
    wheelContext.strokeStyle = '#333333';
    wheelContext.lineWidth = 3;
    wheelContext.stroke();
}

async function spinWheel() {
    if (isSpinning) return;
    
    // Check if GameShow object is available
    if (typeof GameShow === 'undefined' || !GameShow.apiCall) {
        // Try to use fetch directly as fallback
        if (typeof fetch !== 'undefined') {
            try {
                const response = await fetch('/api/wheel/spin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.success) {
                    // Continue with the spin logic
                    // Calculate final rotation - simpler approach with multiple full rotations
                    const baseRotation = data.result.final_angle * (Math.PI / 180);
                    const fullRotations = 8 * 2 * Math.PI; // 8 full rotations for more dramatic effect
                    const finalRotation = baseRotation + fullRotations;
                    
                    // Animate wheel spin
                    animateWheelSpin(finalRotation, () => {
                        // Spin complete
                        isSpinning = false;
                        
                        const spinButton = document.querySelector('#spin-button');
                        if (spinButton) {
                            spinButton.disabled = false;
                            spinButton.innerHTML = '<i class="fas fa-play"></i> SPIN THE WHEEL!';
                        }
                        
                        wheelCanvas.classList.remove('wheel-glow-spinning');
                    });
                } else {
                    throw new Error(data.error || 'Failed to spin wheel');
                }
            } catch (error) {
                alert('Failed to spin wheel: ' + error.message);
                
                isSpinning = false;
                const spinButton = document.querySelector('#spin-button');
                if (spinButton) {
                    spinButton.disabled = false;
                    spinButton.innerHTML = '<i class="fas fa-play"></i> SPIN THE WHEEL!';
                }
                wheelCanvas.classList.remove('wheel-glow-spinning');
            }
            return;
        }
        
        // If no fallback available, show error
        if (typeof GameShow !== 'undefined' && GameShow.showNotification) {
            GameShow.showNotification('GameShow system not ready. Please refresh the page.', 'danger');
        } else {
            alert('GameShow system not ready. Please refresh the page.');
        }
        return;
    }
    
    isSpinning = true;
    const spinButton = document.querySelector('#spin-button');
    if (spinButton) {
        spinButton.disabled = true;
        spinButton.innerHTML = '<span class="loading-spinner"></span> Spinning...';
    }
    
    try {
        // Add spinning animation class
        wheelCanvas.classList.add('wheel-glow-spinning');
        
        // Get spin result from API
        const data = await GameShow.apiCall('/api/wheel/spin', {
            method: 'POST'
        });
        
        if (data.success) {
            // Calculate final rotation - simpler approach with multiple full rotations
            const baseRotation = data.result.final_angle * (Math.PI / 180);
            const fullRotations = 8 * 2 * Math.PI; // 8 full rotations for more dramatic effect
            const finalRotation = baseRotation + fullRotations;
            
            // Animate wheel spin
            animateWheelSpin(finalRotation, () => {
                // Spin complete
                isSpinning = false;
                
                if (spinButton) {
                    spinButton.disabled = false;
                    spinButton.innerHTML = '<i class="fas fa-play"></i> SPIN THE WHEEL!';
                }
                
                wheelCanvas.classList.remove('wheel-glow-spinning');
            });
        } else {
            throw new Error(data.error || 'Failed to spin wheel');
        }
    } catch (error) {
        // Check if GameShow.showNotification exists before calling it
        if (typeof GameShow !== 'undefined' && GameShow.showNotification) {
            GameShow.showNotification('Failed to spin wheel', 'danger');
        } else {
            alert('Failed to spin wheel: ' + error.message);
        }
        
        isSpinning = false;
        if (spinButton) {
            spinButton.disabled = false;
            spinButton.innerHTML = '<i class="fas fa-play"></i> SPIN THE WHEEL!';
        }
        wheelCanvas.classList.remove('wheel-glow-spinning');
    }
}

function animateWheelSpin(targetRotation, onComplete) {
    const duration = 5000; // 5 seconds for more visible spinning
    const startRotation = currentRotation;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        // Calculate rotation with more dramatic movement
        currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
        
        // Redraw the wheel with new rotation
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            onComplete();
        }
    }
    
    requestAnimationFrame(animate);
}

// Make functions globally available for onclick attributes
window.spinWheel = spinWheel;

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Only handle if we're on the wheel page
    if (window.location.pathname !== '/wheel') return;
    
    switch(event.key) {
        case ' ':
        case 'Enter':
            event.preventDefault();
            if (!isSpinning) {
                spinWheel();
            }
            break;
    }
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
    if (wheelCanvas) {
        drawWheel();
    }
}, 250));

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
