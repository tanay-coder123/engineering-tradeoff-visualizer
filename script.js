const speed = document.getElementById("speed");
const torque = document.getElementById("torque");
const cost = document.getElementById("cost");

const speedP = document.getElementById("speedPriority");
const torqueP = document.getElementById("torquePriority");
const costP = document.getElementById("costPriority");

const scoreOut = document.getElementById("score");
const evalOut = document.getElementById("evaluation");
const focusOut = document.getElementById("focus");
const statusOut = document.getElementById("priorityStatus");

const designCanvas = document.getElementById("designChart");
const priorityCanvas = document.getElementById("priorityChart");
const dCtx = designCanvas.getContext("2d");
const pCtx = priorityCanvas.getContext("2d");

const designList = document.getElementById("designList");
let savedDesigns = [];

function updateSliderLabels() {
    document.getElementById("speedVal").textContent = speed.value;
    document.getElementById("torqueVal").textContent = torque.value;
    document.getElementById("costVal").textContent = cost.value;
}

function getWeights() {
    const s = Number(speedP.value);
    const t = Number(torqueP.value);
    const c = Number(costP.value);

    if (s < 0 || t < 0 || c < 0) {
        statusOut.textContent = "Priorities cannot be negative";
        statusOut.style.color = "red";
        return null;
    }

    const total = s + t + c;
    if (total !== 100) {
        statusOut.textContent = `Total priority must equal 100 (Current: ${total})`;
        statusOut.style.color = "red";
        return null;
    }

    statusOut.textContent = "Priority distribution valid";
    statusOut.style.color = "green";

    return { speed: s / 100, torque: t / 100, cost: c / 100 };
}

function calculate() {
    const w = getWeights();
    if (!w) return;

    let score =
        speed.value * w.speed +
        torque.value * w.torque -
        cost.value * w.cost;

    if (torque.value < 5) score -= 1;

    scoreOut.textContent = score.toFixed(2);

    if (torque.value < 5) evalOut.textContent = "Fails minimum torque constraint";
    else if (score >= 6) evalOut.textContent = "Well-balanced trade-off";
    else if (score >= 4) evalOut.textContent = "Acceptable trade-off";
    else evalOut.textContent = "Not optimal";

    focusOut.textContent =
        w.speed > w.torque && w.speed > w.cost ? "Speed-prioritized" :
        w.torque > w.speed && w.torque > w.cost ? "Torque-prioritized" :
        w.cost > w.speed && w.cost > w.torque ? "Cost-prioritized" :
        "Balanced";

    drawDesignChart();
    drawPriorityChart();
}

function drawDesignChart() {
    dCtx.clearRect(0, 0, 600, 300);
    const vals = [speed.value, torque.value, cost.value];
    const labels = ["Speed", "Torque", "Cost"];

    vals.forEach((v, i) => {
        dCtx.fillStyle = "#415a77";
        dCtx.fillRect(150 + i * 120, 260 - v * 20, 60, v * 20);
        dCtx.fillStyle = "#000";
        dCtx.fillText(labels[i], 155 + i * 120, 280);
    });
}

function drawPriorityChart() {
    pCtx.clearRect(0, 0, 600, 200);
    const vals = [speedP.value, torqueP.value, costP.value];
    const colors = ["#778da9", "#415a77", "#1b263b"];

    let x = 50;
    vals.forEach((v, i) => {
        pCtx.fillStyle = colors[i];
        pCtx.fillRect(x, 100 - v, 100, v);
        x += 150;
    });
}

document.getElementById("saveBtn").addEventListener("click", () => {
    const name = document.getElementById("designName").value || "Unnamed Design";
    savedDesigns.push({ name, score: Number(scoreOut.textContent) });
    savedDesigns.sort((a, b) => b.score - a.score);
    renderSaved();
});

function renderSaved() {
    designList.innerHTML = "";
    savedDesigns.forEach((d, i) => {
        const div = document.createElement("div");
        div.className = "design-card";
        div.innerHTML = `<strong>${i + 1}. ${d.name}</strong><br>Score: ${d.score}`;
        designList.appendChild(div);
    });
}

[speed, torque, cost, speedP, torqueP, costP].forEach(el =>
    el.addEventListener("input", () => {
        updateSliderLabels();
        calculate();
    })
);

updateSliderLabels();
calculate();
