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
            console.log(index);
            console.log(questionArray);
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
            currentQuestion = newIndex;

            //проверка на регулярку
            var expr = (questionArray[currentQuestion]['answerRegExp'])?new RegExp(questionArray[currentQuestion]['answerRegExp'], 'img'):false;
            return (!expr || expr.test(answer))?1:-1;

        }
    }




})();