const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
context.font = '700 30px gameFont';
const menuScreen = document.getElementById("menu-screen")
const mainTitleDiv = document.getElementById("main-title")
const startButton = document.getElementById("start-button")
const resumeButton = document.getElementById("resume-button")
menuScreen.style.fontSize = (canvas.width / 7) + "px"
document.getElementById("buttons-container").style.fontSize = (canvas.width / 20) + "px"
context.font.fontWeight = 700

let timeSurvived = 0;

canvas.style.zIndex = 0
menuScreen.style.zIndex = 1

function endGame() {
    ship = {
        isDead: true
    }
    setTimeout(() => {
        togglePause()
    }, 1000)
}

function togglePause() {
    startButton.innerText = "Restart"
    resumeButton.style.display = "flex"
    if (ship.isDead) {
        restartGame()
        mainTitleDiv.innerText = "GAME OVER"
        resumeButton.style.display = "none"
    }
    else mainTitleDiv.innerText = "SPACE FIGHTER"
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
    timeSurvived = 0
    score = 0

    mousePos = {
        x: 500,
        y: 700
    }

    ship = {
        x: 500,
        y: 700,
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

    enemyBullets = {
        normal: {
            speed: 7,
            rof: 1000, //higher is lower
            size: 5,
            dmg: 50
        },
    }

    enemyShips = [
        {
            size: 120,
            x: 0,
            y: 0,
            ySpeed: 2,
            xSpeed: 2,
            hp: 350,
            bullet: enemyBullets.normal
        }
    ]

    enemyShipsTimeout = 5000

    starGenTime = 1000
    rockGenTime = 1000
    drawIntervalTime = 14
    healthPackTimeout = 15000
}

startButton.addEventListener("click", () => {
    restartGame()
    togglePause()
})

resumeButton.addEventListener("click", () => {
    togglePause()
})

document.addEventListener("keydown", (e) => {
    if (e.key == "p" || e.key == "P" || e.key == " ")
        togglePause()
    if (e.key == "f" || e.key == "F")
        document.exitFullscreen().catch((err) => {
            document.body.requestFullscreen()
        })
    if (e.key == "F9") {
        if (typeof logFPSInterval === "undefined")
            logFPS()
        else {
            clearInterval(logFPSInterval)
            logFPSInterval = undefined
        }


    }
})

canvas.addEventListener("mousemove", (e) => {
    mousePos.x = (1000 / canvas.offsetWidth) * e.offsetX
    mousePos.y = (1000 / canvas.offsetHeight) * e.offsetY
})

window.addEventListener("mousedown", () => {
    leftTrigger = true
})

window.addEventListener("mouseup", () => {
    leftTrigger = false
})

//let currentTime = Date.now()
function logFPS() {
    frameCounter = 0
    logFPSInterval = setInterval(() => {
        //console.log("time difference: ", Date.now() - currentTime)
        currentTime = Date.now()
        console.log('FPS: ', frameCounter / 2);
        frameCounter = 0
    }, 2000)
}