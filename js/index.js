const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
const ship = document.getElementById("ship")
const bulletB = document.getElementById("bulletB")
let shipSpeed = 30

let bullet = {
    speed: 10,
    rof: 50,
    size: 10
}

let activeBullets = []

let shipPos = {
    x: 100,
    y: 100
}

let mousePos = {
    x: 100,
    y: 100
}

let drawInterval = setInterval(() => {
    drawShip()
    moveShip()
    drawBullets()
}, 10)

function drawShip() {
    context.clearRect(0, 0, 1000, 1000)
    context.drawImage(ship, shipPos.x - 75, shipPos.y - 75, 150, 150)
}

canvas.addEventListener("mousemove", (e) => {
    mousePos.x = (1000 / canvas.offsetWidth) * e.offsetX
    mousePos.y = (1000 / canvas.offsetHeight) * e.offsetY
})

canvas.addEventListener("click", () => {
    fire()
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
}

function drawBullets() {
    for (let i = 0; i < activeBullets.length; i++) {
        context.drawImage(bulletB, activeBullets[i].x - 75, activeBullets[i].y - 75, 150, 150)
        activeBullets[i].y -= activeBullets[i].speed
        if (activeBullets[i].y < -100)
            activeBullets.splice(i, 1)
    }
}