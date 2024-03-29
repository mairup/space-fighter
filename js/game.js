function drawShip() {
    !activeEnergyPacks.some(pack => pack.isActive) ? context.drawImage(blueGlowImg, ship.x - 63, ship.y - 20, 130, 130) :
        context.drawImage(blueGlowImg, ship.x - 72, ship.y - 30, 150, 150)
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
    let inactiveEnergyPackFlag = true

    inactiveEnergyPackFlag = !activeEnergyPacks.some(pack => pack.isActive)

    inactiveEnergyPackFlag ? ship.stamina -= bullet.stamCost : {} //if active energy pack is active, don't use stamina
    activeBullets.push({
        speed: bullet.speed,
        size: bullet.size,
        dmg: bullet.dmg,
        x: ship.x,
        y: ship.y - 70
    })

    gunCD = setTimeout(() => {
        gunCD = 0
    }, inactiveEnergyPackFlag ? bullet.rof : bullet.rof / 2)

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

function drawEnemyBullets() {
    for (let j = 0; j < activeEnemyBullets.length; j++) {
        context.save();
        context.translate(activeEnemyBullets[j].x, activeEnemyBullets[j].y);
        context.rotate(Math.PI * activeEnemyBullets[j].rotation);
        context.drawImage(bulletR, -75, -75, 150, 150)
        context.restore();

        if (activeEnemyBullets[j].y > (canvas.height + 100) || activeEnemyBullets[j].x > (canvas.width + 100))// || activeEnemyBullets[j].x < -100)
            activeEnemyBullets.splice(j, 1)
    }
}

function generateStars() {
    activeStars.push({
        speed: star.speed,
        size: (Math.random() * star.size) + star.size,
        x: Math.random() * canvas.width,
        y: -100
    })
}

function drawStars() {
    for (let i = 0; i < activeStars.length; i++) {
        context.drawImage(starImg, activeStars[i].x, activeStars[i].y, activeStars[i].size, activeStars[i].size)
        activeStars[i].y += activeStars[i].speed
        if (activeStars[i].y > (canvas.height + 100))
            activeStars.splice(i, 1)
    }
}

function generateRock() {
    let rockSize = Math.random() * (rock.size / 2) + rock.size / 2 //added rock.size / 2 to make the smallest rock size half of the biggest
    let rotationSpeed = 0
    while (rotationSpeed > -0.5 && rotationSpeed < 0.5)
        rotationSpeed = ((Math.random() * 4) - 2) / 2

    activeRocks.push({
        speed: rock.speed,
        size: rockSize,
        relativeSize: rockSize / rock.size,
        hp: rockSize * rock.hpMultiplier,
        maxHP: rockSize * rock.hpMultiplier,
        x: Math.random() * canvas.width,
        y: -50,
        rotation: (Math.random() * 360),
        rotationSpeed: rotationSpeed,
        xSpeed: ((Math.random() * 30) - 15) / 20
    })
}

function drawRocks() {
    for (i = 0; i < activeRocks.length; i++)
        if (activeRocks[i].y > canvas.height + 100)
            activeRocks.splice(i, 1)
    for (let i = 0; i < activeRocks.length; i++) {
        activeRocks[i].x += activeRocks[i].xSpeed
        activeRocks[i].rotation += activeRocks[i].rotationSpeed
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
                    explodeBullet(j)
                }
}

function enemyShipBulletColl() {
    for (let i = 0; i < activeShips.length; i++)
        for (let j = 0; j < activeBullets.length; j++) {
            if (activeShips[i] && activeBullets[j])
                if (checkDistance(activeShips[i], activeBullets[j]) < (activeShips[i].size / 2 + activeBullets[j].size)) {
                    activeShips[i].hp -= activeBullets[j].dmg
                    if (activeShips[i].hp <= 0)
                        explodeEnemyShip(i)
                    explodeBullet(j)
                }
        }

}

function explodeBullet(i) {
    let explosion = { ...bulletExplosionTemplate }
    explosion.x = activeBullets[i].x
    explosion.y = activeBullets[i].y
    explosion.img = new Image()
    explosion.img.src = "img/Explosion.png"
    explosion.size = activeBullets[i].size

    activeBullets.splice(i, 1)

    activeBulletExplosions.push(explosion)
    let int = setInterval(() => {
        explosion.currentframe++
        if (explosion.currentframe >= explosion.totalframes) {
            clearInterval(int)
            activeBulletExplosions.splice(i, 1)
        }
    }, 30)

    explosion2Sound.play()
}

function explodeEnemyBullet(i) {
    let explosion = { ...bulletExplosionTemplate }
    explosion.x = activeEnemyBullets[i].x
    explosion.y = activeEnemyBullets[i].y
    explosion.img = new Image()
    explosion.img.src = "img/Explosion.png"
    explosion.size = activeEnemyBullets[i].size

    activeEnemyBullets.splice(i, 1)

    activeEnemyBulletsExplosions.push(explosion)
    let int = setInterval(() => {
        explosion.currentframe++
        if (explosion.currentframe >= explosion.totalframes) {
            clearInterval(int)
            activeEnemyBulletsExplosions.splice(i, 1)
        }
    }, 30)

    explosion2Sound.play()
}

function explodeRock(i) {
    score += activeRocks[i].maxHP
    let explosion = { ...rockExplosionTemplate }
    explosion.x = activeRocks[i].x
    explosion.y = activeRocks[i].y
    explosion.img = new Image()
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
    }, 40)

    explosion1Sound.play()
}

