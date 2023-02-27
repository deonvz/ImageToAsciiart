const density = "Ñ@#W$9876543210?!abc;:+=-,._ ";

/*
  The object that will be responsible for generating ASCII art graphics. The
  object will be derived from the AsciiArt pseudo-class from the p5.asciiart
  library, so remember to add the p5.asciiart library to the project in the
  appropriate html file.
*/
var myAsciiArt;

/*
  The size of generated ASCII graphics expressed in characters and lines.
*/
var asciiart_width = 120; var asciiart_height = 60;

/*
  This table will store several example images that will be converted to the
  ASCII art form.
*/
var images = [];

/*
  Buffer for processed graphics, simplifying some operations. This will be an
  object derived from the p5.Graphics class
*/
var gfx;

/*
  This variable will store a two-dimensional array - "image" in the form of
  ASCII codes.
*/
var ascii_arr;

/*
  A helper variable to store current "circular" time, useful in controlling of
  the cyclic image display.
*/
var cyclic_t;

/*
  Let's load the example images first.
*/
function preload() {
  images[0] =
    loadImage('logo.png');
  images[1] =loadImage('bridge.jpg');
  images[2] = loadImage('robot.jpg');
  images[3] = loadImage('cat.jpg');
}

function setup() {
  createCanvas(640, 480); // we need some space...
  /*
    In this particular case the gfx helper should have dimensions the same as
    the target graphic.
  */
  gfx = createGraphics(asciiart_width, asciiart_height);
  gfx.pixelDensity(1);
  /*
    Here we create an object derived from the AsciiArt pseudo-class from the
    p5.asciiart library.
      new AsciiArt(_sketch);
      new AsciiArt(_sketch, _fontName);
      new AsciiArt(_sketch, _fontName, _fontSize);
      new AsciiArt(_sketch, _fontName, _fontSize, _textStyle);
  */
  myAsciiArt = new AsciiArt(this);
  /*
    After initializing the object, look at (in the console) the listing of the
    array containing the glyphs sorted according to the amount of space
    occupied. This table is the basis for the procedure that converts
    individual image pixels into glyphs.
  */
  myAsciiArt.printWeightTable();
  /*
    Here we set the font family, size and style. By default ASCII Art library
    is using 'monospace' font, so we want to apply the same setting to our
    sketch.
  */
  textAlign(CENTER, CENTER); textFont('monospace', 8); textStyle(NORMAL);
  noStroke(); fill(255);
  /*
    Finally we set the framerate.
  */
  frameRate(30);
}

function draw() {
    background(0);
    /*
      First, let's calculate which image from the images[] array should now be
      displayed. The floor part of the calculated value will indicate the index
      of the image to be displayed. The decimal part will be used to calculate
      the tint.
    */
    cyclic_t = millis() * 0.0002 % images.length;
    /*
      Let's prepare the image for conversion. Although the object derived from
      the AsciiArt pseudo-class has it's own mechanism of changing the size of
      the image, we will use the external one. Thanks to this we will be able -
      before transferring the image for conversion - to perform the posterize
      effect on it, which will make the final effect better.
    */
    gfx.image(images[floor(cyclic_t)], 0, 0, gfx.width, gfx.height);
    /*
      It is worth experimenting with the value of the parameter defining the
      level of posterization. Depending on the characteristics of the image,
      different values may have the best effect. And sometimes it is worth not
      to apply the effect of posterization on the image.
    */
    gfx.filter(POSTERIZE, 3);
    /*
      Here the processed image is converted to the ASCII art. The convert()
      function in this case is used with just one parameter (image we want to
      convert), so the resultant ASCII graphics will have the same resolution
      as the image. If necessary (especially if the resolution of the converted
      image is relatively high), it is possible to use the converter function
      in the version with three parameters: then the second and third
      parameters will be respectively the width and height of the generated
      glyph table. The convert() function returns a two-dimensional array of
      characters containing the representation of the converted graphics in the
      form of the ASCII art. If the conversion fails, the function returns
      null
    */
    ascii_arr = myAsciiArt.convert(gfx);
    /*
      Now it's time to show ASCII art on the screen. First, we set drawing
      parametrs. Next, we call the function typeArray2d() embedded in the
      ASCII Art library, that writes the contents of a two-dimensional array
      containing (implicitly) text characters (chars) on the screen. In this
      case, we call a function with 2 parameters: the first is the table
      whose contents we want to print, and the second is the destination (an
      object with "canvas" property). If you use the function with two
      parameters (as we do in this example), it will assume that you need to
      fill the entire surface of the target canvass with a drawing. However,
      the function can be called in 3 variants:
        [AsciiArt instance].typeArray2d(_arr2d, _dst);
        [AsciiArt instance].typeArray2d(_arr2d, _dst, _x, _y);
        [AsciiArt instance].typeArray2d(_arr2d, _dst, _x, _y, _w, _h);
      The parameters are as follows:
        _arr2d - 2-dimentional array containing glyphs (chars)
        _dst - destination (typically the sketch itself)
        _x, _y - coordinates of the upper left corner
        _w, _h - width and height
      It is relatively easy to write your own function that formats the contents
      of an array to ASCII graphics. At the end of this example, I glue the
      function code from a non-minimized version of the library - it can be
      used as a base for your own experiments.
    */
    myAsciiArt.typeArray2d(ascii_arr, this);
    /*
      Finally, let's display the source image, too.
    */
    tint(255, pow(1.0 - (cyclic_t % 1.0), 4) * 255);
    image(images[floor(cyclic_t)], 0, 0, width, height);
    noTint();
}

