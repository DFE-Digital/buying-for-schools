const nodemon = require('nodemon')
const sassjs = require('sass')
const mkdirp = require('mkdirp')
const fs = require('fs')
const gulp = require('gulp')
const jest = require('gulp-jest').default
// const cucumber = require('gulp-cucumber')

function nodeChanges () {
  return nodemon({
    script: 'app/index.js',
    ext: 'js,html,njk,json',
    env: { 'NODE_ENV': 'development' },
    cwd: __dirname,
    ignore: ['node_modules/**'],
    watch: ['app/index.js', 'app/templates/**/*.njk', 'app/decisionTree/*.js', 'app/*.json']
  })
}

function watch () {
  gulp.watch('sass/*.scss', gulp.series(['sass']))
  return nodeChanges()
}

function sass () {
  return new Promise((resolve, reject) => {
    sassjs.render({
      file: 'sass/main.scss',
      includePaths: ['node_modules/govuk-elements-sass/public/sass',
        'node_modules/govuk_frontend_toolkit/stylesheets'
      ],
      // outFile: 'app/assets/styles',
      outputStyle: 'compressed'
    }, function (err, result) {
      if (!err) {
        // No errors during the compilation, write this result on the disk
        mkdirp.sync('public/assets/styles')
        fs.writeFile('public/assets/styles/main.css', result.css, function (err) {
          if (err) {
            return reject(err)
          }
          return resolve()
        })
      } else {
        console.log('ERROR', err)
      }
    })
  })
}

function assets () {
  // /node_modules/govuk-frontend/assets
  return gulp
    .src(['node_modules/govuk-frontend/assets/**/*.*', 'node_modules/govuk-frontend/all.js', 'app/assets/**/*.*'])
    .pipe(gulp.dest('public/assets'))
}


 
function jestTest () {
  return gulp
    .src('app/**/*.test.js')
    .pipe(jest({
    "preprocessorIgnorePatterns": [
      "<rootDir>/public/", "<rootDir>/node_modules/"
    ],
    "automock": false,
    "coverage": true
    }))
}

function build (done) {
  return gulp.series(assets, sass, jestTest)(done)
}

function cucum (done) {
  return gulp.series(cuke)(done)
}

function cuke (done) {
  return gulp
    .src('*features/*')
    .pipe(cucumber({
      'steps': '*features/steps/*.js',
      'support': '*features/support/*.js'
    }))

}

// exports.default = build

module.exports = {
  watch,
  sass,
  assets,
  nodeChanges,
  default: build,
  // cucumber: cucum,
  jest: jestTest
}
