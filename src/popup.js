import { LocalStorage, DrawMode } from "./types/background_types.js";

const runScriptButton = document.getElementById("runScriptButton");
const toggleDrawModeButton = document.getElementById("toggleDrawModeButton");

let isCurrentlyRunning = false;
let currentDrawMode = DrawMode.ARROW;

function updateUI(isRunning, drawMode) {
    isCurrentlyRunning = isRunning;
    currentDrawMode = drawMode;

    runScriptButton.textContent = isRunning ? "Switch Off" : "Switch On";
    toggleDrawModeButton.textContent = drawMode === DrawMode.CIRCLE ? "Draw Arrows" : "Draw Circles";
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