function mouseReleased() {
  /*
    If you want to export the generated ASCII graphics, you can use the built-in
    function convert2dArrayToString() to convert the array of glyphs to a string.
  */
  console.log(myAsciiArt.convert2dArrayToString(ascii_arr));
}

/*
  *****************************************************************************
  ******************************** typeArray2d ********************************
  Slightly reworked part of the oryginal code from the ASCII Art library - you
  can redesign this to suit your needs.
  *****************************************************************************
  A simple function to help us print the ASCII Art on the screen. The function
  prints a two-dimensional array of glyphs and it is used similarly to the
  standard method of displaying images. It can be used in versions with 2, 4 or
  6 parameters. When using the version with 2 parameters, the function assumes
  that the width and height of the printed text block is equal to the width and
  height of the working space (that's mean: equal to the _dst size) and it
  starts drawing from upper left corner (coords: 0, 0). When using the version
  with 4 parameters, the function assumes that the width and height of the
  printed text block is equal to the width and height of the working space
  (that's mean: equal to the _dst size). _arr2d is the two-dimensional array of
  glyphs, _dst is destinetion (basically anything with 'canvas' property, such
  as p5js sketch or p5.Graphics).
*/
typeArray2d = function(_arr2d, _dst, _x, _y, _w, _h) {
  if(_arr2d === null) {
    console.log('[typeArray2d] _arr2d === null');
    return;
  }
  if(_arr2d === undefined) {
    console.log('[typeArray2d] _arr2d === undefined');
    return;
  }
  switch(arguments.length) {
    case 2: _x = 0; _y = 0; _w = width; _h = height; break;
    case 4: _w = width; _h = height; break;
    case 6: /* nothing to do */ break;
    default:
      console.log(
        '[typeArray2d] bad number of arguments: ' + arguments.length
      );
      return;
  }
  /*
    Because Safari in macOS seems to behave strangely in the case of multiple
    calls to the p5js text(_str, _x, _y) method for now I decided to refer
    directly to the mechanism for handling the canvas tag through the "pure"
    JavaScript.
  */
  if(_dst.canvas === null) {
    console.log('[typeArray2d] _dst.canvas === null');
    return;
  }
  if(_dst.canvas === undefined) {
    console.log('[typeArray2d] _dst.canvas === undefined');
    return;
  }
  var temp_ctx2d = _dst.canvas.getContext('2d');
  if(temp_ctx2d === null) {
    console.log('[typeArray2d] _dst canvas 2d context is null');
    return;
  }
  if(temp_ctx2d === undefined) {
    console.log('[typeArray2d] _dst canvas 2d context is undefined');
    return;
  }
  var dist_hor = _w / _arr2d.length;
  var dist_ver = _h / _arr2d[0].length;
  var offset_x = _x + dist_hor * 0.5;
  var offset_y = _y + dist_ver * 0.5;
  for(var temp_y = 0; temp_y < _arr2d[0].length; temp_y++)
    for(var temp_x = 0; temp_x < _arr2d.length; temp_x++)
      /*text*/temp_ctx2d.fillText(
        _arr2d[temp_x][temp_y],
        offset_x + temp_x * dist_hor,
        offset_y + temp_y * dist_ver
      );
}