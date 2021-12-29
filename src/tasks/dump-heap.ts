'use strict'
const heapdump = require('heapdump')
import { Results } from 'typing/interfaces'


export const dumpHeap = async ():Promise<Results> => {
  const timestamp = new Date()
    .toISOString()
    .replace(/\.[0-9]{3}/, '')
    .replace(/:/g, '_') 
  const file = `./${timestamp}.heapsnapshot`
  const hrStart = process.hrtime()
  const ok = await heapdump.writeSnapshot(file)
  const hrEnd = process.hrtime(hrStart)
  const runtime = `${hrEnd[0]}s ${hrEnd[1]/1000000}ms`
  return { ok, runtime, file }
}