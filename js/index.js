const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
const ship = document.getElementById("ship")
const bulletB = document.getElementById("bulletB")
const starImg = document.getElementById("star")
let shipSpeed = 30
let leftTrigger = false

var fireSprite = { img: null, x: 0, y: 0, width: 28, height: 60, currentframe: 0, totalframes: 9 }

fireSprite.img = new Image();
fireSprite.img.src = "img/fireSprite3.png";

let bullet = {
    speed: 10,
    rof: 200, //higher is lower
    size: 10
}

let star = {
    speed: 1,
    size: 40
}

let activeBullets = []
let activeStars = []

let shipPos = {
    x: 500,
    y: 800
}

let mousePos = {
    x: 500,
    y: 800
}

let gunCD = 0;

let starInterval = setInterval(() => {
    generateStars()
}, (Math.random() * 1000) + 1000)

let drawInterval = setInterval(() => {
    context.clearRect(0, 0, 1000, 1000)
    drawStars()
    drawShip()
    animateJetSprite()
    moveShip()
    if (leftTrigger && gunCD == 0) fire()
    drawBullets()
}, 10)

function drawShip() {
    context.drawImage(ship, shipPos.x - 75, shipPos.y - 75, 150, 150)
}

canvas.addEventListener("mousemove", (e) => {
    mousePos.x = (1000 / canvas.offsetWidth) * e.offsetX
    mousePos.y = (1000 / canvas.offsetHeight) * e.offsetY
})

canvas.addEventListener("mousedown", () => {
    leftTrigger = true
})

canvas.addEventListener("mouseup", () => {
    leftTrigger = false
})

canvas.addEventListener("mouseout", () => {
    leftTrigger = false
})

function moveShip() {
    if (Math.sqrt(Math.abs((mousePos.x - shipPos.x) * (mousePos.x - shipPos.x) - ((mousePos.y - shipPos.y) * (mousePos.y - shipPos.y)))) < 100) {
        shipPos.x += (mousePos.x - shipPos.x) / (shipSpeed / 2)
        shipPos.y += (mousePos.y - shipPos.y) / (shipSpeed / 2)
    }

    else {
        shipPos.x += (mousePos.x - shipPos.x) / shipSpeed
        shipPos.y += (mousePos.y - shipPos.y) / shipSpeed
    }

}

function fire() {
    activeBullets.push({
        speed: bullet.speed,
        size: bullet.size,
        x: shipPos.x,
        y: shipPos.y - 70
    })
    gunCD = setTimeout(() => {
        gunCD = 0
    }, bullet.rof)
}

function drawBullets() {
    for (let i = 0; i < activeBullets.length; i++) {
        context.drawImage(bulletB, activeBullets[i].x - 75, activeBullets[i].y - 75, 150, 150)
        activeBullets[i].y -= activeBullets[i].speed
        if (activeBullets[i].y < -100)
            activeBullets.splice(i, 1)
    }
}

function generateStars() {
    activeStars.push({
        speed: star.speed,
        size: (Math.random() * star.size) + star.size,
        x: Math.random() * 1000,
        y: -100
    })
}

function drawStars() {
    for (let i = 0; i < activeStars.length; i++) {
        context.drawImage(starImg, activeStars[i].x, activeStars[i].y, activeStars[i].size, activeStars[i].size)
        activeStars[i].y += activeStars[i].speed
        if (activeStars[i].y > 1100)
            activeStars.splice(i, 1)
    }
}

function animateJetSprite() {
    fireSprite.currentframe++;

    context.drawImage(fireSprite.img, fireSprite.currentframe * fireSprite.width, 0, fireSprite.width, fireSprite.height, shipPos.x - 13, shipPos.y + 55, fireSprite.width, fireSprite.height);


    if (fireSprite.currentframe >= fireSprite.totalframes) {
        fireSprite.currentframe = 0;
    }
}