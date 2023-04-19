const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
const shipImg = document.getElementById("ship")
const bulletB = document.getElementById("bulletB")
const starImg = document.getElementById("star")
const rockImg = document.getElementById("asteroid")
let leftTrigger = false
let starGenTime = 1000
let rockGenTime = 2000
let drawIntervalTime = 10

let ship = {
    x: 500,
    y: 800,
    speed: 50 //higher is lower
}

var fireSprite = { img: null, x: 0, y: 0, width: 28, height: 60, currentframe: 0, totalframes: 9 }

fireSprite.img = new Image();
fireSprite.img.src = "img/fireSprite3.png";

let bullet = {
    speed: 10,
    rof: 300, //higher is lower
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

let mousePos = {
    x: 500,
    y: 800
}

let gunCD = 0;

let drawInterval
function startDrawInterval() {
    drawInterval = setInterval(() => {
        context.clearRect(0, 0, 1000, 1000)
        drawStars()
        drawShip()
        animateJetSprite()
        moveShip()
        if (leftTrigger && gunCD == 0) fire()
        drawBullets()
        drawRocks()
        rockBulletColl()
        for (let i = 0; i < activeRocks.length; i++)
            shipColl(activeRocks[i], "rock", i)
    }, drawIntervalTime)
}

let starInterval
function startStarInterval() {
    starInterval = setInterval(() => {
        generateStars()
    }, (Math.random() * starGenTime) + starGenTime)
}

let rockInterval
function startRockInterval() {
    rockInterval = setInterval(() => {
        generateRocks()
    }, (Math.random() * rockGenTime) + rockGenTime)
}

function startIntervals() {
    startDrawInterval()
    startStarInterval()
    startRockInterval()
}

startIntervals()

function clearIntervals() {
    clearInterval(drawInterval)
    clearInterval(starInterval)
    clearInterval(rockInterval)
    drawInterval = null
    starInterval = null
    rockInterval = null
}

let rock = {
    speed: 2,
    size: 100,
    hp: 100
}