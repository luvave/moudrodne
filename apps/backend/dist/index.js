"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/dotenv/package.json
var require_package = __commonJS({
  "../../node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.4.7",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// ../../node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "../../node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs = require("fs");
    var path = require("path");
    var os = require("os");
    var crypto = require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _log(message) {
      console.log(`[dotenv@${version}][INFO] ${message}`);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path2 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path2, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path2} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// ../../node_modules/tsconfig-paths/lib/filesystem.js
var require_filesystem = __commonJS({
  "../../node_modules/tsconfig-paths/lib/filesystem.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.removeExtension = exports2.fileExistsAsync = exports2.readJsonFromDiskAsync = exports2.readJsonFromDiskSync = exports2.fileExistsSync = void 0;
    var fs = require("fs");
    function fileExistsSync(path) {
      if (!fs.existsSync(path)) {
        return false;
      }
      try {
        var stats = fs.statSync(path);
        return stats.isFile();
      } catch (err) {
        return false;
      }
    }
    exports2.fileExistsSync = fileExistsSync;
    function readJsonFromDiskSync(packageJsonPath) {
      if (!fs.existsSync(packageJsonPath)) {
        return void 0;
      }
      return require(packageJsonPath);
    }
    exports2.readJsonFromDiskSync = readJsonFromDiskSync;
    function readJsonFromDiskAsync(path, callback) {
      fs.readFile(path, "utf8", function(err, result) {
        if (err || !result) {
          return callback();
        }
        var json = JSON.parse(result);
        return callback(void 0, json);
      });
    }
    exports2.readJsonFromDiskAsync = readJsonFromDiskAsync;
    function fileExistsAsync(path2, callback2) {
      fs.stat(path2, function(err, stats) {
        if (err) {
          return callback2(void 0, false);
        }
        callback2(void 0, stats ? stats.isFile() : false);
      });
    }
    exports2.fileExistsAsync = fileExistsAsync;
    function removeExtension(path) {
      return path.substring(0, path.lastIndexOf(".")) || path;
    }
    exports2.removeExtension = removeExtension;
  }
});

// ../../node_modules/tsconfig-paths/lib/mapping-entry.js
var require_mapping_entry = __commonJS({
  "../../node_modules/tsconfig-paths/lib/mapping-entry.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getAbsoluteMappingEntries = void 0;
    var path = require("path");
    function getAbsoluteMappingEntries(absoluteBaseUrl, paths, addMatchAll) {
      var sortedKeys = sortByLongestPrefix(Object.keys(paths));
      var absolutePaths = [];
      for (var _i = 0, sortedKeys_1 = sortedKeys; _i < sortedKeys_1.length; _i++) {
        var key = sortedKeys_1[_i];
        absolutePaths.push({
          pattern: key,
          paths: paths[key].map(function(pathToResolve) {
            return path.resolve(absoluteBaseUrl, pathToResolve);
          })
        });
      }
      if (!paths["*"] && addMatchAll) {
        absolutePaths.push({
          pattern: "*",
          paths: ["".concat(absoluteBaseUrl.replace(/\/$/, ""), "/*")]
        });
      }
      return absolutePaths;
    }
    exports2.getAbsoluteMappingEntries = getAbsoluteMappingEntries;
    function sortByLongestPrefix(arr) {
      return arr.concat().sort(function(a, b) {
        return getPrefixLength(b) - getPrefixLength(a);
      });
    }
    function getPrefixLength(pattern) {
      var prefixLength = pattern.indexOf("*");
      return pattern.substr(0, prefixLength).length;
    }
  }
});

// ../../node_modules/tsconfig-paths/lib/try-path.js
var require_try_path = __commonJS({
  "../../node_modules/tsconfig-paths/lib/try-path.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.exhaustiveTypeException = exports2.getStrippedPath = exports2.getPathsToTry = void 0;
    var path = require("path");
    var path_1 = require("path");
    var filesystem_1 = require_filesystem();
    function getPathsToTry(extensions, absolutePathMappings, requestedModule) {
      if (!absolutePathMappings || !requestedModule || requestedModule[0] === ".") {
        return void 0;
      }
      var pathsToTry = [];
      for (var _i = 0, absolutePathMappings_1 = absolutePathMappings; _i < absolutePathMappings_1.length; _i++) {
        var entry = absolutePathMappings_1[_i];
        var starMatch = entry.pattern === requestedModule ? "" : matchStar(entry.pattern, requestedModule);
        if (starMatch !== void 0) {
          var _loop_1 = function(physicalPathPattern2) {
            var physicalPath = physicalPathPattern2.replace("*", starMatch);
            pathsToTry.push({ type: "file", path: physicalPath });
            pathsToTry.push.apply(pathsToTry, extensions.map(function(e) {
              return { type: "extension", path: physicalPath + e };
            }));
            pathsToTry.push({
              type: "package",
              path: path.join(physicalPath, "/package.json")
            });
            var indexPath = path.join(physicalPath, "/index");
            pathsToTry.push.apply(pathsToTry, extensions.map(function(e) {
              return { type: "index", path: indexPath + e };
            }));
          };
          for (var _a = 0, _b = entry.paths; _a < _b.length; _a++) {
            var physicalPathPattern = _b[_a];
            _loop_1(physicalPathPattern);
          }
        }
      }
      return pathsToTry.length === 0 ? void 0 : pathsToTry;
    }
    exports2.getPathsToTry = getPathsToTry;
    function getStrippedPath(tryPath) {
      return tryPath.type === "index" ? (0, path_1.dirname)(tryPath.path) : tryPath.type === "file" ? tryPath.path : tryPath.type === "extension" ? (0, filesystem_1.removeExtension)(tryPath.path) : tryPath.type === "package" ? tryPath.path : exhaustiveTypeException(tryPath.type);
    }
    exports2.getStrippedPath = getStrippedPath;
    function exhaustiveTypeException(check) {
      throw new Error("Unknown type ".concat(check));
    }
    exports2.exhaustiveTypeException = exhaustiveTypeException;
    function matchStar(pattern, search) {
      if (search.length < pattern.length) {
        return void 0;
      }
      if (pattern === "*") {
        return search;
      }
      var star = pattern.indexOf("*");
      if (star === -1) {
        return void 0;
      }
      var part1 = pattern.substring(0, star);
      var part2 = pattern.substring(star + 1);
      if (search.substr(0, star) !== part1) {
        return void 0;
      }
      if (search.substr(search.length - part2.length) !== part2) {
        return void 0;
      }
      return search.substr(star, search.length - part2.length);
    }
  }
});

// ../../node_modules/tsconfig-paths/lib/match-path-sync.js
var require_match_path_sync = __commonJS({
  "../../node_modules/tsconfig-paths/lib/match-path-sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.matchFromAbsolutePaths = exports2.createMatchPath = void 0;
    var path = require("path");
    var Filesystem = require_filesystem();
    var MappingEntry = require_mapping_entry();
    var TryPath = require_try_path();
    function createMatchPath(absoluteBaseUrl, paths, mainFields, addMatchAll) {
      if (mainFields === void 0) {
        mainFields = ["main"];
      }
      if (addMatchAll === void 0) {
        addMatchAll = true;
      }
      var absolutePaths = MappingEntry.getAbsoluteMappingEntries(absoluteBaseUrl, paths, addMatchAll);
      return function(requestedModule, readJson, fileExists, extensions) {
        return matchFromAbsolutePaths(absolutePaths, requestedModule, readJson, fileExists, extensions, mainFields);
      };
    }
    exports2.createMatchPath = createMatchPath;
    function matchFromAbsolutePaths(absolutePathMappings, requestedModule, readJson, fileExists, extensions, mainFields) {
      if (readJson === void 0) {
        readJson = Filesystem.readJsonFromDiskSync;
      }
      if (fileExists === void 0) {
        fileExists = Filesystem.fileExistsSync;
      }
      if (extensions === void 0) {
        extensions = Object.keys(require.extensions);
      }
      if (mainFields === void 0) {
        mainFields = ["main"];
      }
      var tryPaths = TryPath.getPathsToTry(extensions, absolutePathMappings, requestedModule);
      if (!tryPaths) {
        return void 0;
      }
      return findFirstExistingPath(tryPaths, readJson, fileExists, mainFields);
    }
    exports2.matchFromAbsolutePaths = matchFromAbsolutePaths;
    function findFirstExistingMainFieldMappedFile(packageJson, mainFields, packageJsonPath, fileExists) {
      for (var index = 0; index < mainFields.length; index++) {
        var mainFieldSelector = mainFields[index];
        var candidateMapping = typeof mainFieldSelector === "string" ? packageJson[mainFieldSelector] : mainFieldSelector.reduce(function(obj, key) {
          return obj[key];
        }, packageJson);
        if (candidateMapping && typeof candidateMapping === "string") {
          var candidateFilePath = path.join(path.dirname(packageJsonPath), candidateMapping);
          if (fileExists(candidateFilePath)) {
            return candidateFilePath;
          }
        }
      }
      return void 0;
    }
    function findFirstExistingPath(tryPaths, readJson, fileExists, mainFields) {
      if (readJson === void 0) {
        readJson = Filesystem.readJsonFromDiskSync;
      }
      if (mainFields === void 0) {
        mainFields = ["main"];
      }
      for (var _i = 0, tryPaths_1 = tryPaths; _i < tryPaths_1.length; _i++) {
        var tryPath = tryPaths_1[_i];
        if (tryPath.type === "file" || tryPath.type === "extension" || tryPath.type === "index") {
          if (fileExists(tryPath.path)) {
            return TryPath.getStrippedPath(tryPath);
          }
        } else if (tryPath.type === "package") {
          var packageJson = readJson(tryPath.path);
          if (packageJson) {
            var mainFieldMappedFile = findFirstExistingMainFieldMappedFile(packageJson, mainFields, tryPath.path, fileExists);
            if (mainFieldMappedFile) {
              return mainFieldMappedFile;
            }
          }
        } else {
          TryPath.exhaustiveTypeException(tryPath.type);
        }
      }
      return void 0;
    }
  }
});

