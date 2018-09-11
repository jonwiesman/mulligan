// entityStation
class Station
{
    constructor(x, y, comms)
    {
        this.x = x;
        this.y = y;
        this.comms = comms ? true : false;
        this.interacting = false;
        this.state = 0; // 0 = inactive, 1 = active, 2 = solved
        this.id = stations.length;
        if(this.id == 0)
        {
            this.state = 1;
        }
        stations.push(this);

        // stamp down 's' to prevent trees
        for(let i = this.y; i < this.y + 95; i++)
        {
            for(let j = this.x - 35; j < this.x + 35; j++)
            {
                if(passable[i * 1024 + j] == 'g')
                {
                    passable[i * 1024 + j] = 's';
                }
            }
        }


        this.missingLinks = {};
        this.required = [];
        this.rules = [];
        switch(this.id)
        {
        case 0:
            this.nw = 2;
            this.nh = 2;
            this.rules = [];
            this.missingLinks = {'_0_0_1_0':true, '_0_0_0_1':true, '_0_1_0_2':true };
            break;
        case 1:
            this.nw = 2;
            this.nh = 4;
            this.rules = [
                {x:0,y:2,t:0x8},
            ];
            break;
        case 2:
            this.nw = 2;
            this.nh = 4;
            this.rules = [
                {x:0,y:2,t:0x88},
            ];
            break;
        case 3:
            this.nw = 3;
            this.nh = 3;
            this.rules = [
                {x:0,y:1,t:0x4c},
            ];
            break;
        case 4:
            this.nw = 4;
            this.nh = 4;
            this.rules = [
                {x:1,y:1,t:0xcc},
            ];
            this.missingLinks = {'_2_1_3_1':true, '_1_2_2_2':true, '_2_3_3_3':true};
            break;
        case 5:
            this.nw = 2;
            this.nh = 2;
            this.required = [
                {x:0,y:0},
            ];
            break;
        case 6:
            this.nw = 3;
            this.nh = 3;
            this.required = [
                {x:0,y:0},
                {x:4,y:4},
            ];
            break;
        case 7:
            this.nw = 5;
            this.nh = 5;
            this.rules = [
                {x:0,y:1,t:0xf}, {x:1,y:3,t:0x888}, {x:2,y:3,t:0x888}, 
            ];
            this.missingLinks = {'_2_1_2_2': true};
            break;
        case 8:
            this.nw = 5;
            this.nh = 5;
            this.rules = [
                {x:0,y:1,t:0xf}, {x:1,y:3,t:0x888}, {x:2,y:3,t:0x888}, 
            ];
            this.missingLinks = {'_3_1_3_2': true};
            break;
        case 9:
            this.nw = 6;
            this.nh = 6;
            this.rules = [
                {x:4,y:0,t:0x8888}, {x:2,y:2,t:0x8}, {x:2,y:4,t:0xc}, 
            ];
            break;
        case 10:
            this.nw = 6;
            this.nh = 6;
            this.rules = [
                {x:0,y:0,t:0xe2}, {x:4,y:0,t:0xc}, {x:1,y:4,t:0x888}, {x:4,y:4,t:0xe},  
            ];
            break;
        case 11:
            this.nw = 5;
            this.nh = 5;
            this.rules = [
                {x:1,y:0,t:0xc4}, {x:1,y:3,t:0xe}, 
            ];
            break;
        case 12:
            this.nw = 6;
            this.nh = 6;
            this.rules = [
                {x:0,y:0,t:0x8e}, {x:4,y:0,t:0x8888}, {x:0,y:4,t:0xe8}, 
            ];
            break;
        case 13:
            this.nw = 5;
            this.nh = 5;
            this.rules = [
                {x:0,y:0,t:0x8e}, {x:3,y:0,t:0x8888}, {x:0,y:3,t:0xe8}, 
            ];
            break;
        case 14:
            this.nw = 4;
            this.nh = 4;
            this.required = [
                {x:2,y:0}, {x:4,y:2}, {x:0,y:4}, {x:2,y:4}, {x:6,y:6}
            ];
            this.missingLinks = {
                '_0_0_1_0':true, '_0_0_0_1':true,
                '_2_1_3_1':true, '_2_2_2_3':true,
            };
            break;
        case 15:
            this.nw = 4;
            this.nh = 4;
            this.required = [
                {x:2,y:0}, {x:4,y:2}, {x:0,y:4}, {x:2,y:4}, {x:6,y:6}
            ];
            this.missingLinks = {
                '_0_0_1_0':true, '_0_0_0_1':true,
                '_1_1_2_1':true, '_2_1_3_1':true,
                '_2_2_2_3':true,
            };
            break;
        case 16:
            this.nw = 6;    // nodesHeight
            this.nh = 7;    // nodesWidth
    
            this.rules = [
                {x:1,y:0,t:0xe2},
                {x:1, y:2,t:0xcc},
                {x:3, y:2,t:0x8c4},
                {x:4, y:2,t:0x8888},
                {x:0, y:3,t:0xe8},
                {x:1, y:5,t:0x4e},
                {x:3, y:5,t:0xc6},
            ];
            break;
        case 17:
            this.nw = 2;
            this.nh = 2;
            break;
        }
        this.ox = 0;
        this.oy = this.nh - 1;
        this.dx = this.nw - 1;
        this.dy = 0;
        if(this.nw > this.nh)
        {
            this.spacing = 170 / (this.nw - 1);
        }
        else
        {
            this.spacing = 170 / (this.nh - 1);
        }
        this.orX = ~~((screenWidth - this.spacing * (this.nw - 1)) / 2);
        this.orY = ~~((screenHeight - this.spacing * (this.nh - 1)) / 2);

        this.start();
    }

