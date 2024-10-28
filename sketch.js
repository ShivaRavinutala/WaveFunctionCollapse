let tiles = [];
let all = []

let grid = [];

const DIM = 10;
let ready = false;
let brakes = false;

// LOAD TILE IMAGES HERE!!
function preload() {
  // naming convention: [blank, down, left, right, up].png
  let directionDirectories = [  
  ]

  // naming convention: [i].png 
  let indexedDirectories = [  
    {path: "tiles/kennytiles", num: 20},
  ]

  for(let dir of indexedDirectories){
    let images = [];
    for (let i = 0; i < dir.num; i++) { images[i] = loadImage(`${dir.path}/${i}.png`); }
    all.push({ key: dir.path, array: images });
  }

  for(let dir of directionDirectories){
    let images = [];
    for (let i = 0; i < 5; i++) { 
      images[0] = loadImage(`${dir}/blank.png`);
      images[1] = loadImage(`${dir}/down.png`);
      images[2] = loadImage(`${dir}/left.png`);
      images[3] = loadImage(`${dir}/right.png`);
      images[4] = loadImage(`${dir}/up.png`);
    }
    all.push({ key: dir, array: images });
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
  let canvas = {width: 800, height: 800}
  createCanvas(canvas.width, canvas.height);

  const directory = "tiles/"
  
  //randomSeed(15);
  // USER INPUT
  let div = createDiv("directory:");
  div.position(50, canvas.height + 25);

  input = createInput('');
  input.position(50, canvas.height + 50);
  let button = createButton('go');
  button.position(input.x + input.width, input.y);
  button.mousePressed(() => {
    if(!ready && input.value().length > 0){
      let path = directory + input.value();
      ready = makeTilesArray(path);
    }
    else if(ready && input.value().length > 0){
      stopWFC();

      let path = directory + input.value();
      ready = makeTilesArray(path);
    }
  });
}

// DEFINE ADJACENCIES FOR TILESET HERE!!
function makeTilesArray(path){
  let tileImages;
  let check = all.filter(item => item.key == path);
  if(check.length > 0){ tileImages = check[0].array; }
  else{ 
    console.log(`please enter the name of a directory in "tiles/" that contains tile images
      > "${path}" does not contain tile images.`); 
    return false;
  }

  switch(path){
    case "tiles/kennytiles":
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
      break;
    default: 
      console.log(`problem with path '${path}'`)
      break;
    }
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
  //console.log(tiles.length);
  
  // Generate the adjacency rules based on edges
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    tile.analyze(tiles);
  }
  
  startOver();
  return true;
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
  if(ready){ WFC(); }
  if(brakes) { stopWFC() }
}

function stopWFC(){
  tiles = [];
  grid = [];
  ready = false;
  brakes = false;
}

function WFC() {
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

  if (gridCopy.length == 0) {
    //brakes = true;
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
    //brakes = true;
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