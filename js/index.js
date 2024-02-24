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
const uiBox = new Image()
uiBox.src = "img/uiBox.png"

let leftTrigger = false
let starGenTime
let rockGenTime
let drawIntervalTime
let healthPackTimeout
let timeSurvivedTimeout
let rockDmgMultiplier
let score

let ship = {
    isDead: true
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

let bullet = {}

let star = {
    speed: 1,
    size: 40
}

let rock = {
    speed: 5,
    size: 100,
    hpMultiplier: 5
}

let activeBullets = []
let activeStars = []
let activeRocks = []
let activeShips = []
let activeEnemyBullets = []
let activeHealthPacks = []

let mousePos = {}

let enemyBullets = []

let enemyShips = []

let enemyShipsTimeout
let gunCD = 0

let drawInterval = null
function startDrawInterval() {
    drawInterval = setTimeout(() => {
        context.clearRect(0, 0, 1000, 1000)
        drawStars()
        if (ship.hp > 0) {
            drawShip()
            animateJetSprite()
        }

        drawHealthPacks()
        drawEnemyShips()
        moveShip()
        if (leftTrigger && gunCD == 0 && ship.stamina > bullet.stamCost) fire()
        drawBullets()
        drawRocks()
        rockBulletColl()
        enemyShipBulletColl()

        for (let i = 0; i < activeRocks.length; i++)
            if (shipColl(activeRocks[i], "rock", i) === "break") {
                animateDeath()
                endGame()
            }

        for (let i = 0; i < activeShips.length; i++) {
            let tmp = shipColl(activeShips[i], "ship", i)
            if (tmp === "break") break
            if (tmp && activeShips[i].fireCD == 0) enemyShipFire(activeShips[i])
        }

        for (let i = 0; i < activeHealthPacks.length; i++)
            if (shipColl(activeHealthPacks[i], "healthPack", i) === "break") {
                animateDeath()
                endGame()
            }


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
            if (shipColl(activeEnemyBullets[i], "bullet", i) === "break") {
                animateDeath()
                endGame()
            }
        }

        ship.stamina += ship.maxStamina * 0.0013
        if (ship.stamina > ship.maxStamina) ship.stamina = ship.maxStamina
        drawUI()
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

function startTimeInterval() {
    timeSurvivedTimeout = setTimeout(() => {
        timeSurvived += 0.1
        startTimeInterval()
    }, 100)
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
        //rockDmgMultiplier *= 1.1
        activeRocks.forEach(rock => {
            rock.hp *= 1.15;
            rock.maxHP *= 1.15;
        });
        startIncreaseDifficultyInterval()
    }, 5000)
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
    startTimeInterval()
}


function clearIntervals() {
    clearTimeout(drawInterval)
    clearTimeout(starInterval)
    clearTimeout(rockInterval)
    clearTimeout(enemyShipInterval)
    clearTimeout(increaseDifficultyInterval)
    clearTimeout(healthPackInterval)
    clearTimeout(timeSurvivedTimeout)
    drawInterval = null
    starInterval = null
    rockInterval = null
    enemyShipInterval = null
    increaseDifficultyInterval = null
    healthPackInterval = null
    timeSurvivedTimeout = null
}
