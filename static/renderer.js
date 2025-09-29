var BITBOARD = 0n;
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
var MOUSE = {x: -1, y: -1};
var BLACK_SIDE = false;

var PIECES = {};
const PIECE_NUMBER = {wp: 1, wn: 2, wb: 3, wr: 4, wq: 5, wk: 6, bp: 7, bn: 8, bb: 9, br: 10, bq: 11, bk: 12};
function get_pieces(){
    "wp wn wb wr wq wk bp bn bb br bq bk".split(" ").forEach(piece => {
        let img = new Image();
        img.src = `https://www.chess.com/chess-themes/pieces/neo/${SQUARE_DIM}/${piece}.png`;
        PIECES[PIECE_NUMBER[piece]] = img;
    });
} get_pieces();

const canvas = document.getElementById("board");
canvas.width = canvas.height = CANVAS_DIM;
const ctx = canvas.getContext("2d");

document.addEventListener("keydown", (event) => {
  if (event.key === "r" || event.key === "R") {
    rotate_board();
  }
});

function draw_board() {
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            let bb = BITBOARD & (1n << BigInt(x + y * 8));

            ctx.fillStyle = (x + y) % 2 ? LIGHT_COLOR : DARK_COLOR;

            if (bb) {
                ctx.fillStyle = (x + y) % 2 ? PINK_HIGHLIGHT_LIGHT_COLOR : PINK_HIGHLIGHT_DARK_COLOR;
            }

            ctx.fillRect(x * SQUARE_DIM, (7 - y) * SQUARE_DIM, SQUARE_DIM, SQUARE_DIM);
        }
    }
}

function rotate_board(){
    canvas.style.transform = `translate(-50%, -50%) rotate(${BLACK_SIDE? 0: 180}deg)`
    BLACK_SIDE = !BLACK_SIDE;
}

function get_rotation(){
    let style = window.getComputedStyle(canvas);
    let matrix = new DOMMatrix(style.transform);

    return Math.atan2(matrix.b, matrix.a);
}

function drawRotatedImage(image, x, y, angle) {
  let w = image.width;
  let h = image.height;

  ctx.save(); // save the current state

  // Move origin to the image center
  ctx.translate(x + w / 2, y + h / 2);

  // Rotate (angle in radians)
  ctx.rotate(angle);

  // Draw image, but shift back so it’s centered
  ctx.drawImage(image, -w / 2, -h / 2);

  ctx.restore(); // restore state
}


function render(){
    draw_board();
    let rot = get_rotation();

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            let b = BOARD[x + y * 8];
            if (b == 0){continue;}
            drawRotatedImage(PIECES[b], x * SQUARE_DIM, (7 - y) * SQUARE_DIM, -rot);
        }
    }
    requestAnimationFrame(render);
}
render();