    start()
    {
        this.path = [{x: this.ox, y:this.oy}];
        this.visited = Array(this.nw * this.nh).fill(false);
        this.visited[this.oy * this.nw + this.ox] = true;
    }

    linkExists(x1, y1, x2, y2)
    {
        let k = `_${x1}_${y1}_${x2}_${y2}`;
        if(this.missingLinks[k])
        {
            return false;
        }
        k = `_${x2}_${y2}_${x1}_${y1}`;
        if(this.missingLinks[k])
        {
            return false;
        }
        return true;
    }

    checkPuzzle()
    {
        if(this.checking || this.checked)
        {
            return;
        }
        this.checking = true;
        this.checked = false;

        let grid = new Grid(this.nw-1, this.nh-1);
        grid.SetStartNode({x:this.ox*2, y:this.oy*2});
        grid.SetEndNode({x:this.dx*2, y:this.dy*2});
        for(let i = 0; i < this.rules.length; i++)
        {
            let rule = this.rules[i];
            grid.AddRule(grid.BlockPointToNodePoint(rule), new PRule(rule.t));
        }
        for(let i = 0; i < this.required.length; i++)
        {
            grid.SetNodeRequired(this.required[i]);
        }
        grid.Start({x:this.ox*2, y:this.oy*2});
        for(let i = 1; i < this.path.length; i++)
        {
            let node = this.path[i];
            grid.MoveTo({x: node.x*2, y:node.y*2});
        }
        let success = grid.CheckRules();
        if(success)
        {
            activeEntity.setComplete();
        }
        else
        {
            snd('square', 32.7);
        }    
        this.checking = false;
        this.checked = true;
    }

    update()
    {
        if(entityDistSq(this, mulligan) < 100)
        {
            activeEntity = this;
        }

        if(activeEntity != this || !this.interacting)
        {
            return;
        }
        if(aw.keysJustPressed['p'] && aw.keys['q'])
        {
            this.setComplete();
        }
        if(aw.keysJustPressed['escape'])
        {
            if(this.state < 2 && this.path.length > 1)
            {
                this.start();
                return;
            }
            else
            {
                this.interacting = false;
                return;
            }
        }
        if(this.state != 1)
        {
            return;
        }

        let current = this.path[this.path.length - 1];
        if(current.x == this.dx && current.y == this.dy && this.state == 1)
        {
            if(!this.checked)
            {
                this.checkPuzzle();
                return;
            }
        }
        let previous = {x: -1, y: -1};
        if(this.path.length > 1)
        {
            previous = this.path[this.path.length - 2];
        }
        let temp = Object.assign({}, current);

        if (aw.keysJustPressed['a'] || aw.keysJustPressed['left'])
        {
            temp.x -= 1;
        }
        else if(aw.keysJustPressed['s'] || aw.keysJustPressed['down'])
        {
            if(this.comms)
            {
                this.setComplete();
                return;
            }
            temp.y += 1;
        }
        else if(aw.keysJustPressed['d'] || aw.keysJustPressed['right'])
        {
            temp.x += 1;
        }
        else if(aw.keysJustPressed['w'] || aw.keysJustPressed['up'])
        {
            temp.y -= 1;
        }
        if(!this.visited[temp.y * this.nw + temp.x] && temp.y >= 0 
            && temp.x >= 0 && temp.x < this.nw && temp.y < this.nh
            && this.linkExists(current.x, current.y, temp.x, temp.y))
        {
            this.visited[temp.y * this.nw + temp.x] = true;
            this.checked = false;
            this.path.push(temp);
        }
        else if(temp.x == previous.x && temp.y == previous.y)
        {
            this.visited[current.y * this.nw + current.x] = false;
            this.path.length = this.path.length - 1;
        }
    }