function explodeEnemyShip(i) {
    score += activeShips[i].maxHP * 2 //double score for killing a ship
    let explosion = { ...shipExplosionTemplate }
    explosion.x = activeShips[i].x
    explosion.y = activeShips[i].y
    explosion.img = new Image()
    explosion.img.src = "img/Explosion.png"
    explosion.rotation = activeShips[i].rotation
    explosion.size = activeShips[i].size - activeShips[i].size / 3

    activeShips.splice(i, 1)

    activeShipExplosions.push(explosion)
    let int = setInterval(() => {
        explosion.currentframe++
        if (explosion.currentframe >= explosion.totalframes) {
            clearInterval(int)
            activeShipExplosions.splice(i, 1)
        }
    }, 40);

    explosion3Sound.play()
}

function checkDistance(obj1, obj2) {
    if (obj1 && obj2)
        return (Math.sqrt(Math.abs((obj1.x - obj2.x) * (obj1.x - obj2.x) + ((obj1.y - obj2.y) * (obj1.y - obj2.y))))) // 5 zaklepaju???
}


function shipColl(obj, type, i) {
    let bool = true
    let flag = false
    if (obj) {
        for (let y = 0; y <= 40; y += 4)
            if (checkDistance(obj, { x: ship.x, y: ship.y - 70 + y }) < 5 + obj.size / 2)
                flag = true
        for (let y = 0; y <= 40; y += 4)
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
    }


    if (flag && type == "rock") {
        ship.hp -= (activeRocks[i].hp > ship.hp / 10) ? activeRocks[i].hp : ((ship.hp / 10) * (activeRocks[i].hp / (activeRocks[i].relativeSize * activeRocks[i].maxHP)))
        explodeRock(i)
    }

    if (flag && type == "bullet") {
        ship.hp -= activeEnemyBullets[i].dmg
        explodeEnemyBullet(i)
    }

    if (flag && type == "ship") {
        ship.hp -= activeShips[i].hp
        explodeEnemyShip(i)
        bool = false
    }

    if (flag && type == "healthPack")
        pickupHealthPack(i)

    if (flag && type == "energyPack")
        pickupEnergyPack(i)

    if (ship.hp <= 0 && !ship.isDead)
        return "break"

    return bool
}

