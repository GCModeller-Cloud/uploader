/**
 * FileSystem object model
*/
var UploadFile = /** @class */ (function () {
    function UploadFile(file, name, size, parent) {
        if (!file) {
            // directory
            this.type = fileObjectTypes.directory;
        }
        else {
            this.type = fileObjectTypes.file;
        }
        this.file = file;
        this.name = name;
        this.size = size;
        this.parent = parent;
        if (this.type == fileObjectTypes.directory) {
            this.childs = [];
        }
    }
    UploadFile.prototype.QualifyName = function () {
        if (this.parent) {
            return this.parent.QualifyName() + "/" + this.name;
        }
        else {
            return "/" + this.name;
        }
    };
    UploadFile.prototype.toString = function () {
        return this.QualifyName() + " (" + this.unitSize() + ")";
    };
    UploadFile.prototype.hasChild = function (name) {
        if (!this.childs || this.childs.length == 0) {
            return false;
        }
        else {
            return this.childs.hasOwnProperty(name);
        }
    };
    /**
     * Append a file as child in this tree and returns current object instance.
     *
     * @param child Child node
     */
    UploadFile.prototype.addChild = function (child) {
        if (this.type == fileObjectTypes.file) {
            throw new TypeError("Can not append a child into a file object, this function required a directory file type!");
        }
        else {
            // 如果是文件夹类型，因为childs已经在构造函数位置初始化了
            // 所以在这里不需要再考虑是否为空的问题
            this.childs[child.name] = child;
        }
        return this;
    };
    UploadFile.prototype.unitSize = function () {
        return Utils.unitSize(this.size);
    };
    UploadFile.prototype.files = function () {
        if (!this.childs ||
            this.type === fileObjectTypes.file ||
            this.childs.length === 0) {
            return [this];
        }
        else {
            var list = [];
            // 做递归
            this.childs.forEach(function (child) {
                child.files().forEach(function (child2) {
                    list.push(child2);
                });
            });
            return list;
        }
    };
    return UploadFile;
}());
//# sourceMappingURL=UploadFile.js.map