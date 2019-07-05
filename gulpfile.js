// #####################################################################
// # ENABLE .ENV FILE SUPPORT
// #####################################################################
require('dotenv').config();

// #####################################################################
// # REQUIRE GULP
// #####################################################################
const { src, dest, task, watch, series, parallel } = require('gulp');

// #####################################################################
// # STYLES RELATED
// #####################################################################
const sass              = require('gulp-sass');
const autoprefixer      = require('gulp-autoprefixer');

// #####################################################################
// # JAVASCRIPT RELATED
// #####################################################################
const uglify            = require("gulp-uglify");
const babelify          = require("babelify");
const browserify        = require("browserify");
const source            = require("vinyl-source-stream");
const buffer            = require("vinyl-buffer");

// #####################################################################
// # UTILITIES
// #####################################################################
const rename            = require('gulp-rename');
const sourcemaps        = require('gulp-sourcemaps');
const plumber           = require('gulp-plumber');
const purify            = require('gulp-purify-css');
const replace           = require('gulp-replace');

// #####################################################################
// # PICTURES RELATED
// #####################################################################
const cache             = require('gulp-cache');
const imagemin          = require('gulp-imagemin');
const imageminPngquant  = require('imagemin-pngquant');
const imageminMozjpeg   = require('imagemin-mozjpeg');
const imageminGiflossy  = require('imagemin-giflossy');

// #####################################################################
// # BROWSER RELATED
// #####################################################################
const browserSync       = require('browser-sync').create();

// #####################################################################
// # PROJECT RELATED
// #####################################################################
const siteURL           = process.env.SITE_URL;
const externalURL       = process.env.EXTERNAL_URL;
const assetsURL         = process.env.DIST + process.env.TPL;
const assetsSRC         = process.env.SRC + process.env.TPL;
const imageFolder       = process.env.IMG;


const styleSRC          = [ assetsSRC + '/scss/style.scss' ]
const styleWatch        = assetsSRC + '/scss/**/*.scss';

const scriptSRC         = 'script.js';
const scriptFolder      = assetsSRC + '/js/';
const scriptWatch       = assetsSRC + '/js/**/*.js';
const scriptFiles       = [scriptSRC];

const imageSRC          = assetsSRC + imageFolder + '/*';

// #####################################################################
// # DEFAULT
// #####################################################################
const phpFiles          = '**/*.php';
const htmlFiles          = '**/*.html';

// #####################################################################
// # SYMFONY
// #####################################################################
// const phpFiles          = '**/*.php';
// const htmlFiles         = '../templates/**/*.html';
// const twigFiles         = '../templates/**/*.twig';

// #####################################################################
// # FUNCTIONS
// #####################################################################
function browser_sync(done) {
    browserSync.init({
        open: false,
        proxy: siteURL,
        host: externalURL,
        port: 3000,
        notify: false
    });
    done();
}

function reload(done) {
    browserSync.reload();
    done();
}

// TODO: Create a standalone purify function

function styles(done) {
    src(styleSRC, {allowEmpty: true})
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole: true, outputStyle: 'compressed'}))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({browsers: ['last 2 versions', '> 5%', 'Firefox ESR']}))
        .pipe(purify(['./HTML/**/*.html']))     // Your view files
        .pipe(sass({errLogToConsole: true, outputStyle: 'compressed'}))
        .pipe(replace('!important', ''))        // Remove !important for AMP Validator
        .pipe(rename({extname: '.min.css'}))
        .pipe(sourcemaps.write('./'))
        .pipe(dest(assetsURL + '/css'))
        .pipe(browserSync.stream());
    done();
}

function scripts(done) {
    scriptFiles.map( function( entry ) {
        return browserify({entries: [scriptFolder + entry]})
            .transform(babelify, {presets: ['@babel/preset-env']})
            .bundle()
            .pipe(source(entry))
            .pipe(rename({extname: '.min.js'}))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(dest(assetsURL + '/js'))
            .pipe(browserSync.stream());
    });
    done();
}

function compress_img() {
    return src(imageSRC)
        .pipe(cache(imagemin([
            imageminPngquant({speed: 1, quality: 98}),
            imageminGiflossy({optimizationLevel: 3, optimize: 3, lossy: 2}),
            imagemin.svgo({plugins: [{ removeViewBox: false }]}),
            imagemin.jpegtran({ progressive: true }),
            imageminMozjpeg({ quality: 70 })
        ])))
        .pipe(dest(assetsURL + imageFolder));
}

function watch_files() {
    watch(styleWatch, series(styles, reload));
    watch(scriptWatch, series(scripts, reload));
    watch(phpFiles, reload);
    watch(htmlFiles, reload);
    // SYMFONY
    // watch(twigFiles, reload);
}

// #####################################################################
// # GULP TASKS
// #####################################################################
task('default', parallel(styles, scripts));
task('watch', parallel(browser_sync, watch_files));
task('imagemin', parallel(compress_img));