// stateSplash.js
var islandImg = null;
var splashInitialized = false;
var castAdded = false;
var c = [];
var frame = 0;
var passable = [];
var atlas = null;
var loadingShown = false;

function enterSplashState()
{
    loadingShown = false;
    frame = 0;
    castAdded = false;
    aw.state = splashState;
    c = [];
    aw.clearAllEntities();   
    aw.ctx.setTransform(1, 0, 0, 1, 0, 0);
}

var seed = 1;
function ezrnd() {
    return Math.random();
    // var x = Math.sin(seed++) * 17389;
    // return x - ~~(x);
}

function pickOne(options)
{
    let r = ~~(Math.random() * options.length);
    return options[r];
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function pickColor(type)
{
    if(type == 'g')
    {
        return pickOne(['#59A044', '#71BB42', '#71BA44', '#59A040', '#90C63D', '#599F47']);
    }
    if(type == 'w')
    {
        return '#0020b0';
    }
    if(type == 's')
    {
        return pickOne(['#C8BE8D', '#E3D9A8', '#E2D8A7', '#DBD49D', '#E7DDAC', '#DAD39C']);
    }
    if(type == 'b')
    {
        return pickOne(['#706CD1', '#6864C9', '#706CD1', '#6A67CB', '#766FDC', '#726BD7']);
    }
    return 'black';
}

function getLSProj(p, v, w)
{
    let l = entityDistSq(v, w);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l;
    return Math.max(0, Math.min(1, t));
}

function distToSegTSq(p, v, w, t)
{
    return entityDistSq(p, {x:v.x + t * (w.x - v.x), y:v.y + t * (w.y - v.y)});
}

function distToSegSq(p, v, w)
{
    let t = getLSProj(p, v, w);
    return distToSegTSq(p, v, w, t);
}


function getBaseElevation(x, y)
{
    let peaks = [{x:605,y:380,h:8}, {x:768,y:512,h:2}, {x:768, y:256, h:8}, {x:544, y:252, h:4},
        {x:384, y:384, h:16}, {x:256, y:768, h:8},
        {x:512,y:850,h:4}, {x:669,y:790,h:4}, {x:580,y:880,h:4}, {x:700,y:850,h:7}
    ];


    let p = {x:x, y:y};
    let e = 0;
    for(let i = 1; i < peaks.length; i++)
    {
        let t = getLSProj(p, peaks[i - 1], peaks[i]);
        let h = peaks[i - 1].h * (1-t) + peaks[i].h * t;
        let d = distToSegTSq(p, peaks[i - 1], peaks[i], t);
        let r = 20 * h;

        if(d < r * r)
        {
            e = Math.max(e, h * (1 - d/(r*r)));
        }
    }

    return e;
}

function makeIsland()
{
    let canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    let ctx = canvas.getContext('2d');
    let canvasData = ctx.getImageData(0, 0, 2048, 1024);

    let baseValues = {
        g: 2, s: 1, w: 0,
    }

    let peak = {x: 512, y:512};
    let p = 'w';
    for(let y = 0; y < 1024; y++)
    {
        for(let x = 0; x < 1024; x++)
        {
            let e = getBaseElevation(x, y);
            let waterAlpha = 0;
            if(e < 1.65)
            {
                p = 'w';
                waterAlpha = 128;
            }
            else if(e < 2)
            {
                p = 's';
                waterAlpha = 128;
            }
            else if(e < 5)
            {
                p = 's';
            }
            else
            {
                p = 'g';
            }

            passable[y * 1024 + x] = p;
            let clr = hexToRgb(pickColor(p));
            let i = (y * 2048 + x) * 4;

            canvasData.data[i] = clr.r;
            canvasData.data[i + 1] = clr.g;
            canvasData.data[i + 2] = clr.b;
            canvasData.data[i + 3] = 255;

            clr = hexToRgb(pickColor('w'));
            canvasData.data[i + 4096] = clr.r;
            canvasData.data[i + 4097] = clr.g;
            canvasData.data[i + 4098] = clr.b;
            canvasData.data[i + 4099] = waterAlpha;
            
        }
    }
    ctx.putImageData(canvasData, 0, 0);

    let new_image_url = canvas.toDataURL();
    islandImg = document.createElement('img');
    islandImg.src = new_image_url;
}

function initializeState()
{
    atlas = aw.getAsset("mulligan.png")

    makeIsland();

    splashInitialized = true; 

}


function splashState()
{
    aw.drawText({text: "Mulligan's Island", x: 160, y: 5, color: "yellow", fontName: "Georgia", fontSize: 30, fontStyle: "bold", textAlign: "center", textBaseline: "top"});
    aw.drawText({text: "Loading...", x: 160, y: 120, color: "yellow", fontName: "Georgia", fontSize: 30, fontStyle: "bold", textAlign: "center", textBaseline: "middle"});

    if(!loadingShown)
    {
        loadingShown = true;
        return;
    }
    if(!splashInitialized)
    {
        initializeState();
        return;
    }
    if(!castAdded)
    {
        aw.addEntity(c[c.length] = new Castaway(-1, 0), true);
        aw.addEntity(c[c.length] = new Castaway(-1, 0), true);
        aw.addEntity(c[c.length] = new Castaway(-1, 0), true);
        aw.addEntity(c[c.length] = new Castaway(-1, 0), true);
        aw.addEntity(c[c.length] = new Castaway(-1, 0), true);
        aw.addEntity(c[c.length] = new Castaway(-1, 0), true);
        aw.addEntity(c[c.length] = new Castaway(-1, 0), true);
        castAdded = true;
    }

    frame++;

    aw.ctx.setTransform(1, 0, 0, 1, 0, 0);
    aw.ctx.fillStyle = '#0020b0';
    aw.ctx.fillRect(0, 0, 320, 240);

    aw.ctx.globalAlpha = 0.5;
    aw.ctx.drawImage(islandImg, 0, 0, 1024, 1024, 40, 0, 240, 240);
    aw.ctx.globalAlpha = 1;

    aw.drawText({text: "Mulligan's Island", x: 160, y: 5, color: "yellow", fontName: "Georgia", fontSize: 30, fontStyle: "bold", textAlign: "center", textBaseline: "top"});

    let tale = ["Now sit right back and you'll hear the tale of a 3-hour tour ",
                "that went awry. Our castaways have been shipwrecked ",
                "on a desert isle. Their radio is OFFLINE. But wait!",
                "This island has some sort of communications system on it.",
                " Can they figure out how to activate it?"
    ];
    let cast = [
        'With Mulligan...',
        'The Captain too.',
        'The Billionaire...',
        'And her guy.',
        'The YouTube star...',
        'The Instructor and ',
        'Carrie Ann.',
        "Here on Mulligan's Isle!",
        "Hit space to continue."
    ];

    for(let i = 0; i < tale.length; i++) {
        aw.drawText({text: tale[i], x:160, y:40 + i * 10, color:'yellow', fontName: "Georgia", fontSize:10, textAlign:'center', textBaseline:'top'});
    }

    let cx = [160, 80, 160, 240, 80, 160, 240, 160, 160];
    let cy = [125, 165, 165, 165, 205, 205, 205, 217, 229];
    for(let i = 0; i < cast.length; i++) {
        if(frame >= 100 + i * 60)
        {
            if(i != 8 || ~~((frame / 30)) % 2 == 0)
            {
                aw.drawText({text: cast[i], x:cx[i], y:cy[i], color:'yellow', fontName:"Georgia", fontSize:9, textAlign:'center', textBaseline:'top'});
            }            
            if(i < c.length)
            {
                c[i].x = cx[i];
                c[i].y = cy[i];
            }
        }    
    }

    if(aw.keysJustPressed['space'])
    {
        if(frame > 25)
        {
            enterMulliganState();
        }
    }
}