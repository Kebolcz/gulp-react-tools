//Tyler using browserify

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');

var path = {
    HTML: 'Tyler/src/index.html',
    MINIFIED_OUT: 'build.min.js',
    OUT: 'build.js',
    DEST: 'Tyler/dist',
    DEST_BUILD: 'Tyler/dist/build',
    DEST_SRC: 'Tyler/dist/src',
    ENTRY_POINT: 'Tyler/src/js/App.js'
};

//Tyler/src/index.html中复制到TylerTyler/dist中
gulp.task('copy', function() {
    console.log('copy');
    gulp.src(path.HTML)
        .pipe(htmlreplace({
        'js': 'src/' + path.OUT
        }))
        .pipe(gulp.dest(path.DEST));
});

//监测
gulp.task('watch', function() {

    //监测html文件
    gulp.watch(path.HTML, ['copy']);

    //watchify配合browserify使用，因为单独使用browserify会每次遍历每个组件，一旦有变化就会重新生成绑定文件。而有了watchify，会缓存文件，只更新哪些发生改变的文件
    var watcher = watchify(browserify({
        entries: [path.ENTRY_POINT], //Tyler/src/js/App.js, browserify会检测Tyler/src/js下的所有js文件，以及Tyler/src/js下所有子文件夹下的js文件
        transform: [reactify], //使用reactify把jsx转换成js文件
        debug: true, //告诉Browersify使用source maps, souce maps帮助我们在出现错误的时候定位到jsx中的错误行
        cache: {}, //必须的，browserify告诉我们这样使用
        packageCache: {}, //必须的，browserify告诉我们这样使用
        fullPath: true //必须的，browserify告诉我们这样使用
    }));

    return watcher.on('update', function() {
            watcher.bundle() //把所有的jsx文件绑定到一个文件
                .pipe(source(path.OUT))
                .pipe(gulp.dest(path.DEST_SRC));

            console.log('Updated');
        })
        .bundle()
        .pipe(source(path.OUT))
        .pipe(gulp.dest(path.DEST_SRC));
});

//默认的task
gulp.task('default', ['watch']);

//发布到生产环境之前
gulp.task('build', function() {
    browserify({
            entries: [path.ENTRY_POINT],
            transform: [reactify]
        })
        .bundle()
        .pipe(source(path.MINIFIED_OUT))
        .pipe(streamify(uglify(path.MINIFIED_OUT)))
        .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('replaceHTML', function() {
    gulp.src(path.HTML)
        .pipe(htmlreplace({
            'js': 'build/' + path.MINIFIED_OUT
        }))
        .pipe(gulp.dest(path.DEST));
});

gulp.task('production', ['replaceHTML', 'build']);