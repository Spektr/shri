/** Глобальные переменные */
var allBodies = [],			//массив всех космических тел
    currentObject={},		//управляемый объект (корабль)
	space = (function(){	//берем дом элемент космоса
		var nodes = document.getElementsByTagName('*');
		for (i = 0; i<nodes.length; i++){
			if (nodes[i].className.indexOf("b-space-sheep__field") >= 0){
				return nodes[i];
			}
		}
	})();

/**
 * Создает экземпляр космического объекта.
 * @constructor
 * @this {Object}
 * @param {Object} spaceParams Набор параметров для создания обьекта.
 * {string} name Название космообъекта.
 * {number}[] posititon Местоположение космообъекта.
 * {number} loadLevel Текущая загрузка объекта.
 * {number} capacity Максимальная вместимость космообъекта.
 * @return {object} Прототип космообъекта
 */
function SpaceObject(spaceParams){
	var type=false,	//тип будущего объекта (неопределен)
		name=spaceParams['name']||"Инкогнито",
		position = spaceParams['position']||[0,0],
		capacity = (spaceParams['capacity'] && spaceParams['capacity']>=0)?spaceParams['capacity']:1000000,
		loadLevel = (spaceParams['loadLevel'] && spaceParams['loadLevel']<=capacity)?spaceParams['loadLevel']:0,
		visualObject = document.createElement("span"),	//блок, который будет характеризовать объект в дом дереве
		
		/** getters & setters */
		getName = function(){return name;},
		getObject = function(){return visualObject;},
		getType = function(){return type;},
		setType = function(typeName){if((typeof typeName=='string') && !type){type=typeName;};},
		getPosition = function(){return position;},
		
		/** 
		* Устанавливает месторасположение объекта
		* @param {number} x Позиция по горизонтали
		* @param {number} y Позиция по вертикали
		*/
		setPosition = function(x,y){
			x=(x)?x:position[0];
			y=(y)?y:position[1];
			position=[x,y];
			visualObject.style.left = x+"px";
			visualObject.style.top = y+"px";
		},
		getOccupiedSpace = function(){return loadLevel;},			//Выводит количество занятого места.
		getAvailableAmountOfCargo = function(){return capacity;},	//Возвращает доступное количество места.
		getFreeSpace = function(){return (capacity-loadLevel);},	//Выводит количество свободного места на корабле.
		
		/** 
		* Проверяет находится ли текущий объект в той же точке, что и переданный в параметрах
		* @param {object} SpaceObject Проверяемый космообъект
		* @return {bool} Рядом или нет
		*/
		nearTo = function(SpaceObject){
			var one = SpaceObject.getPosition(),
				two = this.getPosition();
			return (one[0]==two[0]&&one[1]==two[1])?true:false;
		},
		
		/**
		 * Выводит текущее состояние объекта: тип, имя, местоположение, доступную грузоподъемность.
		 * @param {bool} inText Возвращать ли текст или выводить в консоль 
		 * @return {string|bool} Строка или утвердительный объект
		 * @example
		 * spaceObject.report(); // Грузовой корабль. Перехватчик №1. Местоположение: Земля. Товаров нет.
		 * @example
		 * spaceObject.report(); // Планета. Земля. Местоположение: 50,20. Количество груза: 20000т.
		 * @name SpaceObject.report
		 */		
		report = function(inText){
			/** Формируем строку ответа */
			var rType="Тип: "+type+".<br /> ",
				rName="Название: "+name+".<br /> ",
				rCurrentPlace = "Местоположение: "+position+".<br />",
				rCargo = "Груз: "+((loadLevel)?loadLevel+"т.":"отсутствует.")+"<br />";
			
			/** Корректируем вывод позиции если на планете */
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
				return true;
			}
		},
		
		/**
		 * Общий метод для загрузки и выгрузки товара с/на объект. 
		 * (особенность: операция загрузки инициирует операцию разгрузки на паралельном объекте и наоборот)
		 * @param {Object} SpaceObject С каким объектом будем взаимодействовать.
		 * @param {number} cargoWeight Объём товаров.
		 * @param {bool} loading Загружать или разгружать.
		 * @return {number|bool} Объём реально обработанного товара или отказ
		 */
		commonLoad = function(SpaceObject, cargoWeight, loading){
			if(!SpaceObject['getAvailableAmountOfCargo'] || cargoWeight<0){ return false;};										//проверка на адекватность аргументов
			var answer = false,																									//ответ метода (реально обработанное карго)
				postCount = (commonLoad.caller && (commonLoad.caller.toString() == commonLoad.toString()))?true:false,			//0_0 флаг рекурсивного вызова
				available = (loading)?this.getFreeSpace():loadLevel,															//доступное место/товар (зависит от операции)
				errorMessage = (loading)?"Вы реально желаете загрузиться по полной?":"Вы реально желаете забрать все товары?";	//сообщение при переполнении
			
			/** Если объём указанного товара больше того что можно обработать */
			if(cargoWeight>available){
				cargoWeight = (confirm(errorMessage))?available:0;
			}
			
			/** Если вызывается первый раз, тогда инвертировать операцию для противоположного объекта */
			cargoWeight =(postCount)?cargoWeight:SpaceObject.commonLoad(this, cargoWeight, !loading);
			answer = (loading)?cargoWeight:(-cargoWeight);	//знак операции
			loadLevel+= answer;								//сама операция
			return Math.abs(answer);						//возвращяем абсолютное значение сколько было списано или прибавлено
			
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
	
	/** показ сообщений о состоянии */
	var messageObject = document.createElement("span");			//дом элемент
	messageObject.className = "b-space-sheep__object-message";	//оформление
	space.appendChild(messageObject);							//добавляем в космос
	visualObject.onmouseover = function(){						//появление
		var pos = getPosition();
		messageObject.innerHTML = report(1);
		messageObject.style.display = "inline";
		messageObject.style.left =pos[0]+50+"px";
		messageObject.style.top = pos[1]-30+"px";
	}	
	visualObject.onmouseout = function(){						//исчезновение
		messageObject.innerText = "";
		messageObject.style.display = "none";
	}
	
	
    allBodies.push(obj);	//пушим в общий стак объектов
	return obj;				//и возвращает
}


