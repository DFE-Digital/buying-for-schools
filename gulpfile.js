const nodemon = require('nodemon')
const sassjs = require('sass')
const mkdirp = require('mkdirp')
const fs = require('fs')
const gulp = require('gulp')

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
      }
    })
  })
}

function assets () {
  // /node_modules/govuk-frontend/assets
  return gulp
    .src(['node_modules/govuk-frontend/assets/**/*.*', 'node_modules/govuk-frontend/all.js'])
    .pipe(gulp.dest('public/assets'))
}

module.exports = {
  watch,
  sass,
  assets,
  nodeChanges
}
