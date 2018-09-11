var screenWidth = 320;
var screenHeight = 240;
var screenScale = 2.0;

var aw = new Aw(screenWidth, screenHeight, screenScale, ["mulligan.png", "palmsegment.png"]);
aw.ctx.imageSmoothingEnabled = false;

enterSplashState();