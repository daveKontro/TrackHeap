'use strict'
import * as types from './types'


export interface Results {
  ok: boolean|null,
  runtime: string,
  file: string,
}

export interface TrackHeapResults {
  trackHeap: Results,
}

export interface Options {
  cronTime: types.CronTime
}