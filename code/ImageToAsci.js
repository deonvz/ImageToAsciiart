const density = "Ñ@#W$9876543210?!abc;:+=-,._ ";

let image;

function preload() {
  image = loadImage("logo.png");
}

function setup() {
  noCanvas();
  image.loadPixels();
  for (let j = 0; j < image.height; j++) {
    let row = "";
    for (let i = 0; i < image.width; i++) {
      const pixelIndex = (i + j * image.width) * 4;
      const r = image.pixels[pixelIndex + 0];
      const g = image.pixels[pixelIndex + 1];
      const b = image.pixels[pixelIndex + 2];

      const avg = (r + g + b) / 3;

      const len = density.length;
      const charIndex = floor(map(avg, 0, 255, len, 0));

      const c = density.charAt(charIndex);
      if (c == " ") row += "&nbsp;";
      else row += c;
    }
    createDiv(row);
  }
}