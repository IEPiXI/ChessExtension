const LocalStorage = {
    isRunning: "isRunning",
    drawMode: "drawMode",
    bestMove: "bestMove",
};

const State = {
    INITIALIZING: "initializing",
    READY: "ready",
    THINKING: "thinking",
};

const StockfishMessage = {
    OK: "uciok",
    READY: "readyok",
    BEST_MOVE: "bestmove",
};

const StockfishCommand = {
    READY: "isready",
    UCI: "uci",
    POSITION_FEN: "position fen ",
    GO_DEPTH: "go depth ",
};

const Requests = {
    START_ANALYSIS: "start_analysis",
    GET_BEST_MOVE: "get_best_move",
    STOCKFISH_MOVE: "stockfish_move",
};

const DrawMode = {
    ARROW: "arrow",
    CIRCLE: "circle",
};
