// stateMulligan
var mulliganInitialized = false;
var mulligan = null;
var stations = [];
var activeEntity = null;
var gameOver = false;
var vicMsg = false;
var gust = 0;
var timeToNextGust = 0;

function roundedRect(x, y, w, h, r, edge) {
    aw.ctx.beginPath();

    aw.ctx.moveTo(x + r, y);
    aw.ctx.arcTo(x + w, y, x + w, y + r, r);
    aw.ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    aw.ctx.arcTo(x, y + h, x, y + h - r, r);
    aw.ctx.arcTo(x, y, x + r, y, r);
    aw.ctx.closePath();

    if(edge)
    {
        aw.ctx.stroke();
    }
    else
    {
        aw.ctx.fill();
    }
}

function entityDistSq(e1, e2)
{
    return (e1.x - e2.x) * (e1.x - e2.x) + (e1.y - e2.y) * (e1.y - e2.y);
}

function entityDist(e1, e2)
{
    return Math.sqrt(entityDistSq(e1, e2));
}

function enterMulliganState()
{
    gameOver = false;
    vicMsg = false;
    mulliganInitialized = false;
    aw.state = mulliganState;
    stations = [];
    aw.clearAllEntities();   
}

function isPassable(x, y)
{
    return (passable[~~(y) * 1024 + ~~(x)] != 'w');
}

function testMove(op, np)
{
    let d = entityDistSq(op, np);
    if(d <= 1)
    {
        if(isPassable(np.x, np.y))
        {
            return np;
        }
        return op;
    }
    d = Math.sqrt(d);
    let dx = (np.x - op.x)/d;
    let dy = (np.y - op.y)/d;

    let p = {x:op.x, y:op.y};
    for(let t = 0; t < d; t++)
    {
        if(isPassable(p.x + dx, p.y + dy))
        {
            p.x += dx;
            p.y += dy;
        }
        else
        {
            return p;
        }
    }
    if(isPassable(np.x, np.y))
    {
        return np;
    }
    return p;
}

function getPulsePoint(x1, y1, x2, y2, x3, y3, x4, y4, t)
{
    let t3 = t*t*t;
    let t2 = t*t;
    let tp = 1-t;
    let tp2 = tp*tp;
    let tp3 = tp*tp*tp;
    return {x:tp3*x1 + 3*tp2*t*x2 + 3*tp*t2*x3 + t3*x4,
            y:tp3*y1 + 3*tp2*t*y2 + 3*tp*t2*y3 + t3*y4 };
}

function drawPowerLine(station1, station2)
{
    aw.ctx.lineCap = 'round';
    aw.ctx.strokeStyle = 'black';
    aw.ctx.lineWidth = 3;
    aw.ctx.beginPath();
    aw.ctx.moveTo(station1.x, station1.y - 2);
    let dx = station2.x - station1.x;
    let dy = station2.y - station1.y;
    let cx1 = station1.x + (dx) / 3;
    let cx2 = station1.x + (dx) * 2 / 3;
    let cy1 = station1.y + (dy) / 3;
    let cy2 = station1.y + (dy) * 2 / 3;
    if(dy > dx)
    {
        cx1 += dy;
        cx2 -= dy;
    }
    else
    {
        cy1 += dx;
        cy2 -= dx;
    }
    aw.ctx.bezierCurveTo(cx1, cy1, cx2, cy2, station2.x, station2.y - 2);
    aw.ctx.stroke();

    aw.ctx.lineWidth = 2;
    aw.ctx.strokeStyle = '#808080';
    if(station1.state == 2)
    {
        aw.ctx.strokeStyle = 'cyan';
    }
    aw.ctx.stroke();

    if(station1.state == 2)
    {
        let t = (performance.now() % 1000) / 1000;
        let pulse = getPulsePoint(station1.x, station1.y-2, cx1, cy1, cx2, cy2, station2.x, station2.y-2, t);

        aw.ctx.save();
        aw.ctx.fillStyle = 'white';
        aw.ctx.shadowColor = 'white';
        aw.ctx.shadowBlur = 5;
        aw.ctx.beginPath();
        aw.ctx.arc(pulse.x, pulse.y, 2, 0, 2*Math.PI);
        aw.ctx.fill();
        aw.ctx.restore();
    }
}

