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
const bulletR = new Image()
bulletR.src = "img/bulletR.png"
const healthPackImg = new Image()
healthPackImg.src = "img/healthPack.png"
const blueGlowImg = new Image()
blueGlowImg.src = "img/blueGlow.png"
const whiteGlowImg = new Image()
whiteGlowImg.src = "img/whiteGlow.png"
const redGlowImg = new Image()
redGlowImg.src = "img/redGlow.png"

let leftTrigger = false
let starGenTime = 1000
let rockGenTime = 1000
let drawIntervalTime = 10
let healthPackTimeout = 15000

let ship = {
    x: 500,
    y: 800,
    speed: 20, //higher is lower
    hp: 700,
    maxHP: 700,
    stamina: 100,
    maxStamina: 100,
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

let bulletExplosionTemplate = {
    img: null,
    x: 100,
    y: 100,
    width: 32,
    height: 32,
    currentframe: 0,
    totalframes: 8
}

bulletExplosionTemplate.img = new Image()
bulletExplosionTemplate.img.src = "img/Explosion.png"

let shipExplosionTemplate = {
    img: null,
    x: 100,
    y: 100,
    width: 32,
    height: 32,
    currentframe: 0,
    totalframes: 8
}

shipExplosionTemplate.img = new Image()
shipExplosionTemplate.img.src = "img/Explosion.png"

let activeRockExplosions = []
let activeBulletExplosions = []
let activeShipExplosions = []
let activeEnemyBulletsExplosions = []

let bullet = {
    speed: 10,
    rof: 250, //higher is lower
    size: 10,
    dmg: 100,
    stamCost: 6
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
let activeEnemyBullets = []
let activeHealthPacks = []

let mousePos = {
    x: 500,
    y: 800
}

let enemyBullets = [{
    speed: 7,
    rof: 1000, //higher is lower
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
    hp: 350,
    bullet: enemyBullets[0]
},
{
    size: 50,
    x: 0,
    y: 0,
    ySpeed: 0.5,
    xSpeed: 2,
    hp: 300,
    bullet: enemyBullets[1]
},
{
    size: 50,
    x: 0,
    y: 0,
    ySpeed: 0.5,
    xSpeed: 2,
    hp: 50,
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
        if (leftTrigger && gunCD == 0 && ship.stamina > bullet.stamCost) fire()
        drawBullets()
        drawRocks()
        rockBulletColl()
        enemyShipBulletColl()
        drawHealthPacks()

        for (let i = 0; i < activeRocks.length; i++)
            shipColl(activeRocks[i], "rock", i)

        for (let i = 0; i < activeShips.length; i++)
            if (shipColl(activeShips[i], "ship", i) && activeShips[i].fireCD == 0) enemyShipFire(activeShips[i])

        for (let i = 0; i < activeHealthPacks.length; i++)
            shipColl(activeHealthPacks[i], "healthPack", i)

        for (let i = 0; i < activeRockExplosions.length; i++)
            drawRockExplosion(activeRockExplosions[i])

        for (let i = 0; i < activeBulletExplosions.length; i++)
            drawBulletExplosion(activeBulletExplosions[i], 1)

        for (let i = 0; i < activeShipExplosions.length; i++) {
            drawShipExplosion(activeShipExplosions[i])
        }

        for (let i = 0; i < activeEnemyBulletsExplosions.length; i++)
            drawBulletExplosion(activeEnemyBulletsExplosions[i], -1)

        for (let i = 0; i < activeEnemyBullets.length; i++) {
            activeEnemyBullets[i].y += activeEnemyBullets[i].speed
            activeEnemyBullets[i].x += activeEnemyBullets[i].speedX
            drawEnemyBullets(i)
            shipColl(activeEnemyBullets[i], "bullet", i)
        }

        ship.stamina += ship.maxStamina * 0.0013
        if (ship.stamina > ship.maxStamina) ship.stamina = ship.maxStamina
        drawStamina()
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
        if (rockGenTime > 200)
            rockGenTime -= 40
        else
            rockGenTime -= rockGenTime / 50
        enemyBullets[0].dmg *= 1.1
        enemyBullets[0].rof -= enemyBullets[0].rof / 50
        enemyShips[0].hp *= 1.06
        ship.maxHP *= 1.1
        ship.hp = (ship.hp / (ship.maxHP / 1.1)) * ship.maxHP
        ship.maxStamina *= 1.02
        ship.stamina = (ship.stamina / (ship.maxStamina / 1.02)) * ship.maxStamina
        bullet.dmg += Math.random() * 10 + 5
        bullet.rof -= bullet.rof / 70
        startIncreaseDifficultyInterval()
    }, 7000)
}

let healthPackInterval
function startHealthPackInterval() {
    healthPackInterval = setTimeout(() => {
        spawnHealthPack()
        startHealthPackInterval()
    }, (Math.random() * (healthPackTimeout / 2)) + healthPackTimeout)
}

function startIntervals() {
    startDrawInterval()
    startStarInterval()
    startRockInterval()
    startEnemyShipInterval()
    startIncreaseDifficultyInterval()
    startHealthPackInterval()
}

startIntervals()

function clearIntervals() {
    clearTimeout(drawInterval)
    clearTimeout(starInterval)
    clearTimeout(rockInterval)
    clearTimeout(enemyShipInterval)
    clearTimeout(increaseDifficultyInterval)
    clearTimeout(healthPackInterval)
    drawInterval = null
    starInterval = null
    rockInterval = null
    enemyShipInterval = null
    increaseDifficultyInterval = null
    healthPackInterval = null
}