/**
 * Создает экземпляр космического корабля.
 * @constructor
 * @extend SpaceObject()
 * @param {Object} spaceParams Набор параметров для создания обьекта.
 * @return {object} корабль
 */
function Vessel(){
	var me = SpaceObject(arguments[0]),	//расширяем
		visualObject = me.getObject(),	//получаем дом объект
		timer;
		
	me.setType("Грузовой корабль");						//устанавливаем тип космообьекта
    space.appendChild(visualObject);					//добавляем в космос
	me.setPosition();									//размещяем дом объект в космосе
	
	/**
	 * Метод для визуального полета корабля.
	 * @param {SpaceObject|number[]} coords Объект или координаты куда лететь.
	 * @param {number} speed Скорость перемещения по космосу в милисекундах
	 */
	me.flyTo=function(coords, speed){
		var coords = (coords['getAvailableAmountOfCargo'])?coords.getPosition():coords,
			x = coords[0],
			y = coords[1],
			curPos = me.getPosition();
			
		visualObject.className = "b-space-sheep__object-sheep";
		var tempX = Math.abs(x-curPos[0]),
			tempY = Math.abs(y-curPos[1]),
			tempClass = "";
		
		if(tempX<=tempY){
			tempClass=(y>curPos[1])?" b-space-sheep__object-sheep_bottom":"";
		}else{
			tempClass=(x>curPos[0])?" b-space-sheep__object-sheep_right":" b-space-sheep__object-sheep_left";
		}
		visualObject.className+= tempClass;
		
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

	/** донастраиваем визуальный обьект корабля */
    visualObject.className="b-space-sheep__object-sheep";
    visualObject.onclick = function(event){	//при клике на корабль, делаем его текущим
        var e = event || window.event;
        currentObject = me;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }

    }
	
	/** Убираем некоторые ненужные методы */
	me.getAvailableAmountOfCargo =function(){};
	me.getObject =function(){};
	me.getName =function(){};
	me.getType =function(){};
	me.setType =function(){};
	me.nearTo =function(){};
	
	me.constructor = arguments.callee;	//конструктор = Vessel
	return me;
}

/**
 * Создает экземпляр Планеты.
 * @constructor
 * @extend SpaceObject()
 * @param {Object} spaceParams Набор параметров для создания обьекта.
 * @return {object} Планета
 */
