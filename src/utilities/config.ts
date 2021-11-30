'use strict'
const dotenv = require('dotenv')
import { EOL } from "typing/types"


const getEnv = () => {
  let env:EOL = {}

  const result = dotenv.config()
  const rawEnv = result.parsed

  // shallowly coerce .env text value to boolean if applicable
  const parseBool = (value:any) => {
    const check = ['true', 'false']
    if (check.includes(value)) return value === 'true'
    else return value
  }

  Object.entries(rawEnv).map(([key, value]:any[]) => {
    const newValue = parseBool(value)
    env[key] = newValue
    return null
  })

  // add select, default variables if absent from .env
  const defaults = {
    RUN_ALL_TESTS: false,
  }

  Object.entries(defaults).map(([key, value]:any[]) => {
    if (!(key in env)) env[key] = value 
    return null
  })

  return env
}

const env = getEnv()
export = env