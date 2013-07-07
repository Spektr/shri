$(function(){

    bSimulatedServer.getQuestionArray();

    //закрывает текст вопроса
    $('.b-task__slide_description').on('click',function(){
        $(this).toggleClass('b-task__slide_closed');
    });

    //автопрокрут ответа
    $('.b-task__slide_solution textarea').on('keyup', function(){
        this.style.height = "1px";
        this.style.height = this.scrollHeight+"px";
    });

    //выбор вопроса
    $('.b-task__item').on('click', function(){
        $('.b-task__item_active').removeClass('b-task__item_active');
        $(this).addClass('b-task__item_active');
    });




});