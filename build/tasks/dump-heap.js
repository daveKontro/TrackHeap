'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.dumpHeap = void 0;
const heapdump = require('heapdump');
const dumpHeap = () => {
    const file = `/tmp/${new Date().toISOString()}.heapsnapshot`;
    const hrStart = process.hrtime();
    const ok = heapdump.writeSnapshot(file);
    const hrEnd = process.hrtime(hrStart);
    const runtime = `${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`;
    return { ok, runtime, file };
};
exports.dumpHeap = dumpHeap;

//# sourceMappingURL=dump-heap.js.map
