var BOARD = [
    0x4, 0x2, 0x3, 0x5, 0x6, 0x3, 0x2, 0x4,
    0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1,
    0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
    0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
    0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
    0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
    0x7, 0x7, 0x7, 0x7, 0x7, 0x7, 0x7, 0x7,
    0xA, 0x8, 0x9, 0xB, 0xC, 0x9, 0x8, 0xA
];
var MOUSE = { x: -1, y: -1, gx: -1, gy: -1};
var BLACK_SIDE = false;

var PIECES = {};
const PIECE_NUMBER = { wp: 1, wn: 2, wb: 3, wr: 4, wq: 5, wk: 6, bp: 7, bn: 8, bb: 9, br: 10, bq: 11, bk: 12 };

function get_pieces() {
    "wp wn wb wr wq wk bp bn bb br bq bk".split(" ").forEach(piece => {
        let img = new Image();
        img.src = `https://www.chess.com/chess-themes/pieces/neo/${SQUARE_DIM}/${piece}.png`;
        PIECES[PIECE_NUMBER[piece]] = img;
    });
} get_pieces();

const canvas = document.getElementById("board");
canvas.width = canvas.height = CANVAS_DIM;
const ctx = canvas.getContext("2d");

canvas.onmousemove = (event) => {
    let rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left) * (canvas.width / rect.width);
    let y = (event.clientY - rect.top) * (canvas.height / rect.height);

    let angle = get_rotation();
    let cx = canvas.width / 2;
    let cy = canvas.height / 2;

    let dx = x - cx;
    let dy = y - cy;

    MOUSE.x =  dx * Math.cos(-angle) - dy * Math.sin(-angle) + cx;
    MOUSE.y =  dx * Math.sin(-angle) + dy * Math.cos(-angle) + cy;

    let gd = xyToGrid(MOUSE.x, MOUSE.y);
    MOUSE.gx = gd[0];
    MOUSE.gy = gd[1];
}

document.addEventListener("keydown", (event) => {
    if (event.key === "r" || event.key === "R") {
        rotate_board();
    }
});

// Utility functions
function get_randi(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function gridToXY(x, y) { return [x * SQUARE_DIM, (7 - y) * SQUARE_DIM]; }
function xyToGrid(x, y) { return [Math.floor(x / SQUARE_DIM), 7 - Math.floor(y / SQUARE_DIM)]; }

function get_rotation() {
    let style = window.getComputedStyle(canvas);
    let matrix = new DOMMatrix(style.transform);

    return Math.atan2(matrix.b, matrix.a);
}


// Rendering functions
function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
}


function draw_board() {
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            ctx.fillStyle = (x + y) % 2 ? LIGHT_COLOR : DARK_COLOR;
            ctx.fillRect(x * SQUARE_DIM, (7 - y) * SQUARE_DIM, SQUARE_DIM, SQUARE_DIM);
        }
    }
}

function drawRotatedImage(image, x, y, angle) {
    let w = image.width;
    let h = image.height;

    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(angle);
    ctx.drawImage(image, -w / 2, -h / 2);
    ctx.restore();
}

