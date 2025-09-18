const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const gulpIf = require('gulp-if');
const del = require('del');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');

const isProd = process.env.NODE_ENV === 'production';

const paths = {
    html:   { src: 'src/index.html', dest: 'dist/' },
    styles: { src: 'src/scss/style.scss', watch: 'src/scss/**/*.scss', dest: 'dist/assets/css/' },
    scripts:{ src: 'src/js/main.js', watch: 'src/js/**/*.js', dest: 'dist/assets/js/' },
    fonts:  { src: 'src/fonts/**/*.{woff,woff2,ttf,otf,eot,svg}', dest: 'dist/assets/fonts/' },
    images:  { src: 'src/images/**/*.{jpg,jpeg,png,gif,svg,webp}', dest: 'dist/assets/images/' }
};

function clean() {
    return del.deleteAsync(['dist']);
}

function html() {
    return src(paths.html.src)
        .pipe(gulpIf(isProd, htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        })))
        .pipe(dest(paths.html.dest))
        .pipe(browserSync.stream());
}

function fonts() {
    return src(paths.fonts.src)
        .pipe(dest(paths.fonts.dest));
}

function images() {
    return src(paths.images.src)
        .pipe(dest(paths.images.dest))
        .pipe(browserSync.stream());
}

function styles() {
    return src(paths.styles.src)
        .pipe(gulpIf(!isProd, sourcemaps.init()))
        .pipe(sass.sync({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(postcss([autoprefixer(), ...(isProd ? [cssnano()] : [])]))
        .pipe(gulpIf(!isProd, sourcemaps.write('.')))
        .pipe(dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

function scripts() {
    return src(paths.scripts.src, { allowEmpty: true })
        .pipe(gulpIf(!isProd, sourcemaps.init()))
        .pipe(terser())
        .pipe(gulpIf(!isProd, sourcemaps.write('.')))
        .pipe(dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

function serve() {
    browserSync.init({ server: { baseDir: 'dist' }, open: false, notify: false, ui: false });
    watch(paths.html.src, html);
    watch(paths.styles.watch, styles);
    watch(paths.scripts.watch, scripts);
    watch(paths.fonts.src, fonts);
    watch(paths.images.src, images);
}

const build = series(clean, parallel(html, styles, scripts, fonts, images));
exports.clean = clean;
exports.build = build;
exports.default = series(build, serve);
