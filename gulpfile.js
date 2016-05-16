/**
 *  在该目录执行gulp命令时，会自动寻找目录下的名为gulpfile.js文件，然后根据输入的命令参数，查询对应的task并执行
 */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    config = {
        srcPath: './src/scss/**/*.scss',
        // includePaths: ["./src/scss"],
        outputPath: './src/css/'
    };

var argv = require('yargs').argv;

// 定义名为scss的任务，可以再控制台通过“gulp scss”的方式执行这个任务
// 该任务的功能是将config中定义的scss目录的内容编译生成css并输出到config中指定的css目录
gulp.task('scss', function () {
    //如果不传参数则编译所有
    var srcPath = config.srcPath,
        outputPath = config.outputPath;

  return gulp.src(srcPath)
    .pipe(sourcemaps.init())
    .pipe(sass({
            'outputStyle': 'nested',
            'errLogToConsole': true,
            'includePaths': config.includePaths
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('/map'))
    .pipe(gulp.dest(outputPath));
});

// scss watch   支持参数一对多 gulp watch:scss -p com -p admin
gulp.task('watch:scss', ['scss']/*先运行一遍scss*/, function () {

    var resArr = [];
    var pArr = Array.isArray(argv.p) ? argv.p : [argv.p];

    //过滤掉无用参数值
    pArr = pArr.filter(function(item){
        var filter = item in config.srcPath;
        if(!filter && item !== undefined){
            console.log('您传入的参数-p: ' + item + ' 有误');
        }
        return filter && item !== 'all';
    });

    if(!pArr.length){
        pArr.push('all');
    }

    pArr.forEach(function(item){
        console.log('********您已开启watch:'+ item + ' *********');
        var cssWatcher = gulp.watch(config.srcPath[item], ['scss']);
        //输出文件变更日志
        cssWatcher.on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type);
        });

    });




});


// scss watch 
gulp.task('watch', ['watch:scss']);



