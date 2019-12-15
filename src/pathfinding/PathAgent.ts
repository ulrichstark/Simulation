import { PathAgentDefinition } from "./PathAgentDefinition";
import { Tile } from "../world/Tile";
import { PathAgentNode } from "./PathAgentNode";
import { Directions } from "../common/Direction";

export class PathAgent {
    public definition: PathAgentDefinition;

    constructor(definition: PathAgentDefinition) {
        this.definition = definition;
    }

    public findPath(from: Tile, to: Tile): Tile[] | null {
        const { getCost, getDistance } = this.definition;
        const openNodes: PathAgentNode[] = [
            {
                tile: from,
                parent: null,
                score: 0
            }
        ];
        const openedNodes: { [key: string]: boolean } = { [from.key]: true };

        while (true) {
            const node = openNodes.shift();

            if (!node) {
                return null;
            }

            const { tile } = node;

            if (tile === to) {
                // TODO: Pathfinding optimization possible
                const tiles: Tile[] = [];
                let currentNode = node;
                while (currentNode.parent) {
                    tiles.unshift(currentNode.tile);
                    currentNode = currentNode.parent;
                }
                return tiles;
            }

            for (const direction of Directions) {
                const possibleOpenTile = tile.neighbors[direction.key];

                if (possibleOpenTile && !openedNodes[possibleOpenTile.key]) {
                    const cost = getCost(tile, possibleOpenTile);

                    if (cost !== null) {
                        const distance = getDistance(possibleOpenTile, to);
                        const score = node.score + cost + distance;

                        const nextNode: PathAgentNode = {
                            tile: possibleOpenTile,
                            parent: node,
                            score: score
                        };

                        openedNodes[possibleOpenTile.key] = true;

                        // TODO: Pathfinding optimization possible
                        let inserted = false;
                        for (let i = 0; i < openNodes.length; i++) {
                            if (openNodes[i].score > score) {
                                openNodes.splice(i, 0, nextNode);
                                inserted = true;
                                break;
                            }
                        }

                        if (!inserted) {
                            openNodes.push(nextNode);
                        }
                    }
                }
            }
        }
    }
}
