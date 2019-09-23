# @odjs/classes

[![CircleCI](https://circleci.com/gh/odjs/classes.svg?style=svg)](https://circleci.com/gh/odjs/classes) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=odjs/classes)](https://dependabot.com) [![npm](https://img.shields.io/npm/v/@odjs/classes.svg)](https://www.npmjs.com/package/@odjs/classes) [![codecov](https://codecov.io/gh/odjs/classes/branch/master/graph/badge.svg)](https://codecov.io/gh/odjs/classes) [![jsdelivr downloads](https://data.jsdelivr.com/v1/package/npm/@odjs/classes/badge?style=rounded)](https://www.jsdelivr.com/package/npm/@odjs/classes) [![dependencies](https://badgen.net/david/dep/odjs/classes)](https://david-dm.org/odjs/classes) [![devDependencies](https://badgen.net/david/dev/odjs/classes)](https://david-dm.org/odjs/classes?type=dev) [![npm type definitions](https://img.shields.io/npm/types/@odjs/classes.svg)](https://www.typescriptlang.org) [![Known Vulnerabilities](https://snyk.io//test/github/odjs/classes/badge.svg?targetFile=package.json)](https://snyk.io//test/github/odjs/classes?targetFile=package.json) [![NPM LICENSE](https://img.shields.io/npm/l/@odjs/classes.svg)](LICENSE)

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
  ["btn-small", "btn-red"],
  { "is-rounded has-border": true, "is-enable": false },
  { "has-border": false },
);

console.log(classname);
```

```console
> "btn btn-small btn-red is-rounded"
```

*note that* `"has-border"` *is not present in the resulting string, see [object normalization feature](#object-normalization) for more information.*

## Types

### ClassName

```typescript
type ClassName = string | ClassObject | ClassArray;
```

### ClassObject

```typescript
interface ClassObject {
  [key: string]: any;
}
```

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

## Features

### Object Normalization

*Objects with "multi-class" keys (keys that contain spaces) will be normalized, which allows to extend a "single-class" after it's been set from a "multi-class". It also trims any extra space in the object keys and ignore empty keys.*

***example***

```javascript
const classObj1 = {
  "btn btn-small is-rounded is-enabled": true,
};

const classObj2 = {
  "is-rounded": false,
};

const classname = classes(classObj1, classObj2),

console.log(classname);
```

```console
> "btn btn-small is-enabled"
```

*Using this feature within a single object should work most of the times, however since key-value-pair iteration order is implementation dependent, it may lead to unpredictable results and therefore it is not recommended.*

***example***

```javascript
const classObj = {
  "btn btn-small is-rounded is-enabled": true,
  "is-rounded": false,
};

const classname = classes(classObj);

console.log(classname);
```

```console
> "btn btn-small is-enabled" ...most of the times!
```

## License

[MIT](LICENSE) &copy; [Manuel Fernández](https://github.com/manferlo81)
