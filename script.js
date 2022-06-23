// level starts from 0
var LEVEL = 0;
// 0 for dark, 1 for bright
var THEME = [0, 1, 0];

var maps = [new Map(MAP1, THEME[0]), new Map(MAP2, THEME[1]), new Map(MAP2, THEME[2])];

var canvas = document.getElementById('myCanvas'); 
var ctx = canvas.getContext('2d');

var block = new Player(0, 1, 0, 0);
// var map1 = new Map(MAP1);

window.onload = function(){    
    init();
}

function save(){
    document.cookie = "level=" + LEVEL.toString();
    console.log(document.cookie);
}

function read(){
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) 
    {
        var c = ca[i].trim();
        if (c.indexOf("level=") == 0){
            LEVEL = parseInt(c.substring("level=".length, c.length));
        }
    }
    console.log(document.cookie);
}

function init(){
    window.addEventListener('resize', resizecanvas, false);
    window.addEventListener('keydown', keydown, false);
    // window.addEventListener('keyup', keyup, false);
    read();
    resizecanvas();
}

// function flush(){
//     ctx.fillStyle('#FFFFFF');
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
// }

// STRICTLY OBEY UP DOWN LEFT RIGHT
function keydown(event){
    switch(event.keyCode)
    {
        // 两个方向键都判
        case 38: case 87:
            if (event.shiftKey){
                // 两个可以被破坏的方块
                if (maps[LEVEL].map[block.y - 1][block.x] == 3 || maps[LEVEL].map[block.y - 1][block.x] == 4){
                    block.dash_up();
                // 重点的情况,直接执行原本操作
                }else if (maps[LEVEL].map[block.y - 1][block.x] == 2){
                    block.up();
                }else if (maps[LEVEL].map[block.y - 1][block.x] == 0){
                    // 前方两格黑色方块就动一
                    if (maps[LEVEL].map[block.y - 2][block.x] == 0){
                        block.dash_up();
                    }else if (maps[LEVEL].map[block.y - 2][block.x] != 0){
                        block.up();
                    }
                }
            }else {
                if (maps[LEVEL].map[block.y - 1][block.x] == 0 || maps[LEVEL].map[block.y - 1][block.x] == 2){
                    block.up();
                }
            }
            break;
        case 40: case 83:
            if (event.shiftKey){
                if (maps[LEVEL].map[block.y + 1][block.x] == 3 || maps[LEVEL].map[block.y + 1][block.x] == 4){
                    block.dash_down();
                }else if (maps[LEVEL].map[block.y + 1][block.x] == 2){
                    block.down();
                }else if (maps[LEVEL].map[block.y + 1][block.x] == 0){
                    if (maps[LEVEL].map[block.y + 2][block.x] == 0){
                        block.dash_down();
                    }else if (maps[LEVEL].map[block.y + 2][block.x] != 0){
                        block.down();
                    }
                }
            }else {
                if (maps[LEVEL].map[block.y + 1][block.x] == 0 || maps[LEVEL].map[block.y + 1][block.x] == 2){
                    block.down();
                }
            }
            break;
        case 37: case 65:
            if (event.shiftKey){
                if (maps[LEVEL].map[block.y][block.x - 1] == 3 || maps[LEVEL].map[block.y][block.x - 1] == 4){
                    block.dash_left();
                }else if (maps[LEVEL].map[block.y][block.x - 1] == 2){
                    block.left();
                }else if (maps[LEVEL].map[block.y][block.x - 1] == 0){
                    if (maps[LEVEL].map[block.y][block.x - 2] == 0){
                        block.dash_left();
                    }else if (maps[LEVEL].map[block.y][block.x - 2] != 0){
                        block.left();
                    }
                }
            }else {
                if (maps[LEVEL].map[block.y][block.x - 1] == 0 || maps[LEVEL].map[block.y][block.x - 1] == 2){
                    block.left();
                }
            }
            break;
        case 39: case 68:
            if (event.shiftKey){
                if (maps[LEVEL].map[block.y][block.x + 1] == 3 || maps[LEVEL].map[block.y][block.x + 1] == 4){
                    block.dash_right();
                }else if (maps[LEVEL].map[block.y][block.x + 1] == 2){
                    block.right();
                }else if (maps[LEVEL].map[block.y][block.x + 1] == 0){
                    if (maps[LEVEL].map[block.y][block.x + 2] == 0){
                        block.dash_right();
                    }else if (maps[LEVEL].map[block.y][block.x + 2] != 0){
                        block.right();
                    }
                }
            }else {
                if (maps[LEVEL].map[block.y][block.x + 1] == 0 || maps[LEVEL].map[block.y][block.x + 1] == 2){
                    block.right();
                }
            }
            break;
    }
}

/*
function keyup(){
    switch(event.keyCode)
    {
        case 38: key.forward = false; break;
        case 40: key.backward = false; break;
        case 37: key.left = false; break;
        case 39: key.right = false; break;
    }
}
*/

function resizecanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    block.set_xy(START_POS[LEVEL][0], START_POS[LEVEL][1]);
    block.set_start(Math.floor(canvas.width / 2 - (MAP_SIZE[LEVEL][0] + 1) * 20), Math.floor(canvas.height / 2 - 10 - (MAP_SIZE[LEVEL][1] + 1) * 20));
    // console.log((MAP_SIZE[LEVEL][0]) * 20, (MAP_SIZE[LEVEL][1]) * 20);
}

