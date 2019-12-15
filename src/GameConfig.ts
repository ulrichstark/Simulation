export class GameConfig {
    public static readonly seed = 6;
    public static readonly noiseScale = 0.02;
    public static readonly chunksXInWorld = 4;
    public static readonly chunksYInWorld = 4;
    public static readonly tilesInChunk = 32;
    public static readonly pixelsInTile = 8;

    public static readonly pixelsInChunk = GameConfig.tilesInChunk * GameConfig.pixelsInTile;
    public static readonly tilesXInWorld = GameConfig.chunksXInWorld * GameConfig.tilesInChunk;
    public static readonly tilesYInWorld = GameConfig.chunksYInWorld * GameConfig.tilesInChunk;
}