function draw_arrow_head(x, y, angle) {
    // 0 - Top down
    // 90 - Right to left
    // 180 - Bottom up
    // 270 - Left to Right
    // Allways draws clockwise
    if (angle == 0 || angle == 180) { // Vertical arrow
        ctx.lineTo((x + .5 + (angle == 180? -1: 1) * ARROW_WIDTH * 2) * SQUARE_DIM, (7 - y + (angle == 180? 1: 0)) * SQUARE_DIM);
        ctx.lineTo((x + .5) * SQUARE_DIM, (7.5 - y) * SQUARE_DIM);
        ctx.lineTo((x + .5 - (angle == 180? -1: 1) * ARROW_WIDTH * 2) * SQUARE_DIM, (7 - y + (angle == 180? 1: 0)) * SQUARE_DIM);
    }
    else if (angle == 90 || angle == 270) { // Horisontal arrow
        ctx.lineTo((x + (angle == 90? 1: 0)) * SQUARE_DIM, (7.5 - y + (angle == 90? -1: 1) * ARROW_WIDTH * 2) * SQUARE_DIM);
        ctx.lineTo((x + .5) * SQUARE_DIM, (7.5 - y) * SQUARE_DIM);
        ctx.lineTo((x + (angle == 90? 1: 0)) * SQUARE_DIM, (7.5 - y - (angle == 90? -1: 1) * ARROW_WIDTH * 2) * SQUARE_DIM)
    } else if (angle == 45 || angle == 225){
        ctx.lineTo((x + (angle == 225? 1: 0) - (angle == 225? -1: 1) * ARROW_WIDTH) * SQUARE_DIM, (7 - y + (angle == 45? 1: 0) + (angle == 45? -1: 1) * 2 * ARROW_WIDTH) * SQUARE_DIM);
        ctx.lineTo((x + .5) * SQUARE_DIM, (7.5 - y) * SQUARE_DIM);
        ctx.lineTo((x + (angle == 225? 1: 0) + (angle == 225? -1: 1) * 2 * ARROW_WIDTH) * SQUARE_DIM, (7 - y + (angle == 45? 1: 0) - (angle == 45? -1: 1) * ARROW_WIDTH) * SQUARE_DIM);
    } else if (angle == 135 || angle == 315){
        ctx.lineTo((x + (angle == 135? 1: 0) - (angle == 135? -1: 1) * ARROW_WIDTH) * SQUARE_DIM, (7 - y + (angle == 135? 1: 0) + (angle == 135? -1: 1) * 2 * ARROW_WIDTH) * SQUARE_DIM);
        ctx.lineTo((x + .5) * SQUARE_DIM, (7.5 - y) * SQUARE_DIM);
        ctx.lineTo((x + (angle == 135? 1: 0) + (angle == 135? -1: 1) * 2 * ARROW_WIDTH) * SQUARE_DIM, (7 - y + (angle == 135? 1: 0) - (angle == 135? -1: 1) * ARROW_WIDTH) * SQUARE_DIM);
    }
}

