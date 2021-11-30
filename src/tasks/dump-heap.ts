'use strict'
const heapdump = require('heapdump')
import { Results } from 'typing/interfaces'


export const dumpHeap = ():Results => {
  const file = `/tmp/${new Date().toISOString()}.heapsnapshot`
  const hrStart = process.hrtime()
  const ok = heapdump.writeSnapshot(file)
  const hrEnd = process.hrtime(hrStart)
  const runtime = `${hrEnd[0]}s ${hrEnd[1]/1000000}ms`
  return { ok, runtime, file }
}