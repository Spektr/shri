$(function(){

    //устанавливаем обработчик на полученные вопросы
    bSimulatedServer.getQuestionArray(createTaskMenu);


    function createTaskMenu(data){
        var list =[];
        for(var len=data.length, i=0;i<len;i++){
            var item = $('<div />', {'class':"b-task__item", 'text':"Вопрос "+i});
            list.push(item);
        }

        $('.b-task__menu').append(list);
        var processbar = new Indicator($('.b-index__process')[0], len);

        //хэндл на кнопы
        $('.b-task__item').on('click', getQuestion);
        function getQuestion(){
            var index = $(this).index();
            var question = bSimulatedServer.getQuestion(index);
            var answerStatus = bSimulatedServer.setAnswer($('.b-task__slide_solution textarea').val(), index);
            if(answerStatus>0){
                var statusClass = "b-pic b-pic__shri b-pic__shri_correct b-indicator__point";
            }else if(answerStatus<0){
                var statusClass = "b-pic b-pic__shri b-pic__shri_wrong";
            }else{
                var statusClass = "";
            }

            if(!question){ return console.log("печаль с выбором запроса");}
            $('.b-task__item_active').removeClass('b-task__item_active b-pic b-pic__shri b-pic__shri_correct b-pic__shri_wrong  b-indicator__point').addClass(statusClass);
            $(this).addClass('b-task__item_active');
            $('.b-task__slide_description').html(question['request']);
			
			
			if(question['example']){
				$('.b-task__example').addClass("b-task__slide b-task__slide_example");
				blib.include(question['example'], '.b-task__example');
			}else{
				$('.b-task__example').removeClass("b-task__slide b-task__slide_example").html('');				
			}
			
			$('.b-task__slide_solution textarea').val(question['answer']).keyup();

            processbar.autoChange(10);
        }
    }

    //закрывает текст вопроса
    $('.b-task__slide_description').on('click',function(){
        $(this).toggleClass('b-task__slide_closed');
    });

    //автопрокрут ответа
    $('.b-task__slide_solution textarea').on('keyup', function(){
        this.style.height = "1px";
        this.style.height = this.scrollHeight+"px";
    });






});