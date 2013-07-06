window.blib =(function(){
	var self = this;
	var head = document.getElementsByTagName('head')[0];
	var cssCache = new Array();
	var jsCache = new Array();
    var css = new Array();
	var js = new Array();

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
				xhr.open("GET", dataObject['url'], true);
				xhr.setRequestHeader("Content-Type", "text/html");
				xhr.send(dataObject['data']);
			}
	
		} else {
			alert("Браузер не поддерживает AJAX");
		}
	}
	$.ajax = ajax;
	/*jQuery simulate $() and $.ajax*/

	return {
		//include css file
		'css': function(cssFile, inCache){
            cssFile = cssFile.toString();
			
            for(key in css){
                if(cssFile==css[key]){return true;}
            }
			for(key in cssCache){
                if(cssFile==cssCache[key]){return true;}
            }
			
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = cssFile;
			link.media = 'all';
			if(head.appendChild(link)){
				if(inCache){
					cssCache.push(cssFile);
					css=css.concat(inCache);
				}else{
					css.push(cssFile);
				}
				
				if('localStorage' in window && window['localStorage'] !== null){
					localStorage.setItem("cssCache", JSON.stringify(cssCache));
					localStorage.setItem("css", JSON.stringify(css));
				}
			}
			return true;
		},
		
		//include js file
		'js': function(jsFile, inCache){
			jsFile = jsFile.toString();
			
			for(key in js){
				if(jsFile==js[key]){
					js.splice(key,1);
					var addededScript = document.getElementById(jsFile);
					if(addededScript){						
						addededScript.parentNode.removeChild(addededScript);
					}
				}
			}
			
			for(key in jsCache){
				if(jsFile==jsCache[key]){return this;}
			}
			
			var script  = document.createElement('script');
			script.id = jsFile;
			script.src = jsFile;
			script.type="text/javascript";
			if(head.appendChild(script)){
				if(inCache){
					jsCache.push(jsFile);
					js=js.concat(inCache);
				}else{
					js.push(jsFile);
				}
							
				if('localStorage' in window && window['localStorage'] !== null){
					localStorage.setItem("jsCache", JSON.stringify(jsCache));
					localStorage.setItem("js", JSON.stringify(js));
				}
			}
			return this;
		},

        //include block (file - block's url [, target] - where it's plased)
		'include':function(file, target){
			var obj = this;
			this.css(file+'.css');

			if(target){
				var target = $(target);
				$.ajax({
					url:file+'.html',
                    dataType: "html",
					success: function(data){
						for(key in target){
							target[key].innerHTML=data;
						}
						obj.js(file+'.js');
					}
				});
			}else{
				/*document.addEventListener("DOMContentLoaded", function(){ */obj.js(file+'.js');/*}, false );*/
			}
		},
		
		/*
		//method for load all stylesheet/script in one file
		//[param]{'script':(bool) - for glue javascripts, 'exception':(array) - blocks which will not be uploaded, 'order': (array of paths) - first turn load sctipts/if 'script' is false, then 'order' set chosen blocks }
		//
		*/
		'vanishLoad':function(dataObject){
			var obj = this;
			document.addEventListener("DOMContentLoaded", function(){
				//забиваем имеющиеся кеши
				if('localStorage' in window && window['localStorage'] !== null){
					
					if(localStorage.getItem('css')){css=JSON.parse(localStorage.getItem('css'));}
					var arr = JSON.parse(localStorage.getItem('cssCache'));
					for(key in arr){
						obj.css(arr[key], []);
					}
	
					if(localStorage.getItem('js')){js=JSON.parse(localStorage.getItem('js'));}
					arr = JSON.parse(localStorage.getItem('jsCache'));
					for(key in arr){
						obj.js(arr[key], []);
					}
				}
				

				var requestData = "data="+JSON.stringify((dataObject['script']?{'css':css, 'js':js}:{'css':css, 'js':"orderOnly"}));
				requestData += (dataObject['exception'])?"&exception="+JSON.stringify(dataObject['exception']):"&exception="+JSON.stringify([]);
				requestData += (dataObject['order'])?"&order="+JSON.stringify(dataObject['order']):"&order="+JSON.stringify(["b-/b-jquery/b-jquery.js", "b-/b-jquery-ui/b-jquery-ui.js"]);
				
				$.ajax({
					url:'/b-/b-blib/b-blib.php',
					data:requestData,
					dataType: "json",
					success: function(data){
						if(!data['status']){return false;}
						if(data['css']){obj.css(data['css']['path'], data['css']['list']);}
						if(data['js']){obj.js(data['js']['path'], data['js']['list']);}
					}
				});
				
			}, false );//DOMContentLoaded
		}//vanishLoad()
	};//return
})(); 