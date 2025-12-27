const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const evalEl = document.getElementById("evaluation");
const focusEl = document.getElementById("focus");
const weightDisplay = document.getElementById("weightDisplay");
const savedList = document.getElementById("savedList");

let savedDesigns = [];

document.querySelectorAll("input").forEach(i =>
    i.addEventListener("input", update)
);

function normalize(a, b, c) {
    const sum = a + b + c || 1;
    return [a / sum, b / sum, c / sum];
}

function update() {
    const speed = +speedInput.value;
    const torque = +torqueInput.value;
    const cost = +costInput.value;

    const wS = Math.max(0, +wSpeed.value);
    const wT = Math.max(0, +wTorque.value);
    const wC = Math.max(0, +wCost.value);

    const [ws, wt, wc] = normalize(wS, wT, wC);

    weightDisplay.textContent =
        `Normalized Weights → Speed: ${(ws*100).toFixed(0)}%, Torque: ${(wt*100).toFixed(0)}%, Cost: ${(wc*100).toFixed(0)}%`;

    const score = (speed * ws + torque * wt) - (cost * wc);
    scoreEl.textContent = score.toFixed(2);

    let evaluation;
    if (torque < 3) evaluation = "Fails torque constraint";
    else if (score >= 6) evaluation = "Well-balanced design";
    else if (score >= 4) evaluation = "Acceptable trade-off";
    else evaluation = "Suboptimal design";

    evalEl.textContent = evaluation;

    let focus;
    if (ws > wt && ws > wc) focus = "Performance-focused";
    else if (wt > ws && wt > wc) focus = "Power-focused";
    else if (wc > ws && wc > wt) focus = "Cost-driven";
    else focus = "Balanced priorities";

    focusEl.textContent = focus;

    drawChart(speed, torque, cost);
}

function drawChart(s, t, c) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const values = [s, t, c];
    const labels = ["Speed", "Torque", "Cost"];
    const colors = ["#0077b6", "#00b4d8", "#adb5bd"];

    const barWidth = 80;

    values.forEach((v, i) => {
        ctx.fillStyle = colors[i];
        ctx.fillRect(80 + i * 120, 240 - v * 20, barWidth, v * 20);
        ctx.fillStyle = "#000";
        ctx.fillText(labels[i], 90 + i * 120, 255);
    });
}

function saveDesign() {
    const name = nameInput.value || `Design ${savedDesigns.length + 1}`;
    savedDesigns.push(`${name} → Score ${scoreEl.textContent}`);
    renderSaved();
}

function renderSaved() {
    savedList.innerHTML = "";
    savedDesigns.forEach(d => {
        const li = document.createElement("li");
        li.textContent = d;
        savedList.appendChild(li);
    });
}

update();
