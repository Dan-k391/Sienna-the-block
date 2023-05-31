// Aim: Can run? Good!😎

// You know, I once said never use var in javascript, turns out this time
// I broke this rule

// 我tm根本看不懂我之前写的这些算式是什么意思。。。😂

import { 
    START_POS,
    FINISH_COORD,
    MAP_SIZE,
    THEMES,
    TRANS_BLOCK_POS,
    TELEPORT_POS,
    MAP_LIST 
} from './maps.js';

import { ascii } from './ascii.js';

// each of the squares are named chunk
const CHUNK_SIZE = 40;
// the player is block
const BLOCK_SIZE = 20;

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

class Player {
    constructor(x, y, startX, startY) {
        this.x = x;
        this.y = y;
        this.startX = startX;
        this.startY = startY;
        // which type of chunks the player can enter
        this.status = 0;
        this.color = '#FF0000';
    }
    
    checkWin() {
        if (this.x == levels.get(stage).finishCoord[0] && this.y == levels.get(stage).finishCoord[1]) {
            this.levelUp();
            console.log('win');
        }
    }

    levelUp() {
        stage++;
        this.setXY(levels.get(stage).startPos[0], levels.get(stage).startPos[1]);
        let startX = Math.floor(canvas.width / 2 - (levels.get(stage).mapSize[0] + 1) * 20);
        let startY = Math.floor(canvas.height / 2 - (levels.get(stage).mapSize[1] + 1) * 20);
        this.setStartXY(startX, startY);

        this.status = 0;
        render();
    }

    egg() {
        console.log('egg');
    }

    switch() {
        if (this.status == 0) {
            this.status = 1;
        }
        else {
            this.status = 0;
        }
    }

    teleport() {
        let teleportPos = levels.get(stage).getTeleportPos();
        this.setXY(teleportPos[0], teleportPos[1]);
    }

    // the movement judgement is basically a pieace of s**t code
    // but I just don't want to optimize it🤣

    moveUp() {
        if (levels.get(stage).getBlock(this.x, this.y - 1) == this.status || levels.get(stage).getBlock(this.x, this.y - 1) == 2) {
            this.y--;
        }
        else if (levels.get(stage).getBlock(this.x, this.y - 1) == 3) {
            this.y--;
            this.switch();
        }
        else if (levels.get(stage).getBlock(this.x, this.y - 1) == 5) {
            this.y--;
            this.teleport();
        }
        else if (levels.get(stage).getBlock(this.x, this.y - 1) == 8) {
            this.egg();
        }
        this.checkWin();
        render();
    }

    moveDown() {
        if (levels.get(stage).getBlock(this.x, this.y + 1) == this.status || levels.get(stage).getBlock(this.x, this.y + 1) == 2) {
            this.y++;
        }
        else if (levels.get(stage).getBlock(this.x, this.y + 1) == 3) {
            this.y++;
            this.switch();
        }
        else if (levels.get(stage).getBlock(this.x, this.y + 1) == 5) {
            this.y++;
            this.teleport();
        }
        else if (levels.get(stage).getBlock(this.x, this.y + 1) == 8) {
            this.egg();
        }
        this.checkWin();
        render();
    }

    moveLeft() {
        if (levels.get(stage).getBlock(this.x - 1, this.y) == this.status || levels.get(stage).getBlock(this.x - 1, this.y) == 2) {
            this.x--;
        }
        else if (levels.get(stage).getBlock(this.x - 1, this.y) == 3) {
            this.x--;
            this.switch();
        }
        else if (levels.get(stage).getBlock(this.x - 1, this.y) == 5) {
            this.x--;
            this.teleport();
        }
        else if (levels.get(stage).getBlock(this.x - 1, this.y) == 8) {
            this.egg();
        }
        this.checkWin();
        render();
    }

