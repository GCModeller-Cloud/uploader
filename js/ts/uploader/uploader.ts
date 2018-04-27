namespace Utils {

    /**
     * 处理拖拽事件，解析获取得到拖拽事件所产生的文件对象树
    */
    export function populateTree(event: DragEvent): UploadFile {
        var items = event.dataTransfer.items;
        var root: UploadFile = new UploadFile(null, "/", -1, null);

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
                    root.addChild(FileNode(root, entry));
                } else {
                    var list = readDirectory(entry);

                    console.log(entry);
                    console.log(list);
                    // root.addChild(DirectoryNode(root, entry));
                }
            }
        }

        return root;
    }

    function DirectoryNode(root: UploadFile, entry: any) {
        // Get folder contents
        var dirReader = entry.createReader();
        var folder: UploadFile = new UploadFile(
            entry,
            entry.name,
            0,
            root);

        console.log(folder.toString());
        console.log(dirReader);

        dirReader.readEntries(function (entries) {

            console.log(entries);

            for (var i = 0; i < entries.length; i++) {
                var file: any = entries[i].webkitGetAsEntry();

                if (file) {
                    if (file.isFile) {
                        folder.addChild(FileNode(folder, file));
                    } else {
                        folder.addChild(DirectoryNode(folder, file));
                    }
                }
            }
        });

        return folder;
    }

    function FileNode(root: UploadFile, entry: any): UploadFile {
        var localfile: File = entry.file();
        var child: UploadFile = new UploadFile(
            entry,
            localfile.name,
            localfile.size,
            root
        );

        console.log(child.toString());

        return child;
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

    function readDirectory(directory) {
        let dirReader = directory.createReader();
        let entries = [];

        let getEntries = function () {
            dirReader.readEntries(function (results) {

                console.log(results);

                if (results.length) {

                    for (var i = 0; i < results.length; i++) { 
                        entries.push(results[i]);
                    }

                    getEntries();
                }
            }, function (error) {
                /* handle error -- error is a FileError object */

                // 2018-4-27 
                // 当网页是直接从文件系统启动的时候，使用的协议为file://
                // 会出现下面的错误
                // DOMException: A URI supplied to the API was malformed, or the resulting Data URL has exceeded the URL length limitations for Data URLs.

                /*
                    https://developer.mozilla.org/en-US/docs/Web/API/FileError

                    Where we can reed :
                    Don't run your app from file://
                    For security reasons, browsers do not allow you to run your app from file://.
                    But using evt.dataTransfer.files seems to be ok, so this security limitation of drop seems to be partial.
                */

                // 在调试的时候应该从web服务器启动，在localhost进行调试

                console.error(error);
            });
        };

        getEntries();

        return entries;
    }
}