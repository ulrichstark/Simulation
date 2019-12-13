import { GameCanvas } from "./GameCanvas";
import { World } from "./world/World";
import { WorldConfig } from "./world/WorldConfig";
import { WorldRenderer } from "./world/WorldRenderer";
import { GameInput } from "./GameInput";
import { Actions } from "./Actions";
import { WorldView } from "./world/WorldView";
import { PathAgentDefinition } from "./pathfinding/PathAgentDefinition";
import { Creature } from "./creature/Creature";

export class Game {
    private worldConfig: WorldConfig;
    private world: World;
    private worldRenderer: WorldRenderer;
    private worldView: WorldView;

    private canvas: GameCanvas;
    private input: GameInput;

    private targetTileHeight: number = 0;
    private creatures: Creature[] = [];

    constructor(worldConfig: WorldConfig) {
        this.worldConfig = worldConfig;
        this.world = new World(worldConfig);
        this.worldRenderer = new WorldRenderer(this.world);
        this.input = new GameInput(this.world, this.onAction.bind(this));
        this.canvas = new GameCanvas(this.onRender.bind(this), this.onResize.bind(this));
        this.worldView = new WorldView(worldConfig, this.canvas, 0, 0);

        const pathAgentDefinition: PathAgentDefinition = {
            getCost: (from, to) => {
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
        };

        for (let i = 0; i < 10; i++) {
            this.creatures.push(new Creature(this.world, pathAgentDefinition));
        }
    }

    public mount() {
        this.canvas.mount();
        this.input.mount();
    }

    public unmount() {
        this.canvas.unmount();
        this.input.unmount();
    }

    private onAction(action: Actions) {
        switch (action.key) {
            case "CAMERA_MOVE": {
                const { deltaX, deltaY } = action;
                this.worldView.move(deltaX, deltaY);
                break;
            }
            case "TILE_CLICK": {
                this.targetTileHeight = action.targetTile.height;
            }
        }
    }

    private onResize() {
        this.worldView.update();
    }

    private onRender() {
        const { worldConfig, worldRenderer, worldView, canvas, input } = this;
        const { width, height, canvasContext, pointerX, pointerY, deltaTime } = canvas;
        const { tileSize } = worldConfig;

        input.update(pointerX, pointerY, worldView);
        const { hoveredChunk, hoveredTile, isPointerDown } = input;

        if (isPointerDown && hoveredChunk && hoveredTile) {
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

        for (const creature of this.creatures) {
            creature.update(deltaTime);
        }

        canvasContext.clearRect(0, 0, width, height);
        worldRenderer.render(canvas, worldView);

        for (const creature of this.creatures) {
            creature.render(canvasContext, worldView);
        }

        if (hoveredChunk && hoveredTile) {
            const x = hoveredTile.globalX * tileSize + worldView.pixelOffsetX;
            const y = hoveredTile.globalY * tileSize + worldView.pixelOffsetY;

            canvasContext.lineWidth = 1;
            canvasContext.strokeStyle = "#222";
            canvasContext.strokeRect(x, y, tileSize, tileSize);
        }
    }
}
