const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
const menuScreen = document.getElementById("menu-screen")
const timeSurvivedDiv = document.getElementById("timeSurvived")
const mainTitleDiv = document.getElementById("main-title")
menuScreen.style.fontSize = (canvas.width / 10) + "px"
document.getElementById("buttons-container").style.fontSize = (canvas.width / 30) + "px"
timeSurvivedDiv.style.fontSize = (canvas.width / 30) + "px"

let timeSurvived = 0;

canvas.style.zIndex = 0
menuScreen.style.zIndex = 1

function endGame() {
    mainTitleDiv.innerText = "GAME OVER"
    togglePause()
}

function togglePause() {
    if (ship.isDead)
        restartGame()
    if (drawInterval === null) {
        startIntervals()
        hideMenu()
    }
    else {
        clearIntervals()
        showMenu()
    }

}

function hideMenu() {
    canvas.style.zIndex = 1
    menuScreen.style.zIndex = 0
}

function showMenu() {
    canvas.style.zIndex = 0
    menuScreen.style.zIndex = 1
}

function restartGame() {
    ship = {
        x: 500,
        y: 800,
        speed: 20,
        hp: 700,
        maxHP: 700,
        stamina: 100,
        maxStamina: 100,
        isDead: false
    }

    bullet = {
        speed: 10,
        rof: 250,
        size: 10,
        dmg: 100,
        stamCost: 6
    }

    activeBullets = []
    activeStars = []
    activeRocks = []
    activeShips = []
    activeEnemyBullets = []
    activeHealthPacks = []

    enemyBullets = [{
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

    enemyShips = [{
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
    }]

    enemyShipsTimeout = 5000

    starGenTime = 1000
    rockGenTime = 1000
    drawIntervalTime = 10
    healthPackTimeout = 15000
}
