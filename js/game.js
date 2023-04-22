function drawShip() {
    context.drawImage(shipImg, ship.x - 75, ship.y - 75, 150, 150)
    /*
        context.beginPath()
        context.fillStyle = 'rgb(255,100,50,0.5)'
        context.arc(ship.x - 50, ship.y + 55, 15, 0, Math.PI / 180 * 360)
        context.closePath()
        context.fill()
    
        context.fillStyle = 'rgb(100,100,100,0.5)'
        context.fillRect(ship.x, ship.y + 55, 35, 35)
    */
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
    if (checkDistance(mousePos, ship) < 150) {
        ship.x += (mousePos.x - ship.x) / (ship.speed / 2)
        ship.y += (mousePos.y - ship.y) / (ship.speed / 2)
    }

    else {
        ship.x += (mousePos.x - ship.x) / ship.speed
        ship.y += (mousePos.y - ship.y) / ship.speed
    }

}

function fire() {
    activeBullets.push({
        speed: bullet.speed,
        size: bullet.size,
        dmg: bullet.dmg,
        x: ship.x,
        y: ship.y - 70
    })
    gunCD = setTimeout(() => {
        gunCD = 0
    }, bullet.rof)

    blasterSound.play()
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

function generateRocks() {
    activeRocks.push({
        speed: rock.speed,
        size: Math.random() * (rock.size / 2) + rock.size / 2,
        hp: rock.hp,
        x: Math.random() * 1000,
        y: -50,
        rotation: (Math.random() * 360),
        xSpeed: ((Math.random() * 20) - 10) / 20
    })
}

function drawRocks() {
    for (i = 0; i < activeRocks.length; i++)
        if (activeRocks[i].y > 1050)
            activeRocks.splice(i, 1)
    for (let i = 0; i < activeRocks.length; i++) {
        activeRocks[i].x += activeRocks[i].xSpeed
        activeRocks[i].rotation += 0.5
        context.save()
        context.translate(activeRocks[i].x, activeRocks[i].y)
        context.rotate(Math.PI / 180 * - activeRocks[i].rotation)
        context.drawImage(rockImg, -activeRocks[i].size * 1.6, -activeRocks[i].size * 1.6, activeRocks[i].size * 3.2, activeRocks[i].size * 3.2)
        context.restore()
        /* context.beginPath();
          context.arc(activeRocks[i].x, activeRocks[i].y, activeRocks[i].size / 2 + 5, 0, Math.PI / 180 * 360);
                 context.closePath();
                 context.fillStyle = 'rgba(248, 248, 248,0.5)';
                 context.fill(); 
         */
        // context.fillRect(activeRocks[i].x, activeRocks[i].y, activeRocks[i].size / 2, activeRocks[i].size / 2)
        activeRocks[i].y += activeRocks[i].speed
    }
}

function rockBulletColl() {
    for (let i = 0; i < activeRocks.length; i++)
        for (let j = 0; j < activeBullets.length; j++)
            if (activeRocks[i] && activeBullets[j])
                if (checkDistance(activeRocks[i], activeBullets[j]) < (activeRocks[i].size / 2 + activeBullets[j].size)) {
                    activeRocks[i].hp -= activeBullets[j].dmg
                    if (activeRocks[i].hp <= 0)
                        explodeRock(i)
                    activeBullets.splice(j, 1)
                }
}

function explodeBullet(i) {
}

function explodeRock(i) {
    let explosion = { ...rockExplosionTemplate }
    explosion.x = activeRocks[i].x
    explosion.y = activeRocks[i].y
    explosion.img = new Image();
    explosion.img.src = "img/AsteroidExplode.png"
    explosion.rotation = activeRocks[i].rotation
    explosion.size = activeRocks[i].size

    activeRocks.splice(i, 1)

    activeRockExplosions.push(explosion)
    let int = setInterval(() => {
        explosion.currentframe++
        if (explosion.currentframe >= explosion.totalframes) {
            clearInterval(int)
            activeRockExplosions.splice(i, 1)
        }
    }, 40);

    explosion1Sound.play()
}

function checkDistance(obj1, obj2) {
    return (Math.sqrt(Math.abs((obj1.x - obj2.x) * (obj1.x - obj2.x) + ((obj1.y - obj2.y) * (obj1.y - obj2.y)))))
}

function togglePause() {
    if (drawInterval === null)
        startIntervals()
    else
        clearIntervals()
}

document.addEventListener("keypress", (e) => {
    if (e.key == "p" || e.key == "P")
        togglePause()
})

function shipColl(obj, type, i) {
    let flag = false
    for (let y = 0; y < 40; y++)
        if (checkDistance(obj, { x: ship.x, y: ship.y - 70 + y }) < 5 + obj.size / 2)
            flag = true
    for (let y = 0; y < 40; y++)
        if (checkDistance(obj, { x: ship.x, y: ship.y - 20 + y }) < 20 + obj.size / 2)
            flag = true
    if (checkDistance(obj, { x: ship.x, y: ship.y + 40 }) < 40 + obj.size / 2)
        flag = true
    if (checkDistance(obj, { x: ship.x + 50, y: ship.y + 55 }) < 15 + obj.size / 2 || checkDistance(obj, { x: ship.x - 50, y: ship.y + 55 }) < 15 + obj.size / 2)
        flag = true
    else if (checkDistance(obj, { x: ship.x + 68, y: ship.y + 55 }) < 10 + obj.size / 2 || checkDistance(obj, { x: ship.x - 68, y: ship.y + 55 }) < 10 + obj.size / 2)
        flag = true
    else if (checkDistance(obj, { x: ship.x + 68, y: ship.y + 40 }) < 10 + obj.size / 2 || checkDistance(obj, { x: ship.x - 68, y: ship.y + 40 }) < 10 + obj.size / 2)
        flag = true

    if (flag && type == "rock") {
        explodeRock(i)
    }
}

function animateJetSprite() {
    fireSprite.currentframe++
    context.drawImage(fireSprite.img, fireSprite.currentframe * fireSprite.width, 0, fireSprite.width, fireSprite.height, ship.x - 13, ship.y + 55, fireSprite.width, fireSprite.height)
    if (fireSprite.currentframe >= fireSprite.totalframes) {
        fireSprite.currentframe = 0
    }
}


function drawRockExplosion(explosion) {
    context.save()
    context.translate(explosion.x, explosion.y)
    context.rotate(Math.PI / 180 * - explosion.rotation)
    //context.drawImage(explosion.img, -explosion.size * 1.6, -explosion.size * 1.6, explosion.size * 3.2, explosion.size * 3.2,)
    context.drawImage(explosion.img, explosion.currentframe * explosion.width, 0, explosion.width, explosion.height, -explosion.size * 1.6, -explosion.size * 1.6, explosion.size * 3.2, explosion.size * 3.2)
    context.restore()
}

function drawHP() {

}
