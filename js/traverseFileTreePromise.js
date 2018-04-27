/**
 * https://stackoverflow.com/questions/3590058/does-html5-allow-drag-drop-upload-of-folders-or-a-folder-tree 
*/ 
function getFilesWebkitDataTransferItems(dataTransferItems) {
    function traverseFileTreePromise(item, path = '') {
        return new Promise(resolve => {

            if (item.isFile) {

                item.file(file => {
                    //save full path
                    file.filepath = path + file.name;
                    files.push(file);
                    resolve(file);
                });

            } else if (item.isDirectory) {
                let dirReader = item.createReader();

                dirReader.readEntries(entries => {
                    let entriesPromises = [];

                    for (let entr of entries) {
                        entriesPromises.push(traverseFileTreePromise(entr, path + item.name + "/"));
                    }

                    resolve(Promise.all(entriesPromises));
                });
            }
        });
    }

    let files = [];

    return new Promise((resolve, reject) => {
        let entriesPromises = [];

        for (let it of dataTransferItems) {
            entriesPromises.push(traverseFileTreePromise(it.webkitGetAsEntry()));
        }

        Promise.all(entriesPromises)
            .then(entries => {
                //console.log(entries)
                resolve(files);
            });
    });
}