    moveRight() {
        if (levels.get(stage).getBlock(this.x + 1, this.y) == this.status || levels.get(stage).getBlock(this.x + 1, this.y) == 2) {
            this.x++;
        }
        else if (levels.get(stage).getBlock(this.x + 1, this.y) == 3) {
            this.x++;
            this.switch();
        }
        else if (levels.get(stage).getBlock(this.x + 1, this.y) == 5) {
            this.x++;
            this.teleport();
        }
        else if (levels.get(stage).getBlock(this.x + 1, this.y) == 8) {
            this.egg();
        }
        this.checkWin();
        render();
    }

    // dash

    dashUp() {
        // 两个可以被破坏的方块
        if (levels.get(stage).getBlock(this.x, this.y - 1) == 6 || levels.get(stage).getBlock(this.x, this.y - 1) == 7) {
            levels.get(stage).breakBlock(this.x, this.y - 1);
        }
        // 重点的情况,直接执行原本操作
        else if (levels.get(stage).getBlock(this.x, this.y - 1) == 2) {
            this.moveUp();
        }
        else if (levels.get(stage).getBlock(this.x, this.y - 1) == 3) {
            // switch will happen in the move function
            this.moveUp();
        }
        else if (levels.get(stage).getBlock(this.x, this.y - 1) == 4) {
            levels.get(stage).transBlock();
        }
        else if (levels.get(stage).getBlock(this.x, this.y - 1) == 5) {
            this.moveUp();
        }
        else if (levels.get(stage).getBlock(this.x, this.y - 1) == 8) {
            this.egg();
        }
        else if (levels.get(stage).getBlock(this.x, this.y - 1) == this.status) {
            // 前方两格黑色方块就动一
            if (levels.get(stage).getBlock(this.x, this.y - 2) == this.status) {
                this.y -= 2;
            }
            else {
                this.moveUp();
            }
        }
        // under some conditions it seems like it would render twice but I don't care😎
        render();
    }

    dashDown() {
        if (levels.get(stage).getBlock(this.x, this.y + 1) == 6 || levels.get(stage).getBlock(this.x, this.y + 1) == 7) {
            levels.get(stage).breakBlock(this.x, this.y + 1);
        }
        else if (levels.get(stage).getBlock(this.x, this.y + 1) == 2) {
            this.moveDown();
        }
        else if (levels.get(stage).getBlock(this.x, this.y + 1) == 3) {
            this.moveDown();
        }
        else if (levels.get(stage).getBlock(this.x, this.y + 1) == 4) {
            levels.get(stage).transBlock();
        }
        else if (levels.get(stage).getBlock(this.x, this.y + 1) == 5) {
            this.moveDown();
        }
        else if (levels.get(stage).getBlock(this.x, this.y + 1) == 8) {
            this.egg();
        }
        else if (levels.get(stage).getBlock(this.x, this.y + 1) == this.status) {
            if (levels.get(stage).getBlock(this.x, this.y + 2) == this.status) {
                this.y += 2;
            }
            else {
                this.moveDown();
            }
        }
        render();
    }

    dashLeft() {
        if (levels.get(stage).getBlock(this.x - 1, this.y) == 6 || levels.get(stage).getBlock(this.x - 1, this.y) == 7) {
            levels.get(stage).breakBlock(this.x - 1, this.y);
        }
        else if (levels.get(stage).getBlock(this.x - 1, this.y) == 2) {
            this.moveLeft();
        }
        else if (levels.get(stage).getBlock(this.x - 1, this.y) == 3) {
            this.moveLeft();
        }
        else if (levels.get(stage).getBlock(this.x - 1, this.y) == 4) {
            levels.get(stage).transBlock();
        }
        else if (levels.get(stage).getBlock(this.x - 1, this.y) == 5) {
            this.moveLeft();
        }
        else if (levels.get(stage).getBlock(this.x - 1, this.y) == 8) {
            this.egg();
        }
        else if (levels.get(stage).getBlock(this.x - 1, this.y) == this.status) {
            if (levels.get(stage).getBlock(this.x - 2, this.y) == this.status) {
                this.x -= 2;
            }
            else {
                this.moveLeft();
            }
        }
        render();
    }

