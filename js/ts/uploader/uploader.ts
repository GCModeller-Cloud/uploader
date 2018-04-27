/**
 * 根据文件路径构建出文件系统树
*/
function tree(files: any[]): UploadFile {
    var root: UploadFile = new UploadFile(null, "/", -1, null);

    files.forEach(file => {
        var path: string[] = file.filepath.split("/");
        var name: string = file.name;
        var size: number = file.size;
        var folder: UploadFile = travelToParent(root, path);
        var obj: UploadFile = new UploadFile(file, name, size, folder);

        folder.addChild(obj);
    });

    return root
}

/**
 * 返回路径所指示的最后一个文件夹，如果不存在，则会进行创建
*/
function travelToParent(root: UploadFile, path: string[]): UploadFile {
    console.log(path.join("/") + " => " + path[path.length - 2]);

    for (var i = 0; i < path.length - 2; ++i) {
        var name: string = path[i];
        var folder: UploadFile = null;

        console.log(name);

        if (root.hasChild(name)) {
            folder = root.childs[name];
            console.log("get");
        } else {
            folder = new UploadFile(null, name, 0, root);
            root.addChild(folder);
            console.log("build");
        }

        root = folder;
    }

    return root;
}

namespace Utils {

    /**
     * 将数值无单位符号的字节大小值转换为带有单位的字节大小值
     * 
     * @param sizeL 无单位的字节大小值
    */
    export function unitSize(sizeL: number): string {
        var size: string = "";

        if (sizeL <= 1024) {
            size = sizeL + 'B';
        } else {
            size = sizeL / 1024 > 1024
                ? sizeL / (1024 * 1024) > 1024
                    ? (sizeL / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
                    : (sizeL / (1024 * 1024)).toFixed(2) + 'MB'
                : (sizeL / 1024).toFixed(2) + 'KB';
        }

        return size;
    }
}