function draw_arrow(sx, sy, ex, ey, diag=true, color = ORANGE_ARROW_COLOR){
    let dx = ex - sx;
    let dy = ey - sy;
    if (dx == 0 && dy == 0){return;}
    let horis_first = (Math.abs(dx) > Math.abs(dy));
    let distance = Math.abs(dx) + Math.abs(dy) + (Math.PI / 2 - 1) * (dx != 0 && dy != 0) - 0.5;
    let slope = ARROW_WIDTH / distance;

    ctx.beginPath();
    ctx.moveTo((sx + .5) * SQUARE_DIM, (7.5 - sy) * SQUARE_DIM);
    
    if (Math.abs(dx) == Math.abs(dy) && diag){
        if (dx * dy > 0) {
            ctx.lineTo((ex + (dx < 0? 1: 0)) * SQUARE_DIM, (7 - ey + (dy > 0? 1: 0) - Math.sign(dy) * ARROW_WIDTH) * SQUARE_DIM);
            draw_arrow_head(ex, ey, (dx > 0? 45: 225));
            ctx.lineTo((ex + (dx < 0? 1: 0) + Math.sign(dx) * ARROW_WIDTH) * SQUARE_DIM, (7 - ey + (dy > 0? 1: 0)) * SQUARE_DIM);
        } else {
            ctx.lineTo((ex + (dx < 0? 1: 0) + Math.sign(dx) * ARROW_WIDTH) * SQUARE_DIM, (7 - ey + (dy > 0? 1: 0)) * SQUARE_DIM);
            draw_arrow_head(ex, ey, (dx > 0? 315: 135));
            ctx.lineTo((ex + (dx < 0? 1: 0)) * SQUARE_DIM, (7 - ey + (dy > 0? 1: 0) - Math.sign(dy) * ARROW_WIDTH) * SQUARE_DIM);
        }
    } else if (horis_first) {
        ctx.lineTo((ex + (dx > 0? 0: 1)) * SQUARE_DIM, (7.5 - sy - (dx - 0.5 * Math.sign(dx)) * slope) * SQUARE_DIM);
        
        if (dy) {
            ctx.ellipse(
                (ex + (dx > 0? 0: 1)) * SQUARE_DIM,
                (7 - sy + (dy > 0? 0: 1)) * SQUARE_DIM, 
                (0.5 - Math.sign(dx * dy) * (Math.abs(dx) - 0.5 + Math.PI / 2) * slope) * SQUARE_DIM,
                (0.5 - Math.sign(dx * dy) * (Math.abs(dx) - 0.5) * slope) * SQUARE_DIM,
                0,
                Math.PI / 2 * Math.sign(dy),
                Math.PI * (dx < 0),
                -dx * dy < 0
            );
            ctx.lineTo((ex + 0.5 - Math.sign(dy) * ARROW_WIDTH) * SQUARE_DIM, (7 - ey + (dy > 0? 1: 0)) * SQUARE_DIM);
            draw_arrow_head(ex, ey, (dy > 0? 180: 0));
            ctx.lineTo((ex + 0.5 + Math.sign(dy) * ARROW_WIDTH) * SQUARE_DIM, (7 - ey + (dy > 0? 1: 0)) * SQUARE_DIM);
            ctx.ellipse(
                (ex + (dx > 0? 0: 1)) * SQUARE_DIM,
                (7 - sy + (dy > 0? 0: 1)) * SQUARE_DIM, 
                (0.5 + Math.sign(dx * dy) * (Math.abs(dx) - 0.5 + Math.PI / 2) * slope) * SQUARE_DIM,
                (0.5 + Math.sign(dx * dy) * (Math.abs(dx) - 0.5) * slope) * SQUARE_DIM,
                0,
                Math.PI * (dx < 0),
                Math.PI / 2 * Math.sign(dy),
                dx * dy < 0
            );
        } else{
            draw_arrow_head(ex, ey, (dx > 0? 270: 90));
        }

        ctx.lineTo((ex + (dx > 0? 0: 1)) * SQUARE_DIM, (7.5 - sy + (dx - 0.5 * Math.sign(dx)) * slope) * SQUARE_DIM);
    } else {
        ctx.lineTo((sx + .5 - (dy - 0.5 * Math.sign(dy)) * slope) * SQUARE_DIM, (7 - ey + (dy > 0? 1: 0)) * SQUARE_DIM);
        
        if (dx) {
            ctx.ellipse(
                (sx + (dx > 0? 1: 0)) * SQUARE_DIM,
                (7 - ey + (dy > 0? 1: 0)) * SQUARE_DIM,
                (0.5 - Math.sign(dx * dy) * (Math.abs(dy) - 0.5) * slope) * SQUARE_DIM,
                (0.5 - Math.sign(dx * dy) * (Math.abs(dy) - 0.5 + Math.PI / 2) * slope) * SQUARE_DIM,
                0,
                Math.PI * (dx > 0),
                -Math.PI / 2 * Math.sign(dy),
                dx * dy < 0
            );
            ctx.lineTo((ex + (dx > 0? 0: 1)) * SQUARE_DIM, (7.5 - ey + Math.sign(dx) * ARROW_WIDTH) * SQUARE_DIM);
            draw_arrow_head(ex, ey, (dx > 0? 270: 90));
            ctx.lineTo((ex + (dx > 0? 0: 1)) * SQUARE_DIM, (7.5 - ey - Math.sign(dx) * ARROW_WIDTH) * SQUARE_DIM);
            ctx.ellipse(
                (sx + (dx > 0? 1: 0)) * SQUARE_DIM,
                (7 - ey + (dy > 0? 1: 0)) * SQUARE_DIM,
                (0.5 + Math.sign(dy * dx) * (Math.abs(dy) - 0.5) * slope) * SQUARE_DIM,
                (0.5 + Math.sign(dy * dx) * (Math.abs(dy) - 0.5 + Math.PI / 2) * slope) * SQUARE_DIM,
                0,
                -Math.PI / 2 * Math.sign(dy),
                Math.PI * (dx > 0),
                -dx * dy < 0
            );
        } else{
            draw_arrow_head(ex, ey, (dy > 0? 180: 0));
        }

        ctx.lineTo((sx + .5 + (dy - 0.5 * Math.sign(dy)) * slope) * SQUARE_DIM, (7 - ey + (dy > 0? 1: 0)) * SQUARE_DIM);
    }
    ctx.lineTo((sx + .5) * SQUARE_DIM, (7.5 - sy) * SQUARE_DIM);
    // ctx.strokeStyle = "rgba(237, 142, 0, 0.75)";
    // ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
}

// Animation functions
function rotate_board() {
    canvas.style.transform = `translate(-50%, -50%) rotate(${BLACK_SIDE ? 0 : 180}deg)`
    BLACK_SIDE = !BLACK_SIDE;
}

// Main render loop

function render() {
    draw_board();
    let rot = get_rotation();


    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            let b = BOARD[x + y * 8];
            if (b == 0) { continue; }
            drawRotatedImage(PIECES[b], x * SQUARE_DIM, (7 - y) * SQUARE_DIM, -rot);
        }
    }
    requestAnimationFrame(render);
}
render();