// ../../node_modules/tsconfig-paths/lib/match-path-async.js
var require_match_path_async = __commonJS({
  "../../node_modules/tsconfig-paths/lib/match-path-async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.matchFromAbsolutePathsAsync = exports2.createMatchPathAsync = void 0;
    var path = require("path");
    var TryPath = require_try_path();
    var MappingEntry = require_mapping_entry();
    var Filesystem = require_filesystem();
    function createMatchPathAsync(absoluteBaseUrl, paths, mainFields, addMatchAll) {
      if (mainFields === void 0) {
        mainFields = ["main"];
      }
      if (addMatchAll === void 0) {
        addMatchAll = true;
      }
      var absolutePaths = MappingEntry.getAbsoluteMappingEntries(absoluteBaseUrl, paths, addMatchAll);
      return function(requestedModule, readJson, fileExists, extensions, callback) {
        return matchFromAbsolutePathsAsync(absolutePaths, requestedModule, readJson, fileExists, extensions, callback, mainFields);
      };
    }
    exports2.createMatchPathAsync = createMatchPathAsync;
    function matchFromAbsolutePathsAsync(absolutePathMappings, requestedModule, readJson, fileExists, extensions, callback, mainFields) {
      if (readJson === void 0) {
        readJson = Filesystem.readJsonFromDiskAsync;
      }
      if (fileExists === void 0) {
        fileExists = Filesystem.fileExistsAsync;
      }
      if (extensions === void 0) {
        extensions = Object.keys(require.extensions);
      }
      if (mainFields === void 0) {
        mainFields = ["main"];
      }
      var tryPaths = TryPath.getPathsToTry(extensions, absolutePathMappings, requestedModule);
      if (!tryPaths) {
        return callback();
      }
      findFirstExistingPath(tryPaths, readJson, fileExists, callback, 0, mainFields);
    }
    exports2.matchFromAbsolutePathsAsync = matchFromAbsolutePathsAsync;
    function findFirstExistingMainFieldMappedFile(packageJson, mainFields, packageJsonPath, fileExistsAsync, doneCallback, index) {
      if (index === void 0) {
        index = 0;
      }
      if (index >= mainFields.length) {
        return doneCallback(void 0, void 0);
      }
      var tryNext = function() {
        return findFirstExistingMainFieldMappedFile(packageJson, mainFields, packageJsonPath, fileExistsAsync, doneCallback, index + 1);
      };
      var mainFieldSelector = mainFields[index];
      var mainFieldMapping = typeof mainFieldSelector === "string" ? packageJson[mainFieldSelector] : mainFieldSelector.reduce(function(obj, key) {
        return obj[key];
      }, packageJson);
      if (typeof mainFieldMapping !== "string") {
        return tryNext();
      }
      var mappedFilePath = path.join(path.dirname(packageJsonPath), mainFieldMapping);
      fileExistsAsync(mappedFilePath, function(err, exists) {
        if (err) {
          return doneCallback(err);
        }
        if (exists) {
          return doneCallback(void 0, mappedFilePath);
        }
        return tryNext();
      });
    }
    function findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index, mainFields) {
      if (index === void 0) {
        index = 0;
      }
      if (mainFields === void 0) {
        mainFields = ["main"];
      }
      var tryPath = tryPaths[index];
      if (tryPath.type === "file" || tryPath.type === "extension" || tryPath.type === "index") {
        fileExists(tryPath.path, function(err, exists) {
          if (err) {
            return doneCallback(err);
          }
          if (exists) {
            return doneCallback(void 0, TryPath.getStrippedPath(tryPath));
          }
          if (index === tryPaths.length - 1) {
            return doneCallback();
          }
          return findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index + 1, mainFields);
        });
      } else if (tryPath.type === "package") {
        readJson(tryPath.path, function(err, packageJson) {
          if (err) {
            return doneCallback(err);
          }
          if (packageJson) {
            return findFirstExistingMainFieldMappedFile(packageJson, mainFields, tryPath.path, fileExists, function(mainFieldErr, mainFieldMappedFile) {
              if (mainFieldErr) {
                return doneCallback(mainFieldErr);
              }
              if (mainFieldMappedFile) {
                return doneCallback(void 0, mainFieldMappedFile);
              }
              return findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index + 1, mainFields);
            });
          }
          return findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index + 1, mainFields);
        });
      } else {
        TryPath.exhaustiveTypeException(tryPath.type);
      }
    }
  }
});

// ../../node_modules/json5/lib/unicode.js
var require_unicode = __commonJS({
  "../../node_modules/json5/lib/unicode.js"(exports2, module2) {
    module2.exports.Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/;
    module2.exports.ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/;
    module2.exports.ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;
  }
});

// ../../node_modules/json5/lib/util.js
var require_util = __commonJS({
  "../../node_modules/json5/lib/util.js"(exports2, module2) {
    var unicode = require_unicode();
    module2.exports = {
      isSpaceSeparator(c) {
        return typeof c === "string" && unicode.Space_Separator.test(c);
      },
      isIdStartChar(c) {
        return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "$" || c === "_" || unicode.ID_Start.test(c));
      },
      isIdContinueChar(c) {
        return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "$" || c === "_" || c === "\u200C" || c === "\u200D" || unicode.ID_Continue.test(c));
      },
      isDigit(c) {
        return typeof c === "string" && /[0-9]/.test(c);
      },
      isHexDigit(c) {
        return typeof c === "string" && /[0-9A-Fa-f]/.test(c);
      }
    };
  }
});

