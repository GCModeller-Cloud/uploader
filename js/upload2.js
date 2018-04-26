var allfiles = new Array();
var project_id = document.getElementsByName("project_id")[0].value;
var filefolder_id = document.getElementsByName("filefolder_id")[0].value;
var filefolder_name = document.getElementsByName("filefolder_name")[0].value;
var success_count = 0;//文件上传成功数
var file_count = 0;//待上传的文件数
var times = 1;
var interval = 0;

var fileMd5;  //文件唯一标识

//获取该组别下所有的文件
$(function () {
    $.ajax({
        url: "{:U('index/file_check')}",
        type: "POST",
        data: {
            "project_id": project_id,
            "filefolder_id": filefolder_id,
            "filefolder_name": filefolder_name
        },
        dataType: "json",
        success: function (data) {
            allfiles = data;
        }
    })
});

// 在文件开始发送前做些异步操作。
// WebUploader会等待此异步操作完成后，开始发送文件。
WebUploader.Uploader.register({
    "before-send-file": "beforeSendFile",//整个文件上传前
    "before-send": "beforeSend",  //每个分片上传前
    "after-send-file": "afterSendFile",  //分片上传完毕
}, {
        //时间点1：所有分块进行上传之前调用此函数
        beforeSendFile: function (file) {
            var deferred = WebUploader.Deferred();
            //1、计算文件的唯一标记fileMd5，用于断点续传  如果.md5File(file)方法里只写一个file参数则计算MD5值会很慢 所以加了后面的参数：10*1024*1024
            (new WebUploader.Uploader()).md5File(file, 0, 10 * 1024 * 1024).progress(function (percentage) {
                var per = (parseFloat(percentage) * 100).toFixed(2);
                $('#' + file.id).find('.state_c').text('正在读取文件信息...' + per + '%');
            })
                .then(function (val) {
                    $('#' + file.id).find(".state_c").text("成功获取文件信息...");
                    fileMd5 = val;
                    //获取文件信息后进入下一步
                    $.ajax({
                        type: "POST",
                        url: "{:U('index/file_exit')}",
                        data: {
                            "project_id": project_id,
                            "filefolder_id": filefolder_id,
                            "file_content": fileMd5,
                            "file_name": file.name,
                            "filefolder_name": filefolder_name
                        },
                        dataType: "json",
                        cache: false,
                        async: false,  // 与js同步
                        success: function (data) {
                            if (data.info == '原始文件存在但是该组别下该文件不存在,文件等待上传') {

                                success_count++;

                                uploader.skipFile(file);

                                var $li = $('#' + file.id),
                                    $percent = $li.find('.progress .progress-bar');

                                var $progress = $('#' + file.id).find('div.state_c');
                                $('#' + file.id).find('div.state_c').text('');


                                $percent = $('<div class="progress progress-striped active" style="display: inline-block;width: 60%;margin-bottom:-5px;margin-top: 5px;margin-right: 10px;">' +
                                    '<div class="progress-bar" role="progressbar" style="width: 0%;">' +
                                    '</div></div><span style="display: inline-block;margin-left: 5px;width: 8%;">' + '100' + '%' + '</span><span style="display: inline-block;margin-left: 5px;margin-right: 5px;width: 12%;">' + '已上传' + '</span>').appendTo($progress).find('.progress-bar');

                                $percent.css('width', 100 + '%');

                                //全部是已经之前上传的文件则显示已全部上传
                                if (success_count >= file_count) {
                                    layer.msg("文件上传成功", { icon: 1, time: 1000 }, function () {
                                        parent.location.reload();//刷新iframe父页面
                                    });
                                }

                            } else {
                                file.file_md5 = fileMd5;

                            }
                        }
                    });

                });

            deferred.resolve();
            return deferred.promise();
        }

    });


var GUID = WebUploader.Base.guid();
//初始化Web Uploader
var uploader = WebUploader.create({

    // swf文件路径
    swf: '__TMPL__Public/assets/js/Uploader.swf',

    // 文件接收服务端。
    server: '{:U(\'index/post_upload_file\')}',

    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: '#picker',

    // 开起分片上传。
    chunked: true,

    chunkSize: 5 * 1024 * 1024,//每一片的大小5兆(文件大于10兆时)

    chunkRetry: 3,//如果某个分片由于网络问题出错，允许自动重传多少次？

    //上传并发数
    threads: 1,

    //允许的文件后缀，不带点，多个用逗号分割。
    accept: {
        title: 'Files',
        extensions: 'mzXML,netCDF,CDF,mzData,mzML,raw,scan,wiff,mgf,d,lcd',
        mimeTypes: 'file/mzXML,file/netCDF,file/CDF,file/mzDATA,file/mzML,file/raw,file/scan,file/wiff,file/mgf,file/d,file/lcd'
    },

    formData: {
        project_id: project_id,  //你的token名词：token值
        filefolder_id: filefolder_id,
        filefolder_name: filefolder_name,
        guid: GUID
    }

});

