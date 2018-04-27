class fstree {

    public readonly root: UploadFile;

    /**
     * 根据文件路径构建出文件系统树
    */
    constructor(files: any[]) {
        this.root = new UploadFile(null, "/", -1, null);

        files.forEach(file => {
            var path: string[] = file.filepath.split("/");
            var name: string = file.name;
            var size: number = file.size;
            var folder: UploadFile = this.travelToParent(path);
            var obj: UploadFile = new UploadFile(file, name, size, folder);

            folder.addChild(obj);
        });
    }

    /**
     * 返回路径所指示的最后一个文件夹，如果不存在，则会进行创建
    */
    private travelToParent(path: string[]): UploadFile {
        var parent: UploadFile = this.root;

        console.log(path.join("/") + " => " + path[path.length - 2]);

        for (var i = 0; i < path.length - 2; ++i) {
            var name: string = path[i];
            var folder: UploadFile = null;

            console.log(name);

            if (parent.hasChild(name)) {
                folder = parent.childs[name];
                console.log("get");
            } else {
                folder = new UploadFile(null, name, 0, parent);
                parent.addChild(folder);
                console.log("build");
            }

            parent = folder;
        }

        return parent;
    }
}

