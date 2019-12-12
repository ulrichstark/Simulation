import { GameCanvas } from "./GameCanvas";
import { World } from "./World";
import { WorldConfig } from "./WorldConfig";
import { WorldRenderer } from "./WorldRenderer";
import { GameInput } from "./GameInput";
import { Actions } from "./Actions";
import { WorldView } from "./WorldView";
import { Tile } from "./Tile";
import { PathAgent } from "./pathfinding/PathAgent";
import { Stopwatch } from "./common/Stopwatch";
import { Timer } from "./common/Timer";

export class Game {
    private worldConfig: WorldConfig;
    private world: World;
    private worldRenderer: WorldRenderer;
    private worldView: WorldView;

    private canvas: GameCanvas;
    private input: GameInput;

    private targetTileHeight: number = 0;

    private playerPosition: Tile;
    private playerTarget: Tile | null = null;
    private playerPath: Tile[] | null = null;
    private pathAgent: PathAgent;
    private playerMoveTimer: Timer;

    constructor(worldConfig: WorldConfig) {
        this.worldConfig = worldConfig;
        this.world = new World(worldConfig);
        this.worldRenderer = new WorldRenderer(this.world);
        this.worldView = {
            positionX: 0,
            positionY: 0
        };

        this.handleAction = this.handleAction.bind(this);

        this.input = new GameInput(this.world, this.handleAction);
        this.canvas = new GameCanvas(this.render.bind(this));

        this.playerPosition = this.world.getTileRandom();
        this.pathAgent = new PathAgent({
            getCost: (from, to, direction) => {
                if (direction.diagonal) {
                    return null;
                }
                const cost = Math.abs(from.height - to.height);

                if (cost >= 2) {
                    return null;
                } else {
                    return 1 + cost * 100;
                }
            },
            getDistance: (from, to) => {
                const dx = from.x - to.x;
                const dy = from.y - to.y;
                return Math.abs(dx) + Math.abs(dy);
            }
        });

        this.playerMoveTimer = new Timer(100, () => {
            if (this.playerPath && this.playerPath.length > 0) {
                const tile = this.playerPath.shift();

                if (tile) {
                    this.playerPosition = tile;
                }
            }
        });
    }

    public mount() {
        this.canvas.mount();
        this.input.mount();
    }

    public unmount() {
        this.canvas.unmount();
        this.input.unmount();
    }

    private handleAction(action: Actions) {
        switch (action.key) {
            case "CAMERA_MOVE": {
                const { deltaX, deltaY } = action;
                this.worldView.positionX -= deltaX;
                this.worldView.positionY -= deltaY;
                break;
            }
            case "TILE_CLICK": {
                this.targetTileHeight = action.targetTile.height;
            }
        }
    }

    private render(deltaTime: number) {
        const { worldConfig, worldRenderer, worldView, canvas, input } = this;
        const { width, height, canvasContext, pointerX, pointerY } = canvas;
        const { tileSize } = worldConfig;

        if (this.playerTarget === null || this.playerPath === null || this.playerPath.length === 0) {
            this.playerTarget = this.world.getTileRandom();
            this.playerPath = this.pathAgent.findPath(this.playerPosition, this.playerTarget);
        } else {
            this.playerMoveTimer.update(deltaTime);
        }

        input.update(pointerX, pointerY, worldView);
        const { hoveredChunk, hoveredTile, isPointerDown } = input;

        if (isPointerDown && hoveredChunk && hoveredTile && hoveredTile.height >= 1) {
            hoveredTile.height = this.targetTileHeight;
            if (hoveredTile.neighbors.TOP) {
                hoveredTile.neighbors.TOP.height = this.targetTileHeight;
                hoveredTile.neighbors.TOP.chunk.invalidate();
            }
            if (hoveredTile.neighbors.BOTTOM) {
                hoveredTile.neighbors.BOTTOM.height = this.targetTileHeight;
                hoveredTile.neighbors.BOTTOM.chunk.invalidate();
            }
            if (hoveredTile.neighbors.LEFT) {
                hoveredTile.neighbors.LEFT.height = this.targetTileHeight;
                hoveredTile.neighbors.LEFT.chunk.invalidate();
            }
            if (hoveredTile.neighbors.RIGHT) {
                hoveredTile.neighbors.RIGHT.height = this.targetTileHeight;
                hoveredTile.neighbors.RIGHT.chunk.invalidate();
            }
            hoveredChunk.invalidate();
        }

        canvasContext.clearRect(0, 0, width, height);
        worldRenderer.render(canvasContext, worldView);

        if (hoveredChunk && hoveredTile) {
            const x = (hoveredTile.globalX + worldView.positionX) * tileSize;
            const y = (hoveredTile.globalY + worldView.positionY) * tileSize;

            canvasContext.lineWidth = 1;
            canvasContext.strokeStyle = "#222";
            canvasContext.strokeRect(x, y, tileSize, tileSize);
        }

        if (this.playerPath) {
            for (const tile of this.playerPath) {
                this.drawCircle(tile, "white", 0.5);
            }
        }

        this.drawCircle(this.playerPosition, "blue", 1);
        this.drawCircle(this.playerTarget, "red", 1);
    }

    private drawCircle(tile: Tile, color: string, size: number) {
        const { worldConfig, worldView, canvas } = this;
        const { canvasContext } = canvas;
        const { tileSize, chunkSize } = worldConfig;

        const x = (tile.chunk.x * chunkSize + tile.x + worldView.positionX) * tileSize;
        const y = (tile.chunk.y * chunkSize + tile.y + worldView.positionY) * tileSize;
        const halfTileSize = tileSize * 0.5;

        canvasContext.fillStyle = color;
        canvasContext.beginPath();
        canvasContext.arc(x + halfTileSize, y + halfTileSize, halfTileSize * size, 0, 2 * Math.PI);
        canvasContext.closePath();
        canvasContext.fill();
    }
}
