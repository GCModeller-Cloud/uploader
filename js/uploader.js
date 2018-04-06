
'use strict';

var droppedFiles = false;

; (function (document, window, index) {
	// feature detection for drag&drop upload
	var isAdvancedUpload = function () {
		var div = document.createElement('div');
		return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
	}();

	// applying the effect for every form
	var forms = document.querySelectorAll('.box');
	Array.prototype.forEach.call(forms, function (form) {
		var input = form.querySelector('input[type="file"]'),
			label = form.querySelector('label'),
			errorMsg = form.querySelector('.box__error span'),
			restart = form.querySelectorAll('.box__restart'),			
			showFiles = function (files) {
				label.textContent = files.length > 1 ? (input.getAttribute('data-multiple-caption') || '').replace('{count}', files.length) : files[0].name;
			},
			triggerFormSubmit = function () {
				var event = document.createEvent('HTMLEvents');
				event.initEvent('submit', true, false);
				form.dispatchEvent(event);
			};

		// letting the server side to know we are going to make an Ajax request
		var ajaxFlag = document.createElement('input');
		ajaxFlag.setAttribute('type', 'hidden');
		ajaxFlag.setAttribute('name', 'ajax');
		ajaxFlag.setAttribute('value', 1);
		form.appendChild(ajaxFlag);

		// automatically submit the form on file select
		input.addEventListener('change', function (e) {
			showFiles(e.target.files);


		});

		// drag&drop files if the feature is available
		if (isAdvancedUpload) {
			form.classList.add('has-advanced-upload'); // letting the CSS part to know drag&drop is supported by the browser

			['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
				form.addEventListener(event, function (e) {
					// preventing the unwanted behaviours
					e.preventDefault();
					e.stopPropagation();
				});
			});
			['dragover', 'dragenter'].forEach(function (event) {
				form.addEventListener(event, function () {
					form.classList.add('is-dragover');
				});
			});
			['dragleave', 'dragend', 'drop'].forEach(function (event) {
				form.addEventListener(event, function () {
					form.classList.remove('is-dragover');
				});
			});
			form.addEventListener('drop', function (e) {
				droppedFiles = e.dataTransfer.files; // the files that were dropped
				showFiles(droppedFiles);

			});
		}

		// Firefox focus bug fix for file input
		input.addEventListener('focus', function () { input.classList.add('has-focus'); });
		input.addEventListener('blur', function () { input.classList.remove('has-focus'); });

	});
}(document, window, 0));


var xhr;
var ot;//
var oloaded;

function upload(url) {
	var fileObj = document.getElementById("file").files[0]; // js 获取文件对象			
	var form = new FormData(); // FormData 对象

	console.log(fileObj);
	console.log(droppedFiles);
	
	if (!fileObj) {
		// 没有选择任何文件
		var progressBar = document.getElementById("progressBar");
		var button = $('#controlButton');

		progressBar.innerHTML = "<span style='color:red'>* Please select a file to upload at first!</span>";
		// button.progressSet(0);
		button.removeClass('in-progress');

		return;
	}

	form.append("mf", fileObj); // 文件对象

	xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
	xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
	xhr.onload = uploadComplete; //请求完成
	xhr.onerror = uploadFailed; //请求失败
	xhr.upload.onprogress = progressFunction;//【上传进度调用方法实现】
	xhr.upload.onloadstart = function () {//上传开始执行方法
		ot = new Date().getTime();   //设置上传开始时间
		oloaded = 0;//设置上传开始时，以上传的文件大小为0
	};
	xhr.send(form); //开始上传，发送form数据
}

function progressFunction(evt) {

	var progressBar = document.getElementById("progressBar");
	var percentage = 0;

	// event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
	if (evt.lengthComputable) {//
		progressBar.max = evt.total;
		progressBar.value = evt.loaded;

		percentage = Math.round(evt.loaded / evt.total * 100);
	}

	var nt = new Date().getTime();//获取当前时间
	var pertime = (nt - ot) / 1000; //计算出上次调用该方法时到现在的时间差，单位为s
	ot = new Date().getTime(); //重新赋值时间，用于下次计算

	var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b       
	oloaded = evt.loaded;//重新赋值已上传文件大小，用以下次计算

	//上传速度计算
	var speed = perload / pertime;//单位b/s
	var bspeed = speed;
	var units = 'b/s';//单位名称
	if (speed / 1024 > 1) {
		speed = speed / 1024;
		units = 'k/s';
	}
	if (speed / 1024 > 1) {
		speed = speed / 1024;
		units = 'M/s';
	}
	speed = speed.toFixed(1);
	//剩余时间
	var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
	progressBar.innerHTML = percentage + "%" + ' (' + speed + units + ', ETA: ' + resttime + 's)';

	var controlButton = $('#controlButton');
	controlButton.progressSet(percentage);

	if (bspeed == 0) {
		controlButton.progressFinish();
	}

}
