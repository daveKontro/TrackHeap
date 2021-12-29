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
const cron = require('node-cron');
const { dumpHeap } = require('./tasks/dump-heap');
const info = {
    options: {
        cronTime: '00 00 * * *',
    },
    callback(results) { return results; },
    dumpHeapResults: {
        trackHeap: {
            ok: null,
            runtime: 'n/a',
            file: 'n/a',
        },
    },
    set setDumpHeapResults(results) {
        this.dumpHeapResults = { trackHeap: Object.assign({}, results) };
    },
    msgs: {
        invalidCronTime({ cronTime }) {
            return `${cronTime} is not a valid cron time`;
        },
    },
    events: {
        sigterm: 'SIGTERM',
        sigint: 'SIGINT',
        beforeExit: 'beforeExit',
    },
};
const runDumpHeap = ({ callback }) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield dumpHeap();
    info.setDumpHeapResults = results;
    if (callback) {
        try {
            callback(results);
        }
        catch (err) {
            console.error(err);
        }
    }
});
exports.trackHeap = {
    defaults: {
        options: info.options,
    },
    results: info.dumpHeapResults,
    validateCronTime(cronTime) {
        return cron.validate(cronTime);
    },
    run(options = info.options, callback = null) {
        const timeZone = 'local';
        let { cronTime } = options;
        // in case user passes in "{}" for option
        cronTime = cronTime || info.options.cronTime;
        if (!cron.validate(cronTime)) {
            const msg = info.msgs.invalidCronTime({ cronTime });
            return console.error(msg);
        }
        const runTask = () => runDumpHeap({ callback });
        const task = cron.schedule(cronTime, runTask, {
            scheduled: true,
            // timezone: 'America/New_York',
        });
        // process event listeners
        process.on(info.events.sigterm, () => task.stop());
        process.on(info.events.sigint, () => task.stop());
        process.on(info.events.beforeExit, () => task.stop());
        return {
            options,
            callback,
            task,
            schedule: {
                cronTime,
                timeZone,
            }
        };
    }
};

//# sourceMappingURL=schedule.js.map
