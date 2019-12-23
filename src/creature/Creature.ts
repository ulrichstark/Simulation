import { World } from "../world/World";
import { Tile } from "../world/Tile";
import { PathAgent } from "../pathfinding/PathAgent";
import { PathAgentDefinition } from "../pathfinding/PathAgentDefinition";
import { Timer } from "../common/Timer";
import { WorldView } from "../world/WorldView";
import { GameConfig } from "../GameConfig";

export class Creature {
    private world: World;

    private position: Tile;
    private target: Tile | null = null;
    private path: Tile[] | null = null;

    private pathAgent: PathAgent;
    private moveTimer: Timer;

    constructor(world: World, pathAgentDefinition: PathAgentDefinition) {
        this.world = world;
        this.position = world.getTileRandom();
        this.pathAgent = new PathAgent(pathAgentDefinition);
        this.moveTimer = new Timer(0.1, this.move.bind(this));
    }

    private move() {
        if (this.path && this.path.length > 0) {
            const tile = this.path.shift();
            if (tile) {
                if (this.target && this.pathAgent.definition.getCost(this.position, tile) === null) {
                    this.tryToFindPathToTarget();
                } else {
                    this.position = tile;
                }
            }
        }
    }

    private tryToFindPathToTarget() {
        if (this.target !== null) {
            this.path = this.pathAgent.findPath(this.position, this.target);
        }
    }

    public update(deltaTime: number) {
        if (this.target === null || this.path === null || this.path.length === 0) {
            this.target = this.world.getTileRandom();
            this.tryToFindPathToTarget();
        } else {
            this.moveTimer.update(deltaTime);
        }
    }

    public render(canvasContext: CanvasRenderingContext2D, worldView: WorldView) {
        if (this.path) {
            for (const tile of this.path) {
                this.drawCircle(canvasContext, worldView, tile, "white", 0.5);
            }
        }

        this.drawCircle(canvasContext, worldView, this.position, "yellow", 1);
        if (this.target !== null) {
            this.drawCircle(canvasContext, worldView, this.target, "red", 0.5);
        }
    }

    private drawCircle(canvasContext: CanvasRenderingContext2D, worldView: WorldView, tile: Tile, color: string, size: number) {
        const { pixelsInTile } = GameConfig;

        const x = tile.globalX * pixelsInTile + worldView.pixelOffsetX;
        const y = tile.globalY * pixelsInTile + worldView.pixelOffsetY;
        const halfTileSize = pixelsInTile * 0.5;

        canvasContext.fillStyle = color;
        canvasContext.beginPath();
        canvasContext.arc(x + halfTileSize, y + halfTileSize, halfTileSize * size, 0, 2 * Math.PI);
        canvasContext.closePath();
        canvasContext.fill();
    }
}
