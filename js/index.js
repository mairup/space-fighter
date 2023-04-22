const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
const shipImg = document.getElementById("ship")
const bulletB = document.getElementById("bulletB")
const starImg = document.getElementById("star")
const rockImg = document.getElementById("asteroid")
const hpTable = new Image()
hpTable.src = "img/hp_table.png"
const miniHpBar = new Image()
miniHpBar.src = "img/miniHpBar.png"
const miniHpBarBar = new Image()
miniHpBarBar.src = "img/miniHpBarBar.png"
const enemyShipImg = new Image()
enemyShipImg.src = "img/enemyShip1.png"

let leftTrigger = false
let starGenTime = 1000
let rockGenTime = 1000
let drawIntervalTime = 10

let ship = {
    x: 500,
    y: 800,
    speed: 20, //higher is lower
    hp: 700,
    maxHP: 700
}

let fireSprite = {
    img: null,
    x: 0,
    y: 0,
    width: 28,
    height: 60,
    currentframe: 0,
    totalframes: 9
}

fireSprite.img = new Image()
fireSprite.img.src = "img/fireSprite3.png"

let rockExplosionTemplate = {
    img: null,
    x: 100,
    y: 100,
    width: 96,
    height: 96,
    currentframe: 0,
    totalframes: 7
}

rockExplosionTemplate.img = new Image()
rockExplosionTemplate.img.src = "img/AsteroidExplode.png"

let activeRockExplosions = []

let bullet = {
    speed: 10,
    rof: 250, //higher is lower
    size: 10,
    dmg: 100
}

let star = {
    speed: 1,
    size: 40
}

let rock = {
    speed: 5,
    size: 100,
    hp: 200
}

let activeBullets = []
let activeStars = []
let activeRocks = []
let activeShips = []

let mousePos = {
    x: 500,
    y: 800
}

let enemyBullets = [{
    speed: 5,
    rof: 250, //higher is lower
    size: 5,
    dmg: 50
},
{
    speed: 5,
    rof: 250, //higher is lower
    size: 5,
    dmg: 150
},
{
    speed: 10,
    rof: 250, //higher is lower
    size: 5,
    dmg: 30
}]

let enemyShips = [{
    size: 120,
    x: 0,
    y: 0,
    ySpeed: 2,
    xSpeed: 2,
    hp: 300,
    maxHP: 100,
    bullet: enemyBullets[0]
},
{
    size: 50,
    x: 0,
    y: 0,
    ySpeed: 0.5,
    xSpeed: 2,
    hp: 300,
    maxHP: 300,
    bullet: enemyBullets[1]
},
{
    size: 50,
    x: 0,
    y: 0,
    ySpeed: 0.5,
    xSpeed: 2,
    hp: 50,
    maxHP: 50,
    bullet: enemyBullets[2]
}
]

let enemyShipsTimeout = 5000
let gunCD = 0

let drawInterval
function startDrawInterval() {
    drawInterval = setTimeout(() => {
        context.clearRect(0, 0, 1000, 1000)
        drawStars()
        drawShip()
        animateJetSprite()
        drawEnemyShips()
        moveShip()
        if (leftTrigger && gunCD == 0) fire()
        drawBullets()
        drawRocks()
        rockBulletColl()
        enemyShipBulletColl()

        for (let i = 0; i < activeRocks.length; i++)
            shipColl(activeRocks[i], "rock", i)

        for (let i = 0; i < activeShips.length; i++)
            shipColl(activeShips[i], "ship", i)

        for (let i = 0; i < activeRockExplosions.length; i++)
            drawRockExplosion(activeRockExplosions[i])

        drawMiniHP()
        drawHP()
        startDrawInterval()
    }, drawIntervalTime)
}

let starInterval
function startStarInterval() {
    starInterval = setTimeout(() => {
        generateStars()
        startStarInterval()
    }, (Math.random() * starGenTime) + starGenTime)
}

let rockInterval
function startRockInterval() {
    rockInterval = setTimeout(() => {
        generateRocks()
        startRockInterval()
    }, (Math.random() * rockGenTime) + rockGenTime)
}

let enemyShipInterval
function startEnemyShipInterval() {
    enemyShipInterval = setTimeout(() => {
        spawnEnemyShip()
        startEnemyShipInterval()
    }, (Math.random() * (enemyShipsTimeout / 2)) + enemyShipsTimeout)
}


let increaseDifficultyInterval
function startIncreaseDifficultyInterval() {
    increaseDifficultyInterval = setTimeout(() => {
        console.log(rockGenTime);
        if (rockGenTime > 200)
            rockGenTime -= 50
        else rockGenTime -= rockGenTime / 20
        console.log(rockGenTime);
        startIncreaseDifficultyInterval()
    }, 5000)
}

function startIntervals() {
    startDrawInterval()
    startStarInterval()
    startRockInterval()
    startEnemyShipInterval()
    startIncreaseDifficultyInterval()
}

startIntervals()

function clearIntervals() {
    clearTimeout(drawInterval)
    clearTimeout(starInterval)
    clearTimeout(rockInterval)
    clearTimeout(enemyShipInterval)
    clearTimeout(increaseDifficultyInterval)
    drawInterval = null
    starInterval = null
    rockInterval = null
    enemyShipInterval = null
    increaseDifficultyInterval = null
}
