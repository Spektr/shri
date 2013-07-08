$(function(){

    bSimulatedServer.getQuestionArray(createTaskMenu);        //получаем с сервера набор вопросов и обрабатываем

    function createTaskMenu(data){
        var list =[];
        for(var len=data.length, i=0;i<len;i++){
            var item = $('<div />', {'class':"b-task__item ", 'text':"Вопрос "+i});
            list.push(item);
        }

        $('.b-task__menu').append(list);

        //хэндл на кнопы
        $('.b-task__item').on('click', function(){ getQuestion($(this).index())});

    }

    function getQuestion(index){
        console.log(index);
        var question = bSimulatedServer.getQuestion(index);
        if(!question){console.log("печаль с выбором запроса");}
        $('.b-task__item_active').removeClass('b-task__item_active');
        $(this).addClass('b-task__item_active');

        $('.b-task__slide_description').text(question['request']);
        $('.b-task__slide_solution textarea').val(question['answer']);
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