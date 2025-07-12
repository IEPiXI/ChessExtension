const ChessUtils = {
    validatePosition(fen) {
        const fenParts = fen.split(" ");
        if (fenParts.length < 2) {
            throw new Error("Invalid FEN string: Missing active color part.");
        }

        const board = this._parseFenToBoard(fenParts[0]);
        const activeColor = fenParts[1];
        if (activeColor !== "w" && activeColor !== "b") {
            throw new Error(`Invalid FEN string: Invalid active color "${activeColor}".`);
        }
        const inactiveColor = activeColor === "w" ? "b" : "w";
        if (this._isKingInCheck(board, inactiveColor)) {
            return false;
        }
        return true;
    },

    _isKingInCheck(board, color) {
        const kingPiece = color === "w" ? "K" : "k";
        const kingPos = this._findPiece(board, kingPiece);
        if (!kingPos) return false;

        const opponent = {
            pawn: color === "w" ? "p" : "P",
            knight: color === "w" ? "n" : "N",
            bishop: color === "w" ? "b" : "B",
            rook: color === "w" ? "r" : "R",
            queen: color === "w" ? "q" : "Q",
            king: color === "w" ? "k" : "K",
        };

        // check knight
        const knightMoves = [
            [-2, -1],
            [-2, 1],
            [-1, -2],
            [-1, 2],
            [1, -2],
            [1, 2],
            [2, -1],
            [2, 1],
        ];

        for (const [dr, dc] of knightMoves) {
            const r = kingPos.r + dr;
            const c = kingPos.c + dc;
            if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === opponent.knight) return true;
        }

        // check pawn
        const pawnDir = color === "w" ? -1 : 1;
        const pawnAttacks = [
            [pawnDir, -1],
            [pawnDir, 1],
        ];
        for (const [dr, dc] of pawnAttacks) {
            const r = kingPos.r + dr;
            const c = kingPos.c + dc;
            if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === opponent.pawn) return true;
        }

        // check other directional pieces
        const directions = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
        ];
        for (const [dr, dc] of directions) {
            for (let i = 1; i < 8; i++) {
                const r = kingPos.r + i * dr;
                const c = kingPos.c + i * dc;
                if (r < 0 || r >= 8 || c < 0 || c >= 8) break;
                const piece = board[r][c];
                if (piece) {
                    const isDiagonal = dr !== 0 && dc !== 0;
                    if (isDiagonal) {
                        if (piece === opponent.bishop || piece === opponent.queen) return true;
                    } else {
                        if (piece === opponent.rook || piece === opponent.queen) return true;
                    }
                    break;
                }
            }
        }

        // check king
        const kingMoves = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
        ];
        for (const [dr, dc] of kingMoves) {
            const r = kingPos.r + dr;
            const c = kingPos.c + dc;
            if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === opponent.king) return true;
        }

        return false;
    },

    _parseFenToBoard(fenPieces) {
        const board = Array(8)
            .fill(null)
            .map(() => Array(8).fill(null));
        const ranks = fenPieces.split("/");
        for (let r = 0; r < 8; r++) {
            let c = 0;
            for (const char of ranks[r]) {
                if (isNaN(char)) {
                    board[r][c] = char;
                    c++;
                } else {
                    c += parseInt(char, 10);
                }
            }
        }
        return board;
    },

    _findPiece(board, piece) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (board[r][c] === piece) return { r, c };
            }
        }
        return null;
    },
};