function Planet(){
	var me = SpaceObject(arguments[0]),	//расширяем
		visualObject = me.getObject();	//получаем дом объект
	
	me.setType("Планета");								//устанавливаем тип
    space.appendChild(visualObject);					//добавляем в космос
    me.setPosition();									//размещяем дом объект в космосе
	
	/** уточняем методы для загрузки/разгрузки только с планеты */
    me.loadCargoTo = function(SpaceObject, cargoWeight){
        return (me.nearTo(SpaceObject))?me.commonLoad(SpaceObject, cargoWeight, true):false;
    };
    me.unloadCargoFrom = function(SpaceObject, cargoWeight){
        return (me.nearTo(SpaceObject))?me.commonLoad(SpaceObject, cargoWeight, false):false;
    };

	/** донастраиваем визуальный обьект планеты */
	visualObject.className="b-space-sheep__object-planet";
    visualObject.onclick = function(event){	//при клике на планету, быстро летим к ней текущим кораблем
        var e = event || window.event;
        currentObject.flyTo(me.getPosition(),3);
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    }
    visualObject.oncontextmenu = function(){	//загружаемся товарами
        var operation = confirm("Желаете затовариться?"),
            cargo = parseInt((operation)?prompt("Сколько загрузить?", 400):prompt("Ну тогда, сколько выгрузить?", 400));
        if(operation){
            me.unloadCargoFrom(currentObject,cargo);
        }else{
            me.loadCargoTo(currentObject,cargo);
        }

        return false;
    }
	
	/** Убираем некоторые ненужные методы */
    me.setPosition =function(){};
	me.getObject =function(){};
	me.getOccupiedSpace =function(){};
	me.getFreeSpace =function(){};
	me.getOccupiedSpace =function(){};

	me.constructor = arguments.callee;	//конструктор = Planet
	return me;
}

/**
 * Заполняет контейнер появляющимися звездами.
 * @param {DOMElement} container Элемент куда будут загружены звезды.
 * @param {number} numStars Количество звезд.
 * @param {number} speed Скорость анимации звезд.
 * @param {number} delay Задержка между появлением новой звезды.
 */
function starObject(container, numStars, speed, delay){
    var i= 0;
    window.setTimeout(function pull(){	//вызываем таймаут на создание звезд
        if(i>=numStars){return false;}
        i++;

        var star = document.createElement("div"),	//делаем обьект
            position= 0,							//начальная позиция фона звезды
            step = 7,								//шаг смещения в пикселях
            x = container.clientWidth,				//ширина контейнера куда будут грузиться звезды
            y = container.clientHeight,				//его высота
			interval,								//интервал
			timeout;								//таймаут

        star.className = "b-space-sheep__object-star";
        container.appendChild(star);

        interval = window.setInterval(function starAnimate(){	//вызываем интервал на анимацию звезд
            position-=step;
            star.style.backgroundPosition=position+"px";
            if(position==-28){step*=-1;}
            if(position>=0){
                step*=-1;
                star.style.left=Math.floor(Math.random() * (x + 1))+"px";
                star.style.top=Math.floor(Math.random() * (y + 1))+"px";
            }
        },speed);

        timeout = window.setTimeout(pull, delay);
    },0);
}

$(function(){

    /** выставляем две планеты */
	var earth = Planet({'name':"Земля",'position':[80,20], 'loadLevel':30000});
	var mars = Planet({'name':"Марс",'position':[180,200], 'loadLevel':9000});

    /** делаем кнопку создания кораблей */
	var button = document.createElement("span");
	button.className="b-space-sheep__create-sheep";
	button.innerHTML = "Создать кораблик";
	button.onclick = function(){
        var sheep = Vessel({'name':"Космическая овца №"+allBodies.length,'position':[0,0], 'capacity':11000});
        currentObject = sheep;
    };
	space.appendChild(button);

    /** анимируем космос */
    starObject(space, 50, 1000, 300);

    /** учим корабли летать */
    space.onclick = function(event){
        var e = event || window.event,
			x = (e.offsetX)?e.offsetX:(e.layerX - e.currentTarget.offsetLeft),
     		y = (e.offsetY)?e.offsetY:(e.layerY - e.currentTarget.offsetTop);
		x=(x>=0)?x:0;
		y=(y>=0)?y:0;
        currentObject.flyTo([x, y],30);
    };

});