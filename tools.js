function normalize(obj){
  let mag = Math.abs(Math.sqrt(
    obj.x * obj.x + obj.y * obj.y
  ))
  if(mag <= 0.1){
    mag = 1
  }
  return({
    x:obj.x/mag,
    y:obj.y/mag
  })
}

function getDistance(obj1, obj2){
  let ans = Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2)
  ans = Math.sqrt(ans)

  return(ans)
}

function getDirection(obj1, obj2){
  return(normalize({
    x:obj2.x - obj1.x,
    y:obj2.y - obj1.y
  }))
}

function checkCollision(obj1, obj2){
  let maxDist = obj1.size + obj2.size

  if(getDistance(obj1, obj2) < maxDist) return(true)
  return(false)
}

function compareDists(a,b) {
  if ( getDistance(clot.cells[a], nano.n[2]) < getDistance(clot.cells[b], nano.n[2]) )
     return -1;
  else
    return 1;
  return 0;
}

function youLose(){
  lossAlpha += 0.01

  ctx.fillStyle = "#FF0000"
  ctx.globalAlpha = lossAlpha
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.globalAlpha = 1

  if(lossAlpha >= 1){
    lossAlpha = 1
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "100px Arial";
    ctx.fillText("You Lose", 750, 550);
  }
}

function youWin(){
  lossAlpha += 0.01

  ctx.fillStyle = "#00BB00"
  ctx.globalAlpha = lossAlpha
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.globalAlpha = 1

  if(lossAlpha >= 1){
    lossAlpha = 1
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "100px Arial";
    ctx.fillText("You Win", 750, 550);
    ctx.fillText(timer.finalTime, 450, 750);
  }
}

// Taken from this link:
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

var cvtHex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]

var mouse = {
  x:0,
  y:0,
  old:{
    x:0,
    y:0
  },
  oldOld:{
    x:0,
    y:0
  },
  dir:{
    x:0,
    y:0
  }
}
mouse.update = function(event){
  // credit to Rafał S at:
  //https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas?answertab=trending#tab-top
  let rect = canvas.getBoundingClientRect();

  this.oldOld = {
    x:this.old.x,
    y:this.old.y
  }

  this.old = {
    x:this.x,
    y:this.y
  }

  this.dir = normalize(mouse)

  this.x = (event.clientX - rect.left)/scr_ratio - borderW
  this.y = (event.clientY - rect.top)/scr_ratio - borderW
}
window.addEventListener("mousemove", function(){
  mouse.update(event)
});

var timer = {
  time: 0,
  seconds: 120,
  stall:true,
  win:false,
  finalTime:""
}
timer.update = function(){
  if(ctr["1"] || ctr["2"] || ctr["9"] || ctr["0"]) timer.stall = false

  if(!timer.stall){
    timer.time ++

    if(timer.time%fps == 0 && timer.seconds != 0){
      timer.seconds --
    }
  }

  ctx.fillStyle = "#FFFFFF"
  let str = "" + timer.seconds + ""
  ctx.font = "100px Arial";
  ctx.fillText(str, 10, 90);
}
timer.checkWin = function(){
  if(nano.n[2].x >= 1550 && timer.seconds>0 && !timer.win){
    timer.win = true

    let tm = timer.time/fps
    tm = Math.floor(tm * 100)
    tm = tm/100
    timer.finalTime = "Score: " + tm + " seconds"
  }

  if(timer.win){
    youWin()
  }

  if(timer.seconds <= 0 && !timer.win){
    youLose()
  }
}


class Scene{
  constructor(){
    this.x = 0
    this.y = 0

    this.size = gameSize

    this.w = canvas.width
    this.h = canvas.height

    this.col = "#000000"
  }

