$(function(){

    bSimulatedServer.getQuestionArray(createTaskMenu);						//устанавливаем обработчик на полученные вопросы

    function createTaskMenu(data){											//функция создания меню из ответа
        var list =[];														//делаем на каждый вопрос один пункт меню
        for(var len=data.length, i=0;i<len;i++){
            var item = $('<div />', {'class':"b-task__item", 'text':"Вопрос "+i});
            list.push(item);
        }
		
        $('.b-task__menu').append(list);									//добавляем этот список на страницу
        var processbar = new Indicator($('.b-index__process')[0], len);		//прикручиваем индикатор заполняемости
		processbar.complete(function(){										//ставим обработчик когда все будет заполнено
			if($('.b-task__submit')[0]){return false;}
			var submitButton = $('<div />', {'class':"b-task__submit", 'text':"Отправить"}).on('click', function(){
				if($('.b-pic__shri_correct').length != $('.b-task__item').length){
					alert("Заполните все поля правильно.");
					return false;
				}
				alert("Отправлено на сервер");
			});
			
			$('.b-task__menu').append(submitButton);
		});

        $('.b-task__item').on('click', getQuestion);						//хэндл на кнопы
        function getQuestion(){
            var index = $(this).index(),									//узнаем индекс вопроса
            	question = bSimulatedServer.getQuestion(index),				//получаем вопрос по индексу
            	answerStatus = bSimulatedServer.setAnswer($('.b-task__slide_solution textarea').val(), index);	//отвечаем на предыдущий вопрос и узнаем правильный ли ответ был
            
			if(answerStatus>0){												//оформляем согласно правильности ответа
                var statusClass = "b-pic b-pic__shri b-pic__shri_correct b-indicator__point"; //обязательно помечаем классом индикатора чтоб это учитывалось
            }else if(answerStatus<0){
                var statusClass = "b-pic b-pic__shri b-pic__shri_wrong";
            }else{
                var statusClass = "";
            }

            if(!question){ return console.log("печаль с выбором запроса");}
            $('.b-task__item_active').removeClass('b-task__item_active b-pic b-pic__shri b-pic__shri_correct b-pic__shri_wrong  b-indicator__point').addClass(statusClass);
            $(this).addClass('b-task__item_active');
            $('.b-task__slide_description').html(question['request']);
			
			if(question['example']){										//если есть пример то показываем его
				$('.b-task__example').addClass("b-task__slide b-task__slide_example");
				blib.include(question['example'], '.b-task__example');
			}else{
				$('.b-task__example').removeClass("b-task__slide b-task__slide_example").html('');				
			}
			
			$('.b-task__slide_solution textarea').val(question['answer']).keyup();
			
            processbar.autoChange(10);										//изменяем статус процессбара
        }
    }

    $('.b-task__slide_description').on('click',function(){				    //закрывает текст вопроса
        $(this).toggleClass('b-task__slide_closed');
    });

    $('.b-task__slide_solution textarea').on('keyup', function(){		    //автопрокрут ответа
        this.style.height = "1px";
        this.style.height = this.scrollHeight+"px";
    });

});