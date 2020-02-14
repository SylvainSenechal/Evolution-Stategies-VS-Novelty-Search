const NB_KIDS = 200
const SIZE_DNA = 2 // 2D Optimization
const SEARCH_DISTANCE = 0.9

const DRAWING_SIZE_CASE = 5
const DRAWING_SIZE_AGENT = 1
const NB_X_POINTS = 101
const NB_Y_POINTS = 101
const X_AMPLITUDE = 10
const Y_AMPLITUDE = 10

// TODO: construct path
// TODO: add new benchmark functions
// TODO: Test other kid selection (top 10, top 1 vs average)
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let width = window.innerWidth
let height = window.innerHeight
ctx.canvas.width = width
ctx.canvas.height = height

const rastrigin2D = x => 10 * x.length + x.reduce((acc, val) => acc + val**2 - 10 * Math.cos(2 * Math.PI * val), 0)

let optimizedFunction = rastrigin2D
// let bestDNA = new Array(SIZE_DNA).fill().map(_ => Math.random())
let bestDNA = [X_AMPLITUDE / 3, Y_AMPLITUDE / 3]

let cpt = 0
const loop = () => {
  cpt++
  drawFunction(optimizedFunction)
  optimize(bestDNA, optimizedFunction)
  requestAnimationFrame(loop)
}

// TODO: draw function once
const drawFunction = optimizedFunction2D => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  let max = - Infinity
  let min = Infinity
  for (let i = 0; i < NB_X_POINTS; i++) {
    for (let j = 0; j < NB_Y_POINTS; j++) {
      let val = optimizedFunction2D([(i - ((NB_X_POINTS - 1) / 2)) / X_AMPLITUDE, (j - ((NB_Y_POINTS - 1) / 2)) / Y_AMPLITUDE])
      if (val > max) max = val
      if (val < min) min = val
    }
  }
  let normalizer = max - min
  for (let i = 0; i < NB_X_POINTS; i++) {
    for (let j = 0; j < NB_Y_POINTS; j++) {
      let val = optimizedFunction2D([(i - ((NB_X_POINTS - 1) / 2)) / X_AMPLITUDE, (j - ((NB_Y_POINTS - 1) / 2)) / Y_AMPLITUDE])
      ctx.fillStyle = `rgb(${val / normalizer * 255}, 0, ${255 - val / normalizer * 255})`
      ctx.fillRect(i * DRAWING_SIZE_CASE, j * DRAWING_SIZE_CASE, DRAWING_SIZE_CASE, DRAWING_SIZE_CASE)
    }
  }
}

const drawKids = (kids, dna) => {
  ctx.fillStyle = '#00ff00'
  kids.forEach(kid => {
    ctx.beginPath()
    ctx.arc(
      ((kid[0] + dna[0]) + X_AMPLITUDE / 2) * (NB_X_POINTS - 1) / (2 * DRAWING_SIZE_AGENT),
      ((kid[1] + dna[1]) + Y_AMPLITUDE / 2) * (NB_X_POINTS - 1) / (2 * DRAWING_SIZE_AGENT),
      DRAWING_SIZE_AGENT, 0, Math.PI * 2
    )
    ctx.fill()
  })
  ctx.fillStyle = '#fac919'
  ctx.beginPath()
  ctx.arc(
    (dna[0] + X_AMPLITUDE / 2) * (NB_X_POINTS - 1) / (2 * DRAWING_SIZE_AGENT),
    (dna[1] + Y_AMPLITUDE / 2) * (NB_X_POINTS - 1) / (2 * DRAWING_SIZE_AGENT),
    DRAWING_SIZE_AGENT * 3, 0, Math.PI * 2
  )
  ctx.fill()
}

const optimize = (dna, f) => {
  let kids = new Array(NB_KIDS).fill().map((_, index) => new Array(SIZE_DNA).fill(0)) // .map(_ => - 0.5 + Math.random() * 1))
  kids.forEach(kid => {
    let orientation = Math.random() * 360
    let length = Math.random() * SEARCH_DISTANCE
    kid[0] = Math.cos(orientation * Math.PI / 180) * length
    kid[1] = Math.sin(orientation * Math.PI / 180) * length
  })
  drawKids(kids, dna)
  let rewards = []
  for (let kid of kids) {
    rewards.push(1 / f(dna.map((elem, index) => elem + kid[index]))) // inverse because we minimize the function
  }
  let totalReward = rewards.reduce((acc, val) => acc + val)
  for (let dnaElement = 0; dnaElement < SIZE_DNA; dnaElement++) {
    let w = 0
    for (let kid = 0; kid < NB_KIDS; kid++) {
      w += (kids[kid][dnaElement] + dna[dnaElement]) * (rewards[kid] / totalReward)
    }
    dna[dnaElement] = w
  }

  console.log(dna)
  console.log(f(dna))
}

loop()