  draw(){
    ctx.fillStyle = this.col
    ctx.strokeStyle = this.col
    ctx.clearRect(this.x, this.y, this.w, this.h)
    ctx.fillRect(this.x, this.y, this.w, this.h)

    ctx.fillStyle = "#FF0000"
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, canvas.height/5)
    ctx.arc(0, 400, 400,      7*Math.PI/6, 11*Math.PI/6);
    ctx.arc(520, 100, 200,     5*Math.PI/6, Math.PI/6, true);
    ctx.arc(1040, 400, 400,    7*Math.PI/6, 11*Math.PI/6);
    ctx.arc(1560, 100, 200,     5*Math.PI/6, Math.PI/6, true);
    ctx.arc(2080, 400, 400,   7*Math.PI/6, 11*Math.PI/6);
    ctx.arc(2600, 100, 200,    5*Math.PI/6, Math.PI/6, true);
    //ctx.arc(3*canvas.width/8, canvas.height/16, canvas.width/8, 3*Math.PI/4, Math.PI/4, true);
    ctx.lineTo(canvas.width, 0)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = "#FF0000"
    ctx.beginPath()
    ctx.moveTo(0, canvas.height)
    ctx.lineTo(0, canvas.height/5)
    ctx.arc(0, canvas.height -  100, 200,     7*Math.PI/6, 11*Math.PI/6);
    ctx.arc(520, canvas.height - 400, 400,      5*Math.PI/6, Math.PI/6, true);
    ctx.arc(520+520, canvas.height -  100, 200,     7*Math.PI/6, 11*Math.PI/6);
    ctx.arc(1040+520, canvas.height -  400, 400,    5*Math.PI/6, Math.PI/6, true);
    ctx.arc(1560+520, canvas.height -  100, 200,     7*Math.PI/6, 11*Math.PI/6);
    ctx.arc(2080+520, canvas.height -  400, 400,   5*Math.PI/6, Math.PI/6, true);
    ctx.arc(2600+520, canvas.height -  100, 200,    7*Math.PI/6, 11*Math.PI/6);
    ctx.lineTo(canvas.width, canvas.height)
    //ctx.arc(3*canvas.width/8, canvas.height/16, canvas.width/8, 3*Math.PI/4, Math.PI/4, true);
    //ctx.lineTo(canvas.width, 0)
    ctx.closePath()
    ctx.fill()

  }
}

//A Node is a singular circular section of the nanobot.
class Node{
  constructor(x, y, size){
    this.x = x
    this.y = y

    this.size = size

    this.velocity = 5

    this.oldX = 0

    this.lft = null
    this.rgt = null

    this.col = "#888888"
  }

  draw(){
    //draws & fills in a circle at the nodes location

    ctx.beginPath()
    ctx.fillStyle = this.col
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.closePath()
    ctx.fill()

  }

  update(){
    this.velocity = Math.abs(this.x - this.oldX, 0)
    this.oldX = this.x
  }
}

//A Connector is a link between the nodes.
class Connector{
  constructor(size, key){
    this.size = size

    this.maxOffset = 4 * size

    //executions per period
    this.velocity = this.maxOffset / period

    this.extend = false
    this.retract = false

    this.growing = false
    this.shrinking = false

    this.col = "#CCCCCC"
  }

  draw(){
    ctx.beginPath()

    ctx.lineWidth = this.size
    ctx.strokeStyle = this.col

    ctx.moveTo(this.lft.x, this.lft.y)
    ctx.lineTo(this.rgt.x, this.rgt.y)

    ctx.stroke()
  }
}


class Nanobot{
  constructor(x, y, size){
    this.x = x
    this.y = y

    this.active = false
    this.move = "0000"

    this.moveFrame = 0
    this.waitFrame = 0
    this.movements = {}

    for(let i1=0; i1<2; i1++){
      for(let i2=0; i2<2; i2++){
        for(let i3=0; i3<2; i3++){
          for(let i4=0; i4<2; i4++){
            let str = i1.toString() + i2.toString() +
                      i3.toString() + i4.toString()

            this.movements[str] = getNanoVelocities(i1, i2, i3, i4)

          }
        }
      }
    }

    this.d = 0

    this.size = size

    this.n = []
    this.c = []

    this.createStructure()

    this.turn = 0
    this.order = [
      [0, 0], [1, 0], [1, 1], [0, 1]
    ]

    this.v = [

    ]
  }

