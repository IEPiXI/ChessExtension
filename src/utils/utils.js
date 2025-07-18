function getCastleString(pieces) {
    let castleString = "";
    let wk = undefined;
    let bk = undefined;
    for (let element in pieces) {
        let piece = pieces[element];

        let pieceName = piece.piece;
        if (pieceName == "wk") {
            wk = piece;
        } else if (pieceName == "bk") {
            bk = piece;
        }
    }

    let castleWhiteString = "";
    let castleBlackString = "";
    for (let element in pieces) {
        let piece = pieces[element];
        let pieceName = piece.piece;
        let piecePosition = piece.position;
        if (pieceName == "wr") {
            if (wk && wk.position == "51") {
                if (piecePosition == "81") {
                    castleWhiteString = castleWhiteString + "K";
                } else if (piecePosition == "11") {
                    castleWhiteString = castleWhiteString + "Q";
                }
            }
        } else if (pieceName == "br") {
            if (bk && bk.position == "58") {
                if (piecePosition == "88") {
                    castleBlackString = castleBlackString + "k";
                } else if (piecePosition == "18") {
                    castleBlackString = castleBlackString + "q";
                }
            }
        }
    }

    let sortedCastleWhiteString = castleWhiteString.split("").sort().join("");
    let sortedCastleBlackString = castleBlackString.split("").sort().join("");

    castleString = sortedCastleWhiteString + sortedCastleBlackString;

    if (castleString == "") {
        castleString = "-";
    }
    return castleString;
}

function getBoard() {
    const boardNode = document.querySelector(".board, .main-board, #board-layout-main");
    if (!boardNode) return;
    return boardNode;
}

function getPieces() {
    let pieces = [];
    let divs = document.querySelectorAll("div.piece");
    for (let div of divs) {
        if (div.className) {
            let classes = div.className.split(" ");
            let piece = classes.find((c) => c.length == 2);
            let position = classes.find((c) => c.includes("square"));

            if (piece && position) {
                position = position.split("-")[1];
                pieces.push({ piece, position });
            }
        }
    }
    return pieces;
}

function getFEN(pieces) {
    var fenNotation = "";

    for (let i = 8; i >= 1; i--) {
        let counter = 0;
        for (let j = 1; j <= 8; j++) {
            let foundPiece = false;
            let foundPieceName = "";
            for (let element in pieces) {
                let piece = pieces[element];

                let pieceName = piece.piece;
                let piecePosition = piece.position;
                if (piecePosition[0] == j && piecePosition[1] == i) {
                    foundPiece = true;
                    if (pieceName[0] == "w") {
                        foundPieceName = pieceName[1].toUpperCase();
                    } else {
                        foundPieceName = pieceName[1].toLowerCase();
                    }
                }
            }

            if (foundPiece) {
                if (counter > 0) {
                    fenNotation = fenNotation + String(counter);
                    counter = 0;
                }
                fenNotation = fenNotation + foundPieceName;
            } else {
                counter += 1;
            }
            if (j == 8 && counter > 0) {
                fenNotation = fenNotation + String(counter);
            }
        }
        if (i != 1) {
            fenNotation = fenNotation + "/";
        }
    }

    let chessBoardElement = document.getElementsByClassName("board");
    chessBoardElement = chessBoardElement.length > 0 ? chessBoardElement[0] : null;
    let chessBoardElementClassName = chessBoardElement ? chessBoardElement.className.toLowerCase() : "";
    let flipped = chessBoardElementClassName.includes("flipped");

    return fenNotation + (flipped ? " b" : " w") + " " + getCastleString(pieces) + " - 0 1";
}

function drawArrow(svg, points) {
    if (!document.getElementById(DrawMode.ARROW)) {
        let defs = svg.querySelector("defs");
        if (!defs) {
            defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            svg.appendChild(defs);
        }

        // create marker
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", DrawMode.ARROW);
        marker.setAttribute("viewBox", "0 -5 10 10");
        marker.setAttribute("refX", "0");
        marker.setAttribute("refY", "0");
        marker.setAttribute("markerWidth", "2");
        marker.setAttribute("markerHeight", "2");
        marker.setAttribute("orient", "auto");
        marker.setAttribute("markerUnits", "strokeWidth");

        // create path for the marker (arrowhead)
        const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        markerPath.setAttribute("d", "M0,-5L10,0L0,5");
        markerPath.setAttribute("fill", "green");
        markerPath.setAttribute("fill-opacity", "0.5");

        marker.appendChild(markerPath);
        defs.appendChild(marker);
    }

    // create line
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    // shorten the line to accommodate for arrowhead
    const shortenLength = 6;
    const dx = points.to.x - points.from.x;
    const dy = points.to.y - points.from.y;
    const length = Math.sqrt(dx * dx + dy * dy) || 0.0001;
    const shortenX = (dx / length) * shortenLength || 0.0;
    const shortenY = (dy / length) * shortenLength || 0.0;

    line.setAttribute("x1", points.from.x || 0.0);
    line.setAttribute("y1", points.from.y || 0.0);
    line.setAttribute("x2", points.to.x - shortenX || 0.0);
    line.setAttribute("y2", points.to.y - shortenY || 0.0);
    line.setAttribute("stroke", "green");
    line.setAttribute("stroke-width", "3");
    line.setAttribute("stroke-opacity", "0.5");
    line.setAttribute("marker-end", "url(#arrow)");

    svg.appendChild(line);
}

function drawCircle(svg, points) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", DrawMode.CIRCLE);

    circle.setAttribute("cx", points.from.x || 0.0);
    circle.setAttribute("cy", points.from.y || 0.0);
    circle.setAttribute("r", "5");
    circle.setAttribute("fill", "green");
    circle.setAttribute("fill-opacity", "0.5");

    svg.appendChild(circle);
}
function transformMoveToCoordinates(bestMove) {
    const lettersToNumbers = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
    // Adding 6.25 to center the arrow in the square
    const fromX = lettersToNumbers[bestMove[0]] * 12.5 + 6.25;
    const fromY = 100 - parseInt(bestMove[1]) * 12.5 + 6.25;
    const toX = lettersToNumbers[bestMove[2]] * 12.5 + 6.25;
    const toY = 100 - parseInt(bestMove[3]) * 12.5 + 6.25;

    return {
        from: { x: fromX, y: fromY },
        to: { x: toX, y: toY },
    };
}

function draw(drawMode, bestMove = undefined) {
    const svg = document.querySelector("svg.arrows");
    if (svg) {
        const existingElements = svg.querySelectorAll("line, circle");
        if (existingElements) {
            existingElements.forEach((element) => element.remove());
        }
        if (bestMove) {
            let arrowPoints = transformMoveToCoordinates(bestMove);
            if (drawMode === DrawMode.ARROW) {
                drawArrow(svg, arrowPoints);
            } else {
                drawCircle(svg, arrowPoints);
            }
        }
    }
}
