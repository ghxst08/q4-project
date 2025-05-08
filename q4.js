let cnv;
let x = 500;
let y = 500;
let speed = 7;

// Background images
let bgCenter, bgLeft, bgRight, bgTop, bgBottom;

// Track current location in the plus map
let currentPosition = 'center';

// Fishing prompt state
let showFishingPrompt = false;
let fishingPromptDiv;
let movementEnabled = true;
let cancelFishing = false; // New flag for cancel button
let fishingCooldown = 0;  // Prevents re-showing fishing prompt immediately

function preload() {
  bgCenter = loadImage('center_image.png');
  bgLeft = loadImage('two.png');
  bgRight = loadImage('three.png');
  bgTop = loadImage('four.png');
  bgBottom = loadImage('five.png');
}

function centerCanvas() {
  let cx = (windowWidth - width) / 2;
  let cy = (windowHeight - height) / 2;
  cnv.position(cx, cy);
}

function setup() {
  cnv = createCanvas(1000, 1000);
  centerCanvas();
}

function draw() {
  background(200);
  drawBackground();
  if (movementEnabled) {
    handleMovement();
  }
  checkBorders();
  checkFishingZone();

  // Cooldown logic to prevent re-showing fishing prompt immediately
  if (fishingCooldown > 0) {
    fishingCooldown--;
  }

  // Handle cancel flag here
  if (cancelFishing) {
    hideFishingButtons();
    cancelFishing = false;
    fishingCooldown = 60; // About 1 second cooldown (60 frames)
  }

  fill(200);
  circle(x, y, 20);
}

function drawBackground() {
  switch (currentPosition) {
    case 'center':
      background(bgCenter);
      break;
    case 'left':
      background(bgLeft);
      break;
    case 'right':
      background(bgRight);
      break;
    case 'top':
      background(bgTop);
      break;
    case 'bottom':
      background(bgBottom);
      break;
    default:
      background(255, 0, 200);
  }
}

function handleMovement() {
  if (keyIsDown(87)) y -= speed; // W
  if (keyIsDown(83)) y += speed; // S
  if (keyIsDown(65)) x -= speed; // A
  if (keyIsDown(68)) x += speed; // D
}

function checkBorders() {
  if (x < 0) {
    if (currentPosition === 'center') {
      currentPosition = 'left';
      x = width - 5;
    } else if (currentPosition === 'right') {
      currentPosition = 'center';
      x = width - 5;
    }
  } else if (x > width) {
    if (currentPosition === 'center') {
      currentPosition = 'right';
      x = 5;
    } else if (currentPosition === 'left') {
      currentPosition = 'center';
      x = 5;
    }
  }

  if (y < 0) {
    if (currentPosition === 'center') {
      currentPosition = 'top';
      y = height - 5;
    } else if (currentPosition === 'bottom') {
      currentPosition = 'center';
      y = height - 5;
    }
  } else if (y > height) {
    if (currentPosition === 'center') {
      currentPosition = 'bottom';
      y = 5;
    } else if (currentPosition === 'top') {
      currentPosition = 'center';
      y = 5;
    }
  }
}
function checkFishingZone() {
  if (fishingCooldown === 0 && !showFishingPrompt) {
    if (currentPosition === 'top' && abs(y - 430) <= 8) {
      showFishingPrompt = true;
      movementEnabled = false;
      showFishingButtons('top');
    } else if (currentPosition === 'left' && abs(x - 360) <= 8) {
      showFishingPrompt = true;
      movementEnabled = false;
      showFishingButtons('left');
    } else if (currentPosition === 'bottom' && abs(y - 550) <= 8) {
      showFishingPrompt = true;
      movementEnabled = false;
      showFishingButtons('bottom');
    }
  }
}
function showFishingButtons() {
  if (!fishingPromptDiv) {
    fishingPromptDiv = createDiv();

    fishingPromptDiv.html(`
      <div style="text-align: center;">
        <h3>Start Fishing?</h3>
        <button id="castBtn" style="font-size: 20px; padding: 10px 20px;">Cast</button>
        <button id="cancelBtn" style="font-size: 20px; padding: 10px 20px;">Cancel</button>
      </div>
    `);

    fishingPromptDiv.style('position', 'absolute');
    fishingPromptDiv.style('top', '40%');
    fishingPromptDiv.style('left', 'calc(50% - 150px)');
    fishingPromptDiv.style('width', '300px');
    fishingPromptDiv.style('height', '200px');
    fishingPromptDiv.style('padding', '20px');
    fishingPromptDiv.style('background', 'rgba(255, 255, 255, 0.95)');
    fishingPromptDiv.style('border', '2px solid black');
    fishingPromptDiv.style('border-radius', '10px');
    fishingPromptDiv.style('text-align', 'center');
    fishingPromptDiv.style('z-index', '10');
    fishingPromptDiv.style('box-shadow', '0 4px 8px rgba(0,0,0,0.2)');
  } else {
    fishingPromptDiv.show();
  }

  select('#castBtn').mousePressed(() => {
    console.log('You cast your rod!');
    hideFishingButtons();
  });

  select('#cancelBtn').mousePressed(() => {
    console.log('Fishing cancelled.');
    cancelFishing = true; // Trigger cancel in draw loop
  });
}

function hideFishingButtons() {
  if (fishingPromptDiv) {
    fishingPromptDiv.hide(); // Visually hide the prompt
  }
  showFishingPrompt = false;
  movementEnabled = true;
}

function windowResized() {
  centerCanvas();
}