  createStructure(){
    this.n.push( new Node(this.x - this.size * 4, this.y, this.size) )
    this.n.push( new Node(this.x, this.y, this.size) )
    this.n.push( new Node(this.x + this.size * 4, this.y, this.size) )

    this.c.push( new Connector(this.size, "1") )
    this.c.push( new Connector(this.size, "2") )

    for(let i=0; i<2; i++){
      this.c[i].lft = this.n[i]
      this.c[i].rgt = this.n[i+1]

      this.n[i+1].lft = this.c[i]
      this.n[i].rgt = this.c[i]

      this.c[i].lftW = i+1
      this.c[i].rgtW = this.c.length - i
      this.c[i].totW = this.c[i].lftW + this.c[i].rgtW
      this.c[i].center = this.n[1]

      this.c[i].otherC = this.c[ (i + 1) % 2 ]
    }
  }

  draw(){
    for(let i=0; i<this.c.length; i++){
      this.c[i].draw()
    }

    ctx.beginPath()

    ctx.moveTo(this.n[1].x - 3 * this.size, this.y)
    ctx.lineTo(this.n[1].x + 3 * this.size, this.y)

    ctx.lineWidth *= 1.2
    ctx.strokeStyle = "#AAAAAA"

    ctx.stroke()

    for(let i=0; i<this.n.length; i++){
      this.n[i].draw()
    }
  }

  updateMove(){
    let oldMove = this.move

    let i0 = this.move[1]
    let i2 = this.move[3]

    let i1
    let i3

    if(ctr["1"]){
      i1 = "1"
    }

    else if(ctr["2"]){
      i1 = "0"
    }

    else i1 = this.move[1]

    if(ctr["9"]){
      i3 = "1"
    }

    else if(ctr["0"]){
      i3 = "0"
    }

    else i3 = this.move[3]

    if(i1 == this.move[1] && i3 == this.move[3]){
      this.active=false
      return
    }

    this.move = i0 + i1 + i2 + i3
  }

  moveNodes(){
    if(this.active && this.waitFrame == 0){
      let mv = this.movements[this.move]

      this.n[0].x += this.size * mv[0][this.moveFrame]/5
      this.n[1].x += this.size * mv[1][this.moveFrame]/5
      this.n[2].x += this.size * mv[2][this.moveFrame]/5

      this.n[0].update()
      this.n[1].update()
      this.n[2].update()
    }

    if(ctr["Y"]){
      this.n[0].x += 4
      this.n[1].x += 4
      this.n[2].x += 4
    }
  }

  checkWait(){
    if(this.active){
      if(this.waitFrame > 0){
        this.waitFrame --
        if(this.waitFrame == 0){
          this.updateMove()
        }
      }
    }

    else{
      if(ctr["1"] || ctr["2"] || ctr["9"] || ctr["0"]){
        this.waitFrame = 4
        this.active = true
      }
    }
  }

  updateFrames(){
    this.checkWait()

    if(this.active && this.waitFrame == 0){
      this.moveFrame ++
    }

    if(this.moveFrame == 20){
      this.active = false
      this.moveFrame = 0
      return
    }
  }

  update(){
    this.updateFrames()
    this.moveNodes()
    this.draw()
  }
}


class Cell{
  constructor(x, y, size){
    this.x = x + Math.random() * size
    this.y = y + Math.random() * size
    this.size = size + Math.random() * size/2

    // this.x = x
    // this.y = y
    // this.size = size



    this.dir = {
      x:0,
      y:0
    }

    this.velocity = 0

    let magnification = 1.5
    this.drawsize = this.size * magnification
  }

  bounce(obj){

    // Different bounce physics
    // only changes the bouncee's velocity (this)

    // equalizes and alters velocity for both the bouncer & bouncee

    let c = obj.velocity + this.velocity
    this.velocity = (c/2)
    obj.velocity = (c/2)

    let overlap = getDistance(obj, this)
    overlap -= obj.size
    overlap -= this.size

    overlap = Math.min(overlap, 0)
    overlap = Math.abs(overlap)


    // direction is based on a vector, going from the center of
    // one cell, to the center of the other, as they collide
    this.dir = getDirection(obj, this)

    // checks if the nanobot is being bounced off of. If so,
    // it is extra careful to not overlap with any cells.


    this.x += this.dir.x * overlap
    this.y += this.dir.y * overlap

    this.dir = getDirection(obj, this)


    // moves the cell away from its collision
    this.x += this.dir.x * this.velocity
    this.y += this.dir.y * this.velocity
  }

