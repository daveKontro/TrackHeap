'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dumpHeap = void 0;
const heapdump = require('heapdump');
const dumpHeap = () => __awaiter(void 0, void 0, void 0, function* () {
    const timestamp = new Date()
        .toISOString()
        .replace(/\.[0-9]{3}/, '')
        .replace(/:/g, '_');
    const file = `./${timestamp}.heapsnapshot`;
    const hrStart = process.hrtime();
    const ok = yield heapdump.writeSnapshot(file);
    const hrEnd = process.hrtime(hrStart);
    const runtime = `${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`;
    return { ok, runtime, file };
});
exports.dumpHeap = dumpHeap;

//# sourceMappingURL=dump-heap.js.map
