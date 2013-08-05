$(function(){
	
	/** Вычисление факториала */
    var factorial=(function(){
        var stack =[1,1,2];
        return function (n){
            if(stack[n])return stack[n];
            stack[n]=n*factorial(n-1);
            return stack[n];
        }
    })();

	/** Вычисление факториона и запись в консоль */
    function factorion(){
        var str,
            sum,
            message=[],
            startTime = new Date();

        message.push("Скрипт запущен ("+startTime.getHours()+':'+startTime.getMinutes()+':'+startTime.getSeconds()+"):");
        message.push("--------");
        for(var len=(7*factorial(9)),i= 1;i<=len;i++){
            str=i.toString();
            sum=0;
            for(var secLen=str.length,j=0;j<secLen;j++){
                sum+=factorial(parseInt(str[j]));
            }
            if(sum==i) message.push(str);
        }
        message.push("--------");
        message.push("время работы:"+(new Date()- startTime)/1000+"сек.");
        message.push("<hr />");
        message=message.join("<br />");
        $('.b-factorion__console').append(message);
    }

	/** Отображение решения */
	function solution(){
        $('.b-factorion__console').html('Вики-решение<br /><br />Определив верхнюю границу для факторионов, несложно (например, полным перебором) показать, что существует ровно 4 таких числа.<br /> Любое n-значное число не меньше 10^{n-1}. Однако при этом сумма факториалов его цифр не больше 9!* n, где 9!=362880.<br /> Так как первое число возрастает быстрее второго (первое зависит от n экспоненциально, а второе — линейно), а уже 10^{8-1}=10000000>9!*8=2903040.<br /> Следовательно все факторионы состоят не более, чем из 7 цифр. Даже точнее — они меньше 7*9!=2540160.<hr />');
	}

    $('.b-factorion__button_solution').on('click', solution);
    $('.b-factorion__button_start').on('click', factorion);
	
});