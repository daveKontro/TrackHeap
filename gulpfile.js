'use strict'
const gulp = require('gulp')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const mocha = require('gulp-mocha')
const chalk = require('chalk')
const fixme = require('fixme')
const del = require('del')


const tsProject = ts.createProject('tsconfig.json')

const source = 'src/**/*'
const ignore = '!resource/**/*'
const destination = 'build'

const transpile = () => (
  tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest(destination))
)

const mapSource = () => (
  tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.', {
      includeContent: false, 
      sourceRoot: '../src'
    }))
    .pipe(gulp.dest(destination))
)

const test = () => (
  gulp.src('./test/test.js', { read: false })
    .pipe(mocha({
      reporter: 'min',  // 'list'
      exit: true,
    }))
    .on('error', console.error)
)

const scanNotes = () => Promise.resolve(fixme({
  // FYI this can take a long time to resolve
  // can't run as test b/c fn() returns nothing
  path: process.cwd(),
  ignored_directories: [
    'node_modules/**', 
    '.git/**', 
    'build/**',
    'client/**'
  ],
  file_patterns: [
    '**/*.js', 
    '**/*.ts', 
    '**/*.sh'
  ],
  file_encoding: 'utf8',
  line_length_limit: 250,
  skip: [
    'note', 
    'optimize', 
    'todo', 
    'hack', 
    'xxx'
  ]
}))

const watchFiles = () => {
  gulp.watch([source, ignore], gulp.series(deleteBuildDir, mapSource))
}

const watchAndTestFiles = () => {
  gulp.watch([source, ignore], gulp.series(deleteBuildDir, mapSource, test, scanNotes))
}

const flashReminders = () => {
  const format = question => `${question} ${String.fromCodePoint(0x1F914)}`
  return Promise.resolve(
    console.log(
    `           ` +
    `${chalk.red('QUESTIONS:')}\n` +
    `           ` +
    `${format('1) Is there a valid .env file in the root dir?')}\n`
  ))
}

const deleteBuildDir = () => del([destination])

// to run task 'gulp <task name>'
gulp.task('clean', deleteBuildDir)
gulp.task('notes', scanNotes)
gulp.task('scripts', gulp.series('clean', 'notes', transpile))
gulp.task('mapsource', mapSource)
gulp.task('test', test)
gulp.task('watch', gulp.series(flashReminders, 'scripts', watchAndTestFiles))
gulp.task('watchnotest', gulp.series(flashReminders, 'scripts', watchFiles))