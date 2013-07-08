window.bSimulatedServer = (function (){


    var currentQuestion = 0,
        questionArray = [];

    return {

        'getQuestionArray':function(callback, forceLoad){
            $.ajax({
                url:"b-/b-simulated-server/b-simulated-server.php",
                dataType:"json",
                data:"action=getQuestions",
                success:function(data){
                    if(!data['status']||(questionArray.length && !forceLoad)){return false;}
                    questionArray = data['items'];
                    callback(questionArray);
                }
            })
        },

        'getQuestion':function(index){
            if(index in questionArray){
                currentQuestion=index;
                return questionArray[index];
            }
        },

        'setAnswer':function(answer){
            checkAnswer(answer)
        }
    }




})();