    dashRight() {
        if (levels.get(stage).getBlock(this.x + 1, this.y) == 6 || levels.get(stage).getBlock(this.x + 1, this.y) == 7) {
            levels.get(stage).breakBlock(this.x + 1, this.y);
        }
        else if (levels.get(stage).getBlock(this.x + 1, this.y) == 2) {
            this.moveRight();
        }
        else if (levels.get(stage).getBlock(this.x + 1, this.y) == 3) {
            this.moveRight();
        }
        else if (levels.get(stage).getBlock(this.x + 1, this.y) == 4) {
            levels.get(stage).transBlock();
        }
        else if (levels.get(stage).getBlock(this.x + 1, this.y) == 5) {
            this.moveRight();
        }
        else if (levels.get(stage).getBlock(this.x + 1, this.y) == 8) {
            this.egg();
        }
        else if (levels.get(stage).getBlock(this.x + 1, this.y) == this.status) {
            if (levels.get(stage).getBlock(this.x + 2, this.y) == this.status) {
                this.x += 2;
            }
            else {
                this.moveRight();
            }
        }
        render();
    }

    setXY(x, y) {
        this.x = x;
        this.y = y;
    }

    setStartXY(x, y) {
        this.startX = x;
        this.startY = y;
    }

    draw() {
        levels.get(stage).drawMap(this.startX, this.startY);
        ctx.fillStyle = this.color;
        let startX = 10 + this.startX + this.x * CHUNK_SIZE;
        let startY = 10 + this.startY + this.y * CHUNK_SIZE;
        ctx.fillRect(startX, startY, BLOCK_SIZE, BLOCK_SIZE);
    }
}

class Level {
    constructor(map, theme, mapSize, startPos, finishCoord, transBlockPos, teleportPos) {
        this.map = map;
        // 0: light theme, 1: dark theme
        this.theme = theme;
        this.mapSize = mapSize;
        this.startPos = startPos;
        this.finishCoord = finishCoord;
        this.transBlockPos = transBlockPos;
        this.teleportPos = teleportPos;
        // start from 0
        this.teleportCount = 0;
    }

    drawMap(startX, startY) {
        this.drawBackground(startX, startY);
        switch (this.theme) {
            case 0:
                for (let y = 0; y < this.map.length; y++) {
                    for (let x = 0; x < this.map[y].length; x++) {
                        let destX = startX + CHUNK_SIZE * x;
                        let destY = startY + CHUNK_SIZE * y;
                        switch (this.map[y][x]) {
                            case 1:
                                drawChunk(destX, destY, '#000000');
                                break;
                            case 2:
                                drawChunk(destX, destY, '#0000FF');
                                break;
                            case 3:
                                drawChunk(destX, destY, '#00FF00');
                                break;
                            case 4:
                                drawChunk(destX, destY, '#FFFF00');
                                break;
                            case 5:
                                drawChunk(destX, destY, '#FF00FF');
                                break;
                            case 6:
                                drawChunk(destX, destY, '#696969');
                                break;
                            case 7:
                                drawChunk(destX, destY, '#0C0C0C');
                                break;
                        }
                    }
                }
            case 1:
                for (let y = 0; y < this.map.length; y++) {
                    for (let x = 0; x < this.map[y].length; x++) {
                        // x, y坐标差一格
                        // 只渲染周围一格
                        if (player.x - 1 <= x && x <= player.x + 1 && player.y - 1 <= y && y <= player.y + 1) {
                            let destX = startX + 40 * x;
                            let destY = startY + 40 * y;
                            switch (this.map[y][x]) {
                                case 1:
                                    drawChunk(destX, destY, '#000000');
                                    break;
                                case 2:
                                    drawChunk(destX, destY, '#0000FF');
                                    break;
                                case 3:
                                    drawChunk(destX, destY, '#00FF00');
                                    break;
                                case 4:
                                    drawChunk(destX, destY, '#FFFF00');
                                    break;
                                case 5:
                                    drawChunk(destX, destY, '#FF00FF');
                                    break;
                                case 6:
                                    drawChunk(destX, destY, '#696969');
                                    break;
                                case 7:
                                    drawChunk(destX, destY, '#0C0C0C');
                                    break;
                            }
                        }
                    }
                }
        }
    }

