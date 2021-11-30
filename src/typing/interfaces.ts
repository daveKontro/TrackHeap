'use strict'
export interface Results {
  ok: boolean,
  runtime: string,
  file: string,
}

export interface TrackHeapResults {
  trackHeap: Results,
}