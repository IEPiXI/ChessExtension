export const LocalStorage = {
    isRunning: "isRunning",
    drawMode: "drawMode",
    bestMove: "bestMove",
};

export const State = {
    INITIALIZING: "initializing",
    READY: "ready",
    THINKING: "thinking",
};

export const StockfishMessage = {
    OK: "uciok",
    READY: "readyok",
    BEST_MOVE: "bestmove",
};

export const StockfishCommand = {
    READY: "isready",
    UCI: "uci",
    POSITION_FEN: "position fen ",
    GO_DEPTH: "go depth ",
};

export const Requests = {
    START_ANALYSIS: "start_analysis",
    GET_BEST_MOVE: "get_best_move",
    STOCKFISH_MOVE: "stockfish_move",
};

export const DrawMode = {
    ARROW: "arrow",
    CIRCLE: "circle",
};
