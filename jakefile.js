const { execSync } = require('child_process');
var fs = require('fs');
var path = require('path');
var exec = function (cmd) {
  execSync(cmd, {stdio: 'inherit'});
};

/* global jake, task, desc */

task('default', ['build']);

task('build', ['lint', 'clean', 'browserify', 'minify'], function () {
  console.log('Build completed.');
});

desc('Cleans browerified/minified files and package files');
task('clean', function () {
  jake.rmRf('./ejs.js');
  jake.rmRf('./ejs.min.js');
  console.log('Cleaned up compiled files.');
});

desc('Lints the source code');
task('lint', ['clean'], function () {
  var epath = path.join('./node_modules/.bin/eslint');
  exec(epath+' "**/*.js"');
  console.log('Linting completed.');
});

task('browserify', function () {
  var epath = path.join('./node_modules/browserify/bin/cmd.js');
  exec(epath+' --standalone ejs lib/ejs.js > ejs.js');
  console.log('Browserification completed.');
});

task('minify', function () {
  var epath = path.join('./node_modules/uglify-js/bin/uglifyjs');
  exec(epath+' ejs.js > ejs.min.js');
  console.log('Minification completed.');
});

desc('Generates the EJS API docs for the public API');
task('doc', function () {
  jake.rmRf('out');
  var epath = path.join('./node_modules/.bin/jsdoc');
  exec(epath+' --verbose -c jsdoc.json lib/* docs/jsdoc/*');
  console.log('Documentation generated in ./out.');
});

desc('Generates the EJS API docs for the public and private API');
task('devdoc', function () {
  jake.rmRf('out');
  var epath = path.join('./node_modules/.bin/jsdoc');
  exec(epath+' --verbose -p -c jsdoc.json lib/* docs/jsdoc/*');
  console.log('Documentation generated in ./out.');
});

desc('Publishes the EJS API docs');
task('docPublish', ['doc'], function () {
  fs.writeFileSync('out/CNAME', 'api.ejs.co');
  console.log('Pushing docs to gh-pages...');
  var epath = path.join('./node_modules/.bin/git-directory-deploy');
  exec(epath+' --directory out/');
  console.log('Docs published to gh-pages.');
});

desc('Runs TypeScript type tests');
task('typecheck', function () {
  exec(path.join('./node_modules/.bin/tsd'));
  console.log('Type checking completed.');
});

desc('Runs the EJS test suite');
task('test', ['lint', 'typecheck'], function () {
  exec(path.join('./node_modules/.bin/mocha'));
});