function animateJetSprite() {
    fireSprite.currentframe++
    context.drawImage(fireSprite.img, fireSprite.currentframe * fireSprite.width, 0, fireSprite.width, fireSprite.height, ship.x - 13, ship.y + 55, fireSprite.width, fireSprite.height)
    if (fireSprite.currentframe >= fireSprite.totalframes)
        fireSprite.currentframe = 0
}


function drawRockExplosion(explosion) {
    context.save()
    context.translate(explosion.x, explosion.y)
    context.rotate(Math.PI / 180 * - explosion.rotation)
    //context.drawImage(explosion.img, -explosion.size * 1.6, -explosion.size * 1.6, explosion.size * 3.2, explosion.size * 3.2,)
    context.drawImage(explosion.img, explosion.currentframe * explosion.width, 0, explosion.width, explosion.height, -explosion.size * 1.6, -explosion.size * 1.6, explosion.size * 3.2, explosion.size * 3.2)
    context.restore()
}

function drawBulletExplosion(explosion, flag) {
    explosion.y -= explosion.currentframe * 1 * flag
    context.save()
    context.translate(explosion.x, explosion.y)
    context.drawImage(explosion.img, explosion.currentframe * explosion.width, 0, explosion.width, explosion.height, -explosion.size * 1.6, -explosion.size * 1.6, explosion.size * 3.2, explosion.size * 3.2)
    context.restore()
}

function drawShipExplosion(explosion) {
    explosion.y += (explosion.currentframe * 1) / 3
    context.save()
    context.translate(explosion.x, explosion.y)
    context.drawImage(explosion.img, explosion.currentframe * explosion.width, 0, explosion.width, explosion.height, -explosion.size, -explosion.size, explosion.size * 2, explosion.size * 2)
    context.restore()
}

function drawHP() {
    context.drawImage(hpTable, canvas.width / 100, canvas.height / 8, canvas.width * 2 / 100, canvas.height * 5 / 6)
    context.fillStyle = 'rgba(65, 214, 45, 0.6)'
    if (ship.hp / ship.maxHP < 0.20) {
        context.fillStyle = 'rgba(214, 56, 45, 0.6)'
        canvas.style.filter = "grayscale(0.4)"
    }
    else
        canvas.style.filter = ""
    context.fillRect(canvas.width * 1.3 / 100, canvas.height * 1.15 / 8, canvas.width * 1.4 / 100, (ship.hp / ship.maxHP) * (canvas.height * 5 / 6) * 0.958)
}

function drawMiniHP() {
    for (i = 0; i < activeRocks.length; i++) {
        context.drawImage(miniHpBar, activeRocks[i].x - activeRocks[i].size * 1.5 / 2, activeRocks[i].y - activeRocks[i].size, activeRocks[i].size * 1.5, 10)
        context.drawImage(miniHpBarBar, activeRocks[i].x - activeRocks[i].size * 1.5 / 2, activeRocks[i].y - activeRocks[i].size, (activeRocks[i].size * 1.5) * (activeRocks[i].hp / activeRocks[i].maxHP), 10)
    }
    for (let i = 0; i < activeShips.length; i++) {
        context.drawImage(miniHpBar, activeShips[i].x - activeShips[i].size / 2, activeShips[i].y - activeShips[i].size / 1.5, activeShips[i].size, 10)
        context.drawImage(miniHpBarBar, activeShips[i].x - activeShips[i].size / 2, activeShips[i].y - activeShips[i].size / 1.5, (activeShips[i].size) * (activeShips[i].hp / activeShips[i].maxHP), 10)
    }
}

function spawnEnemyShip() {
    let originalX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1
    activeShips.push({
        size: enemyShips[0].size,
        originalX: originalX,
        x: originalX,
        y: -enemyShips[0].size,
        xSpeed: enemyShips[0].xSpeed,
        ySpeed: enemyShips[0].ySpeed,
        hp: enemyShips[0].hp,
        maxHP: enemyShips[0].hp,
        bullet: enemyBullets.normal,
        activeBullets: [],
        fireCD: 0
    })
}

