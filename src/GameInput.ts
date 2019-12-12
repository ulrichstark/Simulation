import { Chunk } from "./world/Chunk";
import { Tile } from "./world/Tile";
import { World } from "./world/World";
import { Actions, ActionCameraMove } from "./Actions";
import { WorldView } from "./world/WorldView";

type ActionCallback = (action: Actions) => void;

type KeyAction = () => void;

export class GameInput {
    private world: World;
    private actionCallback: ActionCallback;
    private keyDownMap: boolean[] = [];
    private keyActionMap: KeyAction[] = [];

    public hoveredChunk: Chunk | null = null;
    public hoveredTile: Tile | null = null;
    public isPointerDown: boolean = false;
    public pointerX: number;
    public pointerY: number;

    constructor(world: World, actionCallback: ActionCallback) {
        this.world = world;
        this.actionCallback = actionCallback;

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.keyActionMap[37] = () => this.fireActionCameraMove(-1, 0);
        this.keyActionMap[38] = () => this.fireActionCameraMove(0, -1);
        this.keyActionMap[39] = () => this.fireActionCameraMove(1, 0);
        this.keyActionMap[40] = () => this.fireActionCameraMove(0, 1);
    }

    public update(pointerXPixel: number, pointerYPixel: number, worldView: WorldView) {
        const { chunks, config } = this.world;
        const { tileSize, chunkSize } = config;
        const { positionX, positionY } = worldView;

        this.pointerX = pointerXPixel / tileSize - positionX;
        this.pointerY = pointerYPixel / tileSize - positionY;

        const chunkX = Math.floor(this.pointerX / chunkSize);
        const chunkY = Math.floor(this.pointerY / chunkSize);
        const tileX = Math.floor(this.pointerX % chunkSize);
        const tileY = Math.floor(this.pointerY % chunkSize);

        if (chunks[chunkX] && chunks[chunkX][chunkY]) {
            const chunk = chunks[chunkX][chunkY];
            this.hoveredChunk = chunk;
            const tile = chunk.tiles[tileX][tileY];
            this.hoveredTile = tile || null;
        } else {
            this.hoveredChunk = null;
        }

        for (const keyCode in this.keyActionMap) {
            if (this.keyDownMap[keyCode]) {
                const action = this.keyActionMap[keyCode];
                action();
            }
        }
    }

    public mount() {
        document.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mouseup", this.handleMouseUp);
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
    }

    public unmount() {
        document.removeEventListener("mousedown", this.handleMouseDown);
        document.removeEventListener("mouseup", this.handleMouseUp);
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
    }

    private handleMouseDown() {
        this.isPointerDown = true;

        if (this.hoveredTile) {
            this.actionCallback({ key: "TILE_CLICK", targetTile: this.hoveredTile });
        }
    }

    private handleMouseUp() {
        this.isPointerDown = false;
    }

    private fireActionCameraMove(deltaX: number, deltaY: number) {
        const action: ActionCameraMove = {
            key: "CAMERA_MOVE",
            deltaX: deltaX,
            deltaY: deltaY
        };
        this.actionCallback(action);
    }

    private handleKeyUp(event: KeyboardEvent) {
        this.keyDownMap[event.keyCode] = false;
    }

    private handleKeyDown(event: KeyboardEvent) {
        this.keyDownMap[event.keyCode] = true;
    }
}
