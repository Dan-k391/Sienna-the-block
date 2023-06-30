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
    MAP_LIST,
    FINAL
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
        // whether the game ends
        if (stage == FINAL) {
            let date = new Date();
            gameEnd = true;
            // update the words
            endWords[6][1] = `It\'s ${date.toLocaleTimeString() + ', ' + date.toLocaleDateString()}`;
            window.removeEventListener('keydown', keyDown, false);
            window.addEventListener('keydown', endKey, false);
            renderEnd();
            console.log('you win');
            return;
        }
        else {
            save();
        }
        this.setXY(levels.get(stage).startPos[0], levels.get(stage).startPos[1]);
        let startX = Math.floor(canvas.width / 2 - (levels.get(stage).mapSize[0] + 1) * 20);
        let startY = Math.floor(canvas.height / 2 - (levels.get(stage).mapSize[1] + 1) * 20);
        this.setStartXY(startX, startY);

        this.status = 0;
        render();
    }

    egg() {
        console.log('egg');
        // the egg for each level
        if (stage == 0) {
            eggOne();
        }
        else if (stage == 1) {
            eggTwo();
        }
        else if (stage == 2) {
            eggThree();
        }
        else if (stage == 4) {
            eggFive();
        }
        else if (stage == 5) {
            eggSix();
        }
        else {
            otherEgg(stage + 1);
        }
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
            // do not render the map when the egg is eaten
            return;
        }
        else if (levels.get(stage).getBlock(this.x, this.y - 1) == 10) {
            this.y--;
            levels.get(stage).illume(this.x, this.y);
            // do not render
            return;
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
            return;
        }
        else if (levels.get(stage).getBlock(this.x, this.y + 1) == 10) {
            this.y++;
            levels.get(stage).illume(this.x, this.y);
            return;
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
            return;
        }
        else if (levels.get(stage).getBlock(this.x - 1, this.y) == 10) {
            this.x--;
            levels.get(stage).illume(this.x, this.y);
            return;
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
            return;
        }
        else if (levels.get(stage).getBlock(this.x + 1, this.y) == 10) {
            this.x++;
            levels.get(stage).illume(this.x, this.y);
            return;
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
            return;
        }
        else if (levels.get(stage).getBlock(this.x, this.y - 1) == 10) {
            this.moveUp();
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
            return;
        }
        else if (levels.get(stage).getBlock(this.x, this.y + 1) == 10) {
            this.moveDown();
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
            return;
        }
        else if (levels.get(stage).getBlock(this.x - 1, this.y) == 10) {
            this.moveLeft();
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
            return;
        }
        else if (levels.get(stage).getBlock(this.x + 1, this.y) == 10) {
            this.moveRight();
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

    reset() {
        this.status = 0;
        this.setXY(levels.get(stage).startPos[0], levels.get(stage).startPos[1]);
        levels.get(stage).teleportCount = 0;
        render();
    }

    switchColor() {
        if (this.color == "#FF0000") {
            this.setColor("#A0522D");
        }
        else {
            this.setColor("#FF0000");
        }
        render();
    }

    setColor(color) {
        this.color = color;
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
                                drawChunk(destX, destY, '#32CD32');
                                break;
                            case 4:
                                drawChunk(destX, destY, '#FFD700');
                                break;
                            case 5:
                                drawChunk(destX, destY, '#EE82EE');
                                break;
                            case 6:
                                drawChunk(destX, destY, '#696969');
                                break;
                            case 7:
                                drawChunk(destX, destY, '#181818');
                                break;
                            case 8:
                                drawChunk(destX, destY, '#CDCDC1');
                                break;
                            case 10:
                                drawSmallChunk(destX, destY, '#FFA500');
                                break;
                        }
                    }
                }
                break;
            case 1:
                for (let y = 0; y < this.map.length; y++) {
                    for (let x = 0; x < this.map[y].length; x++) {
                        // x, y坐标差一格
                        // 只渲染周围一格
                        if (player.x - 1 <= x && x <= player.x + 1 && player.y - 1 <= y && y <= player.y + 1
                            || x == this.transBlockPos[0] && y == this.transBlockPos[1]) {
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
                                    drawChunk(destX, destY, '#32CD32');
                                    break;
                                case 4:
                                    drawChunk(destX, destY, '#FFD700');
                                    break;
                                case 5:
                                    drawChunk(destX, destY, '#EE82EE');
                                    break;
                                case 6:
                                    drawChunk(destX, destY, '#696969');
                                    break;
                                case 7:
                                    drawChunk(destX, destY, '#181818');
                                    break;
                                case 8:
                                    drawChunk(destX, destY, '#CDCDC1');
                                    break;
                                case 10:
                                    drawSmallChunk(destX, destY, '#FFA500');
                                    break;
                            }
                        }
                    }
                }
                break;
            case 2:
                for (let y = 0; y < this.map.length; y++) {
                    for (let x = 0; x < this.map[y].length; x++) {
                        // x, y坐标差一格
                        // 只渲染周围一格
                        if (player.x - 2 <= x && x <= player.x + 2 && player.y - 2 <= y && y <= player.y + 2
                            || x == this.transBlockPos[0] && y == this.transBlockPos[1]) {
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
                                    drawChunk(destX, destY, '#32CD32');
                                    break;
                                case 4:
                                    drawChunk(destX, destY, '#FFD700');
                                    break;
                                case 5:
                                    drawChunk(destX, destY, '#EE82EE');
                                    break;
                                case 6:
                                    drawChunk(destX, destY, '#696969');
                                    break;
                                case 7:
                                    drawChunk(destX, destY, '#181818');
                                    break;
                                case 8:
                                    drawChunk(destX, destY, '#CDCDC1');
                                    break;
                                case 10:
                                    drawSmallChunk(destX, destY, '#FFA500');
                                    break;
                            }
                        }
                    }
                }
                break;
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
            case 2:
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

    illume(x, y) {
        this.theme = 2;
        this.map[y][x] = 0;
        gotTorch();
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
let gameEnd = false;

// stage starts from 0
let stage = 0;

let player = new Player(0, 1, 0, 0);
// values for the special effects
let alpha = 1;
let delta = 0.01;

// The ending words
let endWords = [
    [
        'Press space to continue',
        'Congrats!',
        'Well, you have finished the game',
        'Honestly',
        'I don\'t know who you are',
        'And I don\'t know what to say',
    ],
    [
        'Maybe you\'re my friend',
        'Maybe you\'re a random player',
        'Maybe you\'re me',
        'Or',
        'Maybe you\'re Sienna',
        'I don\'t know',
        'But I\'m glad you\'re here'
    ],
    [
        'I\'m trying to write a minecraft style dialog',
        'Turns out it\'s not that easy',
        'Or maybe I\'m just not good enough',
        'Let me think about something to say',
        'Ha! I got it'
    ],
    [
        'This is a very old game',
        'The first ideas of this game were from 2020???',
        'I don\'t remember, probably 2020',
        'And I wrote it in 2021',
        'On the brithday'
    ],
    [
        'Well, that time I was pretty much a noob',
        'I nearly didn\'t know how to use classes',
        'And I just assembled the code in the style I thought was correct',
        'Amazingly, it actually executed without any problems!'
    ],
    [
        'However the code did not run properly',
        'Mainly because python just cannot be pakaged successfully',
        'So later I thought of moving to a web version',
        'So that everyone could play it',
        'And here comes this version,',
        'The version that you are playing'
    ],
    [
        'Let me check the time',
        // takes the space, will be replaced by the time
        '---',
        'It\'s a long time since then',
        '......',
        '......'
    ],
    [
        'As you can see',
        'I\'m just a coder',
        'who is not good at writing',
        'And not good at expressing my feelings',
        '......',
        '......'
    ],
    [
        'So,',
        'I guess I just want to say',
    ],
    [
        'Thanks for playing my game'
    ],
    [
        'By: Dan-k391',
        'Here, the code is bad',
        'The ideas come from',
        'ZJJ',
        'Carl',
        'And me',
    ]
];
let page = 0;
let word = 0;

// draws the specific chunk at the given coordinates
// x和y为原始坐标，不用换算
function drawChunk(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, CHUNK_SIZE, CHUNK_SIZE);
}