function drawEnemyShips() {
    for (let i = 0; i < activeShips.length; i++)
        if (activeShips[i].y > canvas.height + enemyShips[0].size)
            activeShips.splice(i, 1)

    for (let i = 0; i < activeShips.length; i++) {
        context.save()
        context.translate(activeShips[i].x, activeShips[i].y)
        let rotation = Math.atan((activeShips[i].y - ship.y) / (activeShips[i].x - ship.x))
        if ((activeShips[i].x - ship.x) == Math.abs((activeShips[i].x - ship.x)))
            rotation += Math.PI / 2
        else rotation -= Math.PI / 2

        if ((rotation / Math.PI) * 180 > 40)
            rotation = Math.PI / 180 * 40

        else if ((rotation / Math.PI) * 180 < -40)
            rotation = Math.PI / 180 * -40

        context.rotate(rotation)
        context.drawImage(redGlowImg, - activeShips[i].size / 1.6, - activeShips[i].size / 1.4, activeShips[i].size * 1.3, activeShips[i].size * 1.3)
        context.drawImage(enemyShipImg, - activeShips[i].size / 2, - activeShips[i].size / 2, activeShips[i].size, activeShips[i].size)
        context.restore()

        activeShips[i].y += activeShips[i].ySpeed
        if (Math.abs(activeShips[i].x - activeShips[i].originalX) > 100)
            activeShips[i].xSpeed = -activeShips[i].xSpeed
        activeShips[i].x += (Math.abs(activeShips[i].x - activeShips[i].originalX)) > 90 ? activeShips[i].xSpeed / 2 : activeShips[i].xSpeed

        /*
        context.beginPath();
        context.arc(activeShips[i].x, activeShips[i].y, activeShips[i].size / 2, 0, Math.PI / 180 * 360);
        context.fillStyle = 'rgba(214, 56, 45, 0.3)';
        context.fill();
        context.closePath();*/
    }
}

function enemyShipFire(enemyShip) {
    let speedX = (ship.x - enemyShip.x) * 7 / (Math.abs(enemyShip.y - ship.y))
    if (speedX > 5) speedX = 5
    else if (speedX < -5) speedX = -5

    activeEnemyBullets.push({
        speed: enemyShip.bullet.speed,
        size: enemyShip.bullet.size,
        dmg: enemyShip.bullet.dmg,
        x: enemyShip.x + speedX * 5,
        y: enemyShip.y + 30,
        speedX: speedX,
        rotation: -Math.sin(speedX / 20)
    })
    enemyShip.fireCD = setTimeout(() => {
        if (enemyShip)
            enemyShip.fireCD = 0
    }, enemyShip.bullet.rof)

    enemyBlasterSound.play()
}

function spawnHealthPack() {
    activeHealthPacks.push({
        x: Math.random() * (canvas.width * 0.8) + canvas.width * 0.1,
        y: -50,
        size: 50
    })
}

function spawnEnergyPack() {
    activeEnergyPacks.push({
        x: Math.random() * (canvas.width * 0.8) + canvas.width * 0.1,
        y: -50,
        size: 50,
        isActive: false,
        timeout: 300
    })
}

function drawHealthPacks() {
    for (let i = 0; i < activeHealthPacks.length; i++) {
        context.drawImage(whiteGlowImg, activeHealthPacks[i].x - activeHealthPacks[i].size - 5, activeHealthPacks[i].y - activeHealthPacks[i].size, activeHealthPacks[i].size * 2.2, activeHealthPacks[i].size * 2.2)
        context.drawImage(healthPackImg, activeHealthPacks[i].x - activeHealthPacks[i].size / 2, activeHealthPacks[i].y - activeHealthPacks[i].size / 2, activeHealthPacks[i].size, activeHealthPacks[i].size)

        activeHealthPacks[i].y += 1
    }
}

