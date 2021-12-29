'use strict'
export type EOL = {
  [key:string]:string|number|Function|object|boolean
}

export type CronTime = string

export type Callback = Function|null