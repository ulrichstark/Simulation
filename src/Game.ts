import { GameCanvas } from "./GameCanvas";
import { World } from "./world/World";
import { GameConfig } from "./GameConfig";
import { WorldRenderer } from "./world/WorldRenderer";
import { GameInput } from "./GameInput";
import { Actions } from "./Actions";
import { WorldView } from "./world/WorldView";
import { PathAgentDefinition } from "./pathfinding/PathAgentDefinition";
import { Creature } from "./creature/Creature";

export class Game {
    private world: World;
    private worldRenderer: WorldRenderer;
    private worldView: WorldView;

    private canvas: GameCanvas;
    private input: GameInput;

    private targetTileHeight: number = 0;
    private creatures: Creature[] = [];

    constructor() {
        this.world = new World();
        this.worldRenderer = new WorldRenderer(this.world);
        this.input = new GameInput(this.world, this.onAction.bind(this));
        this.canvas = new GameCanvas(this.onRender.bind(this), this.onResize.bind(this));
        this.worldView = new WorldView(this.canvas, 0, 0);

        const pathAgentDefinition: PathAgentDefinition = {
            getCost: (from, to) => {
                if (to.waterLevel > 1) {
                    return null;
                }
                const heightDifference = Math.abs(from.height - to.height);

                if (heightDifference >= 2) {
                    return null;
                } else {
                    const cost = heightDifference;
                    if (from.isDiagonalTo(to)) {
                        return cost + 1;
                    } else {
                        return cost;
                    }
                }
            },
            getDistance: (from, to) => {
                return from.getDistanceTo(to);
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
                const speed = GameConfig.cameraMovementSpeed * this.canvas.deltaTime;
                const { deltaX, deltaY } = action;
                this.worldView.move(deltaX * speed, deltaY * speed);
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
        const { world, worldRenderer, worldView, canvas, input, creatures, targetTileHeight } = this;
        const { width, height, canvasContext, pointerX, pointerY, deltaTime } = canvas;
        const { pixelsInTile } = GameConfig;

        input.update(pointerX, pointerY, worldView);
        const { hoveredTile, isPointerDown } = input;

        if (isPointerDown && hoveredTile) {
            hoveredTile.setHeight(targetTileHeight);
            const { neighborsMap: neighbors } = hoveredTile;
            if (neighbors.TOP) {
                neighbors.TOP.setHeight(targetTileHeight);
            }
            if (neighbors.BOTTOM) {
                neighbors.BOTTOM.setHeight(targetTileHeight);
            }
            if (neighbors.LEFT) {
                neighbors.LEFT.setHeight(targetTileHeight);
            }
            if (neighbors.RIGHT) {
                neighbors.RIGHT.setHeight(targetTileHeight);
            }
        }

        if (hoveredTile) {
            console.log(hoveredTile.waterLevel);
        }

        world.update(deltaTime);

        for (const creature of creatures) {
            creature.update(deltaTime);
        }

        canvasContext.clearRect(0, 0, width, height);
        worldRenderer.render(canvas, worldView);

        for (const creature of creatures) {
            creature.render(canvasContext, worldView);
        }

        if (hoveredTile) {
            const x = hoveredTile.globalPixelX + worldView.pixelOffsetX;
            const y = hoveredTile.globalPixelY + worldView.pixelOffsetY;

            canvasContext.lineWidth = 1;
            canvasContext.strokeStyle = "#222";
            canvasContext.strokeRect(x, y, pixelsInTile, pixelsInTile);
        }
    }
}
