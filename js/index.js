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
