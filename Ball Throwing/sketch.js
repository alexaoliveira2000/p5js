let trackPointsX = []
let trackPointsY = []

function setup() {

  createCanvas(900, 700)

  xPosition = 100
  yPosition = 550
  diameter = 30
  initialHeight = 0
  vx = 0
  vy = 0
  distance = 0
  lineEndX = 0
  lineEndY = 0
  fallingDistance = 0
  highestPointX = 0
  highestPointY = 0
  locked = false
  readyToLaunch = false
  hasLaunched = false
  time = 0
  acceleration = 15
  
  slider = createSlider(0, 400, 0, 0.01)
  slider.position(100, 655)
  
  button = createButton('lançar')
  button.position(383, 625)
  button.mousePressed(onClick)
  button2 = createButton('recomeçar')
  button2.position(370, 655)
  button2.mousePressed(restart)
  button2.mouseReleased(restart)
  
}

function draw() {
  
  background(color('#ABF0FA'))

  if (!hasLaunched) {
    // se estiver dentro a cor do círculo fica cinzenta, se não fica branca
    if (mouseIsInside())
      fill(100)
    else
      fill(255)
    strokeWeight(1)
    circle1 = circle(xPosition, yPosition - initialHeight, diameter)

    fill(0)
    stroke(0)
    textSize(20)

    if (!readyToLaunch) {
      angle = -Math.atan2(mouseY - (yPosition - initialHeight), mouseX - xPosition)     
      initialHeight = slider.value()
      textSize(15)
      text(slider.value() + 'm de altura', 240, 675)
    }

    angleDegrees = angle * (180 / PI) + 180
    angleRadians = angleDegrees * (PI / 180)

    drawCartesian()

    // se largar o rato, prende todos os itens como estão
    if (readyToLaunch) { 
      initialHeight = slider.value()
      textSize(15)
      text(slider.value() + 'm de altura', 240, 675)
      
      finalDistance = xPosition + fallingDistance

      drawLine()
      drawXAxis()
      drawYAxis()
      drawAngle()
      movementEquations()
      drawInformation()

    } else if (locked) {

      distance = sqrt(pow(mouseX - xPosition, 2) + pow(mouseY - (yPosition - initialHeight), 2))
      
      
      
      /*
      if (distance * angleDegrees > 45*82) {
         distance = 82 
      }
      */

      lineEndX = xPosition + cos(angle) * (-distance)
      lineEndY = yPosition - initialHeight + sin(angle) * distance

      movementEquations()
      drawInformation()
      throwingInformation()
      highestAndFurthestDistance()

    } else {

      initialMovementEquations()

    }

  } else {

    movementEquations()

    vx = distance * cos(angleRadians)
    vy = distance * sin(angleRadians)
    if (xPosition + vx * time < finalDistance) {
      time += 0.1

      fill(255)
      stroke(4)
      textSize(20)
      strokeWeight(1)
      circle1 = circle(xPosition + vx * time, yPosition - (initialHeight + vy * time - (1 / 2) * acceleration * pow(time, 2)), diameter)

      highestAndFurthestDistance()
      trajectory()

    } else {
      fill(255)
      stroke(4)
      textSize(20)
      strokeWeight(1)
      circle1 = circle(finalDistance, yPosition, diameter)
      button2.show()

      highestAndFurthestDistance()
      trajectory()
    }

    highestAndFurthestDistance()
    drawCartesian()

  }

}

















function drawLine() {

  fill(255, 0, 0)
  stroke(4)
  textSize(10)
  strokeWeight(1)
  line1 = line(xPosition, yPosition - initialHeight, lineEndX, lineEndY)

  push()
  translate(lineEndX, lineEndY)
  rotate(-angleRadians + PI / 1.8)
  arrowLine1 = line(0, 0, 8, 8)
  pop()
  push()
  translate(lineEndX, lineEndY)
  rotate(-angleRadians - PI / 0.95)
  arrowLine1 = line(0, 0, 8, 8)
  pop()
}

function drawAngle() {
  noFill()
  fill(200, 0, 0)
  arc1 = arc(xPosition, yPosition - initialHeight, distance * 0.5, distance * 0.5, -angleRadians, 0)
}

function drawXAxis() {
  xAxisLine = line(xPosition, yPosition - initialHeight, lineEndX, yPosition - initialHeight)
  push()
  translate(lineEndX, yPosition - initialHeight)
  rotate(3)
  xAxisArrow1 = line(0, 0, 6, 6)
  pop()
  push()
  translate(lineEndX, yPosition - initialHeight)
  rotate(1.6)
  xAxisArrow2 = line(0, 0, 6, 6)
  pop()
}

