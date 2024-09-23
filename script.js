const escapeRadius = 4;
const mask = document.getElementById('mask');
const canvas = document.getElementById("canvas");

// pixelratio is the ratio of 1 unit of the mandelbrot to 1 pixel
let pixelratio = 1/200
let xmin, xmax, ymin, ymax;
let currentCenter = [0, 0];
// the fact that there's no such thing as tuples in JavaScript


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");

class Complex {
  constructor(real, imag) {
    this.real = real;
    this.imag = imag;
    this.modulus = Math.sqrt(Math.abs(this.real) + Math.abs(this.imag));
  }
  add(other) {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }
  mult(other) {
    return new Complex(this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real);
  }
  square() {
    return this.mult(this);
  }
}

function setRanges(x, y) {
  // set xmin, xmax, ymin, ymax so that the graph is centered at the given center
  // center is the center of the graph
  xmin = x - (window.innerWidth * pixelratio / 2);
  xmax = x + (window.innerWidth * pixelratio / 2);
  ymin = y - (window.innerHeight * pixelratio / 2);
  ymax = y + (window.innerHeight * pixelratio / 2);
}
function setRangebyZoom(x, y, ratio = pixelratio) {
  // set xmin, xmax, ymin, ymax so that the graph zooms to the given ratio with center x, y
  // ratio is the ratio of 1 unit of the graph to 1 unit of the window
  // the parameters are in coordinate units
  let distX = currentCenter[0] - x;
  let distY = currentCenter[1] - y;
  let center = [
    x + distX * ratio,
    y + distY * ratio
  ];
  currentCenter = center;
}
  
function drawMandelbrot(xmin, xmax, ymin, ymax) {
  const pixel = 1;
  const mystery = 0;
  for (let i = 0; i < window.innerWidth; i += pixel) {
    for (let j = 0; j < window.innerHeight; j += pixel) {
      
      // calculates a value for every pixel in the canvas
      let x = xmin + (xmax - xmin) * i / window.innerWidth,
        y = ymin + (ymax - ymin) * j / window.innerHeight;
      let c = new Complex(x, y);

      // repeats z = 0, z^2 + c 10 times
      let z = new Complex(0, 0);
      let [re, im] = [0, 0];
      let good = true;
      let k;
      for (k = 0; k < 100; k++) {
        //z = z.square().add(c);
        [re, im] = [re ** 2 - im ** 2 + x, 2 * re * im + y];
       // if (z.modulus > escapeRadius) {
        if (re ** 2 + im ** 2 >= escapeRadius ** 2) {
          good = false;
          break;
        }
      }
      /*let mods = [];
      for (let k = 0; k < 50; k++) {
        mods.push(z.modulus);
        z = z.square().add(c);
      }

      // check if the moduluses converged
      // if (moduluses[0] > moduluses.at(-1)) {
      if (mods.at(-1) - mods.at(-2) <= mods[1] - mods[0]) { */
      //if (good) {
        // draw a black pixel when it converged
        let color;
        /*if (k <= 97) {
          color = 255 - 255 * k / 100;
        } else {
          color = 255 - 255 * (k - 97) / 3;
        }*/
        color = k / 100 * 255;
        if (k < 100) ctx.fillStyle = `rgb(${color} ${color} ${color} / ${k}%)`;
        else ctx.fillStyle = "black";
        ctx.fillRect(i, j, pixel - mystery, pixel - mystery);
      //}
    
    }
  }
}
function draw() {
  setRanges(...currentCenter);
  document.getElementById("top").innerHTML = ymax;
  document.getElementById("bottom").innerHTML = ymin;
  document.getElementById("left").innerHTML = xmin;
  document.getElementById("right").innerHTML = xmax;
  document.getElementById("pixel-ratio").innerHTML = pixelratio;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  drawMandelbrot(xmin, xmax, ymin, ymax);
}


draw();

window.onresize = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}

mask.onwheel = function(event) {
  let x = event.clientX;
  let y = event.clientY;
  let direction = event.deltaY > 0;
  // true -> down, false -> up
  let ratio;
  if (direction) {
    pixelratio *= 1.25;
    ratio = 1.25;
  } else {
    pixelratio /= 1.25;
    ratio = 1 / 1.25;
  }
  let coordX = xmin + (xmax - xmin) * x / window.innerWidth;
  let coordY = ymin + (ymax - ymin) * y / window.innerHeight;
  setRangebyZoom(coordX, coordY, ratio);
  draw();
}
mask.onpointerdown = function(event) {
  let x = event.clientX;
  let y = event.clientY;
  let center = [];
  mask.onpointermove = function(e) {
    let distX = x - e.clientX;
    let distY = y - e.clientY;
    let coordDistX = xmin + (xmax - xmin) * x / window.innerWidth;
    let coordDistY = ymin + (ymax - ymin) * y / window.innerWidth;
    center = [currentCenter[0] + coordDistX, currentCenter[1] + coordDistY];
    setRanges(...center);
    draw();
  }
  mask.onpointerup = function(e) {
    currentCenter = center;
    mask.onpointermove = null;
    mask.onpointerup = null;
  }
}
  