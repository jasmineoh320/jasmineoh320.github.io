var Metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
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

function build(callback) {
  Metalsmith(__dirname)
  .metadata({
    title: "My Static Site & Blog",
    description: "It's about saying »Hello« to the World.",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io/"
  })
  .source('./src/pages')
  .destination('./build')
  .clean(true)
  .use(assets({
    source: './src/assets',
    destination: './assets'
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: "./src/layouts",
    partials: "./src/partials",
    pattern: ["**/*.html", "*html"],
  }))
  .build(function (err, files) {
    if (err) { throw err; }
    var message = 'Build complete';
    console.log(message);
    callback();
  });
}
