var Metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var inplace = require('metalsmith-in-place');
var assets = require('metalsmith-assets');
var browserSync = require('browser-sync');
var argv = require('minimist')(process.argv);

// If I run node run deploy --prod, it should not use browser-sync to watch for changes.
// Otherwise, it should.
if (!argv.deploy) {
  browserSync({
    port: 8000,
    server: 'build',
    files: ['src/**/*'],
    middleware: function (req, res, next) {
      build(next);
    }
  })
} else {
  build(function () {
    console.log('Done building.');
  })
}

var dir = {
    base: __dirname + '/',
    lib: __dirname + '/lib/',
    source: './src/',
    dest: './build/'
}

var siteMeta = {
  title: "Jasmine Oh",
  description: "Collection of my work",
  generator: "Metalsmith",
  url: "http://jasmineoh.com"
};

var templateConfig = {
    engine: 'handlebars',
    directory: dir.source + 'templates/',
    partials: dir.source + 'partials/',
    default: 'page.html'
};

var inplaceConfig = {
  pattern: 'templates/**/*'
};

function build(callback) {
  Metalsmith(__dirname)
  .metadata(siteMeta)
  .source(dir.source + '/pages/')
  .destination(dir.dest)
  .clean(true)
  .use(inplace(inplaceConfig)) // in-page templating
  .use(layouts(templateConfig)) // layout templating
  .use(assets({
    source: './src/assets',
    destination: './assets'
  }))
  .build(function (err, files) {
    if (err) { throw err; }
    var message = 'Build complete';
    console.log(message);
    callback();
  });
}
