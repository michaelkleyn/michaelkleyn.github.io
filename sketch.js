let particles = [];
const maxParticles = 5000;
const lifespanDecrease = 2;
const transparencyRange = [50, 200];
let noiseOffsetX, noiseOffsetY;
let lastNoiseChangeTime;
let scrollYPrev = window.scrollY;
let speedFactor = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noiseOffsetX = random(1000);  // Initialize with a random value
  noiseOffsetY = random(1000);
  scrollYPrev = window.scrollY;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background( 231, 224, 209, 120);

  let isScrolling = (window.scrollY !== scrollYPrev);
  let targetSpeedFactor = isScrolling ? 1 : 0;
  speedFactor = lerp(speedFactor, targetSpeedFactor, 0.05);  // Adjust the third parameter as needed

  for(let particle of particles) {


    particle.move(speedFactor);
    particle.display();
    particle.updateLifespan();
  }

  while(particles.length < maxParticles) {
    particles.push(new Particle());
  }

  scrollYPrev = window.scrollY;
}

function mousePressed() {
  noiseOffsetX = random(1000);
  noiseOffsetY = random(1000);
}

function mouseDragged() {
  for(let particle of particles) {
    particle.attractToMouse();
  }
}

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.speed = random(1, 3);
    this.lifespan = random(50, 255);
    this.transparency = random(transparencyRange[0], transparencyRange[1]);
    
    // Directional bias to simulate following an invisible terrain
    this.biasX = random(-0.5, 0.5);
    this.biasY = random(-0.5, 0.5);
  }

  attractToMouse() {
    let mouseVec = createVector(mouseX, mouseY);
    let posVec = createVector(this.x, this.y);
    let forceVec = mouseVec.sub(posVec);
    forceVec.limit(3);  // Limit the magnitude of the attraction force
    posVec.add(forceVec.mult(.15));  // 0.05 is the strength of attraction
    this.x = posVec.x;
    this.y = posVec.y;
  }

  
  move(speedFactor) {
    let angle = noise(this.x * 0.01 + noiseOffsetX, this.y * 0.01 + noiseOffsetY) * TWO_PI * 4;
    this.x += cos(angle) * this.speed * speedFactor + this.biasX;
    this.y += sin(angle) * this.speed * speedFactor + this.biasY;
  
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;
  }

  
display() {
  fill(169, 149, 110, this.transparency); 
  noStroke();
  ellipse(this.x, this.y, 2);
}
  
  updateLifespan() {
    this.lifespan -= lifespanDecrease;
  }
}
