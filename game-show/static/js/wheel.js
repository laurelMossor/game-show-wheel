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
        wheelSegments = randomizeSegments(window.WheelConfig?.DEFAULT_WHEEL_SEGMENTS || []);
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
    
    // Draw the outer wooden ring first (water wheel frame)
    const outerRadius = radius + (config.WOODEN_RING_WIDTH || 25);
    wheelContext.beginPath();
    wheelContext.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    wheelContext.fillStyle = config.WOODEN_RING_COLOR || '#8B4513';
    wheelContext.fill();
    
    // Add wood grain texture to the outer ring
    addWoodGrainTexture(centerX, centerY, outerRadius, config.WOODEN_RING_WIDTH || 25);
    
    // Draw the inner wooden ring (inner frame)
    const innerRadius = radius - (config.WOODEN_RING_WIDTH || 25);
    wheelContext.beginPath();
    wheelContext.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    wheelContext.fillStyle = config.WOODEN_RING_COLOR || '#8B4513';
    wheelContext.fill();
    
    // Add wood grain texture to the inner ring
    addWoodGrainTexture(centerX, centerY, innerRadius, config.WOODEN_RING_WIDTH || 25);
    
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
        
        // Draw wooden slat between segments (thick wooden divider)
        const slatAngle = startAngle + segmentAngle;
        const slatStartX = centerX + Math.cos(slatAngle) * (innerRadius + 5);
        const slatStartY = centerY + Math.sin(slatAngle) * (innerRadius + 5);
        const slatEndX = centerX + Math.cos(slatAngle) * (outerRadius - 5);
        const slatEndY = centerY + Math.sin(slatAngle) * (outerRadius - 5);
        
        wheelContext.beginPath();
        wheelContext.moveTo(slatStartX, slatStartY);
        wheelContext.lineTo(slatEndX, slatEndY);
        wheelContext.strokeStyle = config.WOODEN_SLAT_COLOR || '#A0522D';
        wheelContext.lineWidth = config.WOODEN_SLAT_WIDTH || 8;
        wheelContext.lineCap = 'round';
        wheelContext.stroke();
        
        // Add wood grain to the slat
        addWoodGrainToSlat(slatStartX, slatStartY, slatEndX, slatEndY, config.WOODEN_SLAT_WIDTH || 8);
    });
    
    // Draw text on segments
    wheelSegments.forEach((segment, index) => {
        const startAngle = index * segmentAngle + currentRotation;
        const textAngle = startAngle + segmentAngle / 2;
        const textRadius = radius * (config.TEXT_RADIUS_RATIO || 0.7);
        const textX = centerX + Math.cos(textAngle) * textRadius;
        const textY = centerY + Math.sin(textAngle) * textRadius;
        
        wheelContext.save();
        wheelContext.translate(textX, textY);
        // Rotate text to be vertical like a wheel spoke (from center to edge)
        wheelContext.rotate(textAngle);
        
        // Enhanced text styling with bigger, bolder text
        wheelContext.fillStyle = '#2C3E50'; // Dark blue-gray for better readability
        wheelContext.font = `${config.TEXT_WEIGHT || 'bold'} ${config.TEXT_SIZE || 20}px "Cinzel", serif`;
        wheelContext.textAlign = 'center';
        wheelContext.textBaseline = 'middle';
        
        // Draw text with subtle shadow for depth
        wheelContext.shadowColor = 'rgba(255, 255, 255, 0.8)';
        wheelContext.shadowBlur = 2;
        wheelContext.shadowOffsetX = 1;
        wheelContext.shadowOffsetY = 1;
        
        // Handle long text by splitting into multiple lines
        const words = segment.text.split(' ');
        const lineHeight = config.TEXT_SIZE + 4 || 24;
        
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
    
    // Draw center circle with wooden styling
    const centerRadius = config.CENTER_CIRCLE_RADIUS || 15;
    wheelContext.beginPath();
    wheelContext.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
    wheelContext.fillStyle = config.WOODEN_RING_COLOR || '#8B4513';
    wheelContext.fill();
    wheelContext.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    wheelContext.lineWidth = config.CENTER_BORDER_WIDTH || 3;
    wheelContext.stroke();
    
    // Add wood grain to center circle
    addWoodGrainTexture(centerX, centerY, centerRadius, centerRadius);
}

// Function to add wood grain texture to circular elements
function addWoodGrainTexture(centerX, centerY, radius, width) {
    const config = window.WheelConfig?.WHEEL_CONFIG || {};
    const woodColor = config.WOODEN_RING_COLOR || '#8B4513';
    
    // Create subtle wood grain effect with darker lines
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const startX = centerX + Math.cos(angle) * (radius - width / 2);
        const startY = centerY + Math.sin(angle) * (radius - width / 2);
        const endX = centerX + Math.cos(angle) * (radius + width / 2);
        const endY = centerY + Math.sin(angle) * (radius + width / 2);
        
        wheelContext.beginPath();
        wheelContext.moveTo(startX, startY);
        wheelContext.lineTo(endX, endY);
        wheelContext.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        wheelContext.lineWidth = 1;
        wheelContext.stroke();
    }
}

