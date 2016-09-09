var turn = 0;
var edges = [];
var redScore = 0;
var blueScore = 0;

function createTable(side){
  var tbody = document.getElementById("matrix");
  tbody.innerHTML = '';
  for (var row = 0; row < side; row++){
    var tr = document.createElement("tr");
    for (var col = 0; col < side; col++){
      tr.innerHTML += `<td id='x${row}x${col}'>
                        <div class='dot'></div>
                      </td>`
    }
    tbody.appendChild(tr);
  }
}

function isLegitEdge(prev, current){
  var thisID = current.id.split("x");
  var thisRow = Number(thisID[1]);
  var thisCol = Number(thisID[2]);
  var activeID = prev.id.split("x");
  var activeRow = Number(activeID[1]);
  var activeCol = Number(activeID[2]);
  if (thisRow==activeRow && thisCol==activeCol-1) return "right";
  if (thisRow==activeRow && thisCol==activeCol+1) return "left";
  if (thisCol==activeCol && thisRow==activeRow-1) return "down";
  if (thisCol==activeCol && thisRow==activeRow+1) return "up";
  return false;
}

function handleClick(e){
  var activeElements = document.querySelectorAll(".active");
  if (activeElements.length > 0){
    var edge = isLegitEdge(activeElements[0], this);
    if ( edge ){
        activeElements[0].classList.toggle("active");
        processEdge(this, edge);
    }
    else{
      activeElements[0].classList.toggle("active");
      if (this.id != activeElements[0].id){
        this.classList.toggle("active");
      }

    }
  }
  else{
    this.classList.toggle("active");
  }
}

function processEdge(element, dir){
  createEdge(element, dir);
  if (turn++ % 2 === 0){
    element.innerHTML += `<div class='${dir}-blue'></div>`;
  }
  else{
    element.innerHTML += `<div class='${dir}-red'></div>`;
  }
}

function createEdge(element, dir){
  //[{r: _, c:_}, {r:_, c:_}]
  var dest = element.id.split("x");
  dest = {r : Number(dest[1]), c : Number(dest[2])};
  var orig;
  if (dir === 'left') orig = {r: dest.r, c: dest.c -1 };
  if (dir === 'right') orig = {r: dest.r, c: dest.c +1 };
  if (dir === 'up') orig = { r: dest.r -1, c: dest.c };
  if (dir === 'down') orig = {r: dest.r +1, c: dest.c };
  edges.push([orig, dest]);
  edges.push([dest, orig]);
  //check for square completion
  if (dir == 'left' || dir =='right') checkUpandDown();
  if (dir == 'up' || dir =='down') checkLeftandRight();
}

function checkUpandDown(){
  var lastEdge = edges.slice(-1)[0];
  var topLeft = {r:lastEdge[0].r-1, c: lastEdge[0].c};
  var topRight = {r:lastEdge[1].r-1, c: lastEdge[1].c};
  var bottomLeft = {r:lastEdge[0].r+1, c: lastEdge[0].c};
  var bottomRight = {r:lastEdge[1].r+1, c: lastEdge[1].c};
  if (findEdge(lastEdge[0], topLeft) &&
       findEdge(lastEdge[1], topRight) &&
       findEdge(topLeft, topRight) ){
    //fill square above
    updateScores();
  }
  if (findEdge(lastEdge[0], bottomLeft) &&
      findEdge(lastEdge[1], bottomRight) &&
      findEdge(bottomLeft, bottomRight)){
    //fill square below
    updateScores();
  }
}
function checkLeftandRight(){

}

function updateScores(){
  if (turn % 2 === 0) blueScore++;
  else redScore++;
  console.log("Blue: "+blueScore);
  console.log("Red: "+redScore);
}

function findEdge(orig, dest){
  for (var i = 0; i < edges.length; i++){
    if (edges[i][0].r === orig.r && edges[i][0].c === orig.c
        && edges[i][1].r === dest.r && edges[i][1].c === dest.c)
        return true;
  }
  return false;
}

window.onload = function(){
  createTable(6);
  document.querySelectorAll("#matrix td").forEach(function(e,i){
    e.onclick = handleClick;
  });
}
