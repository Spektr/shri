window.bSimulatedServer = (function (){


    var currentQuestion = "start",
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
                //currentQuestion=index;
                return questionArray[index];
            }
        },

        'setAnswer':function(answer, newIndex){

            //проверка на первое обращение и заполненность
            if(currentQuestion=="start" || answer==""){
                currentQuestion = newIndex;
                return 0;
            }

            questionArray[currentQuestion]['answer'] = answer;
            var expr = (questionArray[currentQuestion]['answerRegExp'])?new RegExp(questionArray[currentQuestion]['answerRegExp'], 'img'):false;
            currentQuestion = newIndex;

            //проверка на регулярку
            var temp = (expr)?expr.test(answer):true;
            return (temp)?1:"-1";

        }
    }




})();