function drawSmallChunk(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x + CHUNK_SIZE / 4, y + CHUNK_SIZE / 4, CHUNK_SIZE / 2, CHUNK_SIZE / 2);
}

function resetSave(){
    document.cookie = 'stage=0';
    console.log(document.cookie);
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
    player.setXY(levels.get(stage).startPos[0], levels.get(stage).startPos[1]);
    console.log(document.cookie);
}

// entrance of the whole program
window.onload = function() {
    init();
}

function init() {
    window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('keydown', keyDown, false);
    // window.addEventListener('keyup', keyup, false);
    load();
    resizeCanvas();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // The following line sets the player to the start position
    // player.setXY(levels.get(stage).startPos[0], levels.get(stage).startPos[1]);
    // tmd完全看不懂
    // 看懂一点了
    let startX = Math.floor(canvas.width / 2 - (levels.get(stage).mapSize[0] + 1) * 20);
    let startY = Math.floor(canvas.height / 2 - (levels.get(stage).mapSize[1] + 1) * 20);
    player.setStartXY(startX, startY);
    render();
}

function keyDown(event) {
    switch(event.keyCode) {
        // KeyC to start the game
        case 67:
            if (!Ingame) {
                startGame();
            }
            break;
        // switch the color
        case 88:
            player.switchColor();
            break;
        // KeyRto reset the level
        case 82:
            if (event.shiftKey) {
                resetSave();
            }
            else {
                player.reset();
            }
            break;
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
        case 32:
            render();
            break;
    }
}

