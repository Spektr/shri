/**
* Обьект - обработчик серверных ответов
*/
window.bSimulatedServer = (function (){
    var currentQuestion = "start",	//флаг текущего вопроса
        questionArray = [];			//массив всех вопросов

    return {

		/**
		* Получение списка всех вопросов с сервера
		* @param {function} callback	Функция обработчик для ответа
		*/
        'getQuestionArray':function(callback){
            $.ajax({
                url:"b-/b-simulated-server/b-simulated-server.php",
                dataType:"json",
                data:"action=getQuestions",
                success:function(data){
                    if(!data['status']||questionArray.length){return false;}
                    questionArray = data['items'];
					/**
					* @param{Object}[]questionArray Массив вопросов
					* {string} request	Текст вопроса
					* {string|boll}answerRegExp	Регулярка для правильности ответа
					* {string}example	Адрес блока с примером
					* {string}answer	Текст ответа (если есть)
					*/
                    callback(questionArray);
                }
            })
        },
		
		/** 
		* Получение вопроса
		*
		* @param {number} index 	Индекс вопроса
		*/
        'getQuestion':function(index){
            if(index in questionArray){
                return questionArray[index];
            }
        },

		/** 
		* Установка ответа
		*
		* @param {string} answer	Текст ответа
		* @param {number} newIndex 	Индекс с которым будем работать теперь
		*/
        'setAnswer':function(answer, newIndex){

            //проверка на первое обращение и заполненность
            if(currentQuestion=="start" || answer==""){
                currentQuestion = newIndex;
                return 0;
            }
			
			//сохраняем ответ, образуем регулярку, ставим индекс текущего вопроса
            questionArray[currentQuestion]['answer'] = answer;
            var expr = (questionArray[currentQuestion]['answerRegExp'])?new RegExp(questionArray[currentQuestion]['answerRegExp'], 'img'):false;
            currentQuestion = newIndex;

            //проверка на регулярку
            var temp = (expr)?expr.test(answer):true;
            return (temp)?1:"-1";
        },
		
		'sendQuestion':function(handle){
			$.ajax({
				url:"b-/b-simulated-server/b-simulated-server.php?action=sendQuestion",
				dataType:"json",
				type:"POST",
                data:"data="+JSON.stringify(questionArray),
				success: handle
			});
		}
    }
})();