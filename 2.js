function Vector(x,y){
    this.x=x;
    this.y=y;
}
Vector.prototype.plus=function(other){
    return new Vector(this.x+other.x,this.y+other.y);
}//使用vector类型来存储坐标
var grid=["top left",  "top middle",  "top right",  "bottom left",  "bottom middle",  "bottom right"];
//表示网格,使用一个数组来存储网格中的数据，数组的长度是宽和高的乘积，并将世界中位于(x,y)处元素的索引定义为x+(y*width)
function Grid(width,height){
    this.space=new Array(width*height);
    this.width=width;
    this.height=height;
}//网格对象
Grid.prototype.isInside=function(vector){
    return vector.x>=0&&vector.x<this.width&&vector.y>=0&&vector.y<this.height;
}//可修改
Grid.prototype.get=function(vector){
    return this.space[vector.x+this.width*vector.y];
}//可修改
Grid.prototype.set=function(vector,value){
    this.space[vector.x+this.width*vector.y]=value;
}//可修改

var directions={
    "n": new Vector(0,-1),//北
    "ne": new Vector(1,-1),//东北
    "e": new Vector(1,0),//东
    "se": new Vector(1,1),//东南
    "s": new Vector(0,1),//南
    "sw": new Vector(-1,1),//西南
    "w": new Vector(-1,0),//西
    "nw": new Vector(-1,-1)//西北
};

function randomElement(array){
    return array[Math.floor(Math.random()*array.length)];
}//randomElement这个辅助函数利用Math.random和四则运算来随机产生元素索引，并从数组中随机选择一个元素。使用该函数来产生随机的元素索引。
var directionNames="n ne e se s sw w nw".split(" ");
function BouncingCritter(){
    this.direction=randomElement(directionNames);
}//BouncingCritter构造函数接受一个方向名数组作为参数，并调用randomElement来随机选择一个方向
BouncingCritter.prototype.act=function(view){
    if(view.look(this.direction)!=" ")
    this.direction=view.find(" ")||"s";
    return {type:"move",direction:this.direction};
}
/*World对象会负责调用critter的动作。其工作原理是：每个critter对象都有一个act方法，调用该方法会返回一个动作。
动作是一个对象，该对象包含type属性，表示动作的类型名称。动作中也可以包含额外信息，比如动物想要移动的方向
当动物发现周围没有多余空间可以移动时（例如当陷入一个角落中，且周围全是动物时）,view.find会返回null.为了防止
act返回null,我们使用了||"s"这样的代码，在出现这种情况时会返回"s"*/
function elementFromChar(legend,ch){
    if(ch==" ")
    return null;
    var element=new legend[ch]();
    element.originChar=ch;
    return element;
}
/*World对象的构造函数会接受两个参数：一个平面图(表示世界网格的字符串数组)和一个图例。图例对象表示地图中字符的含义。
图例中每个字符都会对应一个构造函数（除了空格字符外，空格总是指向null，表示休闲空间） 
在elementFromChar方法中，我们首先字符所对应的构造函数，并使用new来创建对象类型的实例。接着我们在对象上添加orignChar属性
以便于找出创建元素时使用的字符*/
function World(map,legend){
    var grid=new Grid(map[0].length,map.length);
    this.grid=grid;
    this.legend=legend;

    map.forEach(function(line,y){
        for(var x=0;x<line.length;x++)
        grid.set(new Vector(x,y),
        elementFromChar(legend,line[x]));
    })
}

function charFromElenment(element){
    if(element==null)
    return " ";
    else
    return element.originChar;
}

World.prototype.toString=function(){
//实现World类型的toString方法时需要访问orignChar属性。toString方法采用二层循环遍历网格中的所有方块
//根据世界对象的当前状态构造出一个类似于地图的字符串。
    var output=" ";
    for(var y=0;y<this.grid.height;y++){
        for(var x=0;x<this.grid.width;x++){
            var element=this.grid.get(new Vector(x,y));
            output+=charFromElenment(element);
        }
        output+="\n";
    }
    return output;
}
function Wall(){}
//墙壁是一个简单的对象,其中没有act方法，该对象只会在世界中占据空间。
var test={
    prop:10,
    addPropTo:function(array){
        return array.map(function(elt){
            return this.prop+elt;
        },this);     
    }
};

