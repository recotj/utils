const gulp = require('gulp');

gulp.task('clean', (done) => {
	require('del')('./dist')
		.then(paths => {
			paths.forEach(path => console.log('delete: %s', path.replace(__dirname, '')));
			done();
		});
});

gulp.task('build:modules', () => {
	return gulp.src('./src/**')
		.pipe(require('gulp-babel')())
		.pipe(gulp.dest('./dist/modules/'));
});

gulp.task('entry', () => {
	const stream = require('stream');
	const pass = stream.PassThrough();
	pass.end(new Buffer(`module.exports = require('./*', {mode: 'hash'});`, 'utf8'));

	return pass.pipe(require('vinyl-source-stream')('entry.js'))
		.pipe(gulp.dest('./dist/modules/'));
});

gulp.task('build', () => {
	const browserify = require('browserify');
	const options = {
		entries: ['./entry.js'],
		basedir: './dist/modules/',
		standalone: 'RUtils',
		transform: [
			require('require-globify'),
			require('babelify')
		]
	};

	return browserify(options).bundle()
		.pipe(require('vinyl-source-stream')('utils.js'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('build:min', () => {
	const browserify = require('browserify');
	const options = {
		entries: ['./entry.js'],
		basedir: './dist/modules/',
		standalone: 'RUtils',
		transform: [
			require('require-globify'),
			require('babelify')
		],
		plugin: [
			require('browserify-derequire'),
			require('bundle-collapser/plugin')
		]
	};

	return browserify(options).bundle()
		.pipe(require('vinyl-source-stream')('utils.min.js'))
		.pipe(require('vinyl-buffer')())
		.pipe(require('gulp-uglify')({
			compress: {
				if_return: true,
				dead_code: true,
				drop_console: true,
				drop_debugger: true
			},
			output: {
				ascii_only: true
			}
		}))
		.pipe(gulp.dest('./dist/'));
});


gulp.task('release', (done) => {
	const run = require('run-sequence');
	return run(
		'clean',
		['build:modules', 'entry'],
		['build', 'build:min'],
		done
	);
});

gulp.task('default', (done) => {
	const run = require('run-sequence');
	return run(
		'clean',
		['build:modules', 'entry'],
		'build',
		done
	);
});
