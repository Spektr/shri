window.blib =(function(){
	var self        = this;
	var storageFlag = ('localStorage' in window && window['localStorage'] !== null)?true:false;
	var forceLoad   = "";																						/** postfix for force send request to server */
	var version     = (storageFlag && localStorage.getItem('version'))?localStorage.getItem('version'):1;		/** (0_0 NaN .. 1)curent version, get from server (is seconds to last modified .ini file) */
	var head        = document.getElementsByTagName('head')[0];
	var js          = (storageFlag && localStorage.getItem('js'))?JSON.parse(localStorage.getItem('js')):{};
	var css         = {};
	
	
/*jQuery simulate $() and $.ajax*/
	var $ = function(){
		var els = document.getElementsByTagName('*');
		var elsLen=els.length;
		
		var elements=new Array();
		for(var i=0;i<arguments.length;i++){
			var element=arguments[i];
			
			if(typeof element=='string' && element.substr(0,1)=="."){
				var pattern=new RegExp(element.substr(1));
				for(i=0;i<elsLen;i++){
					if(pattern.test(els[i].className)){
						elements.push(els[i]);
					}
				}
				
			}else if(typeof element=='string'){
				element=document.getElementById(element)
			};

			if(arguments.length==1)return (elements)?elements:element;
			elements.push(element);
		}
		return elements;
	};
	
	var ajax = function(dataObject) {
		var xhr;
		if (window.XMLHttpRequest) xhr = new XMLHttpRequest();
		else if (window.ActiveXObject) {
			try {
				xhr = new ActiveXObject('Msxml2.XMLHTTP');
			} catch (e){}
			try {
				xhr = new ActiveXObject('Microsoft.XMLHTTP');
			} catch (e){}
		}

		if (xhr) {
			xhr.onreadystatechange = function(){
				if (xhr.readyState === 4 && xhr.status === 200) {
					var rData = (dataObject['dataType']=="json")?JSON.parse(xhr.responseText):xhr.responseText;
					dataObject['success'](rData);
				}
			}
			
			if(dataObject['dataType']!="html"){
				xhr.open("POST", dataObject['url'], true);
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhr.send(dataObject['data']);
			}else{
				var rData = (dataObject['data'])?"?"+dataObject['data']:"";
				xhr.open("GET", dataObject['url']+rData, true);
				xhr.setRequestHeader("Content-Type", "text/html");
				xhr.send(null);
			}
		} else {
			alert("Браузер не поддерживает AJAX");
		}
	}
	$.ajax = ajax;
/*jQuery simulate $() and $.ajax*/
	
	
/** blib functions */
	/**
	* get all files in cache
	* @param {object} obj		cache css or js
	* @return {string}[]		array of all include files
	*/
	var getFiles = function(obj){
		var arr=[];
		for(key in obj){
			if(obj[key]['list']){
				arr = arr.concat(obj[key]['list']);
			}else{
				arr.push(key);
			}
		}
		return arr;
	};
	
	/**
	* include css file
	* @param {string} cssFile	name of css file
	* @param {string}[] inCache	files which contain in it
	* @return {object}			this
	*/
	var cssFunction = function(cssFile, inCache){
		cssFile = cssFile.toString();
	
		if((cssFile in css) && (css[cssFile]['version']==version)){
			return this;
		}else{
			for(key in css){
				var innerFiles = (css[key]['list'])?css[key]['list']:[];
				for(var i=0, len=innerFiles.length;i<len;i++){
					if(innerFiles[i]==cssFile){return cssFunction(key, innerFiles);}
				}
			}
			
			forceLoad="?new="+version;
			delete css[cssFile];
			var addededStyle = document.getElementById(cssFile);
			if(addededStyle){						
				addededStyle.parentNode.removeChild(addededStyle);
			}
			
		}

		var link  = document.createElement('link');
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = cssFile+forceLoad;
		link.media = 'all';
		link.id = cssFile;
		if(head.appendChild(link)){
			css[cssFile]={};
			css[cssFile]['version']=version;
			if(inCache && inCache.length){
				css[cssFile]['list']=inCache;
			}

			if(storageFlag){
				localStorage.setItem("css", JSON.stringify(css));
			}
		}
		return this;
	};
	
	/**
	* include js file
	* @param {string} jsFile	name of js file
	* @param {string}[] inCache	files which contain in it
	* @return {object}			this
	*/
	var jsFunction = function(jsFile, inCache){
		jsFile = jsFile.toString();

		if(jsFile in js){
			forceLoad=(js[jsFile]['version']==version)?"":"?new="+version;
			delete js[jsFile];
			var addededScript = document.getElementById(jsFile);
			if(addededScript){						
				addededScript.parentNode.removeChild(addededScript);
			}
		}else{
			for(key in js){
				var innerFiles = (js[key]['list'])?js[key]['list']:[];
				for(var i=0, len=innerFiles.length;i<len;i++){
					if(innerFiles[i]==jsFile){return jsFunction(key, innerFiles);}
				}
			}
		}

		var script  = document.createElement('script');
		script.id = jsFile;
		script.src = jsFile+forceLoad;
		script.type="text/javascript";
		if(head.appendChild(script)){
			js[jsFile]={};
			js[jsFile]['version']=version;
			if(inCache && inCache.length){
				js[jsFile]['list']=inCache;
			}

			if(storageFlag){
				localStorage.setItem("js", JSON.stringify(js));
			}
		}
		return this;
	};
	
	/**
	* include block (html+css+js in set container || css+js)
	* @param {string} file		path of block without extension
	* @param {string} target	selector where will be load block
	*/
	var includeFunction = function(file, target){
		cssFunction(file+'.css');

		if(target){
			var target = $(target);
			$.ajax({
				url:file+'.html',
				dataType: "html",
				success: function(data){
					for(key in target){
						target[key].innerHTML=data;
					}
					jsFunction(file+'.js');
				}
			});
		}else{
			jsFunction(file+'.js');
		}
	};
	
	/**
	* method for get version of site and load all stylesheet/script in one file
	* @param {object} dataObject	object of setting
	* {bool} script					for glue javascripts
	* {srting}[]exception			blocks which will not be uploaded
	* {srting}[]order				first turn load sctipts/if 'script' is false, then 'order' set chosen blocks
	*/
	var loadFunction = function(dataObject){
		document.addEventListener("DOMContentLoaded", function(){
			/** get files which we have */
			if(storageFlag){
				var arr = JSON.parse(localStorage.getItem('css'));
				var allCss = (arr)?getFiles(arr):[];

				var arr = JSON.parse(localStorage.getItem('js'));
				var allJs =  (arr)?getFiles(arr):[];
			}
			

			var requestData = "data="+JSON.stringify((dataObject['script']?{'css':allCss, 'js':allJs}:{'css':allCss, 'js':"orderOnly"}));
			requestData += (dataObject['exception'])?"&exception="+JSON.stringify(dataObject['exception']):"&exception="+JSON.stringify([]);
			requestData += (dataObject['order'])?"&order="+JSON.stringify(dataObject['order']):"&order="+JSON.stringify(["b-/b-jquery/b-jquery.js", "b-/b-jquery-ui/b-jquery-ui.js"]);
			
			console.log(requestData);
			
			$.ajax({
				url:'b-/b-blib/b-blib.php',
				data:requestData,
				dataType: "json",
				success: function(data){
					console.log(data);
					if(!data['status']){return false;}
					version = data['version'];
					if(storageFlag){localStorage.setItem("version", JSON.stringify(version));}
					if(data['css']){cssFunction(data['css']['name'], data['css']['list']);}
					if(data['js']){jsFunction(data['js']['name'], data['js']['list']);}
				}
			});
			
		}, false );//DOMContentLoaded
	};
/** blib functions */
	
	
/** prehandling */
	/** first include all css from cache */
	var arr = (storageFlag && localStorage.getItem('css'))?JSON.parse(localStorage.getItem('css')):{};
	for(key in arr){
		cssFunction(key, arr[key]['list']||[]);
	}
	
	if(storageFlag){window.localStorage.clear();} //0_0 for clear old change b-blib
/** prehandling */
	
	/** public object */
	return {
		'css': cssFunction,
		'js': jsFunction,
		'include':includeFunction,
		'vanishLoad':loadFunction
	};
})(); 