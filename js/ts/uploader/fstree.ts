class fstree {

    public readonly root: UploadFile;

    /**
     * 根据文件路径构建出文件系统树
    */
    constructor(files: any[]) {
        var root: UploadFile = new UploadFile(null, "/", -1, null);
        var childs: UploadFile[] = [];

        childs["/"] = root;

        /**
     * 返回路径所指示的最后一个文件夹，如果不存在，则会进行创建
    */
        function travelToParent(path: string[]): UploadFile {
            var dir: string = path.pop();
            var name: string = path[path.length - 1];

            dir = path.join("/");

            console.log(path.join("/") + " => " + path[path.length - 2] + " => " + dir);

            if (dir in childs) {
                return childs[dir];
            } else {
                var parent: UploadFile = travelToParent(path);
                var folder: UploadFile = new UploadFile(null, name, 0, parent);

                childs[dir] = folder;

                return folder;
            }
        }

        files.forEach(file => {
            var path: string[] = file.filepath.split("/");
            var name: string = file.name;
            var size: number = file.size;
            var folder: UploadFile = travelToParent(path);
            var obj: UploadFile = new UploadFile(file, name, size, folder);

            folder.addChild(obj);
        });

        console.log(childs);
    }
}