var grassPos = [];
var treePos = [];
function addEntities()
{
    
    if(grassPos.length == 0)
    {
        for(let y = 0; y < 1024; y+=5)
        {
            for(let x = 0; x < 1024; x+=5)
            {
                if(passable[y * 1024 + x] == 'g')
                {
                    grassPos.push({
                        x: x + Math.random() * 8 - 4,
                        y: y + Math.random() * 8 - 4
                    });
                }
            }
        }    
    }    
    for(let i = 0; i < grassPos.length; i++)
    {
        aw.addEntity(new Grass(grassPos[i].x, grassPos[i].y), true);
    }

    aw.addEntity(mulligan = new Castaway(624, 526, "m-s"));
    aw.addEntity(new Castaway(610, 513, "c1"), true);
    aw.addEntity(new Castaway(571, 504, "c2"), true);
    aw.addEntity(new Castaway(551, 510, "c3"), true);
    aw.addEntity(new Castaway(516, 542, "c4"), true);
    aw.addEntity(new Castaway(533, 574, "c5"), true);
    aw.addEntity(new Castaway(583, 570, "c6"), true);

    aw.addEntity(new Station(516, 573), true);
    aw.addEntity(new Station(447, 596), true);
    aw.addEntity(new Station(430, 747), true);
    aw.addEntity(new Station(440, 818), true);
    aw.addEntity(new Station(703, 854), true);
    aw.addEntity(new Station(525, 820), true);
    aw.addEntity(new Station(364, 864), true);
    aw.addEntity(new Station(167, 748), true);
    aw.addEntity(new Station(234, 650), true);
    aw.addEntity(new Station(131, 530), true);
    aw.addEntity(new Station(244, 412), true);
    aw.addEntity(new Station(195, 284), true);
    aw.addEntity(new Station(310, 205), true);
    aw.addEntity(new Station(421, 137), true);
    aw.addEntity(new Station(531, 236), true);
    aw.addEntity(new Station(677, 302), true);
    aw.addEntity(new Station(764, 394), true);

    aw.addEntity(new Station(638, 508, true));    // the final station
    
    if(treePos.length == 0)
    {
        for(let y = 0; y < 1024; y+=64)
        {
            for(let x = 0; x < 1024; x+=64)
            {
                for(let tries = 0; tries < 5; tries++)
                {
                    let xo = x + ~~(Math.random() * 64) - 32;
                    let yo = y + ~~(Math.random() * 32) - 16;
                    if(passable[yo * 1024 + xo] == 'g')
                    {
                        treePos.push({x: xo, y: yo});
                        break;
                    }
                }
            }
        }    
    }
    for(let i = 0; i < treePos.length; i++)
    {
        aw.addEntity(new Tree(treePos[i].x, treePos[i].y), true);
    }    
    aw.addEntity(new UiOverlay());
}

function snd(t, freq)
{
    let ac = new(window.AudioContext || window.webkitAudioContext)();
    let osc = ac.createOscillator();
    osc.type = t;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    osc.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.1);
}

function mulliganState(deltaTime)
{
    if(!mulliganInitialized)
    {
        addEntities();
        mulliganInitialized = true; 
    }
    frame++;

    timeToNextGust -= deltaTime;
    if(timeToNextGust < 0)
    {
        if(gust > 0)
        {
            gust = 0; //Math.max(0, gust - deltaTime * 8);
            timeToNextGust = 1 + 2.5 * ezrnd();
        }
        else
        {
            gust = 2 + 0.5 * ezrnd();
            timeToNextGust = 0.5 + 0.5 * ezrnd();
        }
    }

    let move = deltaTime * 90;
    if(!activeEntity || !activeEntity.interacting)
    {
        let temp = {x:mulligan.x, y:mulligan.y};
        mulligan.moving = false;
        if(aw.keys['s'] || aw.keys['down'])
        {
            mulligan.moving = true;
            mulligan.image = "s";
            temp.y += move;
        }
        else if(aw.keys['w'] || aw.keys['up'])
        {
            mulligan.moving = true;
            mulligan.image = "n";
            temp.y -= move;
        }
        if (aw.keys['a'] || aw.keys['left'])
        {
            mulligan.moving = true;
            mulligan.image = "w";
            temp.x -= move;
        }
        else if(aw.keys['d'] || aw.keys['right'])
        {
            mulligan.moving = true;
            mulligan.image = "e";
            temp.x += move;
        }
        if(mulligan.moving)
        {
            let np = testMove(mulligan, temp)
            mulligan.x = np.x;
            mulligan.y = np.y;
        }
    }
    if(aw.keysJustPressed['space'])
    {
        if(activeEntity != null)
        {
            activeEntity.interact();
        }
        if(gameOver)
        {
            if(vicMsg)
            {
                enterSplashState();
            }
            vicMsg = true;
        }
    }

    aw.ctx.setTransform(1, 0, 0, 1, 0, 0);
    aw.ctx.fillStyle = '#0020b0';
    aw.ctx.fillRect(0, 0, 320, 480);

    aw.ctx.translate(-mulligan.x + screenWidth / 2, -mulligan.y + screenHeight / 2);
    if(islandImg)
    {
        aw.ctx.imageSmoothingEnabled = true;
        aw.ctx.drawImage(islandImg, 0, 0, 1024, 1024, 0, 0, 1024, 1024);
        let xOffset = 24 * Math.sin((frame%200) * Math.PI/100);
        aw.ctx.drawImage(islandImg, 1024, 0, 1024, 1024, xOffset/2, xOffset/2, 1024-xOffset, 1024-xOffset);
        aw.ctx.imageSmoothingEnabled = false;
    }

    // draw the station wires
    for(let i = 0; i < stations.length - 1; i++)
    {
        drawPowerLine(stations[i], stations[i + 1]);
    }


    activeEntity = null;
}