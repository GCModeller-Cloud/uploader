
dropArea.addEventListener("drop", function (event) {
  event.preventDefault();

  var items = event.dataTransfer.items;
  getFilesFromWebkitDataTransferItems(items)
    .then(files => {
        console.log(files);
    })
}, false);