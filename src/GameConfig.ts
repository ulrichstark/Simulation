export class GameConfig {
    // GENERAL
    public static readonly seed = 6; //;Math.random() * 10000;
    public static readonly noiseScale = 0.02;

    // CAMERA
    public static readonly cameraMovementSpeed = 40;

    // WORLD
    public static readonly chunksXInWorld = 4;
    public static readonly chunksYInWorld = 4;
    public static readonly tilesInChunk = 32;
    public static readonly pixelsInTile = 8;

    // WATER
    public static readonly minimalHeightDiffForWaterFlow = 0.1;
    public static readonly waterFlowSpeed = 2;

    // CALCULATIONS
    public static readonly pixelsInChunk = GameConfig.tilesInChunk * GameConfig.pixelsInTile;
    public static readonly tilesXInWorld = GameConfig.chunksXInWorld * GameConfig.tilesInChunk;
    public static readonly tilesYInWorld = GameConfig.chunksYInWorld * GameConfig.tilesInChunk;
}
