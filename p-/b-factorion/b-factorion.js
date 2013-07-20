$(function(){
    var stack ={};
    var factorial=function (n) {
        console.log(stack[n]);
        if(stack[n])return stack[n];
        if(n!=1){
            stack[n]=n*factorial(n-1);
            return n*factorial(n-1);
        }else{
            return 1;
        }
    }
    function factorion(){
        var str,sum;
        for(var len=7*factorial(9),i= 1;i<=len;i++){
            str=i.toString();
            sum=0;
            for(var secLen=str.length,j=0;j<secLen;j++){
                sum+=factorial(parseInt(str[j]));
            }
            if(sum==i) $('.b-factorion__console').append(str+"<br />");
        }
        $('.b-factorion__console').append("<hr />");
    }


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
			if(sum==i) $('.b-factorion__console').append(str+"<br />");
		}
        $('.b-factorion__console').append("<hr />");
	}

    $('.b-factorion__button_copy').on('click', bruteforce);
    $('.b-factorion__button_start').on('click', factorion);
	
});




