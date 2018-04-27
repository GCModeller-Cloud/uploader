class fstree {

    public root: UploadFile;

    /**
     * 根据文件路径构建出文件系统树
    */
    constructor(files: any[]) {
        var root = new UploadFile(null, "/", -1, null);

        files.forEach(file => {
            var path: string[] = file.filepath.split("/");
            var name: string = file.name;
            var size: number = file.size;
            var folders: UploadFile[] = this.travelToParent(path, root);
            var obj: UploadFile = new UploadFile(file, name, size, folders[0]);

            folders[0].addChild(obj);
            root = folders[1];
        });

        this.root = root;
    }

    /**
     * 返回路径所指示的最后一个文件夹，如果不存在，则会进行创建
    */
    private travelToParent(path: string[], root: UploadFile): UploadFile[] {
        var parent: UploadFile = root;

        console.log(path.join("/") + " => " + path[path.length - 2]);
        console.log(parent);

        for (var i = 0; i < path.length - 2; ++i) {
            var name: string = path[i];
            var folder: UploadFile = null;

            if (parent.hasChild(name)) {
                folder = parent.childs[name];
            } else {
                folder = new UploadFile(null, name, 0, parent);
                parent.addChild(folder);
            }

            parent = folder;
        }        

        return [parent, root];
    }
}