Grid.prototype.forEach=function(f,context){
    for(var y=0;y<this.height;y++){
        for(var x=0;x<this.width;x++){
            var value=this.space[x+y*this.width];
            if(value!=null)
            f.call(context,value,new Vector(x,y));
        }
    }
};

World.prototype.turn=function(){
    var acted=[];
    this.grid.forEach(function(critter,vector){
        if(critter.act&&acted.indexOf(critter)==-1){
            acted.push(critter);
            this.letAct(critter,vector);
        }
    },this);
}

World.prototype.letAct=function(critter,vector){
    var action=critter.act(new View(this,vector));
    if(action&&action.type=="move"){
        var dest=this.checkDestination(action,vector);
        if(dest&&this.grid.get(dest)==null){
            this.grid.set(vector,null);
            this.grid.set(dest,critter);
        }
    }
};

World.prototype.checkDestination=function(action,vector){
    if(directions.hasOwnProperty(action.direction)){
        var dest=vector.plus(directions[action.direction]);
        if(this.grid.isInside(dest))
        return dest;
    }
}

function View(world,vector){
    this.world=world;
    this.vector=vector;
}
View.prototype.look=function(dir){
    var target=this.vector.plus(directions[dir]);
    if(this.world.grid.isInside(target))
      return charFromElenment(this.world.grid.get(target));
      else
      return "#"; 
};

View.prototype.findAll=function(ch){
    var found=[];
    for(var dir in directions)
    if(this.look(dir)==ch)
    found.push(dir);
    return found;
}
View.prototype.find=function(ch){
    var found=this.findAll(ch);
    if(found.length==0)return null;
    return randomElement(found);                                    
};
function dirPlus(dir, n){
var index=directionNames.indexOf(dir);
return directionNames[(index+n+8)];
}
function WallFollower(){
  this.dir="s";
}
WallFollower.prototype.act=function(view){
    var start=thid.dir;
    if(view.look(dirPlus(this.dir,-3))!="")
    start=this.dir=dirPlus(this.dir,-2);
    while(view.look(this.dir)!=""){
        this.dir=dirPlus(this.dir,1);
        if(this.dir==start)
        break;
    }
    return {type:"move",direction:this.dir};
};
function LifelikeWorld(map,legend){
    World.call(this,map,legend);
}
LifelikeWorld.prototype=Object.create(World.prototype);

var actionTypes=Object.create(null);
LifelikeWorld.prototype.letAct=function(critter,vector){
    var action=critter.act(new View(this,vector));
    var handled=action&&action.type in actionTypes&&actionTypes[action.type].call(this,critter,vector,action);
    if(!handled){
        critter.energy-=0.2;
        if(critter.energy<=0)
        this.grid.set(vector,null);
    }
};
actionTypes.grow=function(critter){
    critter.energy+=0.5;
    return true;
};
actionTypes.move=function(critter,vector,action){
    var dest=this.checkDestination(action,vector);
    if(dest==null||critter.energy<=1||this.grid.get(dest)!=null)
    return false;
    critter.energy-=1;
    this.grid.set(vector,null);
    this.grid.set(dest,critter);
    return true;
};
actionTypes.eat=function(critter,vector,action){
    var dest=this.checkDestination(action,vector);
    var atDest=dest!=null&&this.grid.get(dest);
    if(!atDest||atDest.energy==null)
    return false;
    critter.energy+=atDest.energy;
    this.grid.set(dest,null);
    return true;
};
actionTypes.reproduce=function(critter,vector,action){
    var baby=elementFromChar(this.legend,critter.originChar);
    var dest=this.checkDestination(action,vector);
    if(dest==null||critter.energy<=2*baby.energy||this.grid.get(dest)!=null)
    return false;
    critter.energy-=2*baby.energy;
    this.grid.set(dest,baby);
    return true;
};
function Plant(){
    this.energy=3+Math.random()*4;
}
Plant.prototype.act=function(context){
    if(this.energy>15){
        var space=context.find(" ");
        if(space)
        return{type:"reproduce",direction:space};
    }
    if(this.energy<20)
    return{type:"grow"};
}
function PlantEater(){
    this.energy=20;
}
PlantEater.prototype.act=function(context){
    var space=context.find("");
    if(this.energy>60&&space)
    return{type:"reproduce",direction:space};
    var plant=context.find("*");
    if(plant)
    return{type:"eat",direction:plant};
    if(space)
    return{type:"move",direction:space};
};