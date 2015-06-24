var gulp = require('gulp');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var minifyCss = require('gulp-minify-css');
var less = require('gulp-less');
var fs = require('fs');
var changed = require('gulp-changed');

// set up tests - copy images/connectors and JQFT CSS/JS to test/manual directory
gulp.task('tests', function() {
    // do if the test suite is set up
    attempt.test(function(){
        // copy images, connectors, and min files to tests/manual folder
        gulp.src(['dist/images/**', 'dist/connectors/**'], {base: 'dist'}).pipe(gulp.dest('tests/manual'));
        gulp.src('dist/jQueryFileTree.min.css').pipe(gulp.dest('tests/manual'));
        gulp.src('dist/jQueryFileTree.min.js').pipe(gulp.dest('tests/manual'));
    });
});

// compile LESS
gulp.task('less', function () {
    // jqueryfiletree assets
    gulp.src('src/less/*.less')
        .pipe(changed('dist'), {extension: '.css'})
        .pipe(less())
        .pipe(gulp.dest('src'))
        .pipe(minifyCss())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('dist'));

    attempt.test(function(){
        // compile skeleton & demo LESS files
        gulp.src(['tests/manual/bower_components/skeleton-less/less/*.less', 'tests/manual/css/less/*.less'])
            .pipe(changed('tests/manual/css'), {extension: '.css', hasChanged: changed.compareSha1Digest})
            .pipe(less())
            .pipe(gulp.dest('tests/manual/css'));

        // copy jQueryFileTree.min.css to test folder
        gulp.src('dist/jQueryFileTree.min.css')
            .pipe(changed('tests/manual'), {extension: '.css'})
            .pipe(gulp.dest('tests/manual'));
    });
});

// compile coffeescript
gulp.task('coffee', function() {
    gulp.src('src/coffeescript/*.coffee')
        .pipe(changed('src'))
        .pipe(coffee({bare: true}).on('error', gutil.log))
        .pipe(gulp.dest('src'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist'));

    attempt.test(function(){
        gulp.src('dist/jQueryFileTree.min.js')
            .pipe(changed('tests/manual'), {extension: '.css'})
            .pipe(gulp.dest('tests/manual'));
    });
});

// 'gulp default' (or just 'gulp') will both build *and* setup/update tests (if applicable)
gulp.task('default', ['coffee', 'less', 'tests']);

// try/catch closure
var attempt = {
    // execute callback only if test suite is set up
    test: function(callback) {
        try {
            // Query if tests/bower_components is installed (else, that needs to be set up first)
            stats = fs.lstatSync('tests/manual/bower_components');

            // if bower is set up, the test suite is setup and we can run the test scripts
            if (stats.isDirectory()) {
                callback();
            }
        }
        catch (e) {
            // don't do anything with errors yet
        }
    }
}
