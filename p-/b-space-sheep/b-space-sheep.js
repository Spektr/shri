/** Классы */
var allBodies = [],
    currentObject={};
function SpaceObject(spaceParams){
	var type=false,
		name=spaceParams['name']||"Инкогнито",
		position = spaceParams['position']||[0,0],
		capacity = (spaceParams['capacity'] && spaceParams['capacity']>=0)?spaceParams['capacity']:1000000,
		loadLevel = (spaceParams['loadLevel'] && spaceParams['loadLevel']<=capacity)?spaceParams['loadLevel']:0,
		visualObject = document.createElement("span"),
				
		/** getters & setters */
		getName = function(){return name;},
		getObject = function(){return visualObject;},
		getType = function(){return type;},
		setType = function(typeName){if((typeof typeName=='string') && !type){type=typeName;};},
		getPosition = function(){return position;},
		setPosition = function(x,y){
			x=(x)?x:position[0];
			y=(y)?y:position[1];
			position=[x,y];
			visualObject.style.left = x+"px";
			visualObject.style.top = y+"px";
		},
		getOccupiedSpace = function(){return loadLevel;},
		getAvailableAmountOfCargo = function(){return capacity;},
		getFreeSpace = function(){return (capacity-loadLevel);},
		nearTo = function(SpaceObject){
			var one = SpaceObject.getPosition(),
				two = this.getPosition();
			return (one[0]==two[0]&&one[1]==two[1])?true:false;
		},
		
		/**
		 * Выводит текущее состояние объекта: тип, имя, местоположение, доступную грузоподъемность.
		 * @example
		 * spaceObject.report(); // Грузовой корабль. Перехватчик №1. Местоположение: Земля. Товаров нет.
		 * @example
		 * spaceObject.report(); // Планета. Земля. Местоположение: 50,20. Количество груза: 200т.
		 * @name SpaceObject.report
		 */		
		report = function(inText){
			var rType="Тип: "+type+".<br /> ",
				rName="Название: "+name+".<br /> ",
				rCurrentPlace = "Местоположение: "+position+".<br />",
				rCargo = "Груз: "+((loadLevel)?loadLevel+"т.":"отсутствует.")+"<br />";
			
			/** Корректируем позицию если на планете */
			for(key in allBodies){
				var obj = allBodies[key],
					pos = obj.getPosition(),
					x = pos[0],
					y = pos[1];

				if(type!=obj.getType() && position[0]==x && position[1]==y && obj.getType()=="Планета"){
					rCurrentPlace = "Местоположение:"+obj.getName()+".<br />";
				}
			}
			
			/** сообщение в консоль или для отображения другим способом */
			if(inText){
				return rType+rName+rCurrentPlace+rCargo;
			}else{
				console.log(rType+rName+rCurrentPlace+rCargo);
			}
		},
		
		/** общая функция загрузки выгрузки */
		commonLoad = function(SpaceObject, cargoWeight, loading){
			if(!SpaceObject['getAvailableAmountOfCargo'] || cargoWeight<0){ return false;};									//проверка на адекватность аргументов
			var answer = false,																								//ответ метода (реально обработанное карго)
			postCount = (commonLoad.caller && (commonLoad.caller.toString() == commonLoad.toString()))?true:false,			//0_0 флаг рекурсивного вызова
			available = (loading)?this.getFreeSpace():loadLevel,															//доступное место/товар (зависит от операции)
			errorMessage = (loading)?"Вы реально желаете загрузиться по полной?":"Вы реально желаете забрать все товары?";	//сообщение при переполнении
			
			//
			if(cargoWeight>available){
				cargoWeight = (confirm(errorMessage))?available:0;
			}
			
			
			cargoWeight =(postCount)?cargoWeight:SpaceObject.commonLoad(this, cargoWeight, !loading);
			answer = (loading)?cargoWeight:(-cargoWeight);
			loadLevel+= answer;
			return Math.abs(answer);
			
		},
		
		/** Возвращаемый godlike объект с кучей методов */
		obj = {
			'getName':getName,
			'getObject':getObject,
			'getType':getType,
			'setType':setType,
			'getPosition':getPosition,
			'setPosition':setPosition,
			'getOccupiedSpace':getOccupiedSpace,
			'getAvailableAmountOfCargo':getAvailableAmountOfCargo,
			'getFreeSpace':getFreeSpace,
			'nearTo':nearTo,
			'report':report,
			'commonLoad':commonLoad
		};
	
	/** показ сообщений о состоянии*/
	var messageObject = document.createElement("span");
	messageObject.className = "b-space-sheep__object-message";
	$('.b-space-sheep__field').append(messageObject);
	visualObject.onmouseover = function(){
		var pos = getPosition();
		messageObject.innerHTML = report(1);
		messageObject.style.display = "inline";
		messageObject.style.left =pos[0]+50+"px";
		messageObject.style.top = pos[1]-30+"px";
	}
	visualObject.onmouseout = function(){
		messageObject.innerText = "";
		messageObject.style.display = "none";
	}

    allBodies.push(obj);
	return obj
}

