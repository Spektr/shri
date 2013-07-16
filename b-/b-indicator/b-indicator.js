var Indicator = function (obj, pointNum){
    var self = document.createElement('div'),
        line = document.createElement('div'),
        percent = document.createElement('div'),
        pointNum = (pointNum)?pointNum:0;

    self.className = "b-indicator";
    line.className = "b-indicator__line";
    percent.className = "b-indicator__percent";

    self.appendChild(line);
    self.appendChild(percent);
    obj.appendChild(self);


    return {

        'change':function(num){
            console.log(num);
            line.style.width = num+"%";
            percent.innerHTML = num+"%";
            console.log(self);
        },

        'autoChange':function(){
            var els = document.getElementsByTagName('*'),
                elsLen=els.length,
                count = 0;

            for(var i=0;i<elsLen;i++){
                if(/b-indicator__point/.test(els[i].className)){
                    count++;
                }
            }

            this.change(count*100/pointNum);
        }
    }
}

