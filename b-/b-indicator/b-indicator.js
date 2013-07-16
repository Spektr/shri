/**
 * Constructor for processbar
 *
 * @constructor
 * @param {DOM Element} obj     where will be append Indicator
 * @param {Number} pointNum     how many points equal 100%
 * @return {Object}             public methods for change processbar
 */
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
            num = Math.round(num);
            line.style.width = num+"%";
            percent.innerHTML = num+"%";
        },
        'autoChange':function(speed){
            var els = document.getElementsByTagName('*'),
                elsLen=els.length,
                count = 0,
                retObj = this;

            for(var i=0;i<elsLen;i++){
                if(/b-indicator__point/.test(els[i].className)){
                    count++;
                }
            }

            if(speed){
                var start = (line.style.width)?line.style.width.slice(0,-1):0,
                    stop = Math.round(count*100/pointNum);

                var interval = window.setInterval(function(){
                    if(start<stop){
                        start++;
                    }else if(start>stop){
                        start--;
                    }else{
                        window.clearInterval(interval);
                    };
                    retObj.change(start);
                }, speed);
            }else{
                retObj.change(count*100/pointNum);
            }

        }
    }
}

