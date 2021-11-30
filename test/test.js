const assert = require('assert')
const { RUN_ALL_TESTS } = require('../build/utilities/config')
const { dumpHeap } = require('../build/tasks/dump-heap')


const indentedLog = ({ name, results }) => {
  const indents = [1, 2, 3]
  indents.map(indent => console.group())
  console.log({ name, results })
  console.groupEnd()
  return null
}

if (RUN_ALL_TESTS) {
  describe('dump-heap.js', () => {
    const name = 'dumpHeap()'
    describe(name, () => {
      it('takes a snapshot of the V8 heap', async () => {
        const results = dumpHeap()
        indentedLog({ name, results })
        assert.ok(results.ok)
      })
    })
  })
}