// Function to add wood grain to slats
function addWoodGrainToSlat(startX, startY, endX, endY, width) {
    // Create wood grain lines along the slat
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const segments = Math.floor(length / 10);
    
    for (let i = 0; i < segments; i++) {
        const progress = i / segments;
        const x = startX + (endX - startX) * progress;
        const y = startY + (endY - startY) * progress;
        
        // Perpendicular line for wood grain
        const perpX = x + Math.cos(Math.atan2(endY - startY, endX - startX) + Math.PI / 2) * (width / 2);
        const perpY = y + Math.sin(Math.atan2(endY - startY, endX - startX) + Math.PI / 2) * (width / 2);
        const perpEndX = x + Math.cos(Math.atan2(endY - startY, endX - startX) + Math.PI / 2) * (-width / 2);
        const perpEndY = y + Math.sin(Math.atan2(endY - startY, endX - startX) + Math.PI / 2) * (-width / 2);
        
        wheelContext.beginPath();
        wheelContext.moveTo(perpX, perpY);
        wheelContext.lineTo(perpEndX, perpEndY);
        wheelContext.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        wheelContext.lineWidth = 0.5;
        wheelContext.stroke();
    }
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
    
    // Simple, predictable spin force
    const baseRotations = 5; // Always spin about 5 full rotations
    const extraRotations = Math.random() * 2; // Add 0-2 extra rotations for variety
    
    // Calculate the target segment angle
    const targetAngle = data.result.final_angle * (Math.PI / 180);
    
    // Calculate how many full rotations we want
    const totalRotations = (baseRotations + extraRotations) * 2 * Math.PI;
    
    // Add a small offset to ensure pointer lands clearly in the target segment
    const segmentAngle = (2 * Math.PI) / wheelSegments.length;
    const offset = (Math.random() * 0.5 + 0.25) * segmentAngle; // 0.25 to 0.75 of segment
    
    // Calculate the final target rotation
    // Always move forward from current position by adding rotations
    const finalRotation = currentRotation + totalRotations + targetAngle + offset;
    
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
    const duration = config.SPIN_DURATION || 3000;
    
    const startRotation = currentRotation;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Simple, natural wheel physics: starts fast, slows down naturally
        // Use a simple ease-out function that feels realistic
        const easeValue = 1 - Math.pow(1 - progress, 2); // Quadratic ease-out
        
        // Calculate rotation
        currentRotation = startRotation + (targetRotation - startRotation) * easeValue;
        
        // Redraw the wheel
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
window.addEventListener('resize', GameShowUtils.debounce(() => {
    if (wheelCanvas) {
        drawWheel();
    }
}, 250));
