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

const canvas = document.getElementById("barChart");
const ctx = canvas.getContext("2d");
const designList = document.getElementById("designList");

let savedDesigns = [];

function updateValues() {
    document.getElementById("speedVal").textContent = speed.value;
    document.getElementById("torqueVal").textContent = torque.value;
    document.getElementById("costVal").textContent = cost.value;
}

function getWeights() {
    const total =
        Number(speedP.value) +
        Number(torqueP.value) +
        Number(costP.value);

    if (total !== 100) {
        statusOut.textContent = `Total priority must equal 100 (Current: ${total})`;
        statusOut.style.color = "red";
        return null;
    }

    statusOut.textContent = "Priority distribution valid";
    statusOut.style.color = "green";

    return {
        speed: speedP.value / 100,
        torque: torqueP.value / 100,
        cost: costP.value / 100
    };
}

function calculate() {
    const weights = getWeights();
    if (!weights) return;

    let score =
        speed.value * weights.speed +
        torque.value * weights.torque -
        cost.value * weights.cost;

    if (torque.value < 5) score -= 1;

    scoreOut.textContent = score.toFixed(2);

    if (torque.value < 5) evalOut.textContent = "Fails minimum torque constraint";
    else if (score >= 6) evalOut.textContent = "Well-balanced trade-off";
    else if (score >= 4) evalOut.textContent = "Acceptable trade-off";
    else evalOut.textContent = "Not optimal";

    if (weights.speed > weights.torque && weights.speed > weights.cost)
        focusOut.textContent = "Speed-prioritized";
    else if (weights.torque > weights.speed && weights.torque > weights.cost)
        focusOut.textContent = "Torque-prioritized";
    else if (weights.cost > weights.speed && weights.cost > weights.torque)
        focusOut.textContent = "Cost-prioritized";
    else focusOut.textContent = "Balanced";

    drawChart();
}

function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const values = [speed.value, torque.value, cost.value];
    const labels = ["Speed", "Torque", "Cost"];

    values.forEach((v, i) => {
        ctx.fillStyle = "#003566";
        ctx.fillRect(150 + i * 120, 260 - v * 20, 60, v * 20);
        ctx.fillStyle = "#000";
        ctx.fillText(labels[i], 160 + i * 120, 280);
    });
}

document.getElementById("saveBtn").addEventListener("click", () => {
    const name =
        document.getElementById("designName").value || "Unnamed Design";

    savedDesigns.push({
        name,
        score: Number(scoreOut.textContent)
    });

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
        updateValues();
        calculate();
    })
);

updateValues();
calculate();
