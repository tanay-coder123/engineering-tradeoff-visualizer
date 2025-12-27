const speed = document.getElementById("speed");
const torque = document.getElementById("torque");
const cost = document.getElementById("cost");

const wSpeed = document.getElementById("wSpeed");
const wTorque = document.getElementById("wTorque");
const wCost = document.getElementById("wCost");

const speedVal = document.getElementById("speedVal");
const torqueVal = document.getElementById("torqueVal");
const costVal = document.getElementById("costVal");

const scoreEl = document.getElementById("score");
const evalEl = document.getElementById("evaluation");
const focusEl = document.getElementById("focus");
const weightDisplay = document.getElementById("weightDisplay");

const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

const savedList = document.getElementById("saved");
let saved = [];

document.querySelectorAll("input").forEach(i =>
    i.addEventListener("input", update)
);

function normalize(a, b, c) {
    const sum = a + b + c || 1;
    return [a / sum, b / sum, c / sum];
}

function update() {
    speedVal.textContent = speed.value;
    torqueVal.textContent = torque.value;
    costVal.textContent = cost.value;

    const [ws, wt, wc] = normalize(
        +wSpeed.value,
        +wTorque.value,
        +wCost.value
    );

    weightDisplay.textContent =
        `Weights → Speed ${(ws*100).toFixed(0)}%, Torque ${(wt*100).toFixed(0)}%, Cost ${(wc*100).toFixed(0)}%`;

    const score =
        speed.value * ws +
        torque.value * wt -
        cost.value * wc;

    scoreEl.textContent = score.toFixed(2);

    if (torque.value < 3) evalEl.textContent = "Fails minimum torque constraint";
    else if (score >= 6) evalEl.textContent = "Well-balanced design";
    else if (score >= 4) evalEl.textContent = "Acceptable trade-off";
    else evalEl.textContent = "Suboptimal design";

    if (ws > wt && ws > wc) focusEl.textContent = "Performance-focused";
    else if (wt > ws && wt > wc) focusEl.textContent = "Power-focused";
    else if (wc > ws && wc > wt) focusEl.textContent = "Cost-driven";
    else focusEl.textContent = "Balanced";

    drawChart();
}

function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const vals = [speed.value, torque.value, cost.value];
    const labels = ["Speed", "Torque", "Cost"];
    const colors = ["#0077b6", "#00b4d8", "#adb5bd"];

    vals.forEach((v, i) => {
        ctx.fillStyle = colors[i];
        ctx.fillRect(100 + i*140, 260 - v*20, 80, v*20);
        ctx.fillStyle = "#000";
        ctx.fillText(labels[i], 110 + i*140, 280);
    });
}

function saveDesign() {
    saved.push(`Design ${saved.length + 1}: Score ${scoreEl.textContent}`);
    savedList.innerHTML = saved.map(d => `<li>${d}</li>`).join("");
}

update();
