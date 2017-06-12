var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var babelify = require('babelify');
var streamify = require('gulp-streamify');

var path = {
    HTML: 'kebolcz/src/index.html',
    MINIFIED_OUT: 'build.min.js',
    OUT: 'build.js',
    DEST: 'kebolcz/dist',
    DEST_BUILD: 'kebolcz/dist/build',
    DEST_SRC: 'kebolcz/dist/src',
    ENTRY_POINT: 'kebolcz/src/js/App.js'
};

//kebolcz/src/index.html中复制到kebolczkebolcz/dist中
gulp.task('copy', function () {
    console.log('【' + (new Date()).toLocaleTimeString() + '】 copy');
    gulp.src(path.HTML)
        .pipe(htmlreplace({
            'js': 'src/' + path.OUT
        }))
        .pipe(gulp.dest(path.DEST));
});

//监测
gulp.task('watch', function () {

    //监测html文件
    gulp.watch(path.HTML, ['copy']);

    //watchify配合browserify使用，因为单独使用browserify会每次遍历每个组件，一旦有变化就会重新生成绑定文件。而有了watchify，会缓存文件，只更新哪些发生改变的文件
    var watcher = watchify(browserify({
        entries: [path.ENTRY_POINT], //kebolcz/src/js/App.js, browserify会检测kebolcz/src/js下的所有js文件，以及kebolcz/src/js下所有子文件夹下的js文件
        transform: [reactify,babelify], //使用reactify把jsx转换成js文件
        debug: true, //告诉Browersify使用source maps, souce maps帮助我们在出现错误的时候定位到jsx中的错误行
        cache: {}, //必须的，browserify告诉我们这样使用
        packageCache: {}, //必须的，browserify告诉我们这样使用
        fullPath: true //必须的，browserify告诉我们这样使用
    }));

    return watcher.on('update', function () {
        watcher.bundle() //把所有的jsx文件绑定到一个文件
            .pipe(source(path.OUT))
            .pipe(gulp.dest(path.DEST_SRC));

        console.log('【' + (new Date()).toLocaleTimeString() + '】 Updated');
    })
        .bundle()
        .pipe(source(path.OUT))
        .pipe(gulp.dest(path.DEST_SRC));
});

//默认的task
gulp.task('default', ['watch']);