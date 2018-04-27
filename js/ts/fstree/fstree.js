var fstree = /** @class */ (function () {
    /**
     * 根据文件路径构建出文件系统树
    */
    function fstree() {
        var _this = this;
        var root = new UploadFile(null, "/", -1, null);
        var files = [
            { "filepath": "/a/bcde.js", "name": "bcde.js", "size": 250 },
            { "filepath": "/a/b/c/d/e.js", "name": "e.js", "size": 5 },
            { "filepath": "/a/b/c/de.js", "name": "de.js", "size": 25 }
        ];
        files.forEach(function (file) {
            var path = file.filepath.split("/");
            var name = file.name;
            var size = file.size;
            var folders = _this.travelToParent(path, root);
            var obj = new UploadFile(file, name, size, folders[0]);
            folders[0].addChild(obj);
            root = folders[1];
        });
        this.root = root;
    }
    /**
     * 返回路径所指示的最后一个文件夹，如果不存在，则会进行创建
    */
    fstree.prototype.travelToParent = function (path, root) {
        var parent = root;
        console.log(path.join("/") + " => " + path[path.length - 2]);
        console.log(parent);
        for (var i = 0; i < path.length - 2; ++i) {
            var name = path[i];
            var folder = null;
            if (parent.hasChild(name)) {
                folder = parent.childs[name];
            }
            else {
                folder = new UploadFile(null, name, 0, parent);
                parent.addChild(folder);
            }
            parent = folder;
        }
        return [parent, root];
    };
    return fstree;
}());
//# sourceMappingURL=fstree.js.map