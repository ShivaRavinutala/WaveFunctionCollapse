let tiles = [];
const tileImages = [];

let grid = [];

const DIM = 25;

function preload() {
  const path = 'tiles/kennytiles';
  for (let i = 0; i < 20; i++) {
    tileImages[i] = loadImage(`${path}/${i}.png`);
  }
}

function removeDuplicatedTiles(tiles) {
  const uniqueTilesMap = {};
  for (const tile of tiles) {
    const key = tile.edges.join(','); // ex: "ABB,BCB,BBA,AAA"
    uniqueTilesMap[key] = tile;
  }
  return Object.values(uniqueTilesMap);
}

function setup() {
  createCanvas(400, 400);
  //randomSeed(15);

  // tiles[0] = new Tile(tileImages[0], ['AAA', 'AAA', 'AAA', 'AAA']);
  // tiles[1] = new Tile(tileImages[1], ['ABA', 'ABA', 'ABA', 'AAA']);
  // tiles[2] = new Tile(tileImages[2], ['BAA', 'AAB', 'AAA', 'AAA']);
  // tiles[3] = new Tile(tileImages[3], ['BAA', 'AAA', 'AAB', 'AAA']);
  // tiles[4] = new Tile(tileImages[4], ['ABA', 'ABA', 'AAA', 'AAA']);
  // tiles[5] = new Tile(tileImages[5], ['ABA', 'AAA', 'ABA', 'AAA']);
  // tiles[6] = new Tile(tileImages[6], ['ABA', 'ABA', 'ABA', 'ABA']);

  // Loaded and created the tiles
  tiles[0] = new Tile(tileImages[0], ['AAA', 'AAA', 'AAA', 'AAA']);
  tiles[1] = new Tile(tileImages[1], ['AAA', 'ABA', 'ABA', 'AAA']);
  tiles[2] = new Tile(tileImages[2], ['AAA', 'AAA', 'ABA', 'ABA']);
  tiles[3] = new Tile(tileImages[3], ['AAA', 'ABA', 'ABA', 'AAA']);
  tiles[4] = new Tile(tileImages[4], ['AAA', 'AAA', 'ABA', 'ABA']);
  tiles[5] = new Tile(tileImages[5], ['AAA', 'ABA', 'ABA', 'ABA']);
  tiles[6] = new Tile(tileImages[6], ['ABA', 'AAA', 'ABA', 'AAA']);
  tiles[7] = new Tile(tileImages[7], ['AAA', 'ABA', 'AAA', 'ABA']);
  tiles[8] = new Tile(tileImages[8], ['ABA', 'ABA', 'ABA', 'ABA']);
  tiles[9] = new Tile(tileImages[9], ['AAA', 'AAA', 'ABA', 'AAA']);
  tiles[10] = new Tile(tileImages[10], ['AAA', 'AAA', 'AAA', 'ABA']);
  tiles[11] = new Tile(tileImages[11], ['ABA', 'ABA', 'AAA', 'AAA']);
  tiles[12] = new Tile(tileImages[12], ['ABA', 'AAA', 'AAA', 'ABA']);
  tiles[13] = new Tile(tileImages[13], ['ABA', 'ABA', 'AAA', 'AAA']);
  tiles[14] = new Tile(tileImages[14], ['ABA', 'AAA', 'AAA', 'ABA']);
  tiles[15] = new Tile(tileImages[15], ['ABA', 'ABA', 'AAA', 'ABA']);
  tiles[16] = new Tile(tileImages[16], ['ABA', 'ABA', 'ABA', 'AAA']);
  tiles[17] = new Tile(tileImages[17], ['ABA', 'AAA', 'ABA', 'ABA']);
  tiles[18] = new Tile(tileImages[18], ['ABA', 'AAA', 'AAA', 'AAA']);
  tiles[19] = new Tile(tileImages[19], ['AAA', 'ABA', 'AAA', 'AAA']);

  for (let i = 0; i < tiles.length - 1; i++) {
    tiles[i].index = i;
  }

  const initialTileCount = tiles.length;
  for (let i = 0; i < initialTileCount; i++) {
    let tempTiles = [];
    for (let j = 0; j < 4; j++) {
      tempTiles.push(tiles[i].rotate(j));
    }
    tempTiles = removeDuplicatedTiles(tempTiles);
    tiles = tiles.concat(tempTiles);
  }
  console.log(tiles.length);

  // Generate the adjacency rules based on edges
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    tile.analyze(tiles);
  }

  startOver();
}

function startOver() {
  // Create cell for each spot on the grid
  for (let i = 0; i < DIM * DIM; i++) {
    grid[i] = new Cell(tiles.length);
  }
}

function checkValid(arr, valid) {
  //console.log(arr, valid);
  for (let i = arr.length - 1; i >= 0; i--) {
    // VALID: [BLANK, RIGHT]
    // ARR: [BLANK, UP, RIGHT, DOWN, LEFT]
    // result in removing UP, DOWN, LEFT
    let element = arr[i];
    // console.log(element, valid.includes(element));
    if (!valid.includes(element)) {
      arr.splice(i, 1);
    }
  }
  // console.log(arr);
  // console.log("----------");
}

function mousePressed() {
  redraw();
}

function draw() {
  background(0);

  const w = width / DIM;
  const h = height / DIM;
  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      let cell = grid[i + j * DIM];
      if (cell.collapsed) {
        let index = cell.options[0];
        image(tiles[index].img, i * w, j * h, w, h);
      } else {
        noFill();
        stroke(51);
        rect(i * w, j * h, w, h);
      }
    }
  }

  // Pick cell with least entropy
  let gridCopy = grid.slice();
  gridCopy = gridCopy.filter((a) => !a.collapsed);
  // console.table(grid);
  // console.table(gridCopy);

  if (gridCopy.length == 0) {
    return;
  }
  gridCopy.sort((a, b) => {
    return a.options.length - b.options.length;
  });

  let len = gridCopy[0].options.length;
  let stopIndex = 0;
  for (let i = 1; i < gridCopy.length; i++) {
    if (gridCopy[i].options.length > len) {
      stopIndex = i;
      break;
    }
  }

  if (stopIndex > 0) gridCopy.splice(stopIndex);
  const cell = random(gridCopy);
  cell.collapsed = true;
  const pick = random(cell.options);
  if (pick === undefined) {
    startOver();
    return;
  }
  cell.options = [pick];

  const nextGrid = [];
  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      let index = i + j * DIM;
      if (grid[index].collapsed) {
        nextGrid[index] = grid[index];
      } else {
        let options = new Array(tiles.length).fill(0).map((x, i) => i);
        // Look up
        if (j > 0) {
          let up = grid[i + (j - 1) * DIM];
          let validOptions = [];
          for (let option of up.options) {
            let valid = tiles[option].down;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look right
        if (i < DIM - 1) {
          let right = grid[i + 1 + j * DIM];
          let validOptions = [];
          for (let option of right.options) {
            let valid = tiles[option].left;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look down
        if (j < DIM - 1) {
          let down = grid[i + (j + 1) * DIM];
          let validOptions = [];
          for (let option of down.options) {
            let valid = tiles[option].up;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look left
        if (i > 0) {
          let left = grid[i - 1 + j * DIM];
          let validOptions = [];
          for (let option of left.options) {
            let valid = tiles[option].right;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }

        // I could immediately collapse if only one option left?
        nextGrid[index] = new Cell(options);
      }
    }
  }

  grid = nextGrid;
}
