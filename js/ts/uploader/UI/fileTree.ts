import $ from "jquery";

/**
 * 进行UI处理的代码部分
*/
function showFiles(files: UploadFile[]) {

    // 在完成了文件的拖拽之后，会使用这个函数来处理UI界面的变化
    // 拖拽完成之后会将初始页面进行隐藏，然后显示出上传进度页面
    $("#initial-scale").hide();
    $("#progress-scale").show();

    // 将文件显示在进度页面之上
    
    
}