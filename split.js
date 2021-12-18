const glob = require('glob');

if (!process.env.CI_NODE_TOTAL) {
    console.error('No envrionment variable CI_NODE_TOTAL defined');
    process.exit(1);
}

if (!process.env.CI_NODE_INDEX) {
    console.error('No envrionment variable CI_NODE_INDEX defined');
    process.exit(1);
}

function splitChunks(items, total) {
    let chunks = [];

    let currentChunk = 1;
    for (let currentItem = 0; currentItem < items.length; currentItem++) {
        if (!chunks[currentChunk]) {
            chunks[currentChunk] = [];
        }

        chunks[currentChunk].push(items[currentItem]);

        currentChunk++;
        if (currentChunk > total) {
            currentChunk = 1;
        }
    }

    return chunks;
}

const files = glob.sync('tests/**/*.js');
const chunks = splitChunks(files, process.env.CI_NODE_TOTAL);

if (chunks[process.env.CI_NODE_INDEX]) {
    for (file of chunks[process.env.CI_NODE_INDEX]) {
        process.stdout.write(file + "\n");
    }
}