    getPathColor()
    {
        if(this.state == 2)
        {
            return 'green';
        }
        if(!this.visited[this.dy * this.nw + this.dx])
        {
            return 'white';
        }
        if(this.checked){
            return 'red';
        }
        return 'yellow';
    }

    interact()
    {
        if(!this.interacting)
        {
            this.interacting = true;
        }
        else
        {
            this.interacting = false;
        }
    }

    nodePosX(x)
    {
        return this.orX + x * this.spacing;
    }
    nodePosY(y)
    {
        return this.orY + y * this.spacing;
    }

    getPrompt()
    {
        if(!this.interacting)
        {
            return "Press space to access terminal.";
        }
        let prompts = [
            "Terminal offline. Press space to return.",
            "Terminal enabled. Use WASD to draw a path to the exit",
            "Terminal online. Press space to return.",
        ];
        if(this.comms)
        {
            prompts = [
                "Communication terminal offline. Press space to return.",
                "Communication terminal online. Press S to send SOS.",
                "Help is on the way!"
            ]
        }

        return prompts[this.state];
    }

    renderInteracting()
    {
        aw.ctx.strokeStyle = '#808080';
        aw.ctx.lineWidth = 10;
        roundedRect(mulligan.x - 105, mulligan.y - 105, 210, 210, 10, true);

        let fillStyles = [
            '#000000', '#00ffff', '#00ff00'
        ];
        aw.ctx.fillStyle = fillStyles[activeEntity.state]
        aw.ctx.globalAlpha = 0.5;
        roundedRect(mulligan.x - 100, mulligan.y - 100, 200, 200, 5);
        aw.ctx.globalAlpha = 1;

        if(this.comms)
        {
            let colors = ['#400000', '#ff0000', '#ffffff'];
            aw.drawText({text:"SOS", x:mulligan.x, y:mulligan.y, color: colors[this.state], 
            fontName: "Arial", fontSize: 40, fontStyle: "bold", textAlign: "center", textBaseline: "middle"})
            return;
        }

        aw.ctx.save();
        aw.ctx.setTransform(1, 0, 0, 1, 0, 0);
        if(this.state > 0)
        {
            for(let y = 0; y < this.nh; y++)
            {
                for(let x = 0; x < this.nw; x++)
                {
                    aw.ctx.lineWidth = 10;
                    aw.ctx.strokeStyle = 'black';
                    if(x < this.nw - 1 && this.linkExists(x, y, x + 1, y))
                    {
                        aw.ctx.beginPath();
                        aw.ctx.moveTo(this.nodePosX(x), this.nodePosY(y));
                        aw.ctx.lineTo(this.nodePosX(x + 1), this.nodePosY(y));
                        aw.ctx.stroke();    
                    }
                    if(y < this.nh - 1 && this.linkExists(x, y, x, y + 1))
                    {
                        aw.ctx.beginPath();
                        aw.ctx.moveTo(this.nodePosX(x), this.nodePosY(y));
                        aw.ctx.lineTo(this.nodePosX(x), this.nodePosY(y + 1));
                        aw.ctx.stroke();    
                    }
    
                    aw.ctx.fillStyle = 'black';
                    aw.ctx.beginPath()
                    aw.ctx.arc(this.nodePosX(this.ox), this.nodePosY(this.oy), 11, 0, 2 * Math.PI);
                    aw.ctx.fill();
    
                    aw.ctx.beginPath()
                    aw.ctx.arc(this.nodePosX(this.dx), this.nodePosY(this.dy), 12, 0, 2 * Math.PI);
                    aw.ctx.fill();
    
    
                    if(this.path.length > 0)
                    {
                        aw.ctx.fillStyle = this.getPathColor();
                        aw.ctx.beginPath()
                        aw.ctx.arc(this.nodePosX(this.ox), this.nodePosY(this.oy), 9, 0, 2 * Math.PI);
                        aw.ctx.fill();
    
                        aw.ctx.beginPath();
                        aw.ctx.lineWidth = 7;
                        aw.ctx.strokeStyle = this.getPathColor();
                        aw.ctx.lineJoin = 'round';
                        aw.ctx.moveTo(this.nodePosX(this.ox), this.nodePosY(this.oy));
                        for(let i = 1; i < this.path.length; i++)
                        {
                            aw.ctx.lineTo(this.nodePosX(this.path[i].x), this.nodePosY(this.path[i].y));
                        }
                        aw.ctx.stroke();
                        if(this.visited[this.dy * this.nw + this.dx])
                        {
                            aw.ctx.fillStyle = this.getPathColor();
                            aw.ctx.beginPath()
                            aw.ctx.arc(this.nodePosX(this.dx), this.nodePosY(this.dy), 10, 0, 2 * Math.PI);
                            aw.ctx.fill();
                        }
                    }
                }
            }
            // tetris rules
            aw.ctx.fillStyle = 'black';
            for(let i = 0; i < this.rules.length; i++)
            {
                let rule = this.rules[i];
                let bx = this.orX + rule.x * this.spacing + 8;
                let by = this.orY + rule.y * this.spacing + 8;
                for(let ry = 0; ry < 4; ry++)
                {
                    for(let rx = 0; rx < 4; rx++)
                    {
                        let bit = (3-ry) * 4 + (3-rx);
                        if(rule.t & (1 << bit))
                        {
                            aw.ctx.fillRect(bx + rx * 4, by + ry * 4, 3, 3);
                        }
                    }
                } 
            }
            // hexagon rules
            aw.ctx.fillStyle = 'red';
            for(let i = 0; i < this.required.length; i++)
            {
                let n = this.required[i];
                let bx = this.orX + n.x * this.spacing / 2;
                let by = this.orY + n.y * this.spacing / 2;
                aw.ctx.fillRect(bx, by, 2, 2);
            }
        }
        else
        {

        }
        aw.ctx.restore();
    }

