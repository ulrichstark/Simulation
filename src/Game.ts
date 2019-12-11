import { GameCanvas } from "./GameCanvas";
import { World } from "./World";
import { WorldConfig } from "./WorldConfig";
import { WorldRenderer } from "./WorldRenderer";
import { GameInput } from "./GameInput";
import { Actions } from "./Actions";
import { WorldView } from "./WorldView";
import { Direction } from "./common/Direction";

export class Game {
    private worldConfig: WorldConfig;
    private world: World;
    private worldRenderer: WorldRenderer;
    private worldView: WorldView;

    private canvas: GameCanvas;
    private input: GameInput;

    private targetTileHeight: number = 0;

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

    private render() {
        const { worldConfig, worldRenderer, worldView, canvas, input } = this;
        const { width, height, canvasContext, pointerX, pointerY } = canvas;
        const { tileSize, chunkSize } = worldConfig;

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
            const x = (hoveredChunk.x * chunkSize + hoveredTile.x + worldView.positionX) * tileSize;
            const y = (hoveredChunk.y * chunkSize + hoveredTile.y + worldView.positionY) * tileSize;

            canvasContext.lineWidth = 1;
            canvasContext.strokeStyle = "#222";
            canvasContext.strokeRect(x, y, tileSize, tileSize);
        }
    }
}
