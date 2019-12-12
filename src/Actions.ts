import { Tile } from "./world/Tile";

export interface Action<T extends string> {
    key: T;
}

export interface ActionCameraMove extends Action<"CAMERA_MOVE"> {
    deltaX: number;
    deltaY: number;
}

export interface ActionTileClick extends Action<"TILE_CLICK"> {
    targetTile: Tile;
}

export type Actions = ActionCameraMove | ActionTileClick;
