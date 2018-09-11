var maxBlocks = 10;

var Dir = {N: 0, E: 1, S: 2, W: 3};
var NodeType = {Jct: 0, Path: 1, Block: 2, Start: 3, End: 4 };
var RuleEval = { No: 0, Mb: 1, Yes: 2};

class PRule
{
    constructor(data)
    {
        this.data = data;
    }
    GetData() { return this.data; }
    GetDataBit(x, y)
    {
        x = 3 - x;
        y = 3 - y;
        let mask = (1 << (y * 4 + x));
        return (this.data & mask) != 0;
    }
    SquareCount()
    {
        let squares = 0;
        for(let i = 0; i < 16; i++)
        {
            if ((this.data & (1 << i)) != 0)
                squares++;
        }
        return squares;
    }
}

class PNode
{
    constructor(owner, x, y)
    {
        this.owner = owner;
        this.loc = {x: x, y:y};
        this.visited = false;
        this.rule = null;
        this.required = false;
        if(x % 2 == 0 && y % 2 == 0)
        {
            this.type = NodeType.Jct;
            this.passable = true;
        }
        else if(x % 2 == 1 && y % 2 == 1)
        {
            this.type = NodeType.Block;
            this.passable = false;
        }
        else
        {
            this.type = NodeType.Path;
            this.passable = true;
        }
    }
    Visited() { return this.visited; }
    SetVisited(bVisited) { this.visited = bVisited; }
    IsJct() { return this.type == NodeType.Jct || this.IsStart() || this.IsEnd(); }
    IsStart() { return this.type == NodeType.Start; }
    IsEnd() { return this.type == NodeType.End; }
    IsPath() { return this.type == NodeType.Path; }
    IsVertical() { return this.IsPath() && (this.loc.y % 2) == 1; }
    IsBlock() { return this.type == NodeType.Block; }
    IsPassable() { return this.passable; }
    SetPassable(passable) { this.passable = passable; }
    SetStart()
    {
        if (this.IsBlock())
            return;
        this.type = NodeType.Start;
    }
    SetEnd()
    {
        if (this.IsBlock())
            return;
        this.type = NodeType.End;
    }
}

function NextBlock(p, dir)
{
    let po = {x:p.x, y:p.y};
    switch(dir)
    {
        case Dir.N:
            po.y--;
            break;
        case Dir.E:
            po.x++;
            break;
        case Dir.S:
            po.y++;
            break;
        case Dir.W:
            po.x--;
            break;
    }
    return po;
}

function ptEq(p1, p2)
{
    return p1.x == p2.x && p1.y == p2.y;
}

function ptCopy(p)
{
    return {x: p.x, y:p.y};
}

function NxPt(start, dest)
{
    if (start.x > dest.x)
        return {x:start.x - 1, y:start.y};
    if (start.x < dest.x)
        return {x:start.x + 1, y:start.y};
    if (start.y < dest.y)
        return {x:start.x, y:start.y + 1};
    if (start.y > dest.y)
        return {x:start.x, y:start.y - 1};
    return ptCopy(start);
}

class Region
{

    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        this.squares = [];
        this.rules = [];
        if (this.width <= 0 || this.height <= 0)
            return;
        for(let x = 0; x < width; x++)
        {
            for(let y = 0; y < height; y++)
            {
                this.squares[y * this.width + x] = 0;
            }
        }
        this.sqCount = 0;   // all marked squares
        this.sqReq = 0; // sum of all rules
    }
    make(other)
    {
        this.width = other.width;
        this.height = other.height;

        if (this.width <= 0 || this.height <= 0)
            return;
        this.squares = [];
        for (let x = 0; x < this.width; x++)
        {
            for (let y = 0; y < this.height; y++)
            {
                this.squares[y*this.width+x] = other.squares[y*this.width+x];
            }
        }
    }

    AddRule(rule)
    {
        this.sqReq += rule.SquareCount();
        this.rules.push(rule);
    }

    BlockInRegion(block)
    {
        if (block.x < 0 || block.x >= this.width || block.y < 0 || block.y >= this.height)
            return false;
        return true;
    }


    Mark(pt)
    {
        this.sqCount++;
        this.squares[pt.y*this.width+pt.x] = 1;
    }
    V(pt)
    {
        return this.squares[pt.y*this.width+pt.x];
    }

    FirstUnmarked()
    {
        let pt = {x:-1, y:-1};
        for(pt.y = 0; pt.y < this.height; pt.y++)
        {
            for(pt.x = 0; pt.x < this.width; pt.x++)
            {
                if (this.squares[pt.y*this.width+pt.x] == 0)
                    return pt;
            }
        }
        return pt;
    }

    AnyUnmarked()
    {
        for(let x = 0; x < this.width; x++)
        {
            for(let y = 0; y < this.height; y++)
            {
                if (this.squares[y*this.width+x] != 0)
                    return true;
            }
        }
        return false;
    }

    RuleOk(iRule, rgn)
    {
        if(iRule == this.rules.length)
            return RuleEval.Mb;

        let rule = this.rules[iRule];
        let ruleSquares = rule.SquareCount();
        for(let x = 0; x < this.width + 3; x++)
        {
            for(let y = -3; y < this.height + 3; y++)
            {
                let thisRgn = new Region(rgn.width, rgn.height);
                thisRgn.make(rgn);
                let valid = true;
                let squaresMarked = 0;
                for (let rx = 0; rx < 4 && valid; rx++)
                {
                    for(let ry = 0; ry < 4; ry++)
                    {
                        if (rx + x < 0 || ry + y < 0 || rx + x >= this.width || ry + y >= this.height)
                            continue;
                        if (rule.GetDataBit(rx, ry))
                        {
                            if (thisRgn.squares[(ry+y)*this.width + rx + x] == 0)
                            {
                                valid = false;
                                break;
                            }
                            thisRgn.squares[(ry+y)*this.width+rx + x] = 0;
                            squaresMarked++;
                        }
                    }
                }
                if(valid && squaresMarked == ruleSquares)
                {
                    let evl = this.RuleOk(iRule + 1, thisRgn);

                    if (evl == RuleEval.Mb)
                    {
                        // we searched ahead and nobody objected
                        if (!thisRgn.AnyUnmarked())
                        {
                            // everything is great
                            return RuleEval.Yes;
                        }
                    }
                    else if(evl == RuleEval.Yes)
                    {
                        return evl;
                    }
                }
            }
        }
        // something went wrong somewhere
        return RuleEval.No;
    }

    RulesOK()
    {
        if(this.sqCount != this.sqReq && this.sqReq > 0)
        {
            return false;
        }
        let evl = this.RuleOk(0, this);
        return (evl != RuleEval.No);
    }
}