  move(){

    // initial movement of the cell, independent of any collisions
    this.x += this.dir.x * this.velocity
    this.y += this.dir.y * this.velocity

    // this will trigger at each frame to diminish the cell's velocity
    this.velocity*=0.9
  }

  update(){

    if(this.velocity > 0){
      this.move()
    }

    // checks for nanobot collision
    for(let i=0; i<3; i++){
      if(checkCollision(nano.n[i], this)){
        this.bounce(nano.n[i])
      }
    }

    // checks all other cells for a collision
    for(let i=0; i<clot.cells.length; i++){

      if(clot.cells[i] == this) continue

      if( checkCollision(clot.cells[i], this) ){
        clot.cells[i].bounce(this)
      }
    }
  }

  draw(){

    //draws & fills in a circle at the cell's location
    ctx.fillStyle = this.col

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.drawsize, 0, 2 * Math.PI);
    ctx.closePath()
    ctx.fill()

    // big shadow
    ctx.fillStyle = this.col2
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.drawsize, 1.772, 4.511)
    ctx.arc(this.x + (3*this.drawsize)/10, this.y, this.drawsize * 1.1, 4.245, 2.037, true)
    ctx.closePath()
    ctx.fill()

    // small left shadow
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.drawsize * 0.5, 1.772, 4.511)
    ctx.arc(this.x + (3*this.drawsize * 0.5)/10, this.y, this.drawsize * 0.5 * 1.1, 4.245, 2.037, true)
    ctx.closePath()
    ctx.fill()

    // small right shadow
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.drawsize * 0.5, -0.902, 0.902)
    ctx.arc(this.x - (2.4*this.drawsize * 0.5)/10, this.y, this.drawsize * 0.5 * 1.1, 0.427, -0.427, true)
    ctx.closePath()
    ctx.fill()

  }
}


class Clot{
  constructor(x, y, size){
    this.x = x
    this.y = y

    this.ready = false

    this.broke = false

    this.size = size * 0.5

    this.cells = []
    this.makeClot()

    this.order = this.getOrder()

    shuffleArray(this.cells)

    for(let i=0; i<this.cells.length; i++){
      let col = "#"
      let brightness = 100 + Math.floor( (i/this.cells.length) * 156)
      col += cvtHex[ Math.floor(brightness/16) ]
      col += cvtHex[ brightness % 16 ]
      col += "0000"
      this.cells[i].col = col

      let col2 = "#"
      let brightness2 = Math.floor( (i/this.cells.length) * 155)
      col2 += cvtHex[ Math.floor(brightness2/16) ]
      col2 += cvtHex[ brightness2 % 16 ]
      col2 += "0000"
      this.cells[i].col2 = col2
    }
  }

  getOrder(){
    let order = []
    for(let i=0; i<this.cells.length; i++){
      order.push(i)
    }
    return order
  }

  makeClot(){
    for(let j=0; j<60; j++){
      let start = Math.floor(2*Math.sin(Math.PI/2.001 * (30 - Math.abs(j-30) )/30)*this.size/1.2)-10
      for(let i=0; i<10; i++){  //for(let i=start; i<20 - start; i++){
        this.cells.push(new Cell(
          this.x - (i - 5) * this.size * 2, //this.x - (i - (10 - start/10)) * this.size * 2,
          this.y - (j - 30) * this.size * 2 + 50, //this.y - (j - 30) * this.size * 2,
          this.size
        ))
      }
    }
  }

  draw(){
    for(let i=0; i<this.cells.length; i++){
      this.cells[i].draw()
    }
  }

  update(){
    //shuffleArray(this.cells)
    // this.cells.sort(compareDists);

    if(!this.ready){
      for(let i=0; i<50; i++){
        for(let j=0; j<this.cells.length; j++){
          this.cells[j].update()
        }
      }
      this.ready = true
    }

    this.order.sort(compareDists);

    if(ctr["T"]) this.broken = true;

    for(let i=0; i<this.cells.length; i++){
      let j = this.order[i]
      this.cells[j].update()
    }
  }
}
