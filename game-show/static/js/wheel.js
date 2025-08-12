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
    
    // Set canvas size from configuration
    const size = window.WheelConfig?.WHEEL_CONFIG.CANVAS_SIZE || 600;
    wheelCanvas.width = size;
    wheelCanvas.height = size;
    
    // Draw initial wheel
    drawWheel();
}

function setupWheelControls() {
    // Spin button
    const spinButton = document.querySelector('#spin-button');
    if (spinButton) {
        GameShowUtils.initializeButtonState(spinButton);
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
                    // Randomize the segments from the API
                    wheelSegments = randomizeSegments(data.segments);
                    drawWheel();
                    return;
                } catch (fetchError) {
                    throw new Error('Both GameShow and fetch fallback failed');
                }
            }
            
            throw new Error('GameShow system not ready and no fetch fallback');
        }
        
        const data = await GameShow.apiCall('/api/wheel/segments');
        // Randomize the segments from the API
        wheelSegments = randomizeSegments(data.segments);
        drawWheel();
    } catch (error) {
        // Use randomized default segments if API fails
        wheelSegments = window.WheelConfig?.randomizeWheel() || [];
        drawWheel();
    }
}

// Function to randomize segments and assign random colors
function randomizeSegments(segments) {
    if (!segments || !segments.length) {
        return window.WheelConfig?.randomizeWheel() || [];
    }
    
    // Create a copy of segments
    const randomizedSegments = [...segments];
    
    // Shuffle segments using Fisher-Yates algorithm
    for (let i = randomizedSegments.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randomizedSegments[i], randomizedSegments[j]] = [randomizedSegments[j], randomizedSegments[i]];
    }
    
    // Recalculate angles for shuffled segments
    const segmentAngle = 360 / randomizedSegments.length;
    randomizedSegments.forEach((segment, index) => {
        segment.angle = index * segmentAngle;
        // Assign a random soft color
        segment.color = window.WheelConfig?.getRandomSoftColor() || '#F8F9FA';
    });
    
    return randomizedSegments;
}

function drawWheel() {
    if (!wheelContext || !wheelSegments.length) {
        return;
    }
    
    const config = window.WheelConfig?.WHEEL_CONFIG || {};
    
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const radius = Math.min(centerX, centerY) - (config.MIN_RADIUS || 20);
    
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
        
        // Fill segment with soft color
        wheelContext.fillStyle = segment.color || '#F8F9FA';
        wheelContext.fill();
        
        // Draw segment border with subtle dark border
        wheelContext.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        wheelContext.lineWidth = config.BORDER_WIDTH || 2;
        wheelContext.stroke();
        
        // Draw text
        const textAngle = startAngle + segmentAngle / 2;
        const textRadius = radius * (config.TEXT_RADIUS_RATIO || 0.7);
        const textX = centerX + Math.cos(textAngle) * textRadius;
        const textY = centerY + Math.sin(textAngle) * textRadius;
        
        wheelContext.save();
        wheelContext.translate(textX, textY);
        // Rotate text to be vertical like a wheel spoke (from center to edge)
        wheelContext.rotate(textAngle);
        
        // Text styling with medieval font and dark color for contrast
        wheelContext.fillStyle = '#2C3E50'; // Dark blue-gray for better readability on light backgrounds
        wheelContext.font = 'bold 16px "Cinzel", serif';
        wheelContext.textAlign = 'center';
        wheelContext.textBaseline = 'middle';
        
        // Draw text with subtle shadow for depth
        wheelContext.shadowColor = 'rgba(255, 255, 255, 0.8)';
        wheelContext.shadowBlur = 2;
        wheelContext.shadowOffsetX = 1;
        wheelContext.shadowOffsetY = 1;
        
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
    
    // Draw center circle with subtle styling
    const centerRadius = config.CENTER_CIRCLE_RADIUS || 15;
    wheelContext.beginPath();
    wheelContext.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
    wheelContext.fillStyle = '#FFFFFF';
    wheelContext.fill();
    wheelContext.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    wheelContext.lineWidth = config.CENTER_BORDER_WIDTH || 3;
    wheelContext.stroke();
}

async function spinWheel() {
    if (isSpinning) return;
    
    const spinButton = document.querySelector('#spin-button');
    const config = window.WheelConfig?.WHEEL_CONFIG || {};
    
    // Set button to loading state
    GameShowUtils.setButtonState(spinButton, true, 'Spinning...', '<i class="fas fa-play"></i> SPIN THE WHEEL!');
    
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
                    handleSpinSuccess(data, spinButton);
                } else {
                    throw new Error(data.error || 'Failed to spin wheel');
                }
            } catch (error) {
                GameShowUtils.handleError(error, 'Spinning wheel');
                GameShowUtils.setButtonState(spinButton, false);
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
    
    try {
        // Add spinning animation class
        wheelCanvas.classList.add('wheel-glow-spinning');
        
        // Get spin result from API
        const data = await GameShow.apiCall('/api/wheel/spin', {
            method: 'POST'
        });
        
        if (data.success) {
            handleSpinSuccess(data, spinButton);
        } else {
            throw new Error(data.error || 'Failed to spin wheel');
        }
    } catch (error) {
        GameShowUtils.handleError(error, 'Spinning wheel');
        GameShowUtils.setButtonState(spinButton, false);
        wheelCanvas.classList.remove('wheel-glow-spinning');
    }
}

function handleSpinSuccess(data, spinButton) {
    const config = window.WheelConfig?.WHEEL_CONFIG || {};
    
    // Calculate final rotation
    const baseRotation = data.result.final_angle * (Math.PI / 180);
    const fullRotations = (config.FULL_ROTATIONS || 8) * 2 * Math.PI;
    const finalRotation = baseRotation + fullRotations;
    
    // Animate wheel spin
    animateWheelSpin(finalRotation, () => {
        // Spin complete
        isSpinning = false;
        GameShowUtils.setButtonState(spinButton, false);
        wheelCanvas.classList.remove('wheel-glow-spinning');
    });
}

function animateWheelSpin(targetRotation, onComplete) {
    const config = window.WheelConfig?.WHEEL_CONFIG || {};
    const duration = config.SPIN_DURATION || 5000;
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
window.refreshWheel = refreshWheel;

// Function to refresh wheel with new random colors and segment order
function refreshWheel() {
    if (isSpinning) return;
    
    // Randomize segments and colors
    wheelSegments = randomizeSegments(wheelSegments);
    
    // Reset rotation
    currentRotation = 0;
    
    // Redraw wheel
    drawWheel();
    
    // Show notification
    if (typeof GameShow !== 'undefined' && GameShow.showNotification) {
        GameShow.showNotification('Wheel refreshed with new random layout!', 'info');
    }
}

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
        case 'r':
        case 'R':
            event.preventDefault();
            if (!isSpinning) {
                refreshWheel();
            }
            break;
    }
});

// Handle window resize
window.addEventListener('resize', GameShowUtils.debounce(() => {
    if (wheelCanvas) {
        drawWheel();
    }
}, 250));
