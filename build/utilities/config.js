'use strict';
const dotenv = require('dotenv');
const getEnv = () => {
    let env = {};
    const result = dotenv.config();
    const rawEnv = result.parsed;
    // shallowly coerce .env text value to boolean if applicable
    const parseBool = (value) => {
        const check = ['true', 'false'];
        if (check.includes(value))
            return value === 'true';
        else
            return value;
    };
    Object.entries(rawEnv).map(([key, value]) => {
        const newValue = parseBool(value);
        env[key] = newValue;
        return null;
    });
    // add select, default variables if absent from .env
    const defaults = {
        RUN_ALL_TESTS: false,
    };
    Object.entries(defaults).map(([key, value]) => {
        if (!(key in env))
            env[key] = value;
        return null;
    });
    return env;
};
const env = getEnv();
module.exports = env;

//# sourceMappingURL=config.js.map
