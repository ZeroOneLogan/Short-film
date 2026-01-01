// South Park Silent Film Animation Engine
// "The Bus Stop Adventure"

const canvas = document.getElementById('filmCanvas');
const ctx = canvas.getContext('2d');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const progress = document.getElementById('progress');
const sceneInfo = document.getElementById('sceneInfo');

// Animation state
let animationFrame;
let isPlaying = false;
let currentTime = 0;
const DURATION = 45000; // 45 seconds
const FPS = 30;
const FRAME_TIME = 1000 / FPS;

// Character drawing functions
class Character {
    constructor(x, y, color, name) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.name = name;
        this.bounceOffset = 0;
        this.armAngle = 0;
    }

    draw(bounce = 0, armWave = 0) {
        const baseY = this.y + bounce;
        
        // Body (rounded rectangle)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(this.x - 15, baseY, 30, 45, 5);
        ctx.fill();
        
        // Head (circle)
        ctx.fillStyle = '#fdbf6f';
        ctx.beginPath();
        ctx.arc(this.x, baseY - 15, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x - 7, baseY - 18, 5, 0, Math.PI * 2);
        ctx.arc(this.x + 7, baseY - 18, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x - 7, baseY - 17, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 7, baseY - 17, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth (simple line)
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, baseY - 8, 6, 0, Math.PI);
        ctx.stroke();
        
        // Hat/Hair indicator
        if (this.name === 'Stan') {
            // Blue and red hat
            ctx.fillStyle = '#0066cc';
            ctx.fillRect(this.x - 18, baseY - 35, 36, 8);
            ctx.fillStyle = '#cc0000';
            ctx.beginPath();
            ctx.arc(this.x, baseY - 35, 18, Math.PI, 0, true);
            ctx.fill();
        } else if (this.name === 'Kyle') {
            // Green hat
            ctx.fillStyle = '#00aa00';
            ctx.fillRect(this.x - 18, baseY - 35, 36, 12);
            ctx.fillStyle = '#ff6600';
            ctx.fillRect(this.x - 20, baseY - 23, 40, 5);
        } else if (this.name === 'Cartman') {
            // Cyan and yellow hat
            ctx.fillStyle = '#00cccc';
            ctx.fillRect(this.x - 18, baseY - 35, 36, 8);
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(this.x, baseY - 35, 18, Math.PI, 0, true);
            ctx.fill();
        } else if (this.name === 'Kenny') {
            // Orange hood
            ctx.fillStyle = '#ff8800';
            ctx.beginPath();
            ctx.arc(this.x, baseY - 15, 22, 0, Math.PI * 2);
            ctx.fill();
            // Hood opening
            ctx.fillStyle = '#fdbf6f';
            ctx.beginPath();
            ctx.ellipse(this.x, baseY - 12, 12, 15, 0, 0, Math.PI * 2);
            ctx.fill();
            // Redraw eyes in hood
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.x - 6, baseY - 15, 4, 0, Math.PI * 2);
            ctx.arc(this.x + 6, baseY - 15, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(this.x - 6, baseY - 14, 2, 0, Math.PI * 2);
            ctx.arc(this.x + 6, baseY - 14, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Arms
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        
        // Left arm
        ctx.beginPath();
        ctx.moveTo(this.x - 15, baseY + 10);
        ctx.lineTo(this.x - 25 + armWave, baseY + 20 + armWave);
        ctx.stroke();
        
        // Right arm  
        ctx.beginPath();
        ctx.moveTo(this.x + 15, baseY + 10);
        ctx.lineTo(this.x + 25 - armWave, baseY + 20 + armWave);
        ctx.stroke();
        
        // Legs
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 8;
        
        ctx.beginPath();
        ctx.moveTo(this.x - 8, baseY + 45);
        ctx.lineTo(this.x - 8, baseY + 65);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(this.x + 8, baseY + 45);
        ctx.lineTo(this.x + 8, baseY + 65);
        ctx.stroke();
        
        // Shoes
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - 13, baseY + 63, 10, 6);
        ctx.fillRect(this.x + 3, baseY + 63, 10, 6);
    }
}

// Create characters
const stan = new Character(150, 300, '#8B4513', 'Stan');
const kyle = new Character(250, 300, '#00AA00', 'Kyle');
const cartman = new Character(350, 300, '#CC0000', 'Cartman');
const kenny = new Character(450, 300, '#FF8800', 'Kenny');

const characters = [stan, kyle, cartman, kenny];

// Scene drawing functions
function drawBackground(scene) {
    // Sky
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#B0E0E6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 400);
    
    // Mountains in background
    ctx.fillStyle = '#8B7355';
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(200, 200);
    ctx.lineTo(400, 250);
    ctx.lineTo(600, 180);
    ctx.lineTo(800, 280);
    ctx.lineTo(800, 400);
    ctx.lineTo(0, 400);
    ctx.fill();
    
    // Snow on mountains
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineTo(180, 220);
    ctx.lineTo(220, 220);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(600, 180);
    ctx.lineTo(580, 200);
    ctx.lineTo(620, 200);
    ctx.fill();
    
    // Ground
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, 400, 800, 200);
    
    // Road
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 480, 800, 80);
    
    // Road lines
    ctx.fillStyle = '#FFFF00';
    for (let i = 0; i < 800; i += 60) {
        ctx.fillRect(i + (scene * 5) % 60, 515, 30, 5);
    }
    
    // Bus stop sign
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(600, 350, 10, 100);
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(580, 340, 50, 40);
    
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('BUS', 588, 358);
    ctx.fillText('STOP', 585, 372);
}