function endKey(event) {
    switch(event.keyCode) {
        case 82:
            if (event.shiftKey) {
                resetSave();
            }
            break;
        // Space to continue
        case 32:
            showNext();
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
    let subTitle1 = new Font('By: Dan-K391', startX + 50, startY + 100);
    let subTitle2 = new Font('Press F11 to fullscreen', startX + 50, startY + 150);
    let subTitle3 = new Font('Fullscreen for best experience', startX + 50, startY + 200);
    let subTitle4 = new Font('Press C to start', startX + 50, startY + 250);

    title.draw(2);
    subTitle1.draw(1);
    subTitle2.draw(1);
    subTitle3.draw(1);
    subTitle4.draw(1);
}

function gotTorch() {
    renderSubtitles(
        [
            'You found a torch!',
            'It broadens your vision',
            '(Press space to continue)'
        ]
    );
}

function plotOne() {
    renderSubtitles(
        [
            'Once upon a time',
            'there was a block',
            'her name is Sienna',
            'and she was trapped in a giant maze',
            'find the way out',
            'Use WASD or arrow keys to move',
            'Hold shift to dash',
            '(Press space to continue)'
        ]
    );
}

function eggOne() {
    renderSubtitles(
        [
            'Congrats, you found egg one',
            'In fact',
            'Sienna is not just a name',
            'But also a color',
            'Press X to switch the color of Sienna',
            '(Press space to continue)'
        ]
    );
}

function eggTwo() {
    renderSubtitles(
        [
            'Congrats, you found egg two',
            'In fact',
            'In the first version of this game',
            'This is where the egg is placed',
            '(Press space to continue)'
        ]
    );
}

function eggThree() {
    renderSubtitles(
        [
            'Congrats, you found egg three',
            'In fact',
            'This game is inspired by an old game "Adventure"',
            'Where eggs are first introduced to video games',
            '(Press space to continue)'
        ]
    );
}

function eggFive() {
    renderSubtitles(
        [
            'Congrats, you found egg five',
            'In fact',
            'This level has more than one egg',
            '(Press space to continue)'
        ]
    );
}

function eggSix() {
    renderSubtitles(
        [
            'Congrats, you found egg six',
            'This is a hard one',
            'I\'m glad that you can find it',
            'Honestly, I don\'t know what to put here',
            'You should just know, this is an egg',
            'An egg from 22:48, 2023/6/30',
            'Press R to reset the position of Sienna',
            '(Press space to continue)'
        ]
    );
}

function otherEgg(level) {
    renderSubtitles(
        [
            `You found an egg from level ${level}`,
            'Uncompleted yet',
            'I will add it later'
        ]
    );
}

function renderEnd() {
    if (page == endWords.length) {
        clearCanvas();

        let image = new Image();
        
        image.onload = function(){
            ctx.drawImage(image, 600, 500);
        }

        image.src = 'old.png';
        let end = new Font('Thanks for playing my game', 350, 350);
        end.draw(2);
        ctx.drawImage(image, 0, 0, 700, 700);
        console.log('此代码由王逸凡编写')
        console.log('代码总长度1644行, 由于时间紧迫, 没有做任何优化');
        console.log('愿玩的开心');
        console.log('创意来自Carl, Denial和声优');
        console.log('物理引擎来自王逸凡和声优');
    }
    else {
        renderSubtitles(
            endWords[page].slice(0, word + 1)
        );
    }

    // probably the shittest code I ever wrote but I don't care😎
}

function showNext() {
    if (word < endWords[page].length - 1) {
        word++;
    }
    else {
        NextPage();
    }
    render();
}

function NextPage() {
    page++;
    word = 0;
    render();
}

// call without timeout
function renderSubtitles(subtitles) {
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

    // setTimeout(render, time);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function render() {
    // if game has not started render the start page
    if (gameEnd) {
        renderEnd();
    } 
    else if (Ingame) {
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

// The traditional blank line at the end of the file
// By: Dan-K391