// ../../node_modules/json5/lib/parse.js
var require_parse = __commonJS({
  "../../node_modules/json5/lib/parse.js"(exports2, module2) {
    var util = require_util();
    var source;
    var parseState;
    var stack;
    var pos;
    var line;
    var column;
    var token;
    var key;
    var root;
    module2.exports = function parse(text, reviver) {
      source = String(text);
      parseState = "start";
      stack = [];
      pos = 0;
      line = 1;
      column = 0;
      token = void 0;
      key = void 0;
      root = void 0;
      do {
        token = lex();
        parseStates[parseState]();
      } while (token.type !== "eof");
      if (typeof reviver === "function") {
        return internalize({ "": root }, "", reviver);
      }
      return root;
    };
    function internalize(holder, name, reviver) {
      const value = holder[name];
      if (value != null && typeof value === "object") {
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            const key2 = String(i);
            const replacement = internalize(value, key2, reviver);
            if (replacement === void 0) {
              delete value[key2];
            } else {
              Object.defineProperty(value, key2, {
                value: replacement,
                writable: true,
                enumerable: true,
                configurable: true
              });
            }
          }
        } else {
          for (const key2 in value) {
            const replacement = internalize(value, key2, reviver);
            if (replacement === void 0) {
              delete value[key2];
            } else {
              Object.defineProperty(value, key2, {
                value: replacement,
                writable: true,
                enumerable: true,
                configurable: true
              });
            }
          }
        }
      }
      return reviver.call(holder, name, value);
    }
    var lexState;
    var buffer;
    var doubleQuote;
    var sign;
    var c;
    function lex() {
      lexState = "default";
      buffer = "";
      doubleQuote = false;
      sign = 1;
      for (; ; ) {
        c = peek();
        const token2 = lexStates[lexState]();
        if (token2) {
          return token2;
        }
      }
    }
    function peek() {
      if (source[pos]) {
        return String.fromCodePoint(source.codePointAt(pos));
      }
    }
    function read() {
      const c2 = peek();
      if (c2 === "\n") {
        line++;
        column = 0;
      } else if (c2) {
        column += c2.length;
      } else {
        column++;
      }
      if (c2) {
        pos += c2.length;
      }
      return c2;
    }
    var lexStates = {
      default() {
        switch (c) {
          case "	":
          case "\v":
          case "\f":
          case " ":
          case "\xA0":
          case "\uFEFF":
          case "\n":
          case "\r":
          case "\u2028":
          case "\u2029":
            read();
            return;
          case "/":
            read();
            lexState = "comment";
            return;
          case void 0:
            read();
            return newToken("eof");
        }
        if (util.isSpaceSeparator(c)) {
          read();
          return;
        }
        return lexStates[parseState]();
      },
      comment() {
        switch (c) {
          case "*":
            read();
            lexState = "multiLineComment";
            return;
          case "/":
            read();
            lexState = "singleLineComment";
            return;
        }
        throw invalidChar(read());
      },
      multiLineComment() {
        switch (c) {
          case "*":
            read();
            lexState = "multiLineCommentAsterisk";
            return;
          case void 0:
            throw invalidChar(read());
        }
        read();
      },
      multiLineCommentAsterisk() {
        switch (c) {
          case "*":
            read();
            return;
          case "/":
            read();
            lexState = "default";
            return;
          case void 0:
            throw invalidChar(read());
        }
        read();
        lexState = "multiLineComment";
      },
      singleLineComment() {
        switch (c) {
          case "\n":
          case "\r":
          case "\u2028":
          case "\u2029":
            read();
            lexState = "default";
            return;
          case void 0:
            read();
            return newToken("eof");
        }
        read();
      },
      value() {
        switch (c) {
          case "{":
          case "[":
            return newToken("punctuator", read());
          case "n":
            read();
            literal("ull");
            return newToken("null", null);
          case "t":
            read();
            literal("rue");
            return newToken("boolean", true);
          case "f":
            read();
            literal("alse");
            return newToken("boolean", false);
          case "-":
          case "+":
            if (read() === "-") {
              sign = -1;
            }
            lexState = "sign";
            return;
          case ".":
            buffer = read();
            lexState = "decimalPointLeading";
            return;
          case "0":
            buffer = read();
            lexState = "zero";
            return;
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            buffer = read();
            lexState = "decimalInteger";
            return;
          case "I":
            read();
            literal("nfinity");
            return newToken("numeric", Infinity);
          case "N":
            read();
            literal("aN");
            return newToken("numeric", NaN);
          case '"':
          case "'":
            doubleQuote = read() === '"';
            buffer = "";
            lexState = "string";
            return;
        }
        throw invalidChar(read());
      },
      identifierNameStartEscape() {
        if (c !== "u") {
          throw invalidChar(read());
        }
        read();
        const u = unicodeEscape();
        switch (u) {
          case "$":
          case "_":
            break;
          default:
            if (!util.isIdStartChar(u)) {
              throw invalidIdentifier();
            }
            break;
        }
        buffer += u;
        lexState = "identifierName";
      },
      identifierName() {
        switch (c) {
          case "$":
          case "_":
          case "\u200C":
          case "\u200D":
            buffer += read();
            return;
          case "\\":
            read();
            lexState = "identifierNameEscape";
            return;
        }
        if (util.isIdContinueChar(c)) {
          buffer += read();
          return;
        }
        return newToken("identifier", buffer);
      },
      identifierNameEscape() {
        if (c !== "u") {
          throw invalidChar(read());
        }
        read();
        const u = unicodeEscape();
        switch (u) {
          case "$":
          case "_":
          case "\u200C":
          case "\u200D":
            break;
          default:
            if (!util.isIdContinueChar(u)) {
              throw invalidIdentifier();
            }
            break;
        }
        buffer += u;
        lexState = "identifierName";
      },
      sign() {
        switch (c) {
          case ".":
            buffer = read();
            lexState = "decimalPointLeading";
            return;
          case "0":
            buffer = read();
            lexState = "zero";
            return;
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            buffer = read();
            lexState = "decimalInteger";
            return;
          case "I":
            read();
            literal("nfinity");
            return newToken("numeric", sign * Infinity);
          case "N":
            read();
            literal("aN");
            return newToken("numeric", NaN);
        }
        throw invalidChar(read());
      },
      zero() {
        switch (c) {
          case ".":
            buffer += read();
            lexState = "decimalPoint";
            return;
          case "e":
          case "E":
            buffer += read();
            lexState = "decimalExponent";
            return;
          case "x":
          case "X":
            buffer += read();
            lexState = "hexadecimal";
            return;
        }
        return newToken("numeric", sign * 0);
      },
      decimalInteger() {
        switch (c) {
          case ".":
            buffer += read();
            lexState = "decimalPoint";
            return;
          case "e":
          case "E":
            buffer += read();
            lexState = "decimalExponent";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", sign * Number(buffer));
      },
      decimalPointLeading() {
        if (util.isDigit(c)) {
          buffer += read();
          lexState = "decimalFraction";
          return;
        }
        throw invalidChar(read());
      },
      decimalPoint() {
        switch (c) {
          case "e":
          case "E":
            buffer += read();
            lexState = "decimalExponent";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read();
          lexState = "decimalFraction";
          return;
        }
        return newToken("numeric", sign * Number(buffer));
      },
      decimalFraction() {
        switch (c) {
          case "e":
          case "E":
            buffer += read();
            lexState = "decimalExponent";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", sign * Number(buffer));
      },
      decimalExponent() {
        switch (c) {
          case "+":
          case "-":
            buffer += read();
            lexState = "decimalExponentSign";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read();
          lexState = "decimalExponentInteger";
          return;
        }
        throw invalidChar(read());
      },
      decimalExponentSign() {
        if (util.isDigit(c)) {
          buffer += read();
          lexState = "decimalExponentInteger";
          return;
        }
        throw invalidChar(read());
      },
      decimalExponentInteger() {
        if (util.isDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", sign * Number(buffer));
      },
      hexadecimal() {
        if (util.isHexDigit(c)) {
          buffer += read();
          lexState = "hexadecimalInteger";
          return;
        }
        throw invalidChar(read());
      },
      hexadecimalInteger() {
        if (util.isHexDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", sign * Number(buffer));
      },
      string() {
        switch (c) {
          case "\\":
            read();
            buffer += escape();
            return;
          case '"':
            if (doubleQuote) {
              read();
              return newToken("string", buffer);
            }
            buffer += read();
            return;
          case "'":
            if (!doubleQuote) {
              read();
              return newToken("string", buffer);
            }
            buffer += read();
            return;
          case "\n":
          case "\r":
            throw invalidChar(read());
          case "\u2028":
          case "\u2029":
            separatorChar(c);
            break;
          case void 0:
            throw invalidChar(read());
        }
        buffer += read();
      },
      start() {
        switch (c) {
          case "{":
          case "[":
            return newToken("punctuator", read());
        }
        lexState = "value";
      },
      beforePropertyName() {
        switch (c) {
          case "$":
          case "_":
            buffer = read();
            lexState = "identifierName";
            return;
          case "\\":
            read();
            lexState = "identifierNameStartEscape";
            return;
          case "}":
            return newToken("punctuator", read());
          case '"':
          case "'":
            doubleQuote = read() === '"';
            lexState = "string";
            return;
        }
        if (util.isIdStartChar(c)) {
          buffer += read();
          lexState = "identifierName";
          return;
        }
        throw invalidChar(read());
      },
      afterPropertyName() {
        if (c === ":") {
          return newToken("punctuator", read());
        }
        throw invalidChar(read());
      },
      beforePropertyValue() {
        lexState = "value";
      },
      afterPropertyValue() {
        switch (c) {
          case ",":
          case "}":
            return newToken("punctuator", read());
        }
        throw invalidChar(read());
      },
      beforeArrayValue() {
        if (c === "]") {
          return newToken("punctuator", read());
        }
        lexState = "value";
      },
      afterArrayValue() {
        switch (c) {
          case ",":
          case "]":
            return newToken("punctuator", read());
        }
        throw invalidChar(read());
      },
      end() {
        throw invalidChar(read());
      }
    };
    function newToken(type, value) {
      return {
        type,
        value,
        line,
        column
      };
    }
    function literal(s) {
      for (const c2 of s) {
        const p = peek();
        if (p !== c2) {
          throw invalidChar(read());
        }
        read();
      }
    }
    function escape() {
      const c2 = peek();
      switch (c2) {
        case "b":
          read();
          return "\b";
        case "f":
          read();
          return "\f";
        case "n":
          read();
          return "\n";
        case "r":
          read();
          return "\r";
        case "t":
          read();
          return "	";
        case "v":
          read();
          return "\v";
        case "0":
          read();
          if (util.isDigit(peek())) {
            throw invalidChar(read());
          }
          return "\0";
        case "x":
          read();
          return hexEscape();
        case "u":
          read();
          return unicodeEscape();
        case "\n":
        case "\u2028":
        case "\u2029":
          read();
          return "";
        case "\r":
          read();
          if (peek() === "\n") {
            read();
          }
          return "";
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          throw invalidChar(read());
        case void 0:
          throw invalidChar(read());
      }
      return read();
    }
    function hexEscape() {
      let buffer2 = "";
      let c2 = peek();
      if (!util.isHexDigit(c2)) {
        throw invalidChar(read());
      }
      buffer2 += read();
      c2 = peek();
      if (!util.isHexDigit(c2)) {
        throw invalidChar(read());
      }
      buffer2 += read();
      return String.fromCodePoint(parseInt(buffer2, 16));
    }
    function unicodeEscape() {
      let buffer2 = "";
      let count = 4;
      while (count-- > 0) {
        const c2 = peek();
        if (!util.isHexDigit(c2)) {
          throw invalidChar(read());
        }
        buffer2 += read();
      }
      return String.fromCodePoint(parseInt(buffer2, 16));
    }
    var parseStates = {
      start() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        push();
      },
      beforePropertyName() {
        switch (token.type) {
          case "identifier":
          case "string":
            key = token.value;
            parseState = "afterPropertyName";
            return;
          case "punctuator":
            pop();
            return;
          case "eof":
            throw invalidEOF();
        }
      },
      afterPropertyName() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        parseState = "beforePropertyValue";
      },
      beforePropertyValue() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        push();
      },
      beforeArrayValue() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        if (token.type === "punctuator" && token.value === "]") {
          pop();
          return;
        }
        push();
      },
      afterPropertyValue() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        switch (token.value) {
          case ",":
            parseState = "beforePropertyName";
            return;
          case "}":
            pop();
        }
      },
      afterArrayValue() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        switch (token.value) {
          case ",":
            parseState = "beforeArrayValue";
            return;
          case "]":
            pop();
        }
      },
      end() {
      }
    };
    function push() {
      let value;
      switch (token.type) {
        case "punctuator":
          switch (token.value) {
            case "{":
              value = {};
              break;
            case "[":
              value = [];
              break;
          }
          break;
        case "null":
        case "boolean":
        case "numeric":
        case "string":
          value = token.value;
          break;
      }
      if (root === void 0) {
        root = value;
      } else {
        const parent = stack[stack.length - 1];
        if (Array.isArray(parent)) {
          parent.push(value);
        } else {
          Object.defineProperty(parent, key, {
            value,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      if (value !== null && typeof value === "object") {
        stack.push(value);
        if (Array.isArray(value)) {
          parseState = "beforeArrayValue";
        } else {
          parseState = "beforePropertyName";
        }
      } else {
        const current = stack[stack.length - 1];
        if (current == null) {
          parseState = "end";
        } else if (Array.isArray(current)) {
          parseState = "afterArrayValue";
        } else {
          parseState = "afterPropertyValue";
        }
      }
    }
    function pop() {
      stack.pop();
      const current = stack[stack.length - 1];
      if (current == null) {
        parseState = "end";
      } else if (Array.isArray(current)) {
        parseState = "afterArrayValue";
      } else {
        parseState = "afterPropertyValue";
      }
    }
    function invalidChar(c2) {
      if (c2 === void 0) {
        return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
      }
      return syntaxError(`JSON5: invalid character '${formatChar(c2)}' at ${line}:${column}`);
    }
    function invalidEOF() {
      return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
    }
    function invalidIdentifier() {
      column -= 5;
      return syntaxError(`JSON5: invalid identifier character at ${line}:${column}`);
    }
    function separatorChar(c2) {
      console.warn(`JSON5: '${formatChar(c2)}' in strings is not valid ECMAScript; consider escaping`);
    }
    function formatChar(c2) {
      const replacements = {
        "'": "\\'",
        '"': '\\"',
        "\\": "\\\\",
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "	": "\\t",
        "\v": "\\v",
        "\0": "\\0",
        "\u2028": "\\u2028",
        "\u2029": "\\u2029"
      };
      if (replacements[c2]) {
        return replacements[c2];
      }
      if (c2 < " ") {
        const hexString = c2.charCodeAt(0).toString(16);
        return "\\x" + ("00" + hexString).substring(hexString.length);
      }
      return c2;
    }
    function syntaxError(message) {
      const err = new SyntaxError(message);
      err.lineNumber = line;
      err.columnNumber = column;
      return err;
    }
  }
});

// ../../node_modules/json5/lib/stringify.js
var require_stringify = __commonJS({
  "../../node_modules/json5/lib/stringify.js"(exports2, module2) {
    var util = require_util();
    module2.exports = function stringify(value, replacer, space) {
      const stack = [];
      let indent = "";
      let propertyList;
      let replacerFunc;
      let gap = "";
      let quote;
      if (replacer != null && typeof replacer === "object" && !Array.isArray(replacer)) {
        space = replacer.space;
        quote = replacer.quote;
        replacer = replacer.replacer;
      }
      if (typeof replacer === "function") {
        replacerFunc = replacer;
      } else if (Array.isArray(replacer)) {
        propertyList = [];
        for (const v of replacer) {
          let item;
          if (typeof v === "string") {
            item = v;
          } else if (typeof v === "number" || v instanceof String || v instanceof Number) {
            item = String(v);
          }
          if (item !== void 0 && propertyList.indexOf(item) < 0) {
            propertyList.push(item);
          }
        }
      }
      if (space instanceof Number) {
        space = Number(space);
      } else if (space instanceof String) {
        space = String(space);
      }
      if (typeof space === "number") {
        if (space > 0) {
          space = Math.min(10, Math.floor(space));
          gap = "          ".substr(0, space);
        }
      } else if (typeof space === "string") {
        gap = space.substr(0, 10);
      }
      return serializeProperty("", { "": value });
      function serializeProperty(key, holder) {
        let value2 = holder[key];
        if (value2 != null) {
          if (typeof value2.toJSON5 === "function") {
            value2 = value2.toJSON5(key);
          } else if (typeof value2.toJSON === "function") {
            value2 = value2.toJSON(key);
          }
        }
        if (replacerFunc) {
          value2 = replacerFunc.call(holder, key, value2);
        }
        if (value2 instanceof Number) {
          value2 = Number(value2);
        } else if (value2 instanceof String) {
          value2 = String(value2);
        } else if (value2 instanceof Boolean) {
          value2 = value2.valueOf();
        }
        switch (value2) {
          case null:
            return "null";
          case true:
            return "true";
          case false:
            return "false";
        }
        if (typeof value2 === "string") {
          return quoteString(value2, false);
        }
        if (typeof value2 === "number") {
          return String(value2);
        }
        if (typeof value2 === "object") {
          return Array.isArray(value2) ? serializeArray(value2) : serializeObject(value2);
        }
        return void 0;
      }
      function quoteString(value2) {
        const quotes = {
          "'": 0.1,
          '"': 0.2
        };
        const replacements = {
          "'": "\\'",
          '"': '\\"',
          "\\": "\\\\",
          "\b": "\\b",
          "\f": "\\f",
          "\n": "\\n",
          "\r": "\\r",
          "	": "\\t",
          "\v": "\\v",
          "\0": "\\0",
          "\u2028": "\\u2028",
          "\u2029": "\\u2029"
        };
        let product = "";
        for (let i = 0; i < value2.length; i++) {
          const c = value2[i];
          switch (c) {
            case "'":
            case '"':
              quotes[c]++;
              product += c;
              continue;
            case "\0":
              if (util.isDigit(value2[i + 1])) {
                product += "\\x00";
                continue;
              }
          }
          if (replacements[c]) {
            product += replacements[c];
            continue;
          }
          if (c < " ") {
            let hexString = c.charCodeAt(0).toString(16);
            product += "\\x" + ("00" + hexString).substring(hexString.length);
            continue;
          }
          product += c;
        }
        const quoteChar = quote || Object.keys(quotes).reduce((a, b) => quotes[a] < quotes[b] ? a : b);
        product = product.replace(new RegExp(quoteChar, "g"), replacements[quoteChar]);
        return quoteChar + product + quoteChar;
      }
      function serializeObject(value2) {
        if (stack.indexOf(value2) >= 0) {
          throw TypeError("Converting circular structure to JSON5");
        }
        stack.push(value2);
        let stepback = indent;
        indent = indent + gap;
        let keys = propertyList || Object.keys(value2);
        let partial = [];
        for (const key of keys) {
          const propertyString = serializeProperty(key, value2);
          if (propertyString !== void 0) {
            let member = serializeKey(key) + ":";
            if (gap !== "") {
              member += " ";
            }
            member += propertyString;
            partial.push(member);
          }
        }
        let final;
        if (partial.length === 0) {
          final = "{}";
        } else {
          let properties;
          if (gap === "") {
            properties = partial.join(",");
            final = "{" + properties + "}";
          } else {
            let separator = ",\n" + indent;
            properties = partial.join(separator);
            final = "{\n" + indent + properties + ",\n" + stepback + "}";
          }
        }
        stack.pop();
        indent = stepback;
        return final;
      }
      function serializeKey(key) {
        if (key.length === 0) {
          return quoteString(key, true);
        }
        const firstChar = String.fromCodePoint(key.codePointAt(0));
        if (!util.isIdStartChar(firstChar)) {
          return quoteString(key, true);
        }
        for (let i = firstChar.length; i < key.length; i++) {
          if (!util.isIdContinueChar(String.fromCodePoint(key.codePointAt(i)))) {
            return quoteString(key, true);
          }
        }
        return key;
      }
      function serializeArray(value2) {
        if (stack.indexOf(value2) >= 0) {
          throw TypeError("Converting circular structure to JSON5");
        }
        stack.push(value2);
        let stepback = indent;
        indent = indent + gap;
        let partial = [];
        for (let i = 0; i < value2.length; i++) {
          const propertyString = serializeProperty(String(i), value2);
          partial.push(propertyString !== void 0 ? propertyString : "null");
        }
        let final;
        if (partial.length === 0) {
          final = "[]";
        } else {
          if (gap === "") {
            let properties = partial.join(",");
            final = "[" + properties + "]";
          } else {
            let separator = ",\n" + indent;
            let properties = partial.join(separator);
            final = "[\n" + indent + properties + ",\n" + stepback + "]";
          }
        }
        stack.pop();
        indent = stepback;
        return final;
      }
    };
  }
});

// ../../node_modules/json5/lib/index.js
var require_lib = __commonJS({
  "../../node_modules/json5/lib/index.js"(exports2, module2) {
    var parse = require_parse();
    var stringify = require_stringify();
    var JSON5 = {
      parse,
      stringify
    };
    module2.exports = JSON5;
  }
});

// ../../node_modules/strip-bom/index.js
var require_strip_bom = __commonJS({
  "../../node_modules/strip-bom/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (x) => {
      if (typeof x !== "string") {
        throw new TypeError("Expected a string, got " + typeof x);
      }
      if (x.charCodeAt(0) === 65279) {
        return x.slice(1);
      }
      return x;
    };
  }
});

