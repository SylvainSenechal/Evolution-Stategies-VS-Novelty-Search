// const TARGET = [0.5, 0.1, 0.3]
// const f = x => - x.reduce((acc, val, index) => acc + (val - TARGET[index])**2, 0)
//
// const SIZE_DNA = 3
// const NB_KIDS = 50
// const EPOCH = 1500
// const LEARNING_RATE = 0.05
// let bestDNA = new Array(SIZE_DNA).fill().map(_ => Math.random())
//
//
// for (let i = 0; i < EPOCH; i++) {
//   let kids = new Array(NB_KIDS).fill().map((_, index) => new Array(SIZE_DNA).fill().map(_ => - 0.3 + Math.random() * 0.6))
//   let rewards = []
//   for (let kid of kids) {
//     rewards.push(f(bestDNA.map((elem, index) => elem + kid[index])))
//   }
//   for (let dnaElement = 0; dnaElement < SIZE_DNA; dnaElement++) {
//     let w = 0
//     for (let kid = 0; kid < NB_KIDS; kid++) {
//       w += kids[kid][dnaElement] * (rewards[kid] / 1)
//     }
//     bestDNA[dnaElement] = bestDNA[dnaElement] + w * LEARNING_RATE
//   }
//
//   console.log(bestDNA)
//   console.log(f(bestDNA))
//   if (Math.abs(f(bestDNA)) < 0.0005) {
//     console.log('iterations : ', i)
//     break
//   }
// }

// fonction 2D

const TARGET = [0.5, 0.1, 0.3]
const f = x => 1 - x.reduce((acc, val, index) => acc + (val - TARGET[index])**2, 0)

const SIZE_DNA = 3
const NB_KIDS = 50
const EPOCH = 15000
const LEARNING_RATE = 0.05
let bestDNA = new Array(SIZE_DNA).fill().map(_ => Math.random())


for (let i = 0; i < EPOCH; i++) {
  let kids = new Array(NB_KIDS).fill().map((_, index) => new Array(SIZE_DNA).fill().map(_ => - 0.03 + Math.random() * 0.06))
  let rewards = []
  for (let kid of kids) {
    rewards.push(f(bestDNA.map((elem, index) => elem + kid[index])))
  }
  let totalReward = rewards.reduce((acc, val) => acc + val)
  for (let dnaElement = 0; dnaElement < SIZE_DNA; dnaElement++) {
    let w = 0
    for (let kid = 0; kid < NB_KIDS; kid++) {
      w += (kids[kid][dnaElement] + bestDNA[dnaElement]) * (rewards[kid] / totalReward)
    }
    bestDNA[dnaElement] = w
  }

  console.log(bestDNA)
  console.log(f(bestDNA))
  if (Math.abs(f(bestDNA)) < 0.0005) {
    console.log('iterations : ', i)
    break
  }
}
console.log(f(bestDNA))
