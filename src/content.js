let isRunning = false;
let currentDrawMode = DrawMode.ARROW;
let lastFen = "";

/**
 * Analyzes the chess position if it has changed
 */
function analyzePosition() {
    if (!isRunning) return;

    const pieces = getPieces();
    if (pieces.length === 0) return;

    const fen = getFEN(pieces);
    if (fen !== lastFen) {
        lastFen = fen;
        if (!ChessUtils.validatePosition(fen)) return;
        chrome.runtime.sendMessage({ type: Requests.GET_BEST_MOVE, fen });
    }
}

/**
 * Watches the chessboard for any changes using MutationObserver
 */
function observeBoard() {
    let board = getBoard();

    let timeout;
    const observer = new MutationObserver(() => {
        // debounce to avoid firing too many times during animations
        clearTimeout(timeout);
        timeout = setTimeout(analyzePosition, 250);
    });

    observer.observe(board, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"], // efficiently watch for piece moves
    });
}

// --- Main Initialization and Event Listening ---

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== "local") return;

    if (changes.isRunning) {
        isRunning = changes.isRunning.newValue;
        if (isRunning) {
            analyzePosition();
            chrome.storage.local.get("bestMove", (result) => {
                if (result.bestMove) draw(currentDrawMode, result.bestMove);
            });
        } else {
            draw(currentDrawMode);
        }
    }

    // handle drawMode change by redrawing the current best move
    if (changes.drawMode) {
        currentDrawMode = changes.drawMode.newValue;
        if (isRunning) {
            chrome.storage.local.get("bestMove", (result) => {
                if (result.bestMove) {
                    draw(currentDrawMode, result.bestMove);
                }
            });
        }
    }

    // handle new best move from the engine
    if (changes.bestMove) {
        if (isRunning) {
            draw(currentDrawMode, changes.bestMove.newValue);
        }
    }
});

async function init() {
    const {
        isRunning: initialIsRunning,
        drawMode: initialDrawMode,
        bestMove,
    } = await chrome.storage.local.get([LocalStorage.isRunning, LocalStorage.drawMode, LocalStorage.bestMove]);

    isRunning = initialIsRunning;
    currentDrawMode = initialDrawMode || DrawMode.ARROW;

    observeBoard();

    if (isRunning) {
        analyzePosition();
        if (bestMove) draw(currentDrawMode, bestMove);
    }
}

init();
