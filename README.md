# Grunt Guide

- [Grunt](#grunt)
  * [Grunt-vs-Gulp](#grunt-vs-gulp)
- [Install](#install)
  * [Grunt-CLI](#grunt-cli)
  * [Gruntfile.js/Package.json](#gruntfile.js/package.json)
    * [Gruntfile.js](#gruntfile.js)
    * [Package.json](#package.json)
- [주요플러그인](#주요플러그인)
  * [load-grunt-tasks](#load-grunt-tasks)
  * [time-grunt](#time-grunt)
  * [grunt-contrib-watch](#grunt-contrib-watch)
  * [grunt-usemin](#grunt-usemin)
  * [grunt-include-replace](#grunt-include-replace)
  * [grunt-prettify](#grunt-prettify)
  * [grunt-contrib-compass](#grunt-contrib-compass)
  * [grunt-autoprefixer](#grunt-autoprefixer)
  * [grunt-spritesmith](#grunt-spritesmith)
  * [grunt-contrib-imagemin](#grunt-contrib-imagemin)

## Grunt

Grunt는 자바스크립트 기반의 자동화 도구로써, 개발시 빌드 작업 중 많은 기능을 자동으로 수행하여 불필요한 리소스를 절약하고, 실수를 줄일 수 있어 굉장히 유용한 툴이다. 예를 들어 코드 디버깅, HTML/CSS/JS 파일 통합 및 압축 등을 빠르게 수행하며, 이와 비슷한 도구로 Gulp가 존재한다.	

### Grunt-vs-Gulp

Gulp는 Grunt에 비해 코드가 비교적 간단한 편이며, 일반적으로 한 번에 하나의 작업만 처리가 가능한 Grunt와 달리 동시에 여러 작업을 처리할 수 있다. 또한, 요청 후 한번에 결과를 받는 I/O 방식인 Grunt와 달리 Gulp는 이벤트 중간중간 전달받는 방식인 Stream 기반으로 수행 속도도 더 빠르다. 플러그인 지원에 관해서는 [Gulp](https://gulpjs.com/plugins/)는 약 3,500개, [Grunt](https://gruntjs.com/plugins)는 약 6,400개로 Grunt가 좀더 다양한 플러그인이 존재한다.



## Install

(`Node.js`가 설치되어있다는 가정하에 설명)

### Grunt-CLI

Grunt's Command Line Interface(CLI)를 설치하면, 콘솔 어디서나 `grunt`를 실행할 수 있다.

```
$ npm install -g grunt-cli
```

### Gruntfile.js/Package.json

프로젝트 수행시 `gruntfile.js` 와 `package.json` 파일이 존재해야 한다.
직접 파일을 만들 수도 있지만 `grunt-init`이라는 템플릿 생성 도구를 통해 생성하는 방법도 있다.

> `grunt-init`로 `gruntfile.js` 와 `package.json`을 생성하는 방법
>
> ```
> $ npm install -g grunt-init
> $ git clone https://github.com/gruntjs/grunt-init-gruntfile.git ~/.grunt-init/gruntfile
> $ grunt-init gruntfile
>
> # node modules 세팅을 위해 npm install
> $ npm install
> ```



#### Gruntfile.js

- task를 설정하거나 정의하고, grunt 플러그인을 불러오는데 사용한다. (아래 예시 참고)

  ```javascript
  module.exports = function(grunt) {
      grunt.initConfig({
          watch: {
              gruntfile: {
                  files: '<%= prj.app %>',
                  tasks: ['jshint:gruntfile']
              }
          }
      });
      grunt.loadNpmTasks('grunt-contrib-watch');
      grunt.registerTask('default', ['watch']);
  }
  ```

- 내부 구조

  - wrapper 함수 : 말그대로 코드 전체를 감싸는 함수

    ```javascript
    module.exports = function(grunt) { ... };
    ```

  - 프로젝트의 내부 task 환경설정

    ```javascript
    grunt.initConfig({ ... });
    ```

  - grunt 플러그인과 task 불러오기

    ```javascript
    grunt.loadNpmTasks(플러그인명);
    //ex: grunt.loadNpmTasks('grunt-contrib-watch');
    ```

  - 사용자 정의 task 설정
    사용자가 원하는 task를  `grunt task실행어` 와 같은 간단한 명령어만으로 실행가능케 해준다. 
    원하는 task실행어를 정의하고, 실행시킬 task들을 [ ]안에 순서대로 추가한다. 여러개의 task를 묶어서 정의할 때 유용하다. task실행어가 'default' 일 경우 grunt만 입력해도 실행된다. (=grunt default)

    ```javascript
    grunt.registerTask('task실행어', ['task명'])
    //ex: grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
    ```

#### Package.json

- 프로젝트에 필요한 grunt와 grunt 플러그인을 비롯한 여러가지 정보를 저장하는 파일이다. (아래 예시 참고)

  ```javascript
  {
      "name": "Project",
      "version": "1.0.0",
      "description": "Project description",
      "dependencies": {
          "grunt": "^1.0.2",
          "grunt-contrib-compass": "^1.1.1",
          "grunt-contrib-compress": "^1.4.3",
          "grunt-contrib-concat": "^1.0.1"
      },
      "devDependencies": {
          "grunt-gh-pages": "^2.0.0"
      }
  }
  ```

  > `dependencies`와 `devDependencies`의 차이?
  >
  > `dependencies`는 프로젝트 운영에 사용되는 플러그인, `devDependencies`는 운영이 아닌 개발 및 테스트 단계에서만 필요한 플러그인을 명시한다. 플러그인 설치 명령어에 `--save` 대신 `--save-dev`로 설치하면 `devDependencies` 항목에 추가된다.
  >
  > ```
  > $ npm install 플러그인명 --save-dev
  > ```

## 주요플러그인

앞서 다룬 기본적인 내용을 토대로, 프로젝트 환경 최적화를 위한 주요 플러그인을 소개하겠다.

### [load-grunt-tasks](https://www.npmjs.com/package/load-grunt-tasks)

기본적으로 `gruntfile.js`에서 task를 불러올 때, `grunt.loadNpmTasks();` 와 같은 구문을 사용한다. 이럴 경우, 일일이 수작업으로 task를 추가해주어야한다.

```javascript
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-watch');
```

아래 구문으로 변경할 경우, 자동으로 package.json속 플러그인을 분석해서 모든 tasks를 불러온다.

```javascript
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
};
```



### [time-grunt](https://www.npmjs.com/package/time-grunt)

각 task를 수행하는데 걸린 작업시간을 콘솔에 출력한다. 최적화시 유용하게 쓰인다.

```javascript
module.exports = function(grunt) {
    require('time-grunt')(grunt);
};
```

```
$ Execution Time (2018-05-03 16:05:25 UTC+9)
$ clean:dist           50ms  ███ 6%
$ jshint:dist          31ms  ██ 4%
$ jshint:gruntfile     30ms  ██ 4%
$ imagemin:dist       466ms  ██████████████████████████ 60%
$ useminPrepare:html   72ms  ████ 9%
$ concat:generated     19ms  ██ 2%
$ uglify:generated     47ms  ███ 6%
$ cssmin:generated     16ms  █ 2%
$ copy:dist            26ms  ██ 3%
$ usemin:html          16ms  █ 2%
$ Total 779ms
```



### [grunt-contrib-watch](https://www.npmjs.com/package/grunt-contrib-watch)

파일 변경사항이 발생할 경우, 이를 감지하여 자동으로 task를 수행한다. `spawn` 옵션값을 `false`로 지정시, task 실행속도가 빨라진다. (아래는 SCSS 파일 수정시, CSS 관련 task가 수행되도록 하는 예시)

```javascript
module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
        	compass: {
                files: ['<%= prj.app %>/scss/*.{scss,sass}'],
                tasks: ['cssTasks'],
                options: {
                    spawn: false
                }
            }
        }
    });
    grunt.registerTask('cssTasks', ['sprite', 'compass', 'autoprefixer']);
};
```



### [grunt-usemin](https://www.npmjs.com/package/grunt-usemin)

html에서 선언한 JS/CSS를 패키징할 수 있다. `grunt-usemin`은 `useminPrepare`과 `usemin`, 이렇게 2가지 단계로 나뉜다. `useminPrepare`에서는 `concat`, `uglify`, `cssmin`을 위한 설정을 지정하는 준비단계이며, `usemin`에서는 실제 병합/압축을 하는 과정이 이뤄지는 단계이다. `concat`, `uglify`, `cssmin`의 task를 수행한다. 각 task를 분리하여 option을 사용해 정의할 수도 있다.

- concat : 여러개의 파일을 하나의 파일로 합쳐준다. (CSS 또는 JS)
- uglify : JS 파일을 축소한다.
- cssmin : CSS 파일을 축소한다.

아래와 같이, html 파일에서 패키징(`concat`)할 파일을 block화 하여 앞뒤로 주석을 넣어준다. 주석만으로 지정한 파일을 자동으로 하나의 파일로 합쳐준다.

```html
<html>
<head>
<title>usemin example</title> 
	<!-- build:css ../public/css/service.min.css -->
	<link rel="stylesheet" href="../public/css/common.css">
	<link rel="stylesheet" href="../public/css/service.css">
	<!-- endbuild -->
</head>
<body>
	<!-- build:js ../public/js/service.min.js -->
	<script src="../public/js/common.js"></script>
	<script src="../public/js/main.js"></script>
	<!-- endbuild -->
</body>
</html>
```

위와 같이 마크업 구현을 한 뒤, 빌드를 할 경우 결과는 아래와 같다.

```html
<html>
<head>
<title>usemin example</title> 
	<link rel="stylesheet" href="../public/css/service.min.css">
</head>
<body>
	<script src="../public/js/service.min.js"></script>
</body>
</html>
```

`gruntfile.js` 에서는 아래와 같이 task를 정의한다.

```javascript
module.exports = function(grunt) {
    grunt.initConfig({
        useminPrepare: {
            html: '<%= prj.app %>/html/*.html',
            options: {
                dest: '<%= prj.dist %>/html'
            }
        },
        usemin: {
            html: '<%= prj.dist %>/html/*.html'
        },
    });
    // task실행명을 'build'로 정의하여 묶어 사용한 예시
    grunt.registerTask('build', [
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'usemin'
    ]);
};
```



### [grunt-include-replace](https://www.npmjs.com/package/grunt-include-replace)

자주 사용하는 html 파일을 분리하여, 간단한 include 선언문을 통해 불러올 수 있도록 해준다. 수정된 내용을 바로 확인할 수 있도록 `watch` 구문에 `includereplace` task를 추가하여 사용하는 것이 좋다.

```javascript
module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            includes: {
                files: [
                    '<%= prj.app %>/html/tpls/*.html',
                    '<%= prj.app %>/html/include/*.html'
                ],
                tasks: [
                    'includereplace',
                ]
            }
        },
        includereplace: {
            dev: {
                cwd: '<%= prj.app %>/html/tpls',
                src: '*.html',
                dest: '<%= prj.app %>/html/',
                expand: true
            }
        }
    });
};
```



### [grunt-prettify](https://www.npmjs.com/package/grunt-prettify)

html 코드를 옵션값에 맞게 깔끔한 코드로 정리해주는 역할을 한다.

```javascript
module.exports = function(grunt) {
    grunt.initConfig({
        prettify: {
            options: {
                'indent': 1, // 들여쓰기 크기(기본값: 2)
                'indent_char': '\t', // space or tab(기본값: space)
                'indent_inner_html': false // <body>와 <head>섹션의 들여쓰기 여부
            },
            dist: {
                expand: true,
                cwd: '<%= prj.dist %>/html',
                src: '*.html',
                dest: '<%= prj.dist %>/html'
            }
        }
    });
};
```



### [grunt-contrib-compass](https://www.npmjs.com/package/grunt-contrib-compass)

SCSS 파일을 CSS로 컴파일해주는 역할을 한다.

```javascript
module.exports = function(grunt) {
    grunt.initConfig({
        compass: {
            dist: {
                options: {
                    sassDir: '<%= prj.app %>/scss', // SCSS 파일 경로
                    cssDir: '<%= prj.app %>/css', // CSS 파일 보관할 경로
                    outputStyle: 'compact' // CSS 출력모드 (nested|expanded|compressed)
                }
            }
        }
    });
};
```



### [grunt-autoprefixer](https://www.npmjs.com/package/grunt-autoprefixer)

크로스브라우징에 필요한 접두사가 붙은 CSS 속성을, 각 브라우저 버전에 맞춰 자동으로 추가해준다.

```javascript
module.exports = function(grunt) {
	grunt.initConfig({
		autoprefixer: {
    		options: {
                browsers: [
                    '> 1%', // 전세계 인구의 1% 이상이 사용하는 브라우저
                    'Last 2 versions', // 각 브라우저의 최신 2가지 버전
                    'iOS >= 6',
                    'Android 2.3',
                    'Android >= 4',
                    'ie >= 8',
                    'Firefox >= 20',
                    'Opera >= 10'
                ]
            },
            dist: {
                src: '<%= prj.app %>/css/*.css'
            }
        }
    });
};
```



### [grunt-spritesmith](https://www.npmjs.com/package/grunt-spritesmith)

sprite 이미지를 자동으로 생성해주는 역할을 한다. (아래는 레티나 대응 예시)

```javascript
module.exports = function(grunt) {
	grunt.initConfig({
        sprite: {
            dist: {
                src: '<%= prj.app %>/img/sprites/*.png',
                retinaSrcFilter: '<%= prj.app %>/img/sprites/*@2x.png',
                dest: '<%= prj.app %>/img/sp.png',
                retinaDest: '<%= prj.app %>/img/sp@2x.png',
                destCss: '<%= prj.app %>/scss/_sprites.scss',
                padding: 2 // sprite 요소 사이 간격(px)
            }
        }
    });
};
```

sprite 요소 이미지를 일반 사이즈(ex: ico.png)와 레티나용(ex: ico@2x.png) 사이즈, 이렇게 2개를 sprites 폴더 안에 넣고, SCSS 코드에 아래와 같이 sprite 관련 구문을 추가 후 저장하면 sprite 이미지가 생성된다.

```scss
@import '_sprites';
.icon {
    @include sprite($ico);
}
```



### [grunt-contrib-imagemin](https://www.npmjs.com/package/grunt-contrib-imagemin)

이미지의 용량을 축소시켜주는 역할을 하며, 최적화 레벨을 정할 수 있다. (0~7)

```javascript
module.exports = function(grunt) {
	grunt.initConfig({
        imagemin: {
            dist: {
                options: {
                    optimiztionLevel: 5, // png
                    progressive: true, // jpg (기본값: true로 생략 가능)
                    interlaced: true // gif (기본값: true로 생략 가능)
                },
                files: [{
                    expand: true,
                    cwd: '<%= prj.app %>/img',
                    src: [
                        '**/*.{png,jpg,jpeg,gif}',
                        '!sprites/*.*'
                    ],
                    dest: '<%= prj.dist %>/img'
                }]
            }
        }
    });
};
```

