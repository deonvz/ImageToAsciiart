const density = "Ñ@#W$9876543210?!abc;:+=-,._                    ";
//const density = '       .:-i|=+%O#@'
//const density = '        .:░▒▓█';

let video;
let asciiDiv;

function videoReady() {
  console.log('Video ready');
}

function initCaptureDevice() {
  try {
    video = createCapture(VIDEO, videoReady);
    video.size(height, width);
    video.elt.setAttribute('playsinline', '');
    video.hide();
    console.log(
      '[initCaptureDevice] capture ready. Resolution: ' +
      video.width + ' ' + video.height
    );
  } catch(_err) {
    console.log('[initCaptureDevice] capture error: ' + _err);
  }
}

function setup() {
  //noCanvas();
  createCanvas(640, 480);
  initCaptureDevice(); //  access to the camera;
  asciiDiv = createDiv();
}

function draw() {
  image(video, 0, 0); // video
    video.loadPixels();
    let asciiImage = "";
    for (let j = 0; j < video.height; j++) {
      for (let i = 0; i < video.width; i++) {
        const pixelIndex = (i + j * video.width) * 4;
        const r = video.pixels[pixelIndex + 0];
        const g = video.pixels[pixelIndex + 1];
        const b = video.pixels[pixelIndex + 2];
        const avg = (r + g + b) / 3;
        const len = density.length;
        const charIndex = floor(map(avg, 0, 255, 0, len));
        const c = density.charAt(charIndex);
        if (c == " ") asciiImage += "&nbsp;";
        else asciiImage += c;
        text(asciiImage,j,i);
      }
      text('<br/>');
      //asciiImage += '<br/>';
    }
    asciiDiv.html(asciiImage);
    
}
