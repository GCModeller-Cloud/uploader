/**
 * FileSystem object model
*/
class UploadFile {

    name: string;
    size: number;
    type: fileObjectTypes;
    parent: UploadFile;
    childs: UploadFile[];
    obj: any;

    constructor(obj: any, name: string, size: number, parent: UploadFile) {
        if (!obj && !parent) {
            // root directory
            this.type = fileObjectTypes.directory;
        } else {
            if (obj.isFile) {
                this.type = fileObjectTypes.file;
            } else {
                this.type = fileObjectTypes.directory;
            }
        }

        this.obj = obj;
        this.name = name;
        this.size = size;
        this.parent = parent;
    }

    /**
     * Append a file as child in this tree and returns current object instance.
     * 
     * @param child Child node
     */
    public addChild(child: UploadFile): UploadFile {
        if (this.type = fileObjectTypes.file) {
            throw new TypeError("Can not append a child into a file object, this function required a directory file type!");
        }
        if (!this.childs) {
            this.childs = [];
        }
        this.childs.push(child);

        return this;
    }

    public unitSize(): string {
        return Utils.unitSize(this.size);
    }

    public files(): UploadFile[] {
        if (!this.childs ||
            this.type === fileObjectTypes.file ||
            this.childs.length === 0) {

            return [this];
        } else {
            var list: UploadFile[] = [];

            // 做递归
            this.childs.forEach(child => {
                child.files().forEach(child2 => {
                    list.push(child2);
                });
            });

            return list;
        }
    }
}