function drawBus(x) {
    // Bus body
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x, 420, 180, 80);
    
    // Windows
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x + 10, 430, 35, 30);
    ctx.fillRect(x + 55, 430, 35, 30);
    ctx.fillRect(x + 100, 430, 35, 30);
    ctx.fillRect(x + 145, 430, 25, 30);
    
    // Wheels
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(x + 35, 500, 18, 0, Math.PI * 2);
    ctx.arc(x + 145, 500, 18, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.arc(x + 35, 500, 10, 0, Math.PI * 2);
    ctx.arc(x + 145, 500, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Front grill
    ctx.fillStyle = '#CC0000';
    ctx.fillRect(x + 165, 440, 15, 40);
}

function drawSnowflake(x, y, size) {
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((Math.PI / 3) * i);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -size);
        ctx.stroke();
        ctx.restore();
    }
}

// Animation timeline
function animate(timestamp) {
    if (!isPlaying) return;
    
    currentTime += FRAME_TIME;
    if (currentTime > DURATION) {
        currentTime = DURATION;
        pause();
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, 800, 600);
    
    // Calculate scene progress
    const progress = currentTime / DURATION;
    const scene = Math.floor(progress * 5); // 5 scenes
    
    // Update scene info
    const sceneNames = [
        'Scene 1: The Bus Stop',
        'Scene 2: Waiting Together',
        'Scene 3: Snow Starts Falling',
        'Scene 4: The Bus Arrives!',
        'Scene 5: Happy Ending'
    ];
    sceneInfo.textContent = sceneNames[Math.min(scene, 4)];
    
    // Draw based on current scene
    drawBackground(scene);
    
    // Scene-specific animations
    if (scene === 0) {
        // Scene 1: Characters walk in
        const walkProgress = (currentTime % 9000) / 9000;
        characters.forEach((char, i) => {
            const startX = -50;
            const endX = 150 + i * 100;
            const x = startX + (endX - startX) * Math.min(walkProgress * 4, 1);
            char.x = x;
            const bounce = Math.sin(currentTime / 100 + i) * 3;
            char.draw(bounce, 0);
        });
    } else if (scene === 1) {
        // Scene 2: Characters wave at each other
        const waveTime = currentTime / 200;
        characters.forEach((char, i) => {
            char.x = 150 + i * 100;
            const armWave = Math.sin(waveTime + i) * 8;
            char.draw(0, armWave);
        });
    } else if (scene === 2) {
        // Scene 3: Snow falls, characters look up
        characters.forEach((char, i) => {
            char.x = 150 + i * 100;
            char.draw(0, 0);
        });
        
        // Draw falling snow
        for (let i = 0; i < 30; i++) {
            const x = (i * 123 + currentTime / 10) % 800;
            const y = (i * 87 + currentTime / 8) % 600;
            drawSnowflake(x, y, 5);
        }
    } else if (scene === 3) {
        // Scene 4: Bus arrives from right
        const busProgress = ((currentTime - DURATION * 0.6) / (DURATION * 0.2));
        const busX = 900 - busProgress * 600;
        
        drawBus(busX);
        
        // Characters jump excitedly
        characters.forEach((char, i) => {
            char.x = 150 + i * 100;
            const bounce = Math.sin(currentTime / 100 + i) * 15;
            const armWave = Math.sin(currentTime / 150 + i) * 10;
            char.draw(bounce, armWave);
        });
    } else if (scene === 4) {
        // Scene 5: Bus stopped, everyone happy
        drawBus(350);
        
        characters.forEach((char, i) => {
            char.x = 150 + i * 100;
            const bounce = Math.sin(currentTime / 150 + i) * 5;
            const armWave = Math.sin(currentTime / 200 + i) * 8;
            char.draw(bounce, armWave);
        });
    }
    
    // Add film grain effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        ctx.fillRect(x, y, 1, 1);
    }
    
    // Silent film title cards
    if (currentTime < 2000) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(100, 200, 600, 150);
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 32px serif';
        ctx.textAlign = 'center';
        ctx.fillText('The Bus Stop Adventure', 400, 260);
        ctx.font = 'italic 20px serif';
        ctx.fillText('A South Park Silent Film', 400, 300);
    }
    
    if (currentTime > DURATION - 3000) {
        const fadeIn = Math.min((currentTime - (DURATION - 3000)) / 1000, 1);
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeIn * 0.8})`;
        ctx.fillRect(100, 200, 600, 150);
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 36px serif';
        ctx.textAlign = 'center';
        ctx.fillText('THE END', 400, 280);
    }
    
    // Update progress bar
    updateProgress();
    
    // Continue animation
    setTimeout(() => {
        if (isPlaying) {
            animationFrame = requestAnimationFrame(animate);
        }
    }, FRAME_TIME);
}

function play() {
    if (!isPlaying) {
        isPlaying = true;
        animationFrame = requestAnimationFrame(animate);
        playBtn.disabled = true;
        pauseBtn.disabled = false;
    }
}

function pause() {
    isPlaying = false;
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    playBtn.disabled = false;
    pauseBtn.disabled = true;
}

function restart() {
    pause();
    currentTime = 0;
    ctx.clearRect(0, 0, 800, 600);
    drawBackground(0);
    updateProgress();
    sceneInfo.textContent = 'Scene 1: The Bus Stop';
}

function updateProgress() {
    const percent = (currentTime / DURATION) * 100;
    progress.style.width = percent + '%';
}

// Event listeners
playBtn.addEventListener('click', play);
pauseBtn.addEventListener('click', pause);
restartBtn.addEventListener('click', restart);

// Initialize
pauseBtn.disabled = true;
drawBackground(0);
ctx.fillStyle = '#000';
ctx.font = 'bold 24px Arial';
ctx.textAlign = 'center';
ctx.fillText('Press PLAY to start the film', 400, 300);
