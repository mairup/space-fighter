const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
const ship = document.getElementById("ship")
const bulletB = document.getElementById("bulletB")
const starImg = document.getElementById("star")
const rockImg = document.getElementById("rock")
let shipSpeed = 50 //higher is lower
let leftTrigger = false
let starGenTime = 1000
let rockGenTime = 2000

var fireSprite = { img: null, x: 0, y: 0, width: 28, height: 60, currentframe: 0, totalframes: 9 }

fireSprite.img = new Image();
fireSprite.img.src = "img/fireSprite3.png";

let bullet = {
    speed: 10,
    rof: 200, //higher is lower
    size: 10,
    dmg: 100
}

let star = {
    speed: 1,
    size: 40
}

let activeBullets = []
let activeStars = []
let activeRocks = []

let shipPos = {
    x: 500,
    y: 800
}

let mousePos = {
    x: 500,
    y: 800
}

let gunCD = 0;

let drawInterval = setInterval(() => {
    context.clearRect(0, 0, 1000, 1000)
    drawStars()
    drawShip()
    animateJetSprite()
    moveShip()
    if (leftTrigger && gunCD == 0) fire()
    drawBullets()
    drawRocks()
}, 10)

let starInterval = setInterval(() => {
    generateStars()
}, (Math.random() * starGenTime) + starGenTime)

let rockInterval = setInterval(() => {
    generateRocks()
}, (Math.random() * rockGenTime) + rockGenTime)

let rock = {
    speed: 2,
    size: 100,
    hp: 100
}