//加入队列前，判断文件格式，不合适的排除
uploader.on('beforeFileQueued', function (file) {

    //                    if(file.size < 5 * 1024 * 1024){
    //                        uploader.options.chunkSize = 1 * 1024 * 1024;//每一片的大小1兆(文件小于5兆时)
    //					}else {
    //                        uploader.options.chunkSize = 5 * 1024 * 1024;//每一片的大小5兆(文件大于5兆时)
    //					}

    file.guid = WebUploader.Base.guid();
});

//文件分块上传前触发，加参数，文件的订单编号加在这儿
// 在发送之间可以添加字段什么的。。。
// 如果默认的字段不够使用，可以通过监听此事件来扩展
uploader.on('uploadBeforeSend', function (block, data) {

    console.log(block['file']);

    // var fileData = block['file'];

    // fileData.blocks = null;
    // fileData.source = null;
    // fileData._events = null;

    // console.log(fileData);	

    // fileData = JSON.stringify(fileData);
    // fileData = $.parseJSON(fileData);

    // console.log(fileData);	

    // block为分块数据。
    // file为分块对应的file对象。
    data.file_md5 = block['file']['file_md5'];
    data.guid = block.file.guid;

    console.log(data);
});

//由于webuploader不处理UI逻辑，所以需要去监听fileQueued事件来实现。
// 当有文件被添加进队列的时候
uploader.on('fileQueued', function (file) {

    file_count++;

    var title,
        del;

    //判断组别下存在的文件与待上传的是否重复命名
    if (allfiles.length != 0) {
        for (var i = 0; i < allfiles.length; i++) {
            if (allfiles[i].file_name == file.name) {
                var id = file.id;
                title = '该文件名已存在,建议重命名';
                del = '<button class="btn btn-sm del-file-button" style="margin-left: 5px;line-height:12px;background: #fff;" onclick="self_delete(this);" value="' + file.id + '"><span class="glyphicon glyphicon-trash"></span></button>';
                uploader.skipFile(file);
                success_count++;
                break;
            } else {
                title = '<div class="progress progress-striped active" style="display: inline-block;width: 60%;margin-bottom:-5px;margin-top: 5px;margin-right:70px;"><div class="progress-bar" role="progressbar" style="width: 0%"></div></div>';
                del = '<button class="btn btn-sm del-file-button" style="margin-left: 5px;line-height:12px;background: #fff;" onclick="self_delete(this);" value="' + file.id + '"><span class="glyphicon glyphicon-trash"></span></button>';
            }
        }
    }

    if (!title) {
        title = '<div class="progress progress-striped active" style="display: inline-block;width: 60%;margin-bottom:-5px;margin-top: 5px;margin-right: 70px;"><div class="progress-bar" role="progressbar" style="width: 0%"></div></div>';
        del = '<button class="btn btn-sm del-file-button" style="margin-left: 5px;line-height:12px;background: #fff;" onclick="self_delete(this);" value="' + file.id + '"><span class="glyphicon glyphicon-trash"></span></button>';
    }

    var name = file.name;
    if (name.length > 20) {
        var show_name1 = name.substr(0, 10);
        var show_name2 = name.substr(-10, 10);
        var show_name = show_name1 + "..." + show_name2;
    } else {
        var show_name = name;
    }
    // 计算文件大小
    var size = unitSpeed(file.size);

    $("#thelist").append('<div id="' + file.id + '" class="item">' +
        '<div class="info" style="display: inline-block;text-align: center;width: 200px;border: 1px solid #ddd;height: 40px;line-height: 40px;border-right: none;font-size: 14px;color: #666;cursor: pointer;" title="' + name + '">' + show_name + '</div>' +
        '<div class="state_b" style="display: inline-block;text-align: center;width: 100px;border: 1px solid #ddd;height: 40px;line-height: 40px;border-right: none;font-size: 14px;color: #666;">' + size + '</div>' +
        '<div class="state_c" style="display: inline-block;text-align: center;width: 400px;border: 1px solid #ddd;height: 40px;line-height: 40px;font-size: 14px;color: #666;">' + title + '<span>' + del + '</span></div>' +
        '</div>');

});


