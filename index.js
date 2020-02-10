import map from './defaultMap.js'

const DRAWING_SIZE_CASE = 5
const SIZE_DNA = 5
const NB_AGENT = 200
const DRAWING_SIZE_AGENT = 4
const AGENT_LIFESPAN = 10
const TICK_LIFETIME = 1
const INITIAL_POSITION = {x: 125, y: 25}
const TARGET_POSITION = {x: 105, y: 100}
const COLOR_LETTERS = '0123456789ABCDEF'

// TODO: OPTI UNE FONCTION SIMPLE

class Agent {
  constructor(parentDNA) {
    this.x = INITIAL_POSITION.x
    this.y = INITIAL_POSITION.y
    this.fitness = 0
    this.DNA = new Array(SIZE_DNA).fill().map((elem, index) => {
      return {
        orientation: parentDNA[index].orientation + (- 10 + Math.random() * 20),
        length: parentDNA[index].length + (- 0.1 + Math.random() * 0.2)
      }
    })
    this.lifetime = 0
    this.color = this.generateRandomColor()
  }

  computeFitness = () => this.fitness = Math.sqrt((this.x - TARGET_POSITION.x)**2 + (this.y - TARGET_POSITION.y)**2)

  move = () => {
    this.x += Math.cos(this.DNA[Math.floor(this.lifetime/10)].orientation * Math.PI / 180) * 5 * this.DNA[Math.floor(this.lifetime/10)].length
    this.y += Math.sin(this.DNA[Math.floor(this.lifetime/10)].orientation * Math.PI / 180) * 5 * this.DNA[Math.floor(this.lifetime/10)].length
    this.lifetime += TICK_LIFETIME
  }

  generateRandomColor = () => {
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += COLOR_LETTERS[Math.floor(Math.random() * 16)]
    }
    return color
  }
}

class GeneticAlgorithm {
  constructor() {
    this.nbGeneration = 0
    this.nbSteps = 0
    this.bestDNA = new Array(SIZE_DNA).fill().map((elem, index) => ({orientation: Math.random() * 360, length: Math.random()}))
    this.listAgent = []
    this.generateChildrens()
  }

  updateSteps = () => this.nbSteps++
  resetSteps = () => this.nbSteps = 0

  generateChildrens = () => {
    this.listAgent = new Array(NB_AGENT).fill().map(() => new Agent(this.bestDNA))
  }

  computeNewBestDNA = () => {
    console.log(this.bestDNA[0])
    this.listAgent.forEach(agent => agent.computeFitness()) // We compute the fitness / reward of the current generation
    let totalFitness = this.listAgent.reduce((acc, agent) => acc + agent.fitness, 0)
    console.log(totalFitness / NB_AGENT)
    let dna = new Array(SIZE_DNA).fill().map((elem, index) => {
      return {orientation: 0, length: 0}
    })
    for (let i = 0; i < NB_AGENT; i++) {
      for (let j = 0; j < SIZE_DNA; j++) {
        dna[j].orientation += this.listAgent[i].DNA[j].orientation * (this.listAgent[i].fitness / totalFitness)
        dna[j].length += this.listAgent[i].DNA[j].length * (this.listAgent[i].fitness / totalFitness)
      }
    }
    for (let i = 0; i < SIZE_DNA; i++) {
      dna[i].orientation = dna[i].orientation // / NB_AGENT // TODO: add learning rate
      dna[i].length = dna[i].length // / NB_AGENT
      // this.bestDNA[i].orientation += dna[i].orientation
      // this.bestDNA[i].length += dna[i].length
      this.bestDNA[i].orientation = dna[i].orientation
      this.bestDNA[i].length = dna[i].length
    }
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
  if (cpt % 2 === 0) {
    draw(map)
    genetic.listAgent.forEach(agent => agent.move())
    genetic.updateSteps()
    if (genetic.nbSteps === SIZE_DNA * 10) {
      genetic.resetSteps()
      genetic.computeNewBestDNA()
      genetic.generateChildrens()
    }
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
  ctx.fillRect(TARGET_POSITION.x, TARGET_POSITION.y, DRAWING_SIZE_CASE, DRAWING_SIZE_CASE)

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
