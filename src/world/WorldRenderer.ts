import { World } from "./World";
import { Chunk } from "./Chunk";
import { WorldView } from "./WorldView";

export class WorldRenderer {
    private world: World;

    constructor(world: World) {
        this.world = world;
    }

    public render(canvasContext: CanvasRenderingContext2D, worldView: WorldView) {
        const { chunks, config } = this.world;
        const { chunksX, chunksY, chunkSize, tileSize } = config;
        const { positionX, positionY } = worldView;
        const chunkPixelSize = chunkSize * tileSize;

        for (let ix = 0; ix < chunksX; ix++) {
            for (let iy = 0; iy < chunksY; iy++) {
                const chunk = chunks[ix][iy];
                const x = Math.floor(positionX * tileSize + chunk.x * chunkPixelSize);
                const y = Math.floor(positionY * tileSize + chunk.y * chunkPixelSize);

                chunk.render(canvasContext, x, y);
            }
        }
    }
}