class Grid
{
    // public int this.width { get; }        // in nodes
    // public int this.height { get; }       // in nodes
    // WozNode[,] this.nodes;  // width * height
    // public Point this.current { get; private set; }

    WidthBlocks() { return ~~(this.width / 2); }
    HeightBlocks() { return ~~(this.height / 2); }

    constructor(widthBlocks, heightBlocks)
    {
        if (widthBlocks < 0 || heightBlocks < 0 || widthBlocks > maxBlocks || heightBlocks > maxBlocks)
            return;
        this.current = {x:-1, y:-1};
        this.width = 2 * widthBlocks + 1;
        this.height = 2 * heightBlocks + 1;
        this.nodes = [];

        // create the nodes and blocks
        for (let x = 0; x < this.width; x++)
        {
            for (let y = 0; y < this.height; y++)
            {
                this.nodes[y*this.width +x] = new PNode(this, x, y);
            }
        }
    }
    AddRule(node, rule)
    {
        if (!this.NodeInGrid(node))
            return;
        this.nodes[node.y*this.width+node.x].rule = rule;
    }

    SetNodeRequired(node)
    {
        if (!this.NodeInGrid(node))
            return;
        this.nodes[node.y*this.width+node.x].required = true;
    }

    SetStartNode(node)
    {
        if (!this.NodeInGrid(node))
            return;
        this.GetNode(node).SetStart();
    }
    SetEndNode(node)
    {
        if (!this.NodeInGrid(node))
            return;
        this.GetNode(node).SetEnd();
    }

    NodeInGrid(node)
    {
        if (node.x < 0 || node.x >= this.width || node.y < 0 || node.y >= this.height)
            return false;
        return true;
    }

    GetNode(node)
    {
        if (!this.NodeInGrid(node))
            return null;
        return this.nodes[node.y*this.width+node.x];
    }
   
    BlockPointToNodePoint(block)
    {
        let pt = {x:block.x * 2 + 1,y:block.y * 2 + 1};
        return pt;
    }

    BorderClear(block, dir)
    {
        let ptNode = this.BlockPointToNodePoint(block);
        ptNode = NextBlock(ptNode, dir);

        if (ptNode.x < 0 || ptNode.x >= this.width || ptNode.y < 0 || ptNode.y >= this.height)
            return false;

        return !(this.nodes[ptNode.y*this.width+ptNode.x].Visited());
    }

    FindRegion(all)
    {
        let pt = all.FirstUnmarked();

        if (pt.x >= all.width || pt.y >= all.height)
            return null;

        let rgn = new Region(all.width, all.height);
        let list = [];
        list.push(pt);
        all.Mark(pt);

        while(list.length > 0)
        {
            pt = list[0]
            list.splice(0, 1);
            let nodePoint = this.BlockPointToNodePoint(pt);
            let node = this.nodes[nodePoint.y*this.width +nodePoint.x];
            if(node.rule != null)
            {
                rgn.AddRule(node.rule);
            }

            rgn.Mark(pt);

            for (let dir = 0; dir <= Dir.W; dir++)
            {
                let nextBlock = NextBlock(pt, dir);
                if (all.BlockInRegion(nextBlock)
                    && this.BorderClear(pt, dir)
                    && all.V(nextBlock) == 0)
                {
                    all.Mark(nextBlock);
                    list.push(nextBlock);
                }
            }
        }
        return rgn;
    }

    GetRegions()
    {
        let list = [];

        if (this.height < 2 || this.width < 2)
            return list;

        let all = new Region(~~(this.width / 2), ~~(this.height / 2));

        while(true)
        {
            let rgn = this.FindRegion(all);
            if (rgn == null)
                break;
            list.push(rgn);
        }

        return list;
    }

    Start(pt)
    {
        let node = this.GetNode(pt);
        this.current = ptCopy(pt);
        node.SetVisited(true);
    }

    MoveTo(pt)
    {
        let nodePoint = this.current;
        do 
        {
            nodePoint = NxPt(nodePoint, pt);
            this.GetNode(nodePoint).SetVisited(true);
        } while (!ptEq(nodePoint, pt));
        this.current = ptCopy(pt);
        return true;
    }

    CheckRules()
    {
        // tetris rules
        let list = this.GetRegions();
        for(let i = 0; i < list.length; i++)
        {
            let rgn = list[i];
            if (!rgn.RulesOK())
            {
                return false;
            }
        }

        // hexagon rules
        for(let i = 0; i < this.nodes.length; i++)
        {
            if(this.nodes[i].required && !this.nodes[i].visited)
            {
                return false;
            }
        }
        return true;
    }
}