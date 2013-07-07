window.bSimulatedServer = (function (){


    var currentQuestion = 0,
        questionArray = [];

    return {

        'getQuestionArray':function(){
            $.ajax({
                url:"b-/b-simulated-server/b-simulated-server.php",
                dataType:"json",
                data:"action=getQuestions",
                success:function(data){
                    console.log(data);
                },
                error:function(data){
                    console.log(data);
                }
            })
        },


        'setAnswer':function(answer){
            checkAnswer(answer)
        }
    }




})();