function drawYAxis() {
  fill(255)
  yAxisLine = line(xPosition, yPosition, xPosition, lineEndY)
  push()
  translate(xPosition, lineEndY)
  rotate(1.5)
  yAxisArrow1 = line(0, 0, 6, 6)
  pop()
  push()
  translate(xPosition, lineEndY)
  rotate(6.4)
  yAxisArrow2 = line(0, 0, 6, 6)
  pop()
}

function mouseDragged() {
  if (mouseIsInside()) {
    locked = true
  }
}

function mousePressed() {
  mouseDragged()
}

function mouseReleased() {
  if (locked) {
    locked = false
    readyToLaunch = true
  }
}

function mouseIsInside() {
  return sqrt(pow(mouseX - xPosition, 2) + pow(mouseY - (yPosition - initialHeight), 2)) < diameter / 2
}

function drawInformation() {

  if (angleDegrees < 90) {
    fill(0)
    stroke(0)
    textSize(15)
    velocity = text('v = ' + nf(distance, 0, 2) + ' m/s', lineEndX + 2, lineEndY + 2)
  }

  // só mostra o eixo das ordenadas quando a seta está no 1º ou 2º quadrante (sen positivo)
  if (angleDegrees <= 180) {
    vy = text('vy', xPosition - 15, (lineEndY + yPosition) / 2)
  }

  highestAndFurthestDistance()
}

function onClick() {
  if (readyToLaunch) {
    hasLaunched = true
    button.hide()
  }
}

function restart() {
  isLocked = false
  hasLaunched = false
  locked = false
  readyToLaunch = false
  vx = 0
  vy = 0
  distance = 0
  lineEndX = 0
  lineEndY = 0
  time = 0
  button.show()
  trackPointsX.length = 0
  trackPointsY.length = 0
}

function trajectory() {
  fill(0)
  stroke(1)
  textSize(20)
  strokeWeight(2)
  trackPointsX.push(xPosition + vx * time)
  trackPointsY.push(yPosition - (initialHeight + vy * time - (1 / 2) * acceleration * pow(time, 2)))
  for (let i = 0; i < trackPointsX.length; i++) {
    point(trackPointsX[i], trackPointsY[i])
  }
}

function initialMovementEquations() {
  fill(0)
  stroke(4)
  textSize(15)
  strokeWeight(1)
  distance = 0
  Xequation = text('x(t) = 0 (m/s)', 500, 640)
  if (initialHeight > 0) {
    Yequation = text('y(t) = ' + initialHeight + ' - 1/2 · 9.8 · t² (m/s)', 500, 670)
  } else {
    Yequation = text('y(t) = - 1/2 · 9.8 · t² (m/s)', 500, 670)
  }

  fill(255, 0, 0)
  angleText = text('Θ = 0° = 0 rad', 100, 635)
}

function movementEquations() {
  fill(0)
  stroke(4)
  textSize(15)
  strokeWeight(1)
  Xequation = text('x(t) = ' + nf(distance, 0, 2) + ' · cos(' + nf(angleDegrees, 0, 2) + '°) · t  (m/s)', 500, 640)
  
  if (initialHeight > 0) {
  Yequation = text('y(t) = ' + initialHeight + ' + ' + nf(distance, 0, 2) + ' · sin(' + nf(angleDegrees, 0, 2) + '°) · t - 1/2 · 9.8 · t² (m/s)', 500, 670)
  } else {
    Yequation = text('y(t) = ' + nf(distance, 0, 2) + ' · sin(' + nf(angleDegrees, 0, 2) + '°) · t - 1/2 · 9.8 · t² (m/s)', 500, 670)
  }

  fill(255, 0, 0)
  angleText = text('Θ = ' + nf(angleDegrees, 0, 2) + '° = ' + nf(angleRadians, 0, 2) + ' rad', 100, 635)
}

