const loader = require('./lib/cssUnit-loader');

describe('test loader', () => {
  test('should transform px value into `calc(${value}px * var(--doc-scale))`', () => {
    let output = loader.call({}, 'body {width: 750px}');
    expect(output).toBe('body {\n  width: calc(750px * var(--doc-scale));\n}');
  });

  test('should not transform px value and remove single quote', () => {
    let output = loader.call({}, "body {width: '750px'}");
    expect(output).toBe('body {\n  width: 750px;\n}');
  });
});

describe('Transform Media Query & Key Frames', () => {
  test('should support @media', () => {
    let output = loader.call(
      {},
      '@media only screen and (max-width: 500px) { body { width: 200px; }}'
    );
    expect(output).toBe(
      '@media only screen and (max-width: 500px) {\n  body {\n    width: calc(200px * var(--doc-scale));\n  }\n}'
    );
  });

  test('should support @keyframes', () => {
    let output = loader.call(
      {},
      '@keyframes anim {0% {height: 75px; border-width: 2px; } 100% { height: 150px; border-width: 2px; }}'
    );
    expect(output).toBe(
      '@keyframes anim {\n  0% {\n    height: calc(75px * var(--doc-scale));\n    border-width: calc(2px * var(--doc-scale));\n  }\n\n  100% {\n    height: calc(150px * var(--doc-scale));\n    border-width: calc(2px * var(--doc-scale));\n  }\n}'
    );
  });
});

describe('Loader Query', () => {
  test('should support `units` query', function () {
    let output = loader.call(
      { query: '?units=rem' },
      '.main.content {width: 100rem; height: 50rem}'
    );
    expect(output).toBe(
      '.main.content {\n  width: calc(100rem * var(--doc-scale));\n  height: calc(50rem * var(--doc-scale));\n}'
    );
  });

  test('should support `exceptText` query(default)', function () {
    let output = loader.call(
      { query: '?exceptText=--doc-scale' },
      'body {width: calc(75px * var(--doc-scale))}'
    );
    expect(output).toBe('body {\n  width: calc(75px * var(--doc-scale));\n}');
  });

  test('should support `exceptText` query(customize)', function () {
    let output = loader.call(
      { query: '?exceptText=calc' },
      'body {width: calc(100px - 20px)}'
    );
    expect(output).toBe('body {\n  width: calc(100px - 20px);\n}');
  });

  test('should support `exceptSelect` query', function () {
    let output = loader.call(
      { query: '?exceptSelect=.main' },
      '.main.content {width: 100px; height: 50px}'
    );
    expect(output).toBe('.main.content {\n  width: 100px;\n  height: 50px;\n}');
  });

  test('should support `rule` query', function () {
    let output = loader.call(
      {
        query: {
          rule: (value)=>{
            return value * 2 + 'px'
          }
        },
      },
      '.body {width: 100px; height: 50px}'
    );
    expect(output).toBe(
      '.body {\n  width: 200px;\n  height: 100px;\n}'
    );
  });

  test('should support `exceptProperty` query', function () {
    let output = loader.call(
      {
        query: {
          exceptProperty: 'width'
        },
      },
      '.body {width: 100px; height: 50px}'
    );
    expect(output).toBe(
      '.body {\n  width: 100px;\n  height: calc(50px * var(--doc-scale));\n}'
    );
  });
});