function render(){
    // ctx.fillStyle = '#FFFFFF';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    block.draw();
}

function Player(x, y, start_x, start_y){
    this.x = x;
    this.y = y;
    this.start_x = start_x;
    this.start_y = start_y;

    this.up = function(){
        this.y -= 1;
        this.check_win();
        render();
    }
    this.down = function(){
        this.y += 1;
        this.check_win();
        render();
    }
    this.left = function(){
        this.x -= 1;
        this.check_win();
        render();
    }
    this.right = function(){
        this.x += 1;
        this.check_win();
        render();
    }
    // ================dash======================
    this.dash_up = function(){
        if (maps[LEVEL].map[this.y - 1][this.x] == 3 || maps[LEVEL].map[this.y - 1][this.x] == 4){
            maps[LEVEL].break(this.x, this.y - 1);
        }else {
            this.y -= 2;
        }
        render();
    }
    this.dash_down = function(){
        if (maps[LEVEL].map[this.y + 1][this.x] == 3 || maps[LEVEL].map[this.y + 1][this.x] == 4){
            maps[LEVEL].break(this.x, this.y + 1);
        }else {
            this.y += 2;
        }
        render();
    }
    this.dash_left = function(){
        if (maps[LEVEL].map[this.y][this.x - 1] == 3 || maps[LEVEL].map[this.y][this.x - 1] == 4){
            maps[LEVEL].break(this.x - 1, this.y);
        }else {
            this.x -= 2;
        }
        render();
    }
    this.dash_right = function(){
        if (maps[LEVEL].map[this.y][this.x + 1] == 3 || maps[LEVEL].map[this.y][this.x + 1] == 4){
            maps[LEVEL].break(this.x + 1, this.y);
        }else {
            this.x += 2;
        }
        render();
    }

    this.set_xy = function(x, y){
        this.x = x;
        this.y = y;
        render();
    }

    this.set_start = function(start_x, start_y){
        this.start_x = start_x;
        this.start_y = start_y;
        render();
    }

    this.draw = function(){
        maps[LEVEL].draw(this.start_x, this.start_y);
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.start_x + 10 + 40 * this.x, this.start_y + 10 + 40 * this.y, 20, 20);
    }

    this.check_win = function(){
        if (this.x == FINISH_COORD[LEVEL][0] && this.y == FINISH_COORD[LEVEL][1]){
            this.next_level();
            console.log("win");
        }
    }

    this.next_level = function(){
        LEVEL += 1;
        this.set_xy(START_POS[LEVEL][0], START_POS[LEVEL][1]);
        this.set_start(Math.floor(canvas.width / 2 - (MAP_SIZE[LEVEL][0] + 1) * 20), Math.floor(canvas.height / 2 - 10 - (MAP_SIZE[LEVEL][1] + 1) * 20));
        save();
        render();
    }

}

function Map(map, theme){
    this.map = map;
    this.theme = theme;

    this.draw = function(start_x, start_y){
        this.draw_background();
        if (this.theme == 0){
            for (let y = 0; y < this.map.length; y++){
                for (let x = 0; x < this.map[y].length; x++){
                    if (this.map[y][x] == 1){
                        ctx.fillStyle = '#000000';
                        ctx.fillRect(start_x + 40 * x, start_y + 40 * y, 40, 40);
                    }else if (this.map[y][x] == 2){
                        ctx.fillStyle = '#0000FF';
                        ctx.fillRect(start_x + 40 * x, start_y + 40 * y, 40, 40);
                    }else if (this.map[y][x] == 3){
                        ctx.fillStyle = '#696969';
                        ctx.fillRect(start_x + 40 * x, start_y + 40 * y, 40, 40);
                    }else if (this.map[y][x] == 4){
                        ctx.fillStyle = '#0C0C0C';
                        ctx.fillRect(start_x + 40 * x, start_y + 40 * y, 40, 40);
                    }
                }
            }
        }else if (this.theme == 1){
            for (let y = 0; y < this.map.length; y++){
                for (let x = 0; x < this.map[y].length; x++){
                    // x, y坐标差一格
                    if (block.x - 1 <= x && x <= block.x + 1 && block.y - 1 <= y && y <= block.y + 1){
                        if (this.map[y][x] == 1){
                            ctx.fillStyle = '#000000';
                            ctx.fillRect(start_x + 40 * x, start_y + 40 * y, 40, 40);
                        }else if (this.map[y][x] == 2){
                            ctx.fillStyle = '#0000FF';
                            ctx.fillRect(start_x + 40 * x, start_y + 40 * y, 40, 40);
                        }else if (this.map[y][x] == 3){
                            ctx.fillStyle = '#696969';
                            ctx.fillRect(start_x + 40 * x, start_y + 40 * y, 40, 40);
                        }else if (this.map[y][x] == 4){
                            ctx.fillStyle = '#0C0C0C';
                            ctx.fillRect(start_x + 40 * x, start_y + 40 * y, 40, 40);
                        }
                    }
                    continue;                            
                }
            }
        }
    }

    this.draw_background = function(){
        if (this.theme == 0)
            ctx.fillStyle = '#FFFFFF';
        else if (this.theme == 1)
            ctx.fillStyle = '#282828';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    this.break = function(x, y){
        this.map[y][x] = 0;
        console.log(x, y, this.map[y][x]);
    }
}