// ../../node_modules/tsconfig-paths/lib/tsconfig-loader.js
var require_tsconfig_loader = __commonJS({
  "../../node_modules/tsconfig-paths/lib/tsconfig-loader.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.loadTsconfig = exports2.walkForTsConfig = exports2.tsConfigLoader = void 0;
    var path = require("path");
    var fs = require("fs");
    var JSON5 = require_lib();
    var StripBom = require_strip_bom();
    function tsConfigLoader(_a) {
      var getEnv = _a.getEnv, cwd = _a.cwd, _b = _a.loadSync, loadSync = _b === void 0 ? loadSyncDefault : _b;
      var TS_NODE_PROJECT = getEnv("TS_NODE_PROJECT");
      var TS_NODE_BASEURL = getEnv("TS_NODE_BASEURL");
      var loadResult = loadSync(cwd, TS_NODE_PROJECT, TS_NODE_BASEURL);
      return loadResult;
    }
    exports2.tsConfigLoader = tsConfigLoader;
    function loadSyncDefault(cwd, filename, baseUrl) {
      var configPath = resolveConfigPath(cwd, filename);
      if (!configPath) {
        return {
          tsConfigPath: void 0,
          baseUrl: void 0,
          paths: void 0
        };
      }
      var config = loadTsconfig(configPath);
      return {
        tsConfigPath: configPath,
        baseUrl: baseUrl || config && config.compilerOptions && config.compilerOptions.baseUrl,
        paths: config && config.compilerOptions && config.compilerOptions.paths
      };
    }
    function resolveConfigPath(cwd, filename) {
      if (filename) {
        var absolutePath = fs.lstatSync(filename).isDirectory() ? path.resolve(filename, "./tsconfig.json") : path.resolve(cwd, filename);
        return absolutePath;
      }
      if (fs.statSync(cwd).isFile()) {
        return path.resolve(cwd);
      }
      var configAbsolutePath = walkForTsConfig(cwd);
      return configAbsolutePath ? path.resolve(configAbsolutePath) : void 0;
    }
    function walkForTsConfig(directory, readdirSync) {
      if (readdirSync === void 0) {
        readdirSync = fs.readdirSync;
      }
      var files = readdirSync(directory);
      var filesToCheck = ["tsconfig.json", "jsconfig.json"];
      for (var _i = 0, filesToCheck_1 = filesToCheck; _i < filesToCheck_1.length; _i++) {
        var fileToCheck = filesToCheck_1[_i];
        if (files.indexOf(fileToCheck) !== -1) {
          return path.join(directory, fileToCheck);
        }
      }
      var parentDirectory = path.dirname(directory);
      if (directory === parentDirectory) {
        return void 0;
      }
      return walkForTsConfig(parentDirectory, readdirSync);
    }
    exports2.walkForTsConfig = walkForTsConfig;
    function loadTsconfig(configFilePath, existsSync, readFileSync) {
      if (existsSync === void 0) {
        existsSync = fs.existsSync;
      }
      if (readFileSync === void 0) {
        readFileSync = function(filename) {
          return fs.readFileSync(filename, "utf8");
        };
      }
      if (!existsSync(configFilePath)) {
        return void 0;
      }
      var configString = readFileSync(configFilePath);
      var cleanedJson = StripBom(configString);
      var config;
      try {
        config = JSON5.parse(cleanedJson);
      } catch (e) {
        throw new Error("".concat(configFilePath, " is malformed ").concat(e.message));
      }
      var extendedConfig = config.extends;
      if (extendedConfig) {
        var base = void 0;
        if (Array.isArray(extendedConfig)) {
          base = extendedConfig.reduce(function(currBase, extendedConfigElement) {
            return mergeTsconfigs(currBase, loadTsconfigFromExtends(configFilePath, extendedConfigElement, existsSync, readFileSync));
          }, {});
        } else {
          base = loadTsconfigFromExtends(configFilePath, extendedConfig, existsSync, readFileSync);
        }
        return mergeTsconfigs(base, config);
      }
      return config;
    }
    exports2.loadTsconfig = loadTsconfig;
    function loadTsconfigFromExtends(configFilePath, extendedConfigValue, existsSync, readFileSync) {
      var _a;
      if (typeof extendedConfigValue === "string" && extendedConfigValue.indexOf(".json") === -1) {
        extendedConfigValue += ".json";
      }
      var currentDir = path.dirname(configFilePath);
      var extendedConfigPath = path.join(currentDir, extendedConfigValue);
      if (extendedConfigValue.indexOf("/") !== -1 && extendedConfigValue.indexOf(".") !== -1 && !existsSync(extendedConfigPath)) {
        extendedConfigPath = path.join(currentDir, "node_modules", extendedConfigValue);
      }
      var config = loadTsconfig(extendedConfigPath, existsSync, readFileSync) || {};
      if ((_a = config.compilerOptions) === null || _a === void 0 ? void 0 : _a.baseUrl) {
        var extendsDir = path.dirname(extendedConfigValue);
        config.compilerOptions.baseUrl = path.join(extendsDir, config.compilerOptions.baseUrl);
      }
      return config;
    }
    function mergeTsconfigs(base, config) {
      base = base || {};
      config = config || {};
      return __assign(__assign(__assign({}, base), config), { compilerOptions: __assign(__assign({}, base.compilerOptions), config.compilerOptions) });
    }
  }
});

