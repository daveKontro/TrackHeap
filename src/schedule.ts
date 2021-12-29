'use strict'
const cron = require('node-cron')
const { dumpHeap } = require('./tasks/dump-heap')
import { 
  CronTime,
  Callback,
} from 'typing/types'
import {
  TrackHeapResults,
  Results,
  Options,
} from 'typing/interfaces'


const info = {
  options: <Options>{
    cronTime: '00 00 * * *',
  },
  callback(results:TrackHeapResults) { return results },
  dumpHeapResults: <TrackHeapResults>{
    trackHeap: {
      ok: null,
      runtime: 'n/a',
      file: 'n/a',
    },
  },
  set setDumpHeapResults(results:Results) { 
    this.dumpHeapResults = { trackHeap: { ...results }}
  },
  msgs: {
    invalidCronTime({ cronTime }:{ cronTime:CronTime }) {
      return `${cronTime} is not a valid cron time`
    },
  },
  events: {
    sigterm: 'SIGTERM',
    sigint: 'SIGINT',
    beforeExit: 'beforeExit',
  },
}

const runDumpHeap = async ({ callback }: { callback:Callback }) => {
  const results:Results = await dumpHeap()

  info.setDumpHeapResults = results

  if (callback){
    try {
      callback(results)
    } catch(err) {
      console.error(err)
    }
  }
}

export const trackHeap = {
  defaults: { 
    options: info.options,
  },
  results: info.dumpHeapResults,
  validateCronTime(cronTime:CronTime):boolean {
    return cron.validate(cronTime)
  }, 
  run(
    options:Options = info.options,
    callback:Callback = null,
  ) {
    const timeZone = 'local'
    let { cronTime }:Options = options
    
    // in case user passes in "{}" for option
    cronTime = cronTime || info.options.cronTime
    
    if (!cron.validate(cronTime)) {
      const msg = info.msgs.invalidCronTime({ cronTime })
      return console.error(msg)
    }

    const runTask = () => runDumpHeap({ callback })
    const task = cron.schedule(cronTime, runTask, {
      scheduled: true,
      // timezone: 'America/New_York',
    })

    // process event listeners
    process.on(info.events.sigterm, () => task.stop())
    process.on(info.events.sigint, () => task.stop())
    process.on(info.events.beforeExit, () => task.stop())

    return { 
      options,
      callback,
      task,
      schedule: {
        cronTime,
        timeZone,
      }
    }
  }
}