import map from './defaultMap.js'

const DRAWING_SIZE_CASE = 5
const SIZE_DNA = 10
const NB_AGENT = 5
const DRAWING_SIZE_AGENT = 4
const AGENT_LIFESPAN = 10
const TICK_LIFETIME = 1
const INITIAL_POSITION = {x: 2, y: 2}
const TARGET_POSITION = {x: 30, y: 8}
const COLOR_LETTERS = '0123456789ABCDEF'

class Agent {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.DNA = []
    this.lifetime = 0
    this.color = this.generateRandomColor()
    this.buildDNA()
  }

  buildDNA = () => {
    this.DNA = new Array(SIZE_DNA).fill().map((elem, index) => ({orientation: Math.random() * 360, length: Math.random()}))
  }

  generateRandomColor = () => {
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += COLOR_LETTERS[Math.floor(Math.random() * 16)]
    }
    return color
  }

  move = () => {
    this.x += Math.cos(this.DNA[this.lifetime].orientation * Math.PI / 180) * 5 * this.DNA[this.lifetime].length
    this.y += Math.sin(this.DNA[this.lifetime].orientation * Math.PI / 180) * 5 * this.DNA[this.lifetime].length
    this.lifetime += TICK_LIFETIME
  }
}

class GeneticAlgorithm {
  constructor() {
    this.listAgent = new Array(NB_AGENT).fill().map(() => new Agent(INITIAL_POSITION.x, INITIAL_POSITION.y))

  }
}

let genetic = new GeneticAlgorithm()
console.log(genetic)


const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let width = window.innerWidth
let height = window.innerHeight
ctx.canvas.width = width
ctx.canvas.height = height


console.log(map)


let cpt = 0
const loop = () => {
  cpt++
  if (cpt % 100 === 0) {
    draw(map)
    genetic.listAgent.forEach(agent => agent.move())
  }


  requestAnimationFrame(loop)
}

// TODO: draw map once
const draw = map => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // ctx.strokeRect(0, 0, ) // TODO: bordure

  map.forEach((row, rowID) => {
    row.forEach((value, colID) => {
      map[rowID][colID] === 0 ? ctx.fillStyle = "#f5bfdd" : ctx.fillStyle = "#000000"
      ctx.fillRect(colID * DRAWING_SIZE_CASE, rowID * DRAWING_SIZE_CASE, DRAWING_SIZE_CASE, DRAWING_SIZE_CASE)
    })
  })
  genetic.listAgent.forEach(agent => {
    ctx.fillStyle = agent.color
    ctx.beginPath()
    ctx.arc(agent.x, agent.y, DRAWING_SIZE_AGENT, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.fillStyle = "#00ff00"
  ctx.fillRect(TARGET_POSITION.x * DRAWING_SIZE_CASE, TARGET_POSITION.y * DRAWING_SIZE_CASE, DRAWING_SIZE_CASE, DRAWING_SIZE_CASE)

}

loop()


// ctx.moveTo(car.x, car.y);
// ctx.lineTo(car.x + Math.cos(car.orientation*Math.PI/180)*car.frontDST, car.y + Math.sin(car.orientation*Math.PI/180)*car.frontDST);
// ctx.stroke();

function calculateInputs(){
  for(i=0; i<jeu.listCar.length; i++){
    let orientation = jeu.listCar[i].orientation
    let dstToObstacle = 0
    let foundObstacle = false
    let x = jeu.listCar[i].x
    let y = jeu.listCar[i].y
    let caseX = 0
    let caseY = 0
    // 0° in front of the car
    while(!foundObstacle){
      dstToObstacle++
      caseX = Math.floor((x-jeu.positionX)/jeu.widthCase)
      caseY = Math.floor((y-jeu.positionY)/jeu.widthCase)
      if(jeu.map[caseX][caseY] == 0){
        foundObstacle = true
      }
      else{
        x += Math.cos((orientation)*Math.PI/180)
        y += Math.sin((orientation)*Math.PI/180)
      }
    }
    // console.log("0 degrees in front of you : " + dstToObstacle)
    jeu.listCar[i].frontDST = dstToObstacle
    dstToObstacle = 0 // Reinitialisation
    foundObstacle = false
    x = jeu.listCar[i].x
    y = jeu.listCar[i].y
    // 90° on the right
    while(!foundObstacle){
      dstToObstacle++
      caseX = Math.floor((x-jeu.positionX)/jeu.widthCase)
      caseY = Math.floor((y-jeu.positionY)/jeu.widthCase)
      if(jeu.map[caseX][caseY] == 0){
        foundObstacle = true
      }
      else{
        x += Math.cos((orientation+90)*Math.PI/180)
        y += Math.sin((orientation+90)*Math.PI/180)
      }
    }
    // console.log("90 degrees right : " + dstToObstacle)
    jeu.listCar[i].rightDST = dstToObstacle
    dstToObstacle = 0 // Reinitialisation
    foundObstacle = false
    x = jeu.listCar[i].x
    y = jeu.listCar[i].y

    // 90° on the left
    while(!foundObstacle){
      dstToObstacle++
      caseX = Math.floor((x-jeu.positionX)/jeu.widthCase)
      caseY = Math.floor((y-jeu.positionY)/jeu.widthCase)
      if(jeu.map[caseX][caseY] == 0){
        foundObstacle = true
      }
      else{
        x += Math.cos((orientation-90)*Math.PI/180)
        y += Math.sin((orientation-90)*Math.PI/180)
      }
    }
    // console.log("90 degrees left : " + dstToObstacle)
    jeu.listCar[i].leftDST = dstToObstacle
    dstToObstacle = 0 // Reinitialisation
    foundObstacle = false
    x = jeu.listCar[i].x
    y = jeu.listCar[i].y
    // 45° on the right
    while(!foundObstacle){
      dstToObstacle++
      caseX = Math.floor((x-jeu.positionX)/jeu.widthCase)
      caseY = Math.floor((y-jeu.positionY)/jeu.widthCase)
      if(jeu.map[caseX][caseY] == 0){
        foundObstacle = true
      }
      else{
        x += Math.cos((orientation+45)*Math.PI/180)
        y += Math.sin((orientation+45)*Math.PI/180)
      }
    }
    // console.log("45 degrees right : " + dstToObstacle)
    jeu.listCar[i].rightQuarterDST = dstToObstacle
    dstToObstacle = 0 // Reinitialisation
    foundObstacle = false
    x = jeu.listCar[i].x
    y = jeu.listCar[i].y
    //45° on the left
    while(!foundObstacle){
      dstToObstacle++
      caseX = Math.floor((x-jeu.positionX)/jeu.widthCase)
      caseY = Math.floor((y-jeu.positionY)/jeu.widthCase)
      if(jeu.map[caseX][caseY] == 0){
        foundObstacle = true
      }
      else{
        x += Math.cos((orientation-45)*Math.PI/180)
        y += Math.sin((orientation-45)*Math.PI/180)
      }
    }
    // console.log("45 degrees left : " + dstToObstacle)
    jeu.listCar[i].leftQuarterDST = dstToObstacle
    dstToObstacle = 0 // Reinitialisation
    foundObstacle = false
    x = jeu.listCar[i].x
    y = jeu.listCar[i].y
  }

  // console.log(jeu.listCar[i].frontDST)
  // console.log(jeu.listCar[i].rightDST)
  // console.log(jeu.listCar[i].leftDST)
  // console.log(jeu.listCar[i].rightQuarterDST)
  // console.log(jeu.listCar[i].leftQuarterDST)
}

let a1 = new Agent(1, 2)
console.log(a1)
