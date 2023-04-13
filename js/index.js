const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
const ship = document.getElementById("ship")
let shipSpeed = 20;

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
    moveShip();
}, 10)

function drawShip() {
    context.clearRect(0, 0, 1000, 1000)
    context.drawImage(ship, shipPos.x - 75, shipPos.y - 75, 150, 150)
}

canvas.addEventListener("mousemove", (e) => {
    mousePos = {
        x: (1000 / canvas.offsetWidth) * e.offsetX,
        y: (1000 / canvas.offsetHeight) * e.offsetY
    }
})

function moveShip() {
    if ((mousePos.x - shipPos.x) < 30)
        shipPos.x += Math.ceil((mousePos.x - shipPos.x) / (shipSpeed / 2))
    else
        shipPos.x += Math.ceil((mousePos.x - shipPos.x) / shipSpeed)

    if ((mousePos.y - shipPos.y) < 30)
        shipPos.y += Math.ceil((mousePos.y - shipPos.y) / (shipSpeed / 2))
    else
        shipPos.y += Math.ceil((mousePos.y - shipPos.y) / shipSpeed)
}