# @odjs/classes

[![CircleCI](https://circleci.com/gh/odjs/classes.svg?style=svg)](https://circleci.com/gh/odjs/classes) [![npm](https://badgen.net/npm/v/@odjs/classes)](https://www.npmjs.com/package/@odjs/classes) [![codecov](https://codecov.io/gh/odjs/classes/branch/master/graph/badge.svg)](https://codecov.io/gh/odjs/classes) [![jsDelivr](https://data.jsdelivr.com/v1/package/npm/@odjs/classes/badge?style=rounded)](https://www.jsdelivr.com/package/npm/@odjs/classes) [![dependencies](https://badgen.net/david/dep/odjs/classes)](https://david-dm.org/odjs/classes) [![dev dependencies](https://badgen.net/david/dev/odjs/classes)](https://david-dm.org/odjs/classes?type=dev) [![packagephobia](https://badgen.net/packagephobia/install/@odjs/classes)](https://packagephobia.now.sh/result?p=@odjs/classes) [![bundlephobia](https://badgen.net/bundlephobia/min/@odjs/classes)](https://bundlephobia.com/result?p=@odjs/classes) [![types](https://img.shields.io/npm/types/@odjs/classes.svg)](https://github.com/microsoft/typescript) [![Known Vulnerabilities](https://snyk.io/test/github/odjs/classes/badge.svg?targetFile=package.json)](https://snyk.io/test/github/odjs/classes?targetFile=package.json) [![license](https://badgen.net/github/license/odjs/classes)](LICENSE)

Classname management for [@odjs/dom](https://github.com/odjs/dom)

*While this project has been created to be used internally in [@odjs/dom](https://github.com/odjs/dom), it can be used as standalone both in Node.js and in the browser.*

## Install

```bash
npm i @odjs/classes
```

*For the browser you can use one of our [cdn](#cdn) scripts, or you can use a tool like Webpack, Browserify or Parcel.*

[*see usage section...*](#usage)

## API

***syntax***

```typescript
classes(...names: ClassName[]): string;
```

*Accepts any number of [ClassName](#classname) arguments and returns [normalized classname](#object-normalization) string.*

***example***

```javascript
const classname = classes(
  "btn",
  ["is-small", "is-red", "is-enable"],
  {
    "is-rounded has-border": (current) => current["is-enable"],
    "is-enable": false,
  },
  { "has-border": false },
);

console.log(classname);
```

```console
> "btn is-small is-red is-rounded"
```

*note that* `"has-border"` *is not present in the resulting string, see [object normalization feature](#object-normalization) for more information.*

## Types

### ClassName

```typescript
type ClassName = string | ClassObject | ClassArray;
```

### ClassObject

```typescript
type IsClassPresent = (current: { [key: string]: boolean }) => any;

interface ClassObject {
  [key: string]: IsClassPresent | any;
}
```

*see [Conditional Class](#conditional-class) for more info.*

### ClassArray

```typescript
interface ClassArray {
  [index: number]: ClassName;
}
```

## CDN

### jsDelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@odjs/classes@latest/dist/map.umd.js"></script>
```

*or for production...*

```html
<script src="https://cdn.jsdelivr.net/npm/@odjs/classes@latest/dist/map.umd.min.js"></script>
```

*[more options...](https://www.jsdelivr.com/package/npm/@odjs/classes?version=latest)*

### unpkg

```html
<script src="https://unpkg.com/@odjs/classes@latest/dist/map.umd.js"></script>
```

*for production...*

```html
<script src="https://unpkg.com/@odjs/classes@latest/dist/map.umd.min.js"></script>
```

*[more options...](https://unpkg.com/@odjs/classes@latest/)*

## Usage

### Node.js

```javascript
const classes = require("@odjs/classes");
element.className = classes("btn", { red: true });
```

### Browser

*After including the* `script` *tag in your html file,* `classes` *will be available globally.*

```javascript
element.className = classes("btn", { red: true });
```

## Iteration Order

*Object key iteration order is implementation dependent, which means there are no guarantees the iteration will happen in the order you declared them.*

***example***

```javascript
// BAD IDEA

classes({
  "btn is-red": true,
  "is-red": false,
});
```

*"is-red" may be present or it may not, use the following code for a predictable result.*

```javascript
classes(
  "btn is-red",
  { "is-red": false }
);
```

## Features

### Object Normalization

*Objects with "multi-class" keys (keys that contain spaces) and "multi-class" strings will be normalized, which allows to extend a "single-class" after it's been set from a "multi-class". It also trims any extra space in the object keys and ignore empty keys.*

***example***

```javascript
const classes1 = "btn is-small is-rounded is-enabled";

const classes2 = {
  "is-small": false,
  "is-medium": true,
};

const classes3 = {
  "is-rounded": false,
};

const classname = classes(
  classes1,
  classes2,
  classes3,
),

console.log(classname);
```

```console
> "btn is-enabled is-medium"
```

*Using this feature within a single is a bad idea. see [Iteration Order](#iteration-order) for more info. However, it will work most of the times.*

***example***

```javascript
// this is a bad idea
const classObj = {
  "button is-rounded is-enabled": true,
  "is-rounded": false,
};

const classname = classes(classObj);

console.log(classname);
```

```console
> "button is-enabled"

...most of the times!
however "is-rounded" may be present or it may not.
```

*Use the following code for a predictable result.*

```javascript
const base = "button is-rounded is-enabled";

const cond = {
  "is-rounded": false,
};

const classname = classes(base, cond);

console.log(classname);
```

```console
> "button is-enabled"

...always!
```

### Conditional Class

*When using a [ClassObject](#classobject) the object key will be used as classname and the value will determine whether that classname should be present in the final result. If the value if a function, it will be called with an object as only argument containing the current normalized state of the result.*

> *:warning:* ***DO NOT*** *rely on classnames within the same object to be included in the normalized object. see [Iteration Order](#iteration-order) for more info.*

***example***

```javascript
const classname = classes(
  "button is-enabled",
  "is-rounded",
  {
    "is-rounded": (current, classnames) => {
      // current = {
      //   button: true,
      //   "is-enabled": true
      //   "is-rounded": true
      // }
      // classnames = ['is-rounded']

      // note: is-rounded = true

      // returning undefined will case
      // the classname to be set to false
    }
  },
  {
    "is-red": (current, classnames) => {
      // current = {
      //   button: true,
      //   "is-enabled": true
      //   "is-rounded": false
      // }
      // classnames = ['is-red']

      // note: is-rounded = false
      // because it was set to false in the previous step

      return current["is-enabled"]
    },
  }
);

console.log(classname);
```

```console
> "button is-enabled is-red"
```

## License

[MIT](LICENSE) &copy; [Manuel Fernández](https://github.com/manferlo81)
