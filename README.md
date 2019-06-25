# @odjs/classes

[![CircleCI](https://circleci.com/gh/odjs/classes.svg?style=svg)](https://circleci.com/gh/odjs/classes)

Classname management for [@odjs/dom](https://github.com/odjs/dom)

*While this project has been created to be used internally in [@odjs/dom](https://github.com/odjs/dom), it can be used as standalone both in Node.js and in the browser.*

## Install

```bash
npm i @odjs/classes
```

*For the browser you can use one of owr [cdn](#cdn) scripts, or you can use a tool like Webpack, Browserify or Parcel.*

[*see usage section...*](#usage)

## API

### classes

###### syntax

```typescript
classes(...names: ClassName[]): string;
```

*Accepts any number of [ClassName](#classname) arguments and returns normalized classname string.*

###### example

```javascript
classes(
  "btn",
  ["btn-small", "btn-red"],
  { "is-rounded has-border": true, "is-enable": false },
  { "has-border": false },
);
```

```console
> "btn btn-small btn-red is-rounded"
```

*note the* `"has-border"` *is not present in the resulting string, see [object normalization feature](#object-normalization) for more information.*

### fromArray

###### syntax

```typescript
fromArray(array: ClassName[] | ArrayLike<ClassName>): string;
```

*This method expects a single argument of type* [`ClassArray`](#classarray), *any other argument (if any) will be ignored.*

###### example

```javascript
fromArray([
  "btn",
  ["btn-small", "btn-red"],
  { "is-rounded": true, "is-enable": false },
]);
```

```console
> "btn btn-small btn-red is-rounded"
```

*See see [object normalization feature](#object-normalization) for more information.*

### fromObj

###### syntax

```typescript
fromObj(object: ClassObject, mormalize?: boolean): string;
```

*This method expects a [ClassObject](#classobject) as first and required argument, and an optional* `normalize` *argument, which set whether or not to normalize the input object. See see [object normalization feature](#object-normalization) for more information.*

###### example

```javascript
fromObj({
  "btn btn-small": true,
  "is-enabled": false,
});
```

```console
> "btn btn-small"
```

## Types

### ClassName

###### type

```typescript
type ClassName = string | ClassObject | ClassArray;
```

### ClassObject

###### interface

```typescript
interface ClassObject {
  [key: string]: any;
}
```

### ClassArray

###### interface

```typescript
interface ClassArray {
  [index: number]: string | ClassObject | ClassArray;
}
```

## CDN

### jsDelivr

*[www.jsdelivr.com](https://www.jsdelivr.com)*

```html
<script src="https://cdn.jsdelivr.net/npm/@odjs/classes@latest/dist/map.umd.js"></script>
```

##### for production

```html
<script src="https://cdn.jsdelivr.net/npm/@odjs/classes@latest/dist/map.umd.min.js"></script>
```

*[more options...](https://www.jsdelivr.com/package/npm/@odjs/classes?version=latest)*

### unpkg

*[unpkg.com](https://unpkg.com)*

```html
<script src="https://unpkg.com/@odjs/classes@latest/dist/map.umd.js"></script>
```

##### for production

```html
<script src="https://unpkg.com/@odjs/classes@latest/dist/map.umd.min.js"></script>
```

*[more options...](https://unpkg.com/@odjs/classes@latest/)*

## Usage

### Node.js

```javascript
const { classes } = require("@odjs/classes");
element.className = classes({ btn: true, red: true });
```

### Browser

*After including the* `script` *tag in your html file,* `classes` *will be available globally.*

```javascript
element.className = classes.classes({ btn: true, red: true });
```

## Features

### Object Normalization

*Objects with "multi-class" keys (keys that contain spaces) will be normalized, which allows to extend a "single-class" after it's been set as a "multi-class".*

###### example

```javascript
const classObj1 = {
  "btn btn-small is-rounded is-enabled": true,
};
const classObj2 = {
  "is-rounded": false,
};

console.log( classes(classObj1, classObj2) );
console.log( fromArray([classObj1, classObj2]) );
```

```console
> "btn btn-small is-enabled"
> "btn btn-small is-enabled"
```

*Using this feature within a single object should work most of the times, however since key-value-pair iteration order is implementation dependent, it may lead to unpredictable results and therefore it is optional and not recommended. Pass an argument that evaluates to* `true` *to* `fromObj` *to enable optimization.*

```javascript
const classObj = {
  "btn btn-small is-rounded is-enabled": true,
  "is-rounded": false,
};

console.log( fromObj(classObj, true) );
```

```console
> "btn btn-small is-enabled" > most of the times!
```

## License

[MIT](LICENSE) &copy; [Manuel Fernández](https://github.com/manferlo81)
