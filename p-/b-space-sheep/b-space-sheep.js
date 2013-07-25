/** Классы */
var allBodies = [];
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
		report = function(){
			var cargo = (loadLevel)?". Количество груза:"+loadLevel+"т.":". Грузов нет.";
			var currentPlace = position;
			for(key in allBodies){
				var obj = allBodies[key],
					pos = obj.getPosition(),
					x = pos[0],
					y = pos[1];
				
				if(this!=obj && position[0]==x && position[1]==y && obj.getType()=="Планета"){
					var currentPlace = obj.getName();
				}
			}
			console.log(type+". "+name+". Местоположение:"+currentPlace+cargo);
		},
		
		
		/** общая функция загрузки выгрузки */
		commonLoad = function(SpaceObject, cargoWeight, loading){
			if(!SpaceObject['getAvailableAmountOfCargo'] || cargoWeight<0){ return false;};									//проверка на адекватность аргументов
			var answer = false,																								//ответ метода (реально обработанное карго)
			postCount = (commonLoad.caller && (commonLoad.caller.toString() == commonLoad.toString()))?true:false,			//0_0 флаг рекурсивного вызова
			available = (loading)?this.getFreeSpace():loadLevel,															//доступное место/товар (зависит от операции)
			errorMessage = (loading)?"Вы реально желаете загрузиться по полной?":"Вы реально желаете забрать все товары?";	//при переполнении
			
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
	
	allBodies.push(obj);
	return obj
}

function Vessel(){
	var me = SpaceObject(arguments[0]),
		visualObject = me.getObject();
		
	me.setType("Грузовой корабль");
	visualObject.className="b-space-sheep__object-sheep";
	$('.b-space-sheep__field').append(visualObject);
	me.setPosition();
	
	me.flyTo=function(coords, speed){
		var coords = (coords['getAvailableAmountOfCargo'])?coords.getPosition():coords,
			x = coords[0],
			y = coords[1];

		window.setTimeout(
			function caller() {
				oldCoords = me.getPosition(),
				oX=oldCoords[0],
				oY=oldCoords[1];
				if(oX<x){oX++;}else if(oX>x){oX--;}
				if(oY<y){oY++;}else if(oY>y){oY--;}
				me.setPosition(oX,oY);				
				if (oX!=x || oY!=y) {
					setTimeout(caller, speed);
				}
			},
			speed
		);
	};

	
	me.constructor = arguments.callee;
	return me;
}

function Planet(){
	var me = SpaceObject(arguments[0]),
		visualObject = me.getObject();
		
	me.setType("Планета");
	visualObject.className="b-space-sheep__object-planet";
	$('.b-space-sheep__field').append(visualObject);
	me.setPosition();
	
	me.loadCargoTo = function(SpaceObject, cargoWeight){
		return (me.nearTo(SpaceObject))?me.commonLoad(SpaceObject, cargoWeight, true):false;
	};
	me.unloadCargoFrom = function(SpaceObject, cargoWeight){
		return (me.nearTo(SpaceObject))?me.commonLoad(SpaceObject, cargoWeight, false):false;
	};
	
	me.setPosition =function(){} /** Если это солнце и оно не движется */
	
	me.constructor = arguments.callee;
	return me;
}


$(function(){
	var yambler = Vessel({'name':"Злокорабль",'position':[0,0], 'capacity':1000});
	var earth = Planet({'name':"Земля",'position':[80,20], 'loadLevel':10000});

	console.log("-----");
	yambler.flyTo([150,80], 30);
	//yambler.flyTo(earth);


	
	earth.unloadCargoFrom(yambler, 2000);


});