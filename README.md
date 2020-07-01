# 水印

## 下载

```
git clone git@github.com:freeethy/may-watermark.git
```

## 项目运行

```
yarn install
yarn run build
```

build 后会打包两个文件到 dist：

- watermark-xxx.min.js (xxx 为 package.json 中的 version)  
  这个文件可以直接通过 script 加载，见 /demo/link，访问此文件下的 html 即可观察效果

  **使用方式**：

        ```javascript
        <script src="./lib/watermark-xxx.min.js"></script>
        <script>
            window.onload = function () {
                window.MayWaterMark.init({
                    name: "staff",
                    color: "gray",
                    auto: false,
                    container: document.querySelector('.test')
                });
            }
        </script>
        ```

- watermark.js (xxx 为 package.json 中的 version)  
   这个文件是 umd 包，可通过 **require** 或 **import** 引入使用。
  见 /demo/import，此 demo 项目需要先执行 **yarn install**，**yarn run build**命令打包，然后其访问/src/index.html 即可看到效果。

  **使用方式**：

  ```javascript
  import MayWaterMark from "./lib/watermark.js";

  MayWaterMark.init({
    name: "may-watermark",
    color: "gray",
    container: document.querySelector(".test")
  });
  ```

  > 如果上述引用后报错 MayWaterMark undefined，在 webpack 解析 js 的 rule 中加上 exclude: [path.resolve("src/lib/watermark.js")]

## 开发

开发时需注意，使用 **require** 和 **module.exports** 进行导入、导出，否则可能出现打包后调用失败的情况。

**有修改源码的话提交代码前先执行 yarn run build**

## 调试（demo 中引用的 watermark 文件需修改成打包后的版本号）

### 调试 link demo

```
yarn run start:dev
```

访问 http://localhost:8080/ ，端口修改为启动服务的端口

### 调试 import demo

```
cd demo
cd import
yarn install
yarn run build
yarn run start:dev
```

访问 http://localhost:8080/ ，端口修改为启动服务的端口

## 测试

```
yarn run test
```

测试框架使用 Jest，配置简单，集成度高。  
控制台打印测试报告，会在根目录下生成 coverage 文件，浏览器访问 **/coverage/lcov-report/index.html** 即可查看测试报告结果。

## 设计方案

### 调用方式

> 按 【项目运行】 章节

### api 设计

目前提供以下几个 API

#### init

初始化水印信息

```javascript
MayWaterMark.init({
  auto: true,
  name: "staff",
  color: "gray",
  hasAuthority: true
});
```

| 属性         | 功能                                                 | 类型       | 默认值                                                     |
| ------------ | ---------------------------------------------------- | ---------- | ---------------------------------------------------------- |
| auto         | false 直接添加水印，true 水印添加受权限控制        | boolean    | false                                                      |
| hasAuthority     | 是否有权限显示水印 | boolean     | true（**auto 为 true 时传**）                              |
| name         | 水印文字                                             | string     | watermark                                                     |
| color        | 水印颜色                                             | string     | rgba(230, 230, 230, 0.8)                                   |
| container    | 需要设置水印背景的原生元素                           | DOMElement | document.body                                              |
| width        | 水印间隔宽度                                         | string     | 200px                                                      |
| height       | 水印间隔高度                                         | string     | 150px                                                      |
| opacity      | svg 模式下，水印透明度                               | string     | 0.8                                                        |
| font         | 水印字体样式                                         | string     | 20px 黑体                                                  |
| textAlign    | 水印对齐方式                                         | string     | center                                                     |
| textBaseling | 水印文字基准                                         | string     | middle                                                     |
| rotate       | 水印文字旋转角度                                     | string     | 10                                                         |
| zIndex       | 水印元素的 z-index                                   | number     | 9999                                                       |

**备注**

1. 如果**auto 为 true**，则会在接口调用成功后根据hasAuthority(默认为true)调用**MayWaterMark.add**; auto 为 false 则会自动调用**MayWaterMark.add**添加水印。  
2. 目前只能给一个 **container** 添加水印。

#### add

参数：无  
 根据已有配置生成并添加水印，建议配合 **auto:true** 使用。

```javascript
MayWaterMark.add();
```

#### addForImg

给图片添加水印，需要每张图片单独处理

```
MayWaterMark.addForImg({
  url: 'http://xxx.xxx/a/test.jpg'
})
```

| 属性         | 功能                                                  | 默认值                   |
| ------------ | ----------------------------------------------------- | ------------------------ |
| url          | 图片地址                                              | 必填                     |
| name         | 水印文字                                              | this.config.name         |
| color        | 水印颜色                                              | this.config.color        |
| font         | 水印字体样式                                          | this.config.font         |
| textAlign    | 水印对齐方式                                          | this.config.textAlign    |
| textBaseling | 水印文字基准                                          | this.config.textBaseline |
| textX        | 水印距离图片右边的距离                                | 100                      |
| textY        | 水印距离图片下边的距离                                | 30                       |
| cb           | 水印添加成功后的回调，参数为水印图片的 base64Url 格式 |                          |

**备注**：部分参数的默认值为 init 传入的配置值，在 this.config 中。

### 实现功能

1. 根据传入的配置生成背景水印。
2. 支持通过 script 引入方式，及 umd、import 模式加载。
3. 监听水印节点，只可读不可写，兼容到 IE11

### 出错处理

- 调用 API 时判断传入的 config 格式，如果格式错误则提示
- 不支持 canvas 的浏览器使用 svg 图片做背景

## TODO

以下功能是否需要？

- [x] 不使用 babel 编译的话，字符串模板需改成字符串拼接
- [] 暂未加入各种 lint
- [x] 未加入测试
- [x] 制作成 npm 包，提交到内部 npm 仓库，直接通过 npm 进行安装、更新
- [] 暂不支持多个节点分开添加水印
- [x] 未加入删除水印方法（去掉此功能，不可删除）
- [x] 未支持图片水印
- [x] canvas 和 svg 配置需完善
- [] 监听 DOM 变动的 API MutationObserver 只兼容到 IE11
