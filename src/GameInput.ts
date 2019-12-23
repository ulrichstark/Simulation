import { Tile } from "./world/Tile";
import { World } from "./world/World";
import { Actions, ActionCameraMove } from "./Actions";
import { WorldView } from "./world/WorldView";
import { GameConfig } from "./GameConfig";

type ActionCallback = (action: Actions) => void;

type KeyAction = () => void;

export class GameInput {
    private world: World;
    private actionCallback: ActionCallback;
    private keyDownMap: boolean[] = [];
    private keyActionMap: KeyAction[] = [];

    public hoveredTile: Tile | undefined;
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
        const { world, keyActionMap } = this;
        const { pixelsInTile } = GameConfig;
        const { pixelOffsetX, pixelOffsetY } = worldView;

        this.pointerX = (pointerXPixel - pixelOffsetX) / pixelsInTile;
        this.pointerY = (pointerYPixel - pixelOffsetY) / pixelsInTile;
        this.hoveredTile = world.getTile(Math.floor(this.pointerX), Math.floor(this.pointerY));

        for (const keyCode in keyActionMap) {
            if (this.keyDownMap[keyCode]) {
                const action = keyActionMap[keyCode];
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
