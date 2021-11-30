'use strict'
const { expose } = require('threads/worker')
const { dumpHeap } = require('./dumpHeap')
import { Results } from 'typing/interfaces'


const tasks = {
  dumpHeap():Results {
    const results:Results = dumpHeap()
    return results
  }
}

expose(tasks)