    drawBackground() {
        switch (this.theme) {
            case 0:
                ctx.fillStyle = '#FFFFFF';
                break;
            case 1:
                ctx.fillStyle = '#282828';
                break;
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    breakBlock(x, y) {
        this.map[y][x] = 0;
        console.log(x, y, this.map[y][x]);
    }

    transBlock() {
        if (this.map[this.transBlockPos[1]][this.transBlockPos[0]] == 0) {
            this.map[this.transBlockPos[1]][this.transBlockPos[0]] = 1;
        }
        else {
            this.map[this.transBlockPos[1]][this.transBlockPos[0]] = 0;
        }
    }

    getTeleportPos() {
        if (this.teleportCount < this.teleportPos.length) {
            let pos = this.teleportPos[this.teleportCount];
            this.teleportCount++;
            return pos;
        }
    }

    getBlock(x, y) {
        return this.map[y][x];
    }
}

class Levels {
    constructor() {
        this.levels = [];
    }

    add(level) {
        this.levels.push(level);
    }

    get(stage) {
        return this.levels[stage];
    }
}

class Font {
    constructor(letters, startX, startY) {
        this.letters = letters;
        this.startX = startX;
        this.startY = startY;
    }
    
    draw(scale = 1) {
        let index;
        let bitmap;
        for (let i = 0; i < this.letters.length; i++) {
            index = this.letters.charCodeAt(i) - 32;
            bitmap = ascii[index];

            for (let y = 0; y < bitmap.length; y++) {
                for (let x = 0; x < bitmap[y].length; x++) {
                    if (bitmap[y][x] == 1){
                        // half transparent, currently not needed
                        // ctx.globalAlpha = 0.7;
                        ctx.fillStyle = '#000000';
                        // every letter width is 4
                        ctx.fillRect(this.startX + scale * 5 * (x + i * 4), this.startY + scale * 5 * y, scale * 5, scale * 5);
                        // ctx.globalAlpha = 1;
                    }
                }
            }
        }
    }
}

let levels = new Levels();
// add each map level into levels
for (let i = 0; i < MAP_LIST.length; i++) {
    levels.add(new Level(MAP_LIST[i], THEMES[i], MAP_SIZE[i], START_POS[i], FINISH_COORD[i], TRANS_BLOCK_POS[i], TELEPORT_POS[i]));
}

// keep as false
let Ingame = false;

let stage = 0;

let player = new Player(0, 1, 0, 0);
// values for the special effects
let alpha = 1;
let delta = 0.01;

// draws the specific chunk at the given coordinates
// x和y为原始坐标，不用换算
function drawChunk(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, CHUNK_SIZE, CHUNK_SIZE);
}

function save(){
    document.cookie = 'stage=' + stage.toString();
    console.log(document.cookie);
}

function load(){
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) 
    {
        let c = ca[i].trim();
        if (c.indexOf('stage=') == 0){
            stage = parseInt(c.substring('stage='.length, c.length));
        }
    }
    console.log(document.cookie);
}

// entrance of the whole program
window.onload = function() {
    init();
}

function init() {
    window.addEventListener('resize', resizecanvas, false);
    window.addEventListener('keydown', keydown, false);
    // window.addEventListener('keyup', keyup, false);
    load();
    resizecanvas();
}

function resizecanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.setXY(levels.get(stage).startPos[0], levels.get(stage).startPos[1]);
    // tmd完全看不懂
    // 看懂一点了
    let startX = Math.floor(canvas.width / 2 - (levels.get(stage).mapSize[0] + 1) * 20);
    let startY = Math.floor(canvas.height / 2 - (levels.get(stage).mapSize[1] + 1) * 20);
    player.setStartXY(startX, startY);
    render();
}

function keydown(event) {
    switch(event.keyCode) {
        // KeyC to start the game
        case 67:
            if (!Ingame) {
                startGame();
            }
        // STRICTLY OBEY UP DOWN LEFT RIGHT
        case 38: case 87:
            if (event.shiftKey) {
                player.dashUp();
            }
            else {
                player.moveUp();
            }
            break;
        case 40: case 83:
            if (event.shiftKey) {
                player.dashDown();
            }
            else {
                player.moveDown();
            }
            break;
        case 37: case 65:
            if (event.shiftKey) {
                player.dashLeft();
            }
            else {
                player.moveLeft();
            }
            break;
        case 39: case 68:
            if (event.shiftKey) {
                player.dashRight();
            }
            else {
                player.moveRight();
            }
            break;
    }
}

