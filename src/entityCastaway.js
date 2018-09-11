var cid = 0;

class Castaway
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.movingFrame = 0;
        this.id = cid++;

        // stamp down 's' to prevent trees

        for(let i = this.y; i < this.y + 95; i++)
        {
            for(let j = this.x - 30; j < this.x + 30; j++)
            {
                if(passable[i * 1024 + j] == 'g')
                {
                    passable[i * 1024 + j] = 's';
                }
            }
        }

        switch(this.id%7)
        {
            case 0:
            this.image = "s";
            this.sprite = {
                ['x']:0,w:7,
                ['s0']:{x: 0,w:7},
                ['s1']:{x: 7,w:7},
                ['s2']:{x:14,w:7},
                ['n0']:{x:21,w:7},
                ['n1']:{x:28,w:7},
                ['n2']:{x:35,w:7},
                ['e1']:{x:42,w:7},
                ['e2']:{x:49,w:7},
                ['e0']:{x:56,w:3},
                ['w1']:{x:59,w:7},
                ['w2']:{x:66,w:7},
                ['w0']:{x:73,w:3},
            };
            break; 
            case 1:
            this.dlg = [
                "The Captain:",
                "Hey Little Buddy,",
                "this comms terminal is offline.",
                "Maybe the Instructor knows",
                "how to turn it on."
            ];
            this.sprite = {x:76,w:9};
            break;
            case 2:
            this.dlg = [
                "The Billionaire:",
                "Really, Mulligan. Do hurry!"
            ];
            this.sprite = {x:85,w:7};
            break;
            case 3:
            this.dlg = [
                "Her Guy:",
                "I'm just here to be pretty."
            ];
            this.sprite = {x:92,w:7};
            break;
            case 4:
            this.dlg = [
                "The YouTube Star:",
                "Mulligan, I need to record",
                "a video tonight. Hurry!"
            ];
            this.sprite = {x:99,w:6};
            break;
            case 5:
            this.dlg = [
                "The Instructor:",
                "This terminal seems to be",
                "active! Maybe it controls",
                "the others."
            ];
            this.sprite = {x:105,w:7};
            break;
            case 6:
            this.dlg = [
                "Carrie Ann:",
                "I found some coconuts for pie!"
            ]
            this.sprite = {x:112,w:6};
            break;
        }
    }

    getPrompt()
    {
        return "Press space to talk to me.";
    }

    update(deltaTime)
    {
        if(this.y != this.z)
        {
            this.z = this.y;
        }
        if(mulligan && this != mulligan && entityDistSq(this, mulligan) < 100)
        {
            activeEntity = this;
        }
        if(this == mulligan)
        {
            this.movingFrame += deltaTime * 6;
            while(this.movingFrame >= 4)
            {
                this.movingFrame -= 4;
            }
        }
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

    render()
    {
        let sx = 0;
        let sy = 0;
        let w = 0;
        let h = 0;
        if(this == mulligan)
        {
            let image = this.image;
            let frame = 0;
            if(this.moving)
            {
                let frameIds = [0, 1, 0, 2];
                frame = frameIds[~~this.movingFrame];
            }
            image += `${frame}`;
            sx = this.sprite[image].x;
            sy = 0;
            w = this.sprite[image].w;
            h = 16;
        }
        else
        {
            sx = this.sprite.x;
            sy = 0;
            w = this.sprite.w;
            h = 16;
        }
        aw.ctx.drawImage(atlas, sx, sy, w, h, this.x - w, this.y - h*2, w * 2, h * 2);
    }

    renderInteracting()
    {
        let text = this.dlg;

        aw.ctx.fillStyle = "white";
        roundedRect(mulligan.x - 78, mulligan.y - 50 - text.length * 5 - 5, 156, text.length * 10 + 10, 5);

        let firstRow = mulligan.y - 50 - text.length * 5 + 5;
        for(let i = 0; i < text.length; i++)
        {
            aw.drawText({text:text[i], x:mulligan.x - ((i)?0:75), 
                y:firstRow + i * 10, color: "black", 
                fontName: "Arial", fontSize: 10, fontStyle: "bold", 
                textAlign: i==0?"left":"center", textBaseline: "middle"});
        }
    }
}

