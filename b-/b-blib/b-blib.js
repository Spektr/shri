window.blib =(function(){
	var storageFlag = ('localStorage' in window && window['localStorage'] !== null)?true:false,
		version     = (storageFlag && localStorage.getItem('version'))?localStorage.getItem('version'):1,
		head        = document.getElementsByTagName('head')[0],
		js          = (storageFlag && localStorage.getItem('js'))?JSON.parse(localStorage.getItem('js')):{},
		css         = {},
	/*jQuery simulate $() and $.ajax*/
		$ = function(){
			if(typeof(arguments) == "function"){return false;}
			
			var els = document.getElementsByTagName('*'),
				elsLen=els.length,
				elements=[],
				result = {};
			
			for(var len=arguments.length, i=0; i<len; i++){
				if(typeof(arguments[i])!='string'){continue;}
				var element=arguments[i],
					point = element.substr(0,1),
					pattern = element.substr(1);
			
				if(point=="."){
					for(var j=0;j<elsLen;j++){
						var temp = els[j].className.split(' ');
						for(var tmpLen=temp.length, k=0; k<tmpLen; k++){
							if(temp[k] == pattern){elements.push(els[j]);	break;}
						}
					}
				}else if(point=="#"){
					var temp = document.getElementById(pattern);
					if(temp){elements.push(temp);}
				}else{
					var temp = document.getElementsByTagName(element);
					for(var tagLen=temp.length,j=0; j<tagLen; j++){
						elements.push(temp[j]);
					}
				};
			}
			
			result['length']=elements.length;
			for(var len= result['length'], i=0; i<len; i++){
				result[i]=elements[i];
			}
			
			result.html = function(obj){
				for(var len = this.length, i=0; i<len; i++){
					this[i].innerHTML = obj;
				}
				return this;
			};			
			result.append = function(obj){
				for(var len = this.length, i=0; i<len; i++){
					this[i].appendChild(obj);
				}
				return this;
			};
			return result;
		
		},
		ajax = function(dataObject) {
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
				
				if(typeof(dataObject['data'])=="object"){
					var temp = "";
					for(key in dataObject['data']){
						temp+=key+"="+dataObject['data'][key]+"&";
					}
					dataObject['data'] = temp.substr(0, temp.length-1);
				}
				
				if(dataObject['type']!="GET" && dataObject['dataType']!="html"){
					xhr.open("POST", dataObject['url'], true);
					xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					xhr.send(dataObject['data']);
				}else{
					xhr.open("GET", dataObject['url']+(dataObject['url'].indexOf("?")!=-1?"&":"?")+dataObject['data'], true);
					xhr.setRequestHeader("Content-Type", "text/html");
					xhr.send(null);
				}
			} else {
				alert("Браузер не поддерживает AJAX");
			}
		};
	$['ajax'] = ajax;
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
	},
	
	/**
	* include css file
	* @param {string} cssFile	name of css file
	* @param {string}[] inCache	files which contain in it
	* @return {object}			this
	*/
	cssFunction = function(cssFile, inCache){
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

			delete css[cssFile];
			var addededStyle = document.getElementById(cssFile);
			if(addededStyle){						
				addededStyle.parentNode.removeChild(addededStyle);
			}
			
		}

		var link  = document.createElement('link');
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = cssFile+"?new="+version;
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
	},
	
	/**
	* include js file
	* @param {string} jsFile	name of js file
	* @param {string}[] inCache	files which contain in it
	* @return {object}			this
	*/
	jsFunction = function(jsFile, inCache){
		jsFile = jsFile.toString();

		if(jsFile in js){
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
		script.src = jsFile+"?new="+version;
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
	},
	
	/**
	* include block (html+css+js in set container || css+js)
	* @param {string} file		path of block without extension
	* @param {string} target	selector where will be load block
	*/
	includeFunction = function(file, target){
		cssFunction(file+'.css');

		if(target){
			var target = $(target);
			$.ajax({
				url:file+'.html?new='+version,
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
	},
	
	/**
	* method for get version of site and load all stylesheet/script in one file
	* @param {object} dataObject	object of setting
	* {bool} script					for glue javascripts
	* {srting}[]exception			blocks which will not be uploaded
	* {srting}[]order				first turn load sctipts/if 'script' is false, then 'order' set chosen blocks
	*/
	loadFunction = function(dataObject){
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
	
	$['css']=cssFunction;
	$['js']=jsFunction;
	$['include']=includeFunction;
	$['vanishLoad']=loadFunction;
	
	/** public object */
	return $;

})(); 