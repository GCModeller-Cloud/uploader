/**
 * 根据文件路径构建出文件系统树
*/
function tree(files: any[]): UploadFile {
    var root: UploadFile = new UploadFile(null, "/", -1, null);
    var childs: UploadFile[] = [];

    childs["/"] = root;

    files.forEach(file => {
        var path: string[] = file.filepath.split("/");
        var name: string = file.name;
        var size: number = file.size;
        var folder: UploadFile = travelToParent(childs, path);
        var obj: UploadFile = new UploadFile(file, name, size, folder);

        folder.addChild(obj);
    });

    console.log(childs);

    return root
}

/**
 * 返回路径所指示的最后一个文件夹，如果不存在，则会进行创建
*/
function travelToParent(root: UploadFile[], path: string[]): UploadFile {
    var dir: string = path.pop();
    var name: string = path[path.length - 1];

    dir = path.join("/");

    console.log(path.join("/") + " => " + path[path.length - 2] + " => " + dir);

    if (dir in root) {
        return root[dir];
    } else {
        var parent: UploadFile = travelToParent(root, path);
        var folder: UploadFile = new UploadFile(null, name, 0, parent);

        root[dir] = folder;

        return folder;
    }
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
