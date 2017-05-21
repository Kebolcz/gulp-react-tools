var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var htmlreplace = require('gulp-html-replace');

var path = {
    HTML: 'Tyler/dev/index.html',
    ALL: ['Tyler/dev/src/js/*.js', 'Tyler/dev/src/js/**/*.js', 'Tyler/dev/src/css/*.css', 'Tyler/dev/src/css/**/*.css','Tyler/dev/index.html'],
    JS: ['Tyler/dev/src/js/*.js', 'Tyler/dev/src/js/**/*.js'],
    CSS: ['Tyler/dev/src/css/*.css', 'Tyler/dev/src/css/**/*.css'],
    MINIFIED_OUT: 'build.min.js',
    DEST_SRC: 'Tyler/dist/src/js', //把从jsx文件转换而来的文件放这里
    DEST_BUILD: 'Tyler/dist/build',
    DEST: 'Tyler/dist'
};

//获取js的源文件，把jsx转换成js，放到目标文件夹
gulp.task('transform', function () {
    gulp.src(path.JS)
        .pipe(react())
        .pipe(gulp.dest(path.DEST_SRC))
})

//把Tyler/src/index.html这个文件复制放到Tyler/dist中
gulp.task('copy', function () {
    gulp.src(path.HTML)
        .pipe(gulp.dest(path.DEST));
});

//观察index.html和js文件的变化，执行以上的2个任务
gulp.task('watch', function () {
    gulp.watch(path.ALL, ['transform', 'copy']);
});

//名称为default的task，需要
gulp.task('default', ['watch', 'transform', 'copy']);

//发布到生产环境的task
gulp.task('build', function () {
    gulp.src(path.JS)
        .pipe(react())
        .pipe(concat(path.MINIFIED_OUT)) //合并到build.min.js文件中
        .pipe(uglify(path.MINIFIED_OUT)) //压缩build.min.js文件中
        .pipe(gulp.dest(path.DEST_BUILD));//把build.min.js文件放到Tyler/dist/build文件夹中
});

//在Tyler/dist/index.html中引用的js文件和Tyler/src/index.html中不一样，需要替换
gulp.task('replaceHTML', function () {
    gulp.src(path.HTML)
        .pipe(htmlreplace({
            'js': 'build/' + path.MINIFIED_OUT
        }))
        .pipe(gulp.dest(path.DEST));
});

//把发布到生产环境之前的所有任务再提炼
gulp.task('production', ['replaceHTML', 'build']);