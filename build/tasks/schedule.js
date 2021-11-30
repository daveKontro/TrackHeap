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
exports.trackHeap = void 0;
const { spawn, Thread, Worker } = require('threads');
const cron = require('node-cron');
const info = {
    msgs: {
        dumpHeapResults: null,
        set setDumpHeapResults(results) {
            this.dumpHeapResults = { trackHeap: results };
        },
        invalidCronTime: ({ cronTime }) => `${cronTime} is not a valid cronTime.`
    },
    events: {
        termination: 'termination',
    },
};
const runDumpHeap = () => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield spawn(new Worker('./tasks'));
    Thread.events(tasks).subscribe((event) => {
        if (event.type === info.events.termination) {
            console.log(info.msgs.dumpHeapResults);
        }
    });
    info.msgs.setDumpHeapResults = yield tasks.dumpHeap;
    yield Thread.terminate(tasks);
});
exports.trackHeap = {
    cronTime: '00 00 * * *',
    set setCronTime(cronTime) { this.cronTime = cronTime; },
    get run() {
        return () => {
            const cronTime = this.cronTime;
            if (!cron.validate(cronTime)) {
                return console.error(info.msgs.invalidCronTime({ cronTime }));
            }
        };
    },
};

//# sourceMappingURL=schedule.js.map
