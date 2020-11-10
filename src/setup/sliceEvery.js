module.exports = function () {
    /**
     * Slices a string every x
     * @param {Number} ChunkBy - The number of time to slice the string
     * @returns {Array} an array
     */
    String.prototype.sliceEvery = function (ChunkBy) {
        if (!ChunkBy || isNaN(ChunkBy)) {
            throw new TypeError("No number provided");
        }
        let ChunksNum = Math.ceil(this.length / parseInt(ChunkBy));
        let chunks = new Array(ChunksNum);
        for (let i = 0, o = 0; i < ChunksNum; ++i, o += parseInt(ChunkBy)) {
            chunks[i] = this.substr(o, parseInt(ChunkBy));
        }
        return chunks;
    };

};
