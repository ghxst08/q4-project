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
let fishingCooldown = 0;  // Prevents re-showing fishing prompt immediately

// Slider variables
let sliderPos = 0;
let direction = 1; // 1 for right, -1 for left
const barWidth = 600;
const sliderWidth = 10;
const speedSlider = 15;  // Increased speed
let greenZoneStart, greenZoneEnd;
let gameActive = false;
let castingSuccess = null;  // null until game starts

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

  // Always-on money counter
  let moneyDiv = createDiv('Money: $0');
  moneyDiv.id('moneyCounter');
  moneyDiv.style('position', 'absolute');
  moneyDiv.style('top', '10px');
  moneyDiv.style('right', '10px');
  moneyDiv.style('padding', '10px');
  moneyDiv.style('background', 'white');
  moneyDiv.style('border', '2px solid black');
  moneyDiv.style('border-radius', '10px');
  moneyDiv.style('font-size', '20px');
  moneyDiv.style('z-index', '20');

  if (!fishingPromptDiv) {
    fishingPromptDiv = createDiv();
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
    fishingPromptDiv.hide();
  }
}

function draw() {
  background(200);
  drawBackground();

  if (movementEnabled) {
    handleMovement();
  }

  checkBorders();
  checkFishingZone();

  if (fishingCooldown > 0) {
    fishingCooldown--;
  }

  fill(200);
  circle(x, y, 20);

  if (gameActive) {
    moveSlider();
    drawSlider();
  }
}

function drawBackground() {
  switch (currentPosition) {
    case 'center': background(bgCenter); break;
    case 'left': background(bgLeft); break;
    case 'right': background(bgRight); break;
    case 'top': background(bgTop); break;
    case 'bottom': background(bgBottom); break;
    default: background(255, 0, 200);
  }
}

function handleMovement() {
  if (keyIsDown(87) || keyIsDown(38)) y -= speed;
  if (keyIsDown(83) || keyIsDown(40)) y += speed;
  if (keyIsDown(65) || keyIsDown(37)) x -= speed;
  if (keyIsDown(68) || keyIsDown(39)) x += speed;
}

function checkBorders() {
  if (x < 0) {
    if (currentPosition === 'center') {
      currentPosition = 'left'; x = width - 5;
    } else if (currentPosition === 'right') {
      currentPosition = 'center'; x = width - 5;
    }
  } else if (x > width) {
    if (currentPosition === 'center') {
      currentPosition = 'right'; x = 5;
    } else if (currentPosition === 'left') {
      currentPosition = 'center'; x = 5;
    }
  }

  if (y < 0) {
    if (currentPosition === 'center') {
      currentPosition = 'top'; y = height - 5;
    } else if (currentPosition === 'bottom') {
      currentPosition = 'center'; y = height - 5;
    }
  } else if (y > height) {
    if (currentPosition === 'center') {
      currentPosition = 'bottom'; y = 5;
    } else if (currentPosition === 'top') {
      currentPosition = 'center'; y = 5;
    }
  }
}

function checkFishingZone() {
  if (fishingCooldown === 0 && !showFishingPrompt && movementEnabled) {
    if (currentPosition === 'top' && abs(y - 430) <= 8) {
      showFishingPrompt = true;
      movementEnabled = false;
      showFishingButtons();
    } else if (currentPosition === 'left' && abs(x - 360) <= 8) {
      showFishingPrompt = true;
      movementEnabled = false;
      showFishingButtons();
    } else if (currentPosition === 'bottom' && abs(y - 550) <= 8) {
      showFishingPrompt = true;
      movementEnabled = false;
      showFishingButtons();
    }
  }
}

function startFishingGame() {
  const zoneWidth = 60;
  const maxStart = barWidth - zoneWidth;
  const start = Math.floor(Math.random() * maxStart);
  greenZoneStart = start;
  greenZoneEnd = start + zoneWidth;
  gameActive = true;
  sliderPos = 0;
  direction = 1;
  moveSlider();
}

function showFishingButtons() {
  fishingPromptDiv.html(`
    <div style="text-align: center;">
      <h3>Start Fishing?</h3>
      <button id="castBtn" style="font-size: 20px; padding: 10px 20px;">Cast</button>
      <button id="cancelBtn" style="font-size: 20px; padding: 10px 20px;">Cancel</button>
    </div>
  `);
  fishingPromptDiv.show();

  select('#castBtn').mousePressed(() => {
    hideFishingButtons();
    startFishingGame();
  });

  select('#cancelBtn').mousePressed(() => {
    cancelFishing();
  });
}

function hideFishingButtons() {
  if (fishingPromptDiv) {
    fishingPromptDiv.hide();
  }
}

function checkCast() {
  const sliderCenter = sliderPos + sliderWidth / 2;
  if (sliderCenter >= greenZoneStart && sliderCenter <= greenZoneEnd) {
    castingSuccess = true;
    showCatchPrompt(true);
  } else {
    castingSuccess = false;
    showCatchPrompt(false);
  }
  gameActive = false;
}

function showCatchPrompt(success) {
  let message = success ? "You caught a fish!" : "You failed!";
  let buttonText = success ? "Cast Again" : "Try Again";

  if (success && currentPosition === 'top') {
    const rand = Math.random();
    if (rand < 0.40) message = "You caught a Bluegill!";
    else if (rand < 0.60) message = "You caught a Yellow Perch!";
    else if (rand < 0.80) message = "You caught a White Perch!";
    else if (rand < 0.90) message = "You caught a Largemouth Bass!";
    else if (rand < 0.95) message = "You caught a Pickerel!";
    else message = "You caught a Common Carp!";
  }

  fishingPromptDiv.html(`
    <div style="text-align: center;">
      <h3>${message}</h3>
      <button id="castAgainBtn" style="font-size: 20px; padding: 10px 20px;">${buttonText}</button>
      <button id="cancelBtn" style="font-size: 20px; padding: 10px 20px;">Cancel</button>
    </div>
  `);

  fishingPromptDiv.show();

  select('#castAgainBtn').mousePressed(() => {
    hideFishingButtons();
    startFishingGame();
  });

  select('#cancelBtn').mousePressed(() => {
    cancelFishing();
  });
}

function cancelFishing() {
  movementEnabled = true;
  showFishingPrompt = false;
  fishingCooldown = 60;
  castingSuccess = null;
  gameActive = false;
  if (fishingPromptDiv) fishingPromptDiv.hide();
}

function moveSlider() {
  sliderPos += direction * speedSlider;
  if (sliderPos <= 0 || sliderPos >= barWidth - sliderWidth) {
    direction *= -1;
  }
}

function drawSlider() {
  fill(0);
  rect(200, height - 100, barWidth, 10);
  fill(0, 255, 0);
  rect(200 + greenZoneStart, height - 100, greenZoneEnd - greenZoneStart, 10);
  fill(255, 0, 0);
  rect(200 + sliderPos, height - 100, sliderWidth, 20);
}

function windowResized() {
  centerCanvas();
}

function keyPressed() {
  if (keyCode === 32 && gameActive) {
    checkCast();
  }
}