// ../../node_modules/tsconfig-paths/lib/config-loader.js
var require_config_loader = __commonJS({
  "../../node_modules/tsconfig-paths/lib/config-loader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.configLoader = exports2.loadConfig = void 0;
    var TsConfigLoader2 = require_tsconfig_loader();
    var path = require("path");
    function loadConfig(cwd) {
      if (cwd === void 0) {
        cwd = process.cwd();
      }
      return configLoader({ cwd });
    }
    exports2.loadConfig = loadConfig;
    function configLoader(_a) {
      var cwd = _a.cwd, explicitParams = _a.explicitParams, _b = _a.tsConfigLoader, tsConfigLoader = _b === void 0 ? TsConfigLoader2.tsConfigLoader : _b;
      if (explicitParams) {
        var absoluteBaseUrl = path.isAbsolute(explicitParams.baseUrl) ? explicitParams.baseUrl : path.join(cwd, explicitParams.baseUrl);
        return {
          resultType: "success",
          configFileAbsolutePath: "",
          baseUrl: explicitParams.baseUrl,
          absoluteBaseUrl,
          paths: explicitParams.paths,
          mainFields: explicitParams.mainFields,
          addMatchAll: explicitParams.addMatchAll
        };
      }
      var loadResult = tsConfigLoader({
        cwd,
        getEnv: function(key) {
          return process.env[key];
        }
      });
      if (!loadResult.tsConfigPath) {
        return {
          resultType: "failed",
          message: "Couldn't find tsconfig.json"
        };
      }
      return {
        resultType: "success",
        configFileAbsolutePath: loadResult.tsConfigPath,
        baseUrl: loadResult.baseUrl,
        absoluteBaseUrl: path.resolve(path.dirname(loadResult.tsConfigPath), loadResult.baseUrl || ""),
        paths: loadResult.paths || {},
        addMatchAll: loadResult.baseUrl !== void 0
      };
    }
    exports2.configLoader = configLoader;
  }
});

