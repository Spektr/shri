$(function(){
	function fact(num){
		var ret=1;
		for(var i=1;i<=num;i++){
			ret=ret*i;
		}
		return ret;
	}
	
	function bruteforce(){
		var str,sum;
		for(var i=1;i<=7*fact(9);i++){
			str=i.toString();
			sum=0;
			for(var j=0;j<str.length;j++){
				sum+=fact(parseInt(str[j]));
			}
			if(sum==i) alert(str);
		}
	}
	
});




