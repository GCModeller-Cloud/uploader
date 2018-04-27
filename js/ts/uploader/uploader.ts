﻿namespace Utils {

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
                    root.addChild(DirectoryNode(root, entry));
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
                if (results.length) {
                    entries = entries.concat(toArray(results));
                    getEntries();
                }
            }, function (error) {
                /* handle error -- error is a FileError object */
            });
        };

        getEntries();
        return entries;
    }
}