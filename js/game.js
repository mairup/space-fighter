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

function generateRocks() {
    activeRocks.push({
        speed: rock.speed,
        size: Math.random() * (rock.size / 2) + rock.size / 2,
        hp: rock.hp,
        x: Math.random() * 1000,
        y: -50,
        rotation: (Math.random() * 360)
    })
}

function drawRocks() {
    for (let i = 0; i < activeRocks.length; i++) {
        activeRocks[i].rotation += 0.5
        context.save();
        context.translate(activeRocks[i].x, activeRocks[i].y)
        context.rotate(Math.PI / 180 * - activeRocks[i].rotation)
        context.drawImage(rockImg, -activeRocks[i].size / 2, -activeRocks[i].size / 2, activeRocks[i].size, activeRocks[i].size)
        context.restore()
        //context.fillRect(activeRocks[i].x, activeRocks[i].y, 5, 5)
        activeRocks[i].y += activeRocks[i].speed
        if (activeRocks[i].y > 1100)
            activeRocks.splice(i, 1)
    }
}