function startGame() {
    Ingame = true;
    // javascript 666666
    
    requestAnimationFrame(plotOne);
}

function renderStart() {
    clearCanvas();
    // center the subtitles
    let startX = Math.floor(canvas.width / 2 - 350);
    let startY = Math.floor(canvas.height / 2 - 200);

    let title = new Font('The Block', startX, startY);
    let subTitle1 = new Font('Dan-k391', startX + 50, startY + 100);
    let subTitle2 = new Font('Press F11 to fullscreen', startX + 50, startY + 150);
    let subTitle3 = new Font('Fullscreen for best experience', startX + 50, startY + 200);
    let subTitle4 = new Font('Press C to start', startX + 50, startY + 250);

    title.draw(2);
    subTitle1.draw(1);
    subTitle2.draw(1);
    subTitle3.draw(1);
    subTitle4.draw(1);
}

function plotOne() {
    renderSubtitles(
        [
            'Once upon a time',
            'there was a block',
            'her name is Sienna',
            'and she was trapped in a giant maze',
            'find the way out',
            '(Press c to skip)'
        ], 10000
    );
}

function renderSubtitles(subtitles, time) {
    clearCanvas();

    // figure out the longest subtitle
    let maxLen = 0;
    for (let i = 0; i < subtitles.length; i++) {
        if (subtitles[i].length > maxLen) {
            maxLen = subtitles[i].length;
        }
    }

    // don't care about how it works, it just works fine
    let offSetX = 25 * (maxLen / 2 - 1);
    let offSetY = 50 * (subtitles.length / 2 + 1);

    let startX = Math.floor(canvas.width / 2 - offSetX);
    let startY = Math.floor(canvas.height / 2 - offSetY);

    for (let i = 0; i < subtitles.length; i++) {
        let subTitle = new Font(subtitles[i], startX, startY + 50 * i);
        subTitle.draw(1);
    }

    setTimeout(function() {
        render();
        requestAnimationFrame(render);
    }, time);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function render() {
    // if game has not started render the start page
    if (Ingame) {
        console.log('render');
        player.draw();
    }
    else {
        renderStart();
    }
}

// TODO: finish this function
function fadeOutThenIn(contentOut, contentIn) {
    console.log('fade out');
    alpha -= delta;
    clearCanvas();

    ctx.globalAlpha = alpha;
    contentOut();
    // -1留白一会
    if (alpha > -1 && !fadeOutComplete) {
        requestAnimationFrame(fadeOutThenIn.bind(this, contentOut, contentIn));
    }
    else {
        alpha = 1;
        ctx.globalAlpha = alpha;
    }

    if (fadeOutComplete) {
        console.log('fade in');
        alpha += delta;
        clearCanvas();

        ctx.globalAlpha = alpha;
        content();

        if (alpha < 1) {
            requestAnimationFrame(fadeIn.bind(this, content));
        }
        else {
            alpha = 1;
            ctx.globalAlpha = alpha;
            render();
        }
    }
}

// has problems
function fadeOut(content) {
    console.log('fade out');
    alpha -= delta;
    clearCanvas();

    ctx.globalAlpha = alpha;
    content();
    // -1留白一会
    if (alpha > -1) {
        requestAnimationFrame(fadeOut.bind(this, content));
    }
    else {
        alpha = 1;
        ctx.globalAlpha = alpha;
    }
}

// has problems too
function fadeIn(content) {
    console.log('fade in');
    alpha += delta;
    clearCanvas();

    ctx.globalAlpha = alpha;
    content();

    if (alpha < 1) {
        requestAnimationFrame(fadeIn.bind(this, content));
    }
    else {
        alpha = 1;
        ctx.globalAlpha = alpha;
        render();
    }
}


