/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _dragScale = __webpack_require__(/*! ./src/drag-scale.js */ \"./src/drag-scale.js\");\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./src/drag-scale.js":
/*!***************************!*\
  !*** ./src/drag-scale.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nTypeError: F:\\\\桌面\\\\drag-demo\\\\src\\\\drag-scale.js: Cannot read property 'bindings' of null\\n    at Scope.moveBindingTo (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\@babel\\\\traverse\\\\lib\\\\scope\\\\index.js:926:13)\\n    at BlockScoping.updateScopeInfo (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\babel-plugin-transform-es2015-block-scoping\\\\lib\\\\index.js:364:17)\\n    at BlockScoping.run (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\babel-plugin-transform-es2015-block-scoping\\\\lib\\\\index.js:330:12)\\n    at PluginPass.BlockStatementSwitchStatementProgram (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\babel-plugin-transform-es2015-block-scoping\\\\lib\\\\index.js:70:24)\\n    at newFn (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\@babel\\\\traverse\\\\lib\\\\visitors.js:179:21)\\n    at NodePath._call (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\@babel\\\\traverse\\\\lib\\\\path\\\\context.js:55:20)\\n    at NodePath.call (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\@babel\\\\traverse\\\\lib\\\\path\\\\context.js:42:17)\\n    at NodePath.visit (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\@babel\\\\traverse\\\\lib\\\\path\\\\context.js:90:31)\\n    at TraversalContext.visitQueue (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\@babel\\\\traverse\\\\lib\\\\context.js:112:16)\\n    at TraversalContext.visitSingle (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\@babel\\\\traverse\\\\lib\\\\context.js:84:19)\\n    at TraversalContext.visit (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\@babel\\\\traverse\\\\lib\\\\context.js:140:19)\\n    at Function.traverse.node (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\@babel\\\\traverse\\\\lib\\\\index.js:84:17)\\n    at traverse (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\@babel\\\\traverse\\\\lib\\\\index.js:66:12)\\n    at transformFile (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\transformation\\\\index.js:107:29)\\n    at transformFile.next (<anonymous>)\\n    at run (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\transformation\\\\index.js:35:12)\\n    at run.next (<anonymous>)\\n    at Function.transform (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\transform.js:27:41)\\n    at transform.next (<anonymous>)\\n    at step (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\gensync\\\\index.js:254:32)\\n    at F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\gensync\\\\index.js:266:13\\n    at async.call.result.err.err (F:\\\\桌面\\\\drag-demo\\\\node_modules\\\\gensync\\\\index.js:216:11)\");\n\n//# sourceURL=webpack:///./src/drag-scale.js?");

/***/ })

/******/ });