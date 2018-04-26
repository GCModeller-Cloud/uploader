class file {

    name: string;
    size: number;
    type: fileObjectTypes;
    parent: file;

    public unitSize(): string {
        return Utils.unitSize(this.size);
    }
}

enum fileObjectTypes { file, directory };

namespace Utils {

    /**
     * 处理拖拽事件，解析获取得到拖拽事件所产生的文件对象树
    */
    export function populateTree(event: DragEvent): file {
        var items = event.dataTransfer.items;
        var root: file;

        for (var i = 0; i < items.length; i++) {

            // webkitGetAsEntry is where the magic happens
            //
            // A FileSystemEntry-based object describing the 
            // dropped item. 
            // This will be either FileSystemFileEntry or 
            // FileSystemDirectoryEntry.
            var entry: any = items[i].webkitGetAsEntry();

            if (entry) {
                if (entry.isFile) {
                    var file: FileSystemFileEntry = (FileSystemFileEntry) entry;
                }
            }
        }

        return root;
    }

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