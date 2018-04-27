/**
 * 文件对象类型枚举
*/
var fileObjectTypes;
(function (fileObjectTypes) {
    /**
     * 这是一个文件
    */
    fileObjectTypes[fileObjectTypes["file"] = 0] = "file";
    /**
     * 这是一个文件夹
    */
    fileObjectTypes[fileObjectTypes["directory"] = 1] = "directory";
})(fileObjectTypes || (fileObjectTypes = {}));
;
//# sourceMappingURL=fileObjectTypes.js.map