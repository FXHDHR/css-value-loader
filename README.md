<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

# cssUnit-loader

用户可自定义规则进行css单位转换的webpack Loader，您可以传入规则，对css单位进行个性化转换。

## 安装

```console
npm install --save-dev cssunit-loader
```

## 用法

**webpack.config.js**

cssunit-loader输入的是css文件，如使用sass/less等预处理语言，需先使用sass-loader/less-loader进行转换

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'cssunitloader',
            options: {},
          },
        ],
      },
    ],
  },
};
```

## Options

|                  名称                   |    类型    |    默认值     | 描述                                  |
| :-------------------------------------: | :--------: | :-----------: | ------------------------------------- |
|           **[`unit`](#unit)**           |  {String}  |     'px'      | 需要转化的css单位                     |
|           **[`rule`](#rule)**           | {Function} | [见下](#rule) | 自定义转化规则函数                    |
|   **[`exceptSelect`](#exceptSelect)**   |  {String}  |   '.except'   | 在转化时忽略的css类                   |
| **[`exceptProperty`](#exceptProperty)** |  {String}  | 'background'  | 如css属性名包含此字符串，则不进行转化 |
|     **[`exceptText`](#exceptText)**     |  {String}  | '--doc-scale' | 如css值包含此字符串，则不进行转化     |

###  **`unit`**

类型: `String`

默认值: `'px'`

可自定义需要转化的css单位，包括但不限于px、rem。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'cssunitloader',
            options: {
              unit: 'rem',
            },
          },
        ],
      },
    ],
  },
};
```

###  **`rule`**

类型: `Function`

默认值：

```js
(value) => {
  return `calc(${value}px * var(--doc-scale))`;
}
```

自定义转化规则函数，用户可随意定义，传入一个函数，参数为匹配的属性值数字部分，需return一个结果。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'cssunitloader',
            options: {
              // value 即是匹配的属性值数字部分，比如10px，value代表的是10
              rule: (value) => { 
                return `calc(${value}px * var(--doc-scale))`;
              },
            },
          },
        ],
      },
    ],
  },
};
```

#### **示例**

```css
// 转化前
.main{
	width: 38px;
}

//转化后
.main{
	width: calc(38px * var(--doc-scale));
}
```

### **`exceptSelect`**

类型: `String`

默认值: `'.except'`

在进行转化时，如果css中含有这个选择器，则不进行替换。用户可自定义，为保证匹配准确性，此类名后必须是[如下形式](#exceptSelect)。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'cssunitloader',
            options: {
              exceptSelect: '.except',
            },
          },
        ],
      },
    ],
  },
};
```

#### **示例**

```css
// 转化前
.except.main{ // .expect必须紧跟.
	width: 10px;
}

//转化后
.except.main{
	width: 10px;
}
```

###  **`exceptProperty`**

类型: `String`

默认值: `'background'`

在进行转化时，如果css属性名中含有此字符，则不进行替换，用户可自定义，具体可看示例。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'cssunitloader',
            options: {
              exceptProperty: 'background',
            },
          },
        ],
      },
    ],
  },
};
```

#### **示例**

```css
// 转化前，属性名只要包含'background'就不转化
.main{
	background: url('');
    background-size: 100% 100%;
    background-position: 100px 100px;
}

//转化后
.main{
	background: url('');
    background-size: 100% 100%;
    background-position: 100px 100px;
}
```

###  **`exceptText`**

类型: `String`

默认值: `'--doc-scale'`

在进行转化时，如果css属性值中含有此字符，则不进行替换，用户可自定义，具体可看示例。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'cssunitloader',
            options: {
              unit: '--doc-scale',
            },
          },
        ],
      },
    ],
  },
};
```

#### **示例**

```css
// 转化前，属性值只要包含'--doc-scale'就不转化
.main{
	width: calc(38px * var(--doc-scale));
}

//转化后
.main{
	width: calc(38px * var(--doc-scale));
}
```

## **忽略转换规则**

如果不希望对结果进行转化，可参照如下操作，此为本loader内置属性，暂不可自定义。

#### **示例**

```css
// 转化前，属性值用单引号包裹，转化后输出不带单引号部分
.main{
	width: '38px';
}

//转化后
.main{
	width: 38px;
}
```