// ../../node_modules/minimist/index.js
var require_minimist = __commonJS({
  "../../node_modules/minimist/index.js"(exports2, module2) {
    "use strict";
    function hasKey(obj, keys) {
      var o = obj;
      keys.slice(0, -1).forEach(function(key2) {
        o = o[key2] || {};
      });
      var key = keys[keys.length - 1];
      return key in o;
    }
    function isNumber(x) {
      if (typeof x === "number") {
        return true;
      }
      if (/^0x[0-9a-f]+$/i.test(x)) {
        return true;
      }
      return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
    }
    function isConstructorOrProto(obj, key) {
      return key === "constructor" && typeof obj[key] === "function" || key === "__proto__";
    }
    module2.exports = function(args, opts) {
      if (!opts) {
        opts = {};
      }
      var flags = {
        bools: {},
        strings: {},
        unknownFn: null
      };
      if (typeof opts.unknown === "function") {
        flags.unknownFn = opts.unknown;
      }
      if (typeof opts.boolean === "boolean" && opts.boolean) {
        flags.allBools = true;
      } else {
        [].concat(opts.boolean).filter(Boolean).forEach(function(key2) {
          flags.bools[key2] = true;
        });
      }
      var aliases = {};
      function aliasIsBoolean(key2) {
        return aliases[key2].some(function(x) {
          return flags.bools[x];
        });
      }
      Object.keys(opts.alias || {}).forEach(function(key2) {
        aliases[key2] = [].concat(opts.alias[key2]);
        aliases[key2].forEach(function(x) {
          aliases[x] = [key2].concat(aliases[key2].filter(function(y) {
            return x !== y;
          }));
        });
      });
      [].concat(opts.string).filter(Boolean).forEach(function(key2) {
        flags.strings[key2] = true;
        if (aliases[key2]) {
          [].concat(aliases[key2]).forEach(function(k) {
            flags.strings[k] = true;
          });
        }
      });
      var defaults = opts.default || {};
      var argv = { _: [] };
      function argDefined(key2, arg2) {
        return flags.allBools && /^--[^=]+$/.test(arg2) || flags.strings[key2] || flags.bools[key2] || aliases[key2];
      }
      function setKey(obj, keys, value2) {
        var o = obj;
        for (var i2 = 0; i2 < keys.length - 1; i2++) {
          var key2 = keys[i2];
          if (isConstructorOrProto(o, key2)) {
            return;
          }
          if (o[key2] === void 0) {
            o[key2] = {};
          }
          if (o[key2] === Object.prototype || o[key2] === Number.prototype || o[key2] === String.prototype) {
            o[key2] = {};
          }
          if (o[key2] === Array.prototype) {
            o[key2] = [];
          }
          o = o[key2];
        }
        var lastKey = keys[keys.length - 1];
        if (isConstructorOrProto(o, lastKey)) {
          return;
        }
        if (o === Object.prototype || o === Number.prototype || o === String.prototype) {
          o = {};
        }
        if (o === Array.prototype) {
          o = [];
        }
        if (o[lastKey] === void 0 || flags.bools[lastKey] || typeof o[lastKey] === "boolean") {
          o[lastKey] = value2;
        } else if (Array.isArray(o[lastKey])) {
          o[lastKey].push(value2);
        } else {
          o[lastKey] = [o[lastKey], value2];
        }
      }
      function setArg(key2, val, arg2) {
        if (arg2 && flags.unknownFn && !argDefined(key2, arg2)) {
          if (flags.unknownFn(arg2) === false) {
            return;
          }
        }
        var value2 = !flags.strings[key2] && isNumber(val) ? Number(val) : val;
        setKey(argv, key2.split("."), value2);
        (aliases[key2] || []).forEach(function(x) {
          setKey(argv, x.split("."), value2);
        });
      }
      Object.keys(flags.bools).forEach(function(key2) {
        setArg(key2, defaults[key2] === void 0 ? false : defaults[key2]);
      });
      var notFlags = [];
      if (args.indexOf("--") !== -1) {
        notFlags = args.slice(args.indexOf("--") + 1);
        args = args.slice(0, args.indexOf("--"));
      }
      for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        var key;
        var next;
        if (/^--.+=/.test(arg)) {
          var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
          key = m[1];
          var value = m[2];
          if (flags.bools[key]) {
            value = value !== "false";
          }
          setArg(key, value, arg);
        } else if (/^--no-.+/.test(arg)) {
          key = arg.match(/^--no-(.+)/)[1];
          setArg(key, false, arg);
        } else if (/^--.+/.test(arg)) {
          key = arg.match(/^--(.+)/)[1];
          next = args[i + 1];
          if (next !== void 0 && !/^(-|--)[^-]/.test(next) && !flags.bools[key] && !flags.allBools && (aliases[key] ? !aliasIsBoolean(key) : true)) {
            setArg(key, next, arg);
            i += 1;
          } else if (/^(true|false)$/.test(next)) {
            setArg(key, next === "true", arg);
            i += 1;
          } else {
            setArg(key, flags.strings[key] ? "" : true, arg);
          }
        } else if (/^-[^-]+/.test(arg)) {
          var letters = arg.slice(1, -1).split("");
          var broken = false;
          for (var j = 0; j < letters.length; j++) {
            next = arg.slice(j + 2);
            if (next === "-") {
              setArg(letters[j], next, arg);
              continue;
            }
            if (/[A-Za-z]/.test(letters[j]) && next[0] === "=") {
              setArg(letters[j], next.slice(1), arg);
              broken = true;
              break;
            }
            if (/[A-Za-z]/.test(letters[j]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
              setArg(letters[j], next, arg);
              broken = true;
              break;
            }
            if (letters[j + 1] && letters[j + 1].match(/\W/)) {
              setArg(letters[j], arg.slice(j + 2), arg);
              broken = true;
              break;
            } else {
              setArg(letters[j], flags.strings[letters[j]] ? "" : true, arg);
            }
          }
          key = arg.slice(-1)[0];
          if (!broken && key !== "-") {
            if (args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1]) && !flags.bools[key] && (aliases[key] ? !aliasIsBoolean(key) : true)) {
              setArg(key, args[i + 1], arg);
              i += 1;
            } else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
              setArg(key, args[i + 1] === "true", arg);
              i += 1;
            } else {
              setArg(key, flags.strings[key] ? "" : true, arg);
            }
          }
        } else {
          if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
            argv._.push(flags.strings._ || !isNumber(arg) ? arg : Number(arg));
          }
          if (opts.stopEarly) {
            argv._.push.apply(argv._, args.slice(i + 1));
            break;
          }
        }
      }
      Object.keys(defaults).forEach(function(k) {
        if (!hasKey(argv, k.split("."))) {
          setKey(argv, k.split("."), defaults[k]);
          (aliases[k] || []).forEach(function(x) {
            setKey(argv, x.split("."), defaults[k]);
          });
        }
      });
      if (opts["--"]) {
        argv["--"] = notFlags.slice();
      } else {
        notFlags.forEach(function(k) {
          argv._.push(k);
        });
      }
      return argv;
    };
  }
});

