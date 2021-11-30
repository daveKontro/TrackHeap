'use strict'
const { spawn, Thread, Worker } = require('threads')
const cron = require('node-cron')


import {
  TrackHeapResults,
  Results,
} from 'typing/interfaces'


const info = {
  msgs: {
    dumpHeapResults: <TrackHeapResults|null>null,
    set setDumpHeapResults(results:Results) { 
      this.dumpHeapResults = { trackHeap: results }
    },
    invalidCronTime: ({ cronTime }:{ cronTime:string }) => `${cronTime} is not a valid cronTime.`
  },
  events: {
    termination: 'termination',
  },
}

const runDumpHeap = async () => {
  const tasks = await spawn(new Worker('./tasks'))

  Thread.events(tasks).subscribe((event:any) => {
    if (event.type === info.events.termination) {
      console.log(info.msgs.dumpHeapResults)
    }
  })

  info.msgs.setDumpHeapResults = await tasks.dumpHeap

  await Thread.terminate(tasks)
}

export const trackHeap = {
  cronTime: '00 00 * * *',
  set setCronTime(cronTime:any) { this.cronTime = cronTime },
  get run() {
    return () => {
      const cronTime = this.cronTime

      if (!cron.validate(cronTime)) {
        return console.error(info.msgs.invalidCronTime({ cronTime }))
      }

      
    }
  },
}