// 文件上传中，Web Uploader会对外派送uploadProgress事件，其中包含文件对象和该文件当前上传进度。
// 文件上传过程中创建进度条实时显示。
uploader.on('uploadProgress', function (file, percentage) {
    //                    console.error(file);
    uploader.options.formData.file_md5 = file.file_md5;
    //					console.error(uploader.options.formData);

    var $li = $('#' + file.id),
        $percent = $li.find('.progress .progress-bar');

    var $progress = $('#' + file.id).find('div.state_c');
    $('#' + file.id).find('div.state_c').text('');

    var per = parseInt(percentage * 100);

    var status_pre = file.size * percentage;

    if (status_pre <= 0) {
        return;
    }

    var speed = unitSpeed(status_pre / times);

    // 避免重复创建
    if (per < 100) {
        $percent = $('<div class="progress progress-striped active" style="display: inline-block;width: 60%;margin-bottom:-5px;margin-top: 5px;margin-right: 10px;">' +
            '<div class="progress-bar" role="progressbar" style="width: 0%;">' +
            '</div></div><span style="display: inline-block;margin-left: 5px;width: 8%;">' + per + '%' + '</span><span style="display: inline-block;margin-left: 5px;margin-right: 5px;width: 12%;">' + speed + '/S' + '</span>').appendTo($progress).find('.progress-bar');

        $percent.css('width', percentage * 100 + '%');

    } else {
        $percent = $('<div class="progress progress-striped active" style="display: inline-block;width: 60%;margin-bottom:-5px;margin-top: 5px;margin-right: 10px;">' +
            '<div class="progress-bar" role="progressbar" style="width: 0%;">' +
            '</div></div><span style="display: inline-block;margin-left: 5px;width: 8%;">' + '100' + '%' + '</span><span style="display: inline-block;margin-left: 5px;margin-right: 5px;width: 12%;">' + '已上传' + '</span>').appendTo($progress).find('.progress-bar');

        $percent.css('width', 100 + '%');
    }

    //文件暂停上传
    //<a href="javascript:void(0);" id="stopOretry_'+file.id+'" onclick="stop(\''+file.id+'\');" class="a-pause">暂停</a>
    //$li.find('p.state_c').text('上传中');
    //$( '#'+file.id ).find('p.state_c').text('上传中');


});

//文件上传失败会派送uploadError事件，成功则派送uploadSuccess事件。不管成功或者失败，在文件上传完后都会触发uploadComplete事件。
uploader.on('uploadSuccess', function (file) {

    if (uploader.isInProgress(file) == true) {
        success_count++;
        uploader.removeFile(file);
    }

    times = 1;

    if (success_count >= file_count) {
        layer.msg("文件上传成功", { icon: 1, time: 1000 }, function () {
            // 刷新iframe父页面
            parent.location.reload();
        });
    }
});

uploader.on('uploadError', function (file) {
    $('#' + file.id).find('div.state_c').text('上传出错');
});

$("#ctlBtn").on('click', function () {

    uploader.upload();

    //点击文件上传按钮之后禁止再次点击上传按钮
    $('#ctlBtn').attr("disabled", "disabled");

    interval = setInterval(function () { times++; }, 1000);//文件上传时,定时器启动

    var close = window.parent.document.getElementsByClassName("close")[0];
    close.setAttribute("data-dismiss", " ");
    close.onclick = function () {
        layer.confirm('关闭该窗口，本地上传中的文件将会被取消,是否继续？', function () {
            parent.location.reload();//刷新iframe父页面
        });
    }

    var cancel = window.parent.document.getElementsByClassName("cancel")[0];
    cancel.setAttribute("data-dismiss", " ");
    cancel.onclick = function () {
        layer.confirm('关闭该窗口，本地上传中的文件将会被取消,是否继续？', function () {
            parent.location.reload();//刷新iframe父页面
        });
    }

});

//删除table中显示已存在的文件
function self_delete(e) {
    var id = e.value;
    e.parentNode.parentNode.parentNode.remove();//删除已存在的文件
    uploader.removeFile(id, true);
    file_count--;
}

//文件暂停和继续上传功能
function stop(id) {
    uploader.stop(true);
    $("#stopOretry_" + id).attr("onclick", "retry('" + id + "')");
    $("#stopOretry_" + id).text("恢复");
    clearInterval(interval);
}

function retry(id) {
    uploader.retry();
    $("#stopOretry_" + id).attr("onclick", "stop('" + id + "')");
    $("#stopOretry_" + id).text("暂停");
    //					interval = setInterval(function(){times++;},1000);
}