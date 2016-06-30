// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var iconfont = require('gulp-iconfont');

var runTimestamp = Math.round(Date.now() / 1000);

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

// IconFont Task
gulp.task('iconfont', function() {
    return gulp.src(['src/icons/*.svg'])
        .pipe(iconfont({
            normalize: true,
            fontName: 'icons', // required 
            prependUnicode: true, // recommended option 
            formats: ['ttf', 'eot', 'woff', 'svg'], // default, 'woff2' and 'svg' are available 
            timestamp: runTimestamp, // recommended to get consistent builds when watching files 
        }))
        .on('glyphs', function(glyphs, options) {
            // CSS templating, e.g. 
            console.log(glyphs, options);
        })
        .pipe(gulp.dest('dist/fonts/'));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass()).on('error', sass.logError).pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', ['sass'], function() {
    browserSync.init({
        server: {
            baseDir: "dist",
            index: "index.html"
        },
        browser: "google chrome"
    });
    gulp.watch("src/sass/**/*.scss", ['sass']);
    gulp.watch("src/icons/*.svg", ['iconfont']);
    gulp.watch("dist/*.html").on('change', browserSync.reload);
    gulp.watch("dist/js/*.js", ['lint', 'scripts']).on('change', browserSync.reload);

});


// Default Task
gulp.task('default', ['lint', 'scripts', 'watch']);