function Vessel(){
	var me = SpaceObject(arguments[0]),
		visualObject = me.getObject(),
		timer;

    $('.b-space-sheep__field').append(visualObject);
    me.setType("Грузовой корабль");
	me.setPosition();
	me.flyTo=function(coords, speed){
		var coords = (coords['getAvailableAmountOfCargo'])?coords.getPosition():coords,
			x = coords[0],
			y = coords[1];
		window.setTimeout(
			function caller() {
				window.clearTimeout(timer);
				oldCoords = me.getPosition(),
				oX=oldCoords[0],
				oY=oldCoords[1];
				if(oX<x){oX++;}else if(oX>x){oX--;}
				if(oY<y){oY++;}else if(oY>y){oY--;}
				me.setPosition(oX,oY);				
				if (oX!=x || oY!=y) {
					timer = setTimeout(caller, speed);
				}
			},
			speed
		);
	};

    visualObject.className="b-space-sheep__object-sheep";
    visualObject.onclick = function(){
        var e = event || window.event;
        currentObject = me;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }

    }

	me.constructor = arguments.callee;
	return me;
}

function Planet(){
	var me = SpaceObject(arguments[0]),
		visualObject = me.getObject();

    $('.b-space-sheep__field').append(visualObject);
	me.setType("Планета");
    me.setPosition();
    me.loadCargoTo = function(SpaceObject, cargoWeight){
        return (me.nearTo(SpaceObject))?me.commonLoad(SpaceObject, cargoWeight, true):false;
    };
    me.unloadCargoFrom = function(SpaceObject, cargoWeight){
        return (me.nearTo(SpaceObject))?me.commonLoad(SpaceObject, cargoWeight, false):false;
    };
    me.setPosition =function(){} /** Если это солнце и оно не движется */


	visualObject.className="b-space-sheep__object-planet";
    /** летим текущим карабликом к планете */
    visualObject.onclick = function(){
        var e = event || window.event;
        currentObject.flyTo(me.getPosition(),3);
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    }

    /** загружаемся товарами */
    visualObject.oncontextmenu = function(){
        var operation = confirm("Желаете затовариться?"),
            cargo = parseInt((operation)?prompt("Сколько загрузить?", 400):prompt("Ну тогда, сколько выгрузить?", 400));
        if(operation){
            me.unloadCargoFrom(currentObject,cargo);
        }else{
            me.loadCargoTo(currentObject,cargo);
        }

        return false;
    }

	me.constructor = arguments.callee;
	return me;
}

function starObject(container, numStars, speed, delay){
    var i= 0;
    window.setTimeout(function pull(){
        if(i>=numStars){return false;}
        i++;

        var star = document.createElement("div"),
            position= 0,
            step = 7,
            x = container.clientWidth,
            y = container.clientHeight;

        star.className = "b-space-sheep__object-star";
        container.appendChild(star);

        var interval = window.setInterval(function starAnimate(){
            position-=step;
            star.style.backgroundPosition=position+"px";
            if(position==-28){step*=-1;}
            if(position>=0){
                step*=-1;
                star.style.left=Math.floor(Math.random() * (x + 1))+"px";
                star.style.top=Math.floor(Math.random() * (y + 1))+"px";
            }
        },speed);

        var timeout = window.setTimeout(pull, delay);
    },0);
}
//window.clearInterval(interval);
$(function(){

    /** выставляем две планеты */
	var earth = Planet({'name':"Земля",'position':[80,20], 'loadLevel':10000});
	var mars = Planet({'name':"Марс",'position':[180,200], 'loadLevel':10000});

    /** создаем корабли */
    $('.b-space-sheep__create-sheep').on('click', function(){
        var sheep = Vessel({'name':"Космическая овца №"+allBodies.length,'position':[0,0], 'capacity':1000});
        currentObject = sheep;
    });

    /** анимируем космос */
    starObject($('.b-space-sheep__field')[0], 100, 1000, 300);

    /** учим корабли летать */
    $('.b-space-sheep__field').on('click', function(){
        var e = event || window.event;
        currentObject.flyTo([e.offsetX, e.offsetY],30);
    });

});