'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const { expose } = require('threads/worker');
const { dumpHeap } = require('./dumpHeap');
const tasks = {
    dumpHeap() {
        const results = dumpHeap();
        return results;
    }
};
expose(tasks);

//# sourceMappingURL=tasks.js.map
