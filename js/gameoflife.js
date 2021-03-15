function seed() {
  return [...arguments];
}

function same([x, y], [j, k]) {
  return x===j && y===k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some(e => same(e, cell));
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? '\u25A3' : '\u25A2';
};

const corners = (state = []) => {
  const topRight = [getNum(0,'max'), getNum(1,'max')];
  const bottomLeft = [getNum(0,'min'), getNum(1,'min')];

  return {topRight, bottomLeft};

  function getNum(num, pos){
    if(!state.length) return 0;
    let arr = state.map(x=>x[num]).sort((a,b)=>b-a);
    return pos==='max' ? arr[0] : arr[arr.length-1];
  }
};

const printCells = (state) => {
  let {topRight, bottomLeft} = corners(state);
  let cells = '';
  for(let i = topRight[1]; i>=bottomLeft[1]; i--){
    let row = [];
    for(let j = bottomLeft[0]; j<= topRight[0]; j++){
      row.push(printCell([j,i], state));
    }
    cells+=row.join(' ')+'\n';
  }
  return cells;
};

const getNeighborsOf = ([x, y]) => {
  let neighbors = [];
  for (let i = y+1; i>=y-1; i--){
    for (let j = x-1; j<= x+1; j++){
      if(same([x,y], [j,i])) continue;
      neighbors.push([j,i]);
    }
  }

  return neighbors;
};

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter(neighbor => contains.bind(state)(neighbor));
};

const willBeAlive = (cell, state) => {
  const livingNeighbors = getLivingNeighbors(cell, state).length;
  const alive = contains.call(state, cell);
  return ((alive && livingNeighbors===2) || (livingNeighbors===3));
};

const calculateNext = (state) => {
  let newState = [];
  let {topRight, bottomLeft} = corners(state);
  for(let i = topRight[1]+1; i>=bottomLeft[1]-1; i--){
    for(let j = bottomLeft[0]-1; j<= topRight[0]+1; j++){
      newState = newState.concat(willBeAlive([j, i], state) ? [[j, i]] : []);;
    }
  }  
  return newState;
};

const iterate = (state, iterations) => {
  let states = [];
  states.push(state);
  while(iterations){
    state = calculateNext(state);
    states.push(state);
    iterations--;
  }

  return states;
};

const main = (pattern, iterations) => {
  const game = iterate(startPatterns[pattern], iterations);
  game.forEach(s => console.log(printCells(s)));

};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;