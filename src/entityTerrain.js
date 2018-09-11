// entityTerrain.js

var palmSegment = null;
var patternCanvas = null;
var patternCtx = null;
var pattern = null;

class Tree
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.windx = 0;
        if(!palmSegment)
        {
            palmSegment = aw.getAsset("palmsegment.png");

            patternCanvas = document.createElement('canvas');
            patternCtx = patternCanvas.getContext('2d');
            patternCanvas.width = 8;
            patternCanvas.height = 8;
            patternCtx.drawImage(palmSegment, 0, 0);
            pattern = aw.ctx.createPattern(patternCanvas, 'repeat');

        }

        // stamp down 'w' to prevent collision
        for(let i = this.y-2; i < this.y + 1; i++)
        {
            for(let j = this.x - 6; j < this.x + 6; j++)
            {
                passable[i * 1024 + j] = 'w';
            }
        }

        this.offsetX = -25 + ezrnd() * 50;
        this.topY = 75 + ezrnd() * 30;
        this.branchOffsetX = -20;
        this.branchOffsetY = -10;
        this.sizeBranchX = 50 + ezrnd() * 20;
        this.sizeBranchY = 44 + ezrnd() * 20;

        this.l1 = 30 + ezrnd() * 20;
        this.l2 = 30 + ezrnd() * 20;
        this.l3 = 30 + ezrnd() * 20;
        this.l4 = 30 + ezrnd() * 20;
    }
    update(deltaTime)
    {
        deltaTime *= 2;
        let myGust = 0;
        if(this.windx > 0)
        {
            this.windx = Math.max(0, this.windx - deltaTime);
            let r = ezrnd();
            if(r < 0.25)
            {
                myGust = 1;
            }
        }
        this.windx = Math.min(10, this.windx + (gust + myGust) * deltaTime);
    }

    renderLeaf(x, y, w, h)
    {
        aw.ctx.fillStyle = 'green';
        aw.ctx.beginPath();
        aw.ctx.moveTo(x, y);
        aw.ctx.quadraticCurveTo(x + w*.48, y + 0, x + w*.37, y + h);
        aw.ctx.quadraticCurveTo(x + w*.24, y + 0, x, y);
        aw.ctx.fill();
        aw.ctx.fillStyle = '#004000';
        aw.ctx.beginPath();
        aw.ctx.moveTo(x, y);
        aw.ctx.quadraticCurveTo(x + w*.24, y + 0, x + w*.37, y + h);
        aw.ctx.quadraticCurveTo(x + w*.27, y + h*.77, x + w*.29, y + h*.64);
        aw.ctx.lineTo(x + w*.27, y + h*.77);
        aw.ctx.quadraticCurveTo(x + w*.13, y + h*.52, x + w*.17, y + h*.42);
        aw.ctx.lineTo(x + w*.13, y + h*.52);
        aw.ctx.quadraticCurveTo(x - w*.1, y, x, y);
        aw.ctx.fill();
    }

    render()
    {
        if(this.x < mulligan.x - screenWidth/2 - 50 || this.x > mulligan.x + screenWidth/2 + 50
            || this.y < mulligan.y - screenHeight/2 || this.y > mulligan.y + screenHeight/2 + this.topY + 50)
        {
            return;
        }

        aw.ctx.save();

        // render back leaf
        let lx = this.x + this.offsetX + 3*this.windx + this.branchOffsetX + 20;
        let ly = this.y - this.topY + this.branchOffsetY;
        aw.ctx.translate(lx, ly);
        aw.ctx.rotate((15 - 3*this.windx) * Math.PI/180);
        this.renderLeaf(0, 0, this.l1, this.l1);
        aw.ctx.rotate((7 - 3*this.windx) * Math.PI/180);
        this.renderLeaf(0, 0, -this.l2, this.l2);


        // render trunk
        aw.ctx.restore();
        aw.ctx.save();
        aw.ctx.strokeStyle = pattern;
        aw.ctx.lineWidth = 8;
        aw.ctx.shadowBlur = 2;
        aw.ctx.shadowColor = 'black';
        aw.ctx.beginPath();
        aw.ctx.moveTo(this.x, this.y);
        aw.ctx.lineTo(this.x, this.y - 30 + 2*this.windx);
        aw.ctx.quadraticCurveTo(this.x, this.y - this.topY, this.x + this.offsetX + 3*this.windx, this.y - this.topY);
        aw.ctx.stroke();
        aw.ctx.shadowBlur = 0;

        aw.ctx.translate(lx, ly);
        aw.ctx.rotate((-30 - 3*this.windx) * Math.PI/180);
        this.renderLeaf(0, 0, this.l1, this.l1);
        aw.ctx.rotate((60 - 3*this.windx) * Math.PI/180);
        this.renderLeaf(0, 0, -this.l2, this.l2);
        aw.ctx.rotate((-30 - 3*this.windx) * Math.PI/180);
        this.renderLeaf(0, 0, -this.l3, this.l3);
        this.renderLeaf(0, 0, this.l4, this.l4);


        aw.ctx.restore();
    }
}

class Grass
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.color = pickColor('g');
    }
    update(deltaTime)
    {
    }

    render()
    {
        if(this.x < mulligan.x - screenWidth/2 || this.x > mulligan.x + screenWidth/2
            || this.y < mulligan.y - screenHeight/2 || this.y > mulligan.y + screenHeight/2 + 6)
        {
            return;
        }

        aw.ctx.strokeStyle = this.color;
        aw.ctx.lineWidth = 2;
        aw.ctx.beginPath();
        aw.ctx.moveTo(this.x, this.y);
        aw.ctx.lineTo(this.x, this.y - 6);
        aw.ctx.stroke();
    }    
}