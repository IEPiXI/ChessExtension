import { StockfishCommand, StockfishMessage, State, Requests } from "./types/background_types.js";

const ANALYSIS_DEPTH = 18;
const STOCKFISH_PATH = "./stockfish/stockfish-nnue-16-no-simd.js";

let engineState;
let stockFishWorker;
let requestedFEN = null;

function initializeStockfishWorker() {
    if (stockFishWorker) stockFishWorker.terminate();
    stockFishWorker = new Worker(STOCKFISH_PATH);
    engineState = State.INITIALIZING;

    stockFishWorker.onmessage = (event) => {
        const message = event.data;

        if (message === StockfishMessage.OK) {
            stockFishWorker.postMessage(StockfishCommand.READY);
        } else if (message === StockfishMessage.READY) {
            engineState = State.READY;
            startAnalysis();
        } else if (message.startsWith(StockfishMessage.BEST_MOVE)) {
            handleBestMove(message);
        }
    };

    stockFishWorker.onerror = (error) => {
        requestedFEN = null;
        initializeStockfishWorker();
    };

    stockFishWorker.postMessage(StockfishCommand.UCI);
}

function onAnalysisRequest(fen) {
    requestedFEN = fen;
    startAnalysis();
}

function startAnalysis() {
    if (engineState === State.READY && requestedFEN) {
        engineState = State.THINKING;

        const fenToAnalyze = requestedFEN;
        requestedFEN = null;

        stockFishWorker.postMessage(StockfishCommand.POSITION_FEN + fenToAnalyze);
        stockFishWorker.postMessage(StockfishCommand.GO_DEPTH + ANALYSIS_DEPTH.toString());
    }
}

function handleBestMove(message) {
    const bestMove = message.split(" ")[1];
    chrome.runtime.sendMessage({ type: Requests.STOCKFISH_MOVE, move: bestMove });

    engineState = State.READY;
    startAnalysis();
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.type === Requests.START_ANALYSIS) onAnalysisRequest(request.fen);
});

initializeStockfishWorker();
