import { LocalStorage, DrawMode } from "./types/background_types.js";

const runScriptButton = document.getElementById("runScriptButton");
const toggleDrawModeButton = document.getElementById("toggleDrawModeButton");
const drawModeIcon = document.getElementById("drawModeIcon");
const drawModeText = document.getElementById("drawModeText");

let isCurrentlyRunning = false;
let currentDrawMode = DrawMode.ARROW;

function updateUI(isRunning, drawMode) {
    isCurrentlyRunning = isRunning;
    currentDrawMode = drawMode;

    if (isRunning) {
        runScriptButton.textContent = "Switch Off";
        runScriptButton.classList.remove("button-on");
        runScriptButton.classList.add("button-off");
    } else {
        runScriptButton.textContent = "Switch On";
        runScriptButton.classList.remove("button-off");
        runScriptButton.classList.add("button-on");
    }

    if (drawMode === DrawMode.CIRCLE) {
        drawModeIcon.src = "/assets/arrow.png";
        drawModeText.textContent = "Draw Arrows";
    } else {
        drawModeIcon.src = "/assets/circle.png";
        drawModeText.textContent = "Draw Circles";
    }
}

runScriptButton.addEventListener("click", async () => {
    const newIsRunning = !isCurrentlyRunning;
    await chrome.storage.local.set({ isRunning: newIsRunning });
    updateUI(newIsRunning, currentDrawMode);
});

toggleDrawModeButton.addEventListener("click", async () => {
    const newMode = currentDrawMode === DrawMode.CIRCLE ? DrawMode.ARROW : DrawMode.CIRCLE;
    await chrome.storage.local.set({ drawMode: newMode });
    updateUI(isCurrentlyRunning, newMode);
});

const { isRunning, drawMode } = await chrome.storage.local.get([LocalStorage.isRunning, LocalStorage.drawMode]);
updateUI(isRunning, drawMode);