function drawCartesian() {
  fill(100)
  stroke(3)
  textSize(15)
  strokeWeight(0.5)
  yAxis = line(xPosition, yPosition - 480, xPosition, yPosition)
  xAxis = line(xPosition, yPosition, width - 100, yPosition)

  push()
  translate(xPosition, yPosition - 480)
  rotate(1.5)
  line(0, 0, 6, 6)
  pop()
  push()
  translate(xPosition, yPosition - 480)
  rotate(0)
  line(0, 0, 6, 6)
  pop()
  text('y(m)', xPosition - 40, yPosition - 480)
  push()
  translate(width - 100, yPosition)
  rotate(1.5)
  line(0, 0, 6, 6)
  pop()
  push()
  translate(width - 100, yPosition)
  rotate(3)
  line(0, 0, 6, 6)
  pop()
  text('x(m)', width - 100, yPosition + 20)

  line(xPosition - 5, yPosition - 100, xPosition + 5, yPosition - 100)
  line(xPosition - 5, yPosition - 200, xPosition + 5, yPosition - 200)
  line(xPosition - 5, yPosition - 300, xPosition + 5, yPosition - 300)
  line(xPosition - 5, yPosition - 400, xPosition + 5, yPosition - 400)
  line(xPosition + 100, yPosition - 5, xPosition + 100, yPosition + 5)
  line(xPosition + 200, yPosition - 5, xPosition + 200, yPosition + 5)
  line(xPosition + 300, yPosition - 5, xPosition + 300, yPosition + 5)
  line(xPosition + 400, yPosition - 5, xPosition + 400, yPosition + 5)
  line(xPosition + 500, yPosition - 5, xPosition + 500, yPosition + 5)
  line(xPosition + 600, yPosition - 5, xPosition + 600, yPosition + 5)

  textSize(10)
  text('100', xPosition - 30, yPosition - 97)
  text('200', xPosition - 30, yPosition - 197)
  text('300', xPosition - 30, yPosition - 297)
  text('400', xPosition - 30, yPosition - 397)
  text('100', xPosition + 92, yPosition + 20)
  text('200', xPosition + 192, yPosition + 20)
  text('300', xPosition + 292, yPosition + 20)
  text('400', xPosition + 392, yPosition + 20)
  text('500', xPosition + 492, yPosition + 20)
  text('600', xPosition + 592, yPosition + 20)

}

function throwingInformation() {
  // desenha a linha diagonal quando está no 1º quadrante
  //if (angleDegrees < 90) {
    strokeWeight(2)
    drawLine()
    strokeWeight(1)
    drawAngle()
  //}
  // só mostra o eixo das abcissas quando a seta está no 1º ou 4º quadrante (cos positivo)
  //if (angleDegrees <= 90 || angleDegrees >= 270) {
    drawXAxis()
  //}

  // só mostra o eixo das ordenadas quando a seta está no 1º ou 2º quadrante (sen positivo)
  //if (angleDegrees <= 180) {
    drawYAxis()
  //}
}

function highestAndFurthestDistance() {
  vx = distance * cos(angleRadians)
  vy = distance * sin(angleRadians)

  // calcular onde a bola vai cair (primeiro calcular o tempo com a fórmula resolvente)
  fallingTimePositive = (-vy + sqrt(pow(vy, 2) - 4 * (-1 / 2) * acceleration * initialHeight)) / (2 * (-1 / 2) * acceleration)
  fallingTimeNegative = (-vy - sqrt(pow(vy, 2) - 4 * (-1 / 2) * acceleration * initialHeight)) / (2 * (-1 / 2) * acceleration)

  fallingDistance = 0
  if (fallingTimePositive > 0) {
    fallingDistance = vx * fallingTimePositive
  } else if (fallingTimeNegative > 0) {
    fallingDistance = vx * fallingTimeNegative
  }

  // calcular o ponto mais alto da trajetória (igualar a função vy(t) a 0)
  highestPointTime = vy / acceleration
  highestPointX = vx * highestPointTime
  highestPointY = initialHeight + vy * highestPointTime - (1 / 2) * acceleration * pow(highestPointTime, 2)

  // ponto mais alto
  if (angleDegrees <= 90) {
    fill(0)
    stroke(4)
    textSize(20)
    strokeWeight(5)
    highestPoint = point(100 + highestPointX, yPosition - highestPointY)
    fill(0)
    stroke(4)
    textSize(10)
    strokeWeight(1)
    text('y = ' + nf(highestPointY, 0, 2) + 'm', xPosition + highestPointX - 20, yPosition - highestPointY - 10)
  } else {
    fill(0)
    stroke(4)
    textSize(20)
    strokeWeight(5)
    highestPoint = point(100, 600 - highestPointY)
    fill(0)
    stroke(4)
    textSize(10)
    strokeWeight(1)
    text('y = ' + nf(highestPointY, 0, 2) + 'm', 100 - 20, 600 - highestPointY - 10)
    angleDegrees = 90
    angleRadians = 90
  }


  // ponto mais longe
  if (angleDegrees <= 90 || angleDegrees >= 270) {
    fill(0)
    stroke(4)
    textSize(20)
    strokeWeight(5)
    distancePoint = point(100 + fallingDistance, yPosition)
    fill(0)
    stroke(4)
    textSize(10)
    strokeWeight(1)
    text('x = ' + nf(fallingDistance, 0, 2) + 'm', 100 + fallingDistance - 20, yPosition + 20)
  }
}