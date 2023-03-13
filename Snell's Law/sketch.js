let incidentAngleRadians, incidentAngleDegrees, slider, lineSize, angleSize, refractedAngleDegrees, realRadiansAngle

function setup() {

  lineSize = 300
  angleSize = 200
  n1Default = 1.0
  n2Default = 1.3

  createCanvas(800, 800)

  slider = createSlider(0, 90, 0, 1)
  n1 = createInput(n1Default.toString());
  n2 = createInput(n2Default.toString());

  slider.position(20, 20)
  n1.position(720, 20);
  n2.position(720, 420);

  n1.size(60, 20);
  n2.size(60, 20);

  n1.style('font-size', '20px')
  n2.style('font-size', '20px')
}

function draw() {
  calculateIncidentAngle()
  setBackground()
  drawIncidentLine()
  drawIncidentAngle()
  refractionIndexes()
  calculateRefractedAngle()
  snellsLaw()
}

function drawIncidentLine() {
  stroke(255, 255, 0)
  strokeWeight(5)
  let startX = incidentAngleRadians < 0 ? lineSize * cos(incidentAngleRadians) + width / 2 : width / 2
  let startY = incidentAngleRadians < 0 ? lineSize * sin(incidentAngleRadians) + height / 2 : height / 2 - lineSize
  line(startX, startY, width / 2, height / 2)
}

function drawIncidentAngle() {
  stroke(0)
  strokeWeight(1)
  noFill()
  textSize(15)
  if (incidentAngleRadians < 0)
    arc(width / 2, height / 2, angleSize, angleSize, incidentAngleRadians, -PI / 2)
  let textX = width / 2 + 15
  let textY = height / 2 - 50
  fill(0)
  text("α₁ = " + (-incidentAngleDegrees).toString() + "º", textX, textY)
}

function refractionIndexes() {
  stroke(1)
  strokeWeight(1)
  fill(0)
  textSize(20)
  text("n₁ = ", 680, 40)
  text("n₂ = ", 680, 440)
}

function setBackground() {
  background(0, 205, 255)
  fill(0, 150, 255)
  stroke(0)
  strokeWeight(1)
  rect(0, height / 2, width, height / 2 - 100)
  fill(255)
  rect(0, height - 100, width, 100)
  drawNormalLine()
}

function drawNormalLine() {
  strokeWeight(0.3)
  stroke(0)
  fill(0)
  for (let i = 0; i < height - 100; i += 20) {
    line(width / 2, i, width / 2, i + 10)
  }
}

function calculateRefractedAngle() {
  let realDegreesAngle = abs(incidentAngleDegrees)
  realRadiansAngle = realDegreesAngle * PI / 180
  if (n2.value() >= n1.value()) {
    let refractedAngle = asin(sin(realRadiansAngle) * n1.value() / n2.value())
    drawRefractedLine(refractedAngle)
    drawRefractedAngle(refractedAngle)
  } else {
    calculateAngleLimit(realRadiansAngle)
  }
}

function drawRefractedLine(refractedAngle) {
  stroke(255, 255, 0)
  strokeWeight(4)
  let endX = lineSize * sin(refractedAngle) + width / 2
  let endY = lineSize * cos(refractedAngle) + height / 2
  line(width / 2, height / 2, endX, endY)
}

function drawRefractedAngle(refractedAngle) {
  stroke(0)
  strokeWeight(1)
  noFill()
  textSize(15)
  if (incidentAngleRadians < 0)
    arc(width / 2, height / 2, angleSize, angleSize, PI / 2 - refractedAngle, PI / 2)
  refractedAngleDegrees = refractedAngle * 180 / PI
  let textX = width / 2 - 70
  let textY = height / 2 + 50
  fill(0)
  text("α₂ = " + nf(refractedAngleDegrees, 0, 1) + "º", textX, textY)
}

function calculateAngleLimit(realRadiansAngle) {
  let limitAngle = asin(n2.value() / n1.value())
  if (limitAngle <= realRadiansAngle) {
    stroke(255, 0, 0)
    strokeWeight(4)
    line(width / 2, height / 2, width / 2 + lineSize, height / 2)
    drawRefractedAngle(PI / 2)
  } else {
    let refractedAngle = asin(sin(realRadiansAngle) * n1.value() / n2.value())
    drawRefractedLine(refractedAngle)
    drawRefractedAngle(refractedAngle)
  }
}

function calculateIncidentAngle() {
  incidentAngleDegrees = -slider.value()
  incidentAngleRadians = incidentAngleDegrees < 0 ? incidentAngleDegrees * PI / 180 - PI / 2 : 0
}

function snellsLaw() {
  textSize(20)
  text("Lei de Snell", 350, 740)

  asin(n2.value() / n1.value()) <= realRadiansAngle ? fill(255,0,0) : fill(0)

    text("n₁sin(α₁) = n₂sin(α₂) ⇔ " + n1.value() + "sin(" + (-incidentAngleDegrees).toString() + "º) = " + n2.value() + "sin(" + nf(refractedAngleDegrees, 0, 1) + "º)", 190, 780)
}