// ../../node_modules/tsconfig-paths/lib/register.js
var require_register = __commonJS({
  "../../node_modules/tsconfig-paths/lib/register.js"(exports2) {
    "use strict";
    var __spreadArray = exports2 && exports2.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.register = void 0;
    var match_path_sync_1 = require_match_path_sync();
    var config_loader_1 = require_config_loader();
    var noOp = function() {
      return void 0;
    };
    function getCoreModules(builtinModules) {
      builtinModules = builtinModules || [
        "assert",
        "buffer",
        "child_process",
        "cluster",
        "crypto",
        "dgram",
        "dns",
        "domain",
        "events",
        "fs",
        "http",
        "https",
        "net",
        "os",
        "path",
        "punycode",
        "querystring",
        "readline",
        "stream",
        "string_decoder",
        "tls",
        "tty",
        "url",
        "util",
        "v8",
        "vm",
        "zlib"
      ];
      var coreModules = {};
      for (var _i = 0, builtinModules_1 = builtinModules; _i < builtinModules_1.length; _i++) {
        var module_1 = builtinModules_1[_i];
        coreModules[module_1] = true;
      }
      return coreModules;
    }
    function register(params) {
      var cwd;
      var explicitParams;
      if (params) {
        cwd = params.cwd;
        if (params.baseUrl || params.paths) {
          explicitParams = params;
        }
      } else {
        var minimist = require_minimist();
        var argv = minimist(process.argv.slice(2), {
          // eslint-disable-next-line id-denylist
          string: ["project"],
          alias: {
            project: ["P"]
          }
        });
        cwd = argv.project;
      }
      var configLoaderResult = (0, config_loader_1.configLoader)({
        cwd: cwd !== null && cwd !== void 0 ? cwd : process.cwd(),
        explicitParams
      });
      if (configLoaderResult.resultType === "failed") {
        console.warn("".concat(configLoaderResult.message, ". tsconfig-paths will be skipped"));
        return noOp;
      }
      var matchPath = (0, match_path_sync_1.createMatchPath)(configLoaderResult.absoluteBaseUrl, configLoaderResult.paths, configLoaderResult.mainFields, configLoaderResult.addMatchAll);
      var Module = require("module");
      var originalResolveFilename = Module._resolveFilename;
      var coreModules = getCoreModules(Module.builtinModules);
      Module._resolveFilename = function(request, _parent) {
        var isCoreModule = coreModules.hasOwnProperty(request);
        if (!isCoreModule) {
          var found = matchPath(request);
          if (found) {
            var modifiedArguments = __spreadArray([found], [].slice.call(arguments, 1), true);
            return originalResolveFilename.apply(this, modifiedArguments);
          }
        }
        return originalResolveFilename.apply(this, arguments);
      };
      return function() {
        Module._resolveFilename = originalResolveFilename;
      };
    }
    exports2.register = register;
  }
});

// ../../node_modules/tsconfig-paths/lib/index.js
var require_lib2 = __commonJS({
  "../../node_modules/tsconfig-paths/lib/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.loadConfig = exports2.register = exports2.matchFromAbsolutePathsAsync = exports2.createMatchPathAsync = exports2.matchFromAbsolutePaths = exports2.createMatchPath = void 0;
    var match_path_sync_1 = require_match_path_sync();
    Object.defineProperty(exports2, "createMatchPath", { enumerable: true, get: function() {
      return match_path_sync_1.createMatchPath;
    } });
    Object.defineProperty(exports2, "matchFromAbsolutePaths", { enumerable: true, get: function() {
      return match_path_sync_1.matchFromAbsolutePaths;
    } });
    var match_path_async_1 = require_match_path_async();
    Object.defineProperty(exports2, "createMatchPathAsync", { enumerable: true, get: function() {
      return match_path_async_1.createMatchPathAsync;
    } });
    Object.defineProperty(exports2, "matchFromAbsolutePathsAsync", { enumerable: true, get: function() {
      return match_path_async_1.matchFromAbsolutePathsAsync;
    } });
    var register_1 = require_register();
    Object.defineProperty(exports2, "register", { enumerable: true, get: function() {
      return register_1.register;
    } });
    var config_loader_1 = require_config_loader();
    Object.defineProperty(exports2, "loadConfig", { enumerable: true, get: function() {
      return config_loader_1.loadConfig;
    } });
  }
});

// ../../node_modules/swagger-ui-dist/absolute-path.js
var require_absolute_path = __commonJS({
  "../../node_modules/swagger-ui-dist/absolute-path.js"(exports2, module2) {
    var getAbsoluteFSPath = function() {
      if (typeof module2 !== "undefined" && module2.exports) {
        return require("path").resolve(__dirname);
      }
      throw new Error("getAbsoluteFSPath can only be called within a Nodejs environment");
    };
    module2.exports = getAbsoluteFSPath;
  }
});

// ../../node_modules/swagger-ui-express/index.js
var require_swagger_ui_express = __commonJS({
  "../../node_modules/swagger-ui-express/index.js"(exports2, module2) {
    "use strict";
    var express2 = require("express");
    var getAbsoluteSwaggerFsPath = require_absolute_path();
    var favIconHtml = '<link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" /><link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16" />';
    var swaggerInit = "";
    function trimQuery(q) {
      return q && q.split("?")[0];
    }
    var htmlTplString = `
<!-- HTML for static distribution bundle build -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <% robotsMetaString %>
  <title><% title %></title>
  <link rel="stylesheet" type="text/css" href="./swagger-ui.css" >
  <% favIconString %>
  <style>
    html
    {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *,
    *:before,
    *:after
    {
      box-sizing: inherit;
    }

    body {
      margin:0;
      background: #fafafa;
    }
  </style>
</head>

<body>

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position:absolute;width:0;height:0">
  <defs>
    <symbol viewBox="0 0 20 20" id="unlocked">
      <path d="M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V6h2v-.801C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8z"></path>
    </symbol>

    <symbol viewBox="0 0 20 20" id="locked">
      <path d="M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8zM12 8H8V5.199C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8z"/>
    </symbol>

    <symbol viewBox="0 0 20 20" id="close">
      <path d="M14.348 14.849c-.469.469-1.229.469-1.697 0L10 11.819l-2.651 3.029c-.469.469-1.229.469-1.697 0-.469-.469-.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-.469-.469-.469-1.228 0-1.697.469-.469 1.228-.469 1.697 0L10 8.183l2.651-3.031c.469-.469 1.228-.469 1.697 0 .469.469.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c.469.469.469 1.229 0 1.698z"/>
    </symbol>

    <symbol viewBox="0 0 20 20" id="large-arrow">
      <path d="M13.25 10L6.109 2.58c-.268-.27-.268-.707 0-.979.268-.27.701-.27.969 0l7.83 7.908c.268.271.268.709 0 .979l-7.83 7.908c-.268.271-.701.27-.969 0-.268-.269-.268-.707 0-.979L13.25 10z"/>
    </symbol>

    <symbol viewBox="0 0 20 20" id="large-arrow-down">
      <path d="M17.418 6.109c.272-.268.709-.268.979 0s.271.701 0 .969l-7.908 7.83c-.27.268-.707.268-.979 0l-7.908-7.83c-.27-.268-.27-.701 0-.969.271-.268.709-.268.979 0L10 13.25l7.418-7.141z"/>
    </symbol>


    <symbol viewBox="0 0 24 24" id="jump-to">
      <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z"/>
    </symbol>

    <symbol viewBox="0 0 24 24" id="expand">
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
    </symbol>

  </defs>
</svg>

<div id="swagger-ui"></div>

<script src="./swagger-ui-bundle.js"> </script>
<script src="./swagger-ui-standalone-preset.js"> </script>
<script src="./swagger-ui-init.js"> </script>
<% customJs %>
<% customJsStr %>
<% customCssUrl %>
<style>
  <% customCss %>
</style>
</body>

</html>
`;
    var jsTplString = `
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  <% swaggerOptions %>
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.preauthorizeApiKey) {
    const key = customOptions.preauthorizeApiKey.authDefinitionKey;
    const value = customOptions.preauthorizeApiKey.apiKeyValue;
    if (!!key && !!value) {
      const pid = setInterval(() => {
        const authorized = ui.preauthorizeApiKey(key, value);
        if(!!authorized) clearInterval(pid);
      }, 500)

    }
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
`;
    function toExternalScriptTag(url) {
      return `<script src='${url}'></script>`;
    }
    function toInlineScriptTag(jsCode) {
      return `<script>${jsCode}</script>`;
    }
    function toExternalStylesheetTag(url) {
      return `<link href='${url}' rel='stylesheet'>`;
    }
    function toTags(customCode, toScript) {
      if (typeof customCode === "string") {
        return toScript(customCode);
      } else if (Array.isArray(customCode)) {
        return customCode.map(toScript).join("\n");
      } else {
        return "";
      }
    }
    var generateHTML = function(swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customSiteTitle, _htmlTplString, _jsTplString) {
      var isExplorer;
      var customJs;
      var customJsStr;
      var swaggerUrls;
      var customCssUrl;
      var customRobots;
      if (opts && typeof opts === "object") {
        options = opts.swaggerOptions;
        customCss = opts.customCss;
        customJs = opts.customJs;
        customJsStr = opts.customJsStr;
        customfavIcon = opts.customfavIcon;
        customRobots = opts.customRobots;
        swaggerUrl = opts.swaggerUrl;
        swaggerUrls = opts.swaggerUrls;
        isExplorer = opts.explorer || !!swaggerUrls;
        customSiteTitle = opts.customSiteTitle;
        customCssUrl = opts.customCssUrl;
      } else {
        isExplorer = opts;
      }
      options = options || {};
      var explorerString = isExplorer ? "" : ".swagger-ui .topbar .download-url-wrapper { display: none }";
      customCss = explorerString + " " + customCss || explorerString;
      customfavIcon = customfavIcon || false;
      customSiteTitle = customSiteTitle || "Swagger UI";
      _htmlTplString = _htmlTplString || htmlTplString;
      _jsTplString = _jsTplString || jsTplString;
      var robotsMetaString = customRobots ? '<meta name="robots" content="' + customRobots + '" />' : "";
      var favIconString = customfavIcon ? '<link rel="icon" href="' + customfavIcon + '" />' : favIconHtml;
      var htmlWithCustomCss = _htmlTplString.toString().replace("<% customCss %>", customCss);
      var htmlWithCustomRobots = htmlWithCustomCss.replace("<% robotsMetaString %>", robotsMetaString);
      var htmlWithFavIcon = htmlWithCustomRobots.replace("<% favIconString %>", favIconString);
      var htmlWithCustomJsUrl = htmlWithFavIcon.replace("<% customJs %>", toTags(customJs, toExternalScriptTag));
      var htmlWithCustomJs = htmlWithCustomJsUrl.replace("<% customJsStr %>", toTags(customJsStr, toInlineScriptTag));
      var htmlWithCustomCssUrl = htmlWithCustomJs.replace("<% customCssUrl %>", toTags(customCssUrl, toExternalStylesheetTag));
      var initOptions = {
        swaggerDoc: swaggerDoc || void 0,
        customOptions: options,
        swaggerUrl: swaggerUrl || void 0,
        swaggerUrls: swaggerUrls || void 0
      };
      swaggerInit = _jsTplString.toString().replace("<% swaggerOptions %>", stringify(initOptions));
      return htmlWithCustomCssUrl.replace("<% title %>", customSiteTitle);
    };
    var setup = function(swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customSiteTitle) {
      var html = generateHTML(swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customSiteTitle, htmlTplString, jsTplString);
      return function(req, res) {
        if (req.swaggerDoc) {
          var reqHtml = generateHTML(req.swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customSiteTitle, htmlTplString, jsTplString);
          res.send(reqHtml);
        } else {
          res.send(html);
        }
      };
    };
    function swaggerInitFn(req, res, next) {
      if (trimQuery(req.url).endsWith("/package.json")) {
        res.sendStatus(404);
      } else if (trimQuery(req.url).endsWith("/swagger-ui-init.js")) {
        res.set("Content-Type", "application/javascript");
        res.send(swaggerInit);
      } else {
        next();
      }
    }
    var swaggerInitFunction = function(swaggerDoc, opts) {
      var swaggerInitFile = jsTplString.toString().replace("<% swaggerOptions %>", stringify(opts));
      return function(req, res, next) {
        if (trimQuery(req.url).endsWith("/package.json")) {
          res.sendStatus(404);
        } else if (trimQuery(req.url).endsWith("/swagger-ui-init.js")) {
          if (req.swaggerDoc) {
            opts.swaggerDoc = req.swaggerDoc;
            swaggerInitFile = jsTplString.toString().replace("<% swaggerOptions %>", stringify(opts));
          }
          res.set("Content-Type", "application/javascript");
          res.send(swaggerInitFile);
        } else {
          next();
        }
      };
    };
    var swaggerAssetMiddleware = (options) => {
      var opts = options || {};
      opts.index = false;
      return express2.static(getAbsoluteSwaggerFsPath(), opts);
    };
    var serveFiles = function(swaggerDoc, opts) {
      opts = opts || {};
      var initOptions = {
        swaggerDoc: swaggerDoc || void 0,
        customOptions: opts.swaggerOptions || {},
        swaggerUrl: opts.swaggerUrl || {},
        swaggerUrls: opts.swaggerUrls || void 0
      };
      var swaggerInitWithOpts = swaggerInitFunction(swaggerDoc, initOptions);
      return [swaggerInitWithOpts, swaggerAssetMiddleware()];
    };
    var serve = [swaggerInitFn, swaggerAssetMiddleware()];
    var serveWithOptions = (options) => [swaggerInitFn, swaggerAssetMiddleware(options)];
    var stringify = function(obj, prop) {
      var placeholder = "____FUNCTIONPLACEHOLDER____";
      var fns = [];
      var json = JSON.stringify(obj, function(key, value) {
        if (typeof value === "function") {
          fns.push(value);
          return placeholder;
        }
        return value;
      }, 2);
      json = json.replace(new RegExp('"' + placeholder + '"', "g"), function(_) {
        return fns.shift();
      });
      return "var options = " + json + ";";
    };
    module2.exports = {
      setup,
      serve,
      serveWithOptions,
      generateHTML,
      serveFiles
    };
  }
});

// src/index.ts
var import_express2 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));

// src/routes.ts
var import_express = require("express");

// src/middlewares/errorHandler.ts
var errorHandler = (err, _req, res, next) => {
  const status = "status" in err && typeof err.status === "number" ? err.status : 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
};

// src/services/helloService.ts
var sayHello = async () => {
  return "Hello World from Moudro Dne!";
};

// src/controllers/helloController.ts
var getSaying = async (_req, res) => {
  const hello = await sayHello();
  res.status(200).json(hello);
};

// src/routes.ts
var router = (0, import_express.Router)();
router.use(errorHandler);
router.get("/hello", getSaying);
var routes_default = router;

// src/index.ts
var import_dotenv = __toESM(require_main());

// ../../node_modules/tsconfig-paths/register.js
require_lib2().register();

// src/index.ts
var import_swagger_ui_express = __toESM(require_swagger_ui_express());

// src/swagger_output.json
var swagger_output_default = {
  openapi: "3.0.0",
  info: {
    version: "v0.0.1",
    title: "Swagger of Moudro Dne",
    description: "Implementation of Swagger documentation of Moudro Dne"
  },
  servers: [
    {
      url: "http://localhost:3000/"
    }
  ],
  paths: {
    "/hello": {
      get: {
        description: "",
        responses: {
          "200": {
            description: "OK"
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer"
      }
    }
  }
};

// src/index.ts
import_dotenv.default.config();
var app = (0, import_express2.default)();
var corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  allowedHeaders: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
};
app.use((0, import_cors.default)(corsOptions));
app.use("/api-docs", import_swagger_ui_express.default.serve, import_swagger_ui_express.default.setup(swagger_output_default));
app.use("/api", routes_default);
var PORT = process.env.PORT || 3e3;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