function drawEnergyPacks() {
    for (let i = 0; i < activeEnergyPacks.length; i++) {
        if (activeEnergyPacks[i].isActive) {
            handleActiveEnergyPack();
            activeEnergyPacks[i].timeout--
            if (activeEnergyPacks[i].timeout <= 0) {
                activeEnergyPacks.splice(i, 1)
                ship.speed = defaultShipSpeed
            }
        }
        else {
            context.drawImage(blueGlowImg, activeEnergyPacks[i].x - activeEnergyPacks[i].size - 5, activeEnergyPacks[i].y - activeEnergyPacks[i].size, activeEnergyPacks[i].size * 2.2, activeEnergyPacks[i].size * 2.2)
            context.drawImage(energyPackImg, activeEnergyPacks[i].x - activeEnergyPacks[i].size / 2, activeEnergyPacks[i].y - activeEnergyPacks[i].size / 2, activeEnergyPacks[i].size, activeEnergyPacks[i].size)

            activeEnergyPacks[i].y += 1
        }
    }
}

function handleActiveEnergyPack() {
    ship.stamina += ship.maxStamina * 0.0018
    ship.speed = defaultShipSpeed / 2
}

function pickupHealthPack(i) {

    if (ship.hp != ship.maxHP) {
        if (ship.hp + ship.maxHP / 3 > ship.maxHP)
            ship.hp = ship.maxHP
        else
            ship.hp += ship.maxHP / 3

        activeHealthPacks.splice(i, 1)
        healSound.play()
    }

}

function pickupEnergyPack(i) {
    !activeEnergyPacks[i].isActive && healSound.play()
    activeEnergyPacks[i].isActive = true
    // console.log("picked up energy pack %d", i)
}

function drawStamina() {
    context.drawImage(hpTable, canvas.width / 100 * 97, canvas.height / 8, canvas.width * 2 / 100, canvas.height * 5 / 6)
    context.fillStyle = 'rgba(28, 207, 252, 0.6)'

    if (ship.stamina / ship.maxStamina < 0.3)
        context.fillStyle = 'rgba(18, 125, 151, 0.6)'

    context.fillRect(canvas.width / 100 * 97.33, canvas.height / 8 * 1.15, canvas.width * 1.4 / 100, (ship.stamina / ship.maxStamina) * canvas.height * 5 / 6 * 0.957)
}

function animateDeath() {
    ship.isDead = true
    let explosion = { ...shipExplosionTemplate }
    explosion.x = ship.x
    explosion.y = ship.y
    explosion.img = new Image()
    explosion.img.src = "img/Explosion.png"
    explosion.size = 150

    activeShipExplosions.push(explosion)
    let int = setInterval(() => {
        explosion.currentframe++
        if (explosion.currentframe >= explosion.totalframes) {
            clearInterval(int)
            activeShipExplosions.splice(i, 1)
        }
    }, 40);

    explosion3Sound.play()
}

function drawUI() {
    drawStamina()
    drawMiniHP()
    drawHP()

    context.fillStyle = 'black';
    context.textAlign = 'center';

    context.drawImage(uiBox, canvas.width / 100, canvas.height / 100, canvas.width / 4, canvas.height * 6 / 100)
    context.fillText("Score: " + Math.floor(score), canvas.width / 8 + canvas.width / 100, canvas.height * 50 / 1000, canvas.width / 3);

    context.drawImage(uiBox, canvas.width * 3 / 4 - canvas.width / 100, canvas.height / 100, canvas.width / 4, canvas.height * 6 / 100)
    context.fillText("Time: " + Math.floor(timeSurvived), canvas.width * 7 / 8 - canvas.width / 100, canvas.height * 50 / 1000, canvas.width / 3);
}