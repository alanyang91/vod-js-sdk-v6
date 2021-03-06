"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var sha1 = require('js-sha1');
var COS = require('cos-js-sdk-v5');
var events_1 = require("events");
var axios_1 = require("axios");
var util_1 = require("./util");
var UploaderEvent;
(function (UploaderEvent) {
    UploaderEvent["video_progress"] = "video_progress";
    UploaderEvent["video_upload"] = "video_upload";
    UploaderEvent["cover_progress"] = "cover_progress";
    UploaderEvent["cover_upload"] = "cover_upload";
})(UploaderEvent = exports.UploaderEvent || (exports.UploaderEvent = {}));
var Uploader = /** @class */ (function (_super) {
    __extends(Uploader, _super);
    function Uploader(params) {
        var _this = _super.call(this) || this;
        _this.sessionName = '';
        _this.applyRequestTimeout = 5000;
        _this.applyRequestRetryCount = 3;
        _this.commitRequestTimeout = 5000;
        _this.commitRequestRetryCount = 3;
        _this.retryDelay = 1000;
        _this.validateInitParams(params);
        _this.videoFile = params.videoFile;
        _this.getSignature = params.getSignature;
        _this.videoName = params.videoName;
        _this.coverFile = params.coverFile;
        _this.fileId = params.fileId;
        _this.genFileInfo();
        return _this;
    }
    // set storage
    Uploader.prototype.setStorage = function (name, value) {
        if (!name) {
            return;
        }
        var cname = 'webugc_' + sha1(name);
        try {
            localStorage.setItem(cname, value);
        }
        catch (e) { }
    };
    // get storage
    Uploader.prototype.getStorage = function (name) {
        if (!name) {
            return;
        }
        var cname = 'webugc_' + sha1(name);
        var result = null;
        try {
            result = localStorage.getItem(cname);
        }
        catch (e) { }
        return result;
    };
    // delete storage
    Uploader.prototype.delStorage = function (name) {
        if (!name) {
            return;
        }
        var cname = 'webugc_' + sha1(name);
        try {
            localStorage.removeItem(cname);
        }
        catch (e) { }
    };
    // validate init params
    Uploader.prototype.validateInitParams = function (params) {
        if (!util_1.default.isFunction(params.getSignature)) {
            throw new Error('getSignature must be a function');
        }
        if (params.videoFile && !util_1.default.isFile(params.videoFile)) {
            throw new Error('videoFile must be a File');
        }
    };
    Uploader.prototype.genFileInfo = function () {
        // video file info
        var videoFile = this.videoFile;
        if (videoFile) {
            var lastDotIndex = videoFile.name.lastIndexOf('.');
            var videoName = '';
            // if specified, use it.
            if (this.videoName) {
                if (!util_1.default.isString(this.videoName)) {
                    throw new Error('videoName must be a string');
                }
                else if (/[:*?<>\"\\/|]/g.test(this.videoName)) {
                    throw new Error('Cant use these chars in filename: \\ / : * ? " < > |');
                }
                else {
                    videoName = this.videoName;
                }
            }
            else { // else use the meta info of file
                videoName = videoFile.name.substring(0, lastDotIndex);
            }
            this.videoInfo = {
                name: videoName,
                type: videoFile.name.substring(lastDotIndex + 1).toLowerCase(),
                size: videoFile.size
            };
            this.sessionName += videoFile.name + "_" + videoFile.size + ";";
        }
        // cover file info
        var coverFile = this.coverFile;
        if (coverFile) {
            var coverName = coverFile.name;
            var coverLastDotIndex = coverName.lastIndexOf('.');
            this.coverInfo = {
                name: coverName.substring(0, coverLastDotIndex),
                type: coverName.substring(coverLastDotIndex + 1).toLowerCase(),
                size: coverFile.size
            };
            this.sessionName += coverFile.name + "_" + coverFile.size + ";";
        }
    };
    ;
    Uploader.prototype.applyUploadUGC = function (signature, retryCount) {
        if (retryCount === void 0) { retryCount = 0; }
        return __awaiter(this, void 0, void 0, function () {
            function whenError(err) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self.delStorage(self.sessionName);
                                if (self.applyRequestRetryCount == retryCount) {
                                    if (err) {
                                        throw err;
                                    }
                                    throw new Error("apply upload failed");
                                }
                                return [4 /*yield*/, util_1.default.delay(self.retryDelay)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, self.applyUploadUGC(signature, retryCount + 1)];
                        }
                    });
                });
            }
            var self, sendParam, videoInfo, coverInfo, vodSessionKey, response, e_1, applyResult, vodSessionKey_1, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        videoInfo = this.videoInfo;
                        coverInfo = this.coverInfo;
                        vodSessionKey = this.getStorage(this.sessionName);
                        // resume from break point
                        if (vodSessionKey) {
                            sendParam = {
                                'signature': signature,
                                'vodSessionKey': vodSessionKey
                            };
                        }
                        else if (videoInfo) {
                            sendParam = {
                                'signature': signature,
                                'videoName': videoInfo.name,
                                'videoType': videoInfo.type,
                                'videoSize': videoInfo.size
                            };
                            if (coverInfo) { // upload video together with cover
                                sendParam.coverName = coverInfo.name;
                                sendParam.coverType = coverInfo.type;
                                sendParam.coverSize = coverInfo.size;
                            }
                        }
                        else if (this.fileId && coverInfo) { // alter cover
                            sendParam = {
                                'signature': signature,
                                'fileId': this.fileId,
                                'coverName': coverInfo.name,
                                'coverType': coverInfo.type,
                                'coverSize': coverInfo.size
                            };
                        }
                        else {
                            throw ('Wrong params, please check and try again');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.post('https://vod2.qcloud.com/v3/index.php?Action=ApplyUploadUGC', sendParam, {
                                timeout: this.applyRequestTimeout,
                                withCredentials: false,
                            })];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        return [2 /*return*/, whenError()];
                    case 4:
                        applyResult = response.data;
                        // all err code https://user-images.githubusercontent.com/1147375/51222454-bf6ef280-1978-11e9-8e33-1b0fdb2fe200.png
                        if (applyResult.code == 0) {
                            vodSessionKey_1 = applyResult.data.vodSessionKey;
                            this.setStorage(this.sessionName, vodSessionKey_1);
                            return [2 /*return*/, applyResult.data];
                        }
                        else {
                            err = new Error(applyResult.message);
                            err.code = applyResult.code;
                            return [2 /*return*/, whenError(err)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Uploader.prototype.uploadToCos = function (applyData) {
        return __awaiter(this, void 0, void 0, function () {
            var self, cosParam, cos, uploadCosParams, cosVideoParam, cosCoverParam, uploadPromises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        cosParam = {
                            bucket: applyData.storageBucket + '-' + applyData.storageAppId,
                            region: applyData.storageRegionV5,
                        };
                        cos = new COS({
                            getAuthorization: function (options, callback) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var signature, applyData;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, self.getSignature()];
                                            case 1:
                                                signature = _a.sent();
                                                return [4 /*yield*/, self.applyUploadUGC(signature)];
                                            case 2:
                                                applyData = _a.sent();
                                                callback({
                                                    TmpSecretId: applyData.tempCertificate.secretId,
                                                    TmpSecretKey: applyData.tempCertificate.secretKey,
                                                    XCosSecurityToken: applyData.tempCertificate.token,
                                                    ExpiredTime: applyData.tempCertificate.expiredTime,
                                                });
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            }
                        });
                        this.cos = cos;
                        uploadCosParams = [];
                        if (this.videoFile) {
                            cosVideoParam = __assign({}, cosParam, { file: this.videoFile, key: applyData.video.storagePath, onProgress: function (data) {
                                    self.emit(UploaderEvent.video_progress, data);
                                }, onUpload: function (data) {
                                    self.emit(UploaderEvent.video_upload, data);
                                }, TaskReady: function (taskId) {
                                    self.taskId = taskId;
                                } });
                            uploadCosParams.push(cosVideoParam);
                        }
                        if (this.coverFile) {
                            cosCoverParam = __assign({}, cosParam, { file: this.coverFile, key: applyData.cover.storagePath, onProgress: function (data) {
                                    self.emit(UploaderEvent.cover_progress, data);
                                }, onUpload: function (data) {
                                    self.emit(UploaderEvent.cover_upload, data);
                                }, TaskReady: util_1.default.noop });
                            uploadCosParams.push(cosCoverParam);
                        }
                        uploadPromises = uploadCosParams.map(function (uploadCosParam) {
                            return new Promise(function (resolve, reject) {
                                cos.sliceUploadFile({
                                    Bucket: uploadCosParam.bucket,
                                    Region: uploadCosParam.region,
                                    Key: uploadCosParam.key,
                                    Body: uploadCosParam.file,
                                    TaskReady: uploadCosParam.TaskReady,
                                    onProgress: uploadCosParam.onProgress,
                                }, function (err, data) {
                                    if (!err) {
                                        uploadCosParam.onUpload(data);
                                        return resolve();
                                    }
                                    self.delStorage(self.sessionName);
                                    reject(err);
                                });
                            });
                        });
                        return [4 /*yield*/, Promise.all(uploadPromises)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Uploader.prototype.commitUploadUGC = function (signature, vodSessionKey, retryCount) {
        if (retryCount === void 0) { retryCount = 0; }
        return __awaiter(this, void 0, void 0, function () {
            function whenError() {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (self.commitRequestRetryCount == retryCount) {
                                    throw new Error('commit upload failed');
                                }
                                return [4 /*yield*/, util_1.default.delay(self.retryDelay)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, self.commitUploadUGC(signature, vodSessionKey, retryCount + 1)];
                        }
                    });
                });
            }
            var self, response, e_2, commitResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        this.delStorage(this.sessionName);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.post('https://vod2.qcloud.com/v3/index.php?Action=CommitUploadUGC', {
                                'signature': signature,
                                'vodSessionKey': vodSessionKey,
                            }, {
                                timeout: this.commitRequestTimeout,
                                withCredentials: false,
                            })];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        return [2 /*return*/, whenError()];
                    case 4:
                        commitResult = response.data;
                        if (commitResult.code == 0) {
                            return [2 /*return*/, commitResult.data];
                        }
                        else {
                            return [2 /*return*/, whenError()];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Uploader.prototype.start = function () {
        this.donePromise = this._start();
    };
    Uploader.prototype._start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var signature, applyData, newSignature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSignature()];
                    case 1:
                        signature = _a.sent();
                        return [4 /*yield*/, this.applyUploadUGC(signature)];
                    case 2:
                        applyData = _a.sent();
                        return [4 /*yield*/, this.uploadToCos(applyData)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.getSignature()];
                    case 4:
                        newSignature = _a.sent();
                        return [4 /*yield*/, this.commitUploadUGC(newSignature, applyData.vodSessionKey)];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Uploader.prototype.done = function () {
        return this.donePromise;
    };
    Uploader.prototype.cancel = function () {
        this.cos.cancelTask(this.taskId);
    };
    return Uploader;
}(events_1.EventEmitter));
exports.default = Uploader;
//# sourceMappingURL=uploader.js.map