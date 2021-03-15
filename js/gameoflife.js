function seed() {
  return [...arguments];
}

function same([x, y], [j, k]) {
  return x===j && y===k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  for(const arr of this){
    if(arr[0]===cell[0] && arr[1]===cell[1]) return true;
  }
  return false;
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
  for(let i = bottomLeft[1]; i<=topRight[1]; i++){
    for(let j = bottomLeft[0]; j<= topRight[0]; j++){
      cells+=printCell([j,i], state);
    }
    cells+='\n';
  }
  return cells;
};

const getNeighborsOf = ([x, y]) => {
  let neighbors = [];
  for (let i = x-1; i<=x+1; i++){
    for (let j = y-1; j<= y+1; j++){
      if(same([x,y], [i,j])) continue;
      neighbors.push([i,j]);
    }
  }

  return neighbors;
};

const getLivingNeighbors = (cell, state) => {
  let neighbors = getNeighborsOf(cell);
  let living = [];
  for(const neighbor of neighbors){
    const has = contains.bind(state);
    if(has(neighbor)) living.push(neighbor);
  }

  return living;
};

const willBeAlive = (cell, state) => {
  const livingNeighbors = getLivingNeighbors(cell, state).length;
  const alive = contains.call(state, cell);
  if((alive && livingNeighbors===2) || (livingNeighbors===3)) return true;
  return false;
};

const calculateNext = (state) => {
  let newState = [];
  let {topRight, bottomLeft} = corners(state);
  for(let i = bottomLeft[1]-1; i<=topRight[1]+1; i++){
    for(let j = bottomLeft[0]-1; j<= topRight[0]+1; j++){
      if(willBeAlive[j,i], state) newState.push([j,i]);
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
  let states = iterate(startPatterns[pattern], iterations);
  let result = '';

  while(states.length){
    result+=printCells(states.shift())
    result+='\n';
  }
  console.log(result); 

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