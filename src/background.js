import { DrawMode, Requests } from "./types/background_types.js";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        isRunning: false,
        drawMode: DrawMode.ARROW,
        bestMove: "",
    });
});

async function setupOffscreenDocument() {
    const offscreenUrl = chrome.runtime.getURL("/src/offscreen.html");
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ["OFFSCREEN_DOCUMENT"],
        documentUrls: [offscreenUrl],
    });

    if (existingContexts.length > 0) return;
    await chrome.offscreen.createDocument({
        url: "/src/offscreen.html",
        reasons: ["WORKERS"],
        justification: "Run the Stockfish chess engine WASM.",
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === Requests.GET_BEST_MOVE) {
        (async () => {
            await setupOffscreenDocument();
            await chrome.runtime.sendMessage({ type: Requests.START_ANALYSIS, fen: request.fen });
        })();
        return;
    } else if (request.type === Requests.STOCKFISH_MOVE) {
        chrome.storage.local.set({ bestMove: request.move });
    }
});