    onSignal()
    {
        this.state = 1;
    }

    setComplete()
    {
        snd('sine', 523.25);
        this.state = 2;
        if(this.id + 1 < stations.length)
        {
            stations[this.id + 1].onSignal();
        }
        else
        {
            gameOver = true;
        }
    }

    render()
    {
        aw.ctx.drawImage(atlas, 118, 4, 6, 12, this.x - 6, this.y - 24, 12, 24);
        aw.ctx.globalAlpha = 0.5;
        switch(this.state)
        {
            case 0:
                aw.ctx.fillStyle = 'black';
                break;
            case 1:
                aw.ctx.fillStyle = '#00ffff';
                break;
            case 2:
                aw.ctx.fillStyle = '#00ff00';
                break;
        }
        aw.ctx.fillRect(this.x - 4, this.y - 22, 8, 8);
        aw.ctx.globalAlpha = 1;
    }
}

class UiOverlay
{
    constructor()
    {
        this.showWASD = true;
    }

    update()
    {
        if(this.z != 10000)
        {
            this.z = 10000;
        }
    }

    render()
    {
        let msg = this.showWASD ? "Use WASD keys to move Mulligan" : "";
        if(activeEntity != null)
        {
            msg = activeEntity.getPrompt();
            this.showWASD = false;

            if(activeEntity.interacting)
            {
                activeEntity.renderInteracting();
            }
        }

        if(gameOver && (activeEntity == null || !activeEntity.interacting))
        {
            aw.ctx.save();
            aw.ctx.shadowColor = "black";
            aw.ctx.shadowOffsetX = 1;
            aw.ctx.shadowOffsetY = 1;
            aw.drawText({text: "You saved us Mulligan!", x: mulligan.x, y: mulligan.y, color: "#ddffdd", 
                fontName: "Arial", fontSize: 26, fontStyle: "bold", textAlign: "center", textBaseline: "middle"});
            aw.drawText({text: "Hit space to restart", x: mulligan.x, y: mulligan.y + 30, color: "#ddffdd", 
                fontName: "Arial", fontSize: 20, fontStyle: "bold", textAlign: "center", textBaseline: "middle"});
            aw.ctx.restore();
        }
        else
        {
            // msg = `${~~mulligan.x},${~~mulligan.y} passable = ${passable[~~mulligan.y*1024+~~mulligan.x]}`;
            // draw message
            aw.ctx.save();
            aw.ctx.shadowColor = "black";
            aw.ctx.shadowOffsetX = 1;
            aw.ctx.shadowOffsetY = 1;
            aw.drawText({text: msg, x: mulligan.x, y: mulligan.y + 110, color: "#ddffdd", 
                fontName: "Arial", fontSize: 10, fontStyle: "bold", textAlign: "center", textBaseline: "middle"});
            aw.ctx.restore();
        }
    }
}