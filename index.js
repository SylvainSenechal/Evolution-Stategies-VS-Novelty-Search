import map from './defaultMap.js'

const DRAWING_SIZE_CASE = 5
const SIZE_DNA = 25
const NB_AGENT = 200
const DRAWING_SIZE_AGENT = 4
const AGENT_LIFESPAN = 10
const TICK_LIFETIME = 1
const INITIAL_POSITION = {x: 125, y: 25}
const TARGET_POSITION = {x: 385, y: 320}
const COLOR_LETTERS = '0123456789ABCDEF'
const LEARNING_RATE = 0.05

// TODO: remove useless ctse
// TODO: ne pas utiliser gradient, caper orientation 0,360 et utiliser pos moyenne
class Agent {
  constructor(parentDNA) {
    this.x = INITIAL_POSITION.x
    this.y = INITIAL_POSITION.y
    this.fitness = 0
    this.parentDNA = parentDNA
    this.DNA = new Array(SIZE_DNA).fill().map((elem, index) => {
      return {
        orientation: (- 45 + Math.random() * 90) + parentDNA[index].orientation,
        length: (- 0.1 + Math.random() * 0.2) + parentDNA[index].length
      }
    })
    this.lifetime = 0
    this.color = this.generateRandomColor()
  }

  computeFitness = () => this.fitness = 2500 - Math.sqrt((this.x - TARGET_POSITION.x)**2 + (this.y - TARGET_POSITION.y)**2)
  // computeFitness = () => this.fitness = - Math.sqrt((this.x - TARGET_POSITION.x)**2 + (this.y - TARGET_POSITION.y)**2)

  move = () => {
    this.x += Math.cos((this.DNA[Math.floor(this.lifetime/10)].orientation) * Math.PI / 180) * 5 * (this.DNA[Math.floor(this.lifetime/10)].length)
    this.y += Math.sin((this.DNA[Math.floor(this.lifetime/10)].orientation) * Math.PI / 180) * 5 * (this.DNA[Math.floor(this.lifetime/10)].length)
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
    console.log(this.bestDNA)
    this.listAgent.forEach(agent => agent.computeFitness()) // We compute the fitness / reward of the current generation
    let totalFitness = this.listAgent.reduce((acc, agent) => acc + agent.fitness, 0)
    console.log(totalFitness)
    // for (let dnaElement = 0; dnaElement < SIZE_DNA; dnaElement++) {
    //   let dna = {orientation: 0, length: 0}
    //   for (let kid = 0; kid < NB_AGENT; kid++) {
    //     dna.orientation += this.listAgent[kid].DNA[dnaElement].orientation * (this.listAgent[kid].fitness / totalFitness)
    //     dna.length += this.listAgent[kid].DNA[dnaElement].length * (this.listAgent[kid].fitness / totalFitness)
    //   }
    //   console.log(dna)
    //   this.bestDNA[dnaElement].orientation = this.bestDNA[dnaElement].orientation + dna.orientation * LEARNING_RATE
    //   this.bestDNA[dnaElement].length = this.bestDNA[dnaElement].length + dna.length * LEARNING_RATE
    // }

    // let index = 0
    // let max = 0
    // for (let i = 0; i < NB_AGENT; i++) {
    //   console.log(this.listAgent[i].fitness)
    //   if (this.listAgent[i].fitness > max) {
    //     max = this.listAgent[i].fitness
    //     index = i
    //   }
    // }
    // this.bestDNA = this.listAgent[index].DNA

    for (let dnaElement = 0; dnaElement < SIZE_DNA; dnaElement++) {
      let dna = {orientation: 0, length: 0}
      for (let kid = 0; kid < NB_AGENT; kid++) {
        dna.orientation += this.listAgent[kid].DNA[dnaElement].orientation * (this.listAgent[kid].fitness / totalFitness)
        dna.length += this.listAgent[kid].DNA[dnaElement].length * (this.listAgent[kid].fitness / totalFitness)
      }
      console.log(dna)
      this.bestDNA[dnaElement].orientation = dna.orientation // this.bestDNA[dnaElement].orientation + dna.orientation * LEARNING_RATE
      this.bestDNA[dnaElement].length = dna.length // this.bestDNA[dnaElement].length + dna.length * LEARNING_RATE
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
  if (cpt % 1 === 0) {
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
