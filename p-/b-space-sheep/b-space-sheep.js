var allBodies = [];
function SpaceObject(spaceParams){
	var type=false,
		name=spaceParams['name']||"Инкогнито",
		position = spaceParams['position']||[0,0],
		capacity = (spaceParams['capacity'] && spaceParams['capacity']>=0)?spaceParams['capacity']:1000000,
		loadLevel = (spaceParams['loadLevel'] && spaceParams['loadLevel']<=capacity)?spaceParams['loadLevel']:0,
		
		/** getters & setters */
		getName = function(){return name;},
		getType = function(){return type;},
		setType = function(typeName){if((typeof typeName=='string') && !type){type=typeName;};},
		getPosition = function(){return position;},
		setPosition = function(x,y){position=[x,y];},
		getFreeSpace = function(){return (capacity-loadLevel);},
		getOccupiedSpace = function(){return loadLevel;},
		getAvailableAmountOfCargo = function(){return capacity;},
		
		/**
		 * Выводит текущее состояние объекта: тип, имя, местоположение, доступную грузоподъемность.
		 * @example
		 * spaceObject.report(); // Грузовой корабль. Перехватчик №1. Местоположение: Земля. Товаров нет.
		 * @example
		 * spaceObject.report(); // Планета. Земля. Местоположение: 50,20. Количество груза: 200т.
		 * @name Vessel.report
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
			'getType':getType,
			'setType':setType,
			'getPosition':getPosition,
			'setPosition':setPosition,
			'getFreeSpace':getFreeSpace,
			'getOccupiedSpace':getOccupiedSpace,
			'getAvailableAmountOfCargo':getAvailableAmountOfCargo,
			'report':report,
			'commonLoad':commonLoad
		};
	
	allBodies.push(obj);
	return obj
}

function Vessel(){
    var me = SpaceObject(arguments[0]);
	me.setType("Грузовой корабль");
    me.flyTo=function(){};
	
    me.constructor = arguments.callee;
    return me;
}

function Planet(){
	var me = SpaceObject(arguments[0]);
	me.setType("Планета");
	
	me.loadCargoTo = function(SpaceObject, cargoWeight){
		return me.commonLoad(SpaceObject, cargoWeight, true);
	};
	me.unloadCargoFrom = function(SpaceObject, cargoWeight){
		return me.commonLoad(SpaceObject, cargoWeight, false);
	};
	
	me.setPosition =function(){} /** Если это солнце и оно не движется */
	
    me.constructor = arguments.callee;
    return me;
}


var yambler = Vessel({'name':"Злокорабль",'position':[80,30], 'capacity':1000});
var earth = Planet({'name':"Земля",'position':[80,30], 'loadLevel':10000});
yambler.report();
earth.report();
console.log("-----");


earth.unloadCargoFrom(yambler, 2000);
yambler.report();
earth.report();



/**
 * Переносит корабль в указанную точку.
 * @param {Number}[]|Planet newPosition Новое местоположение корабля.
 * @example
 * vessel.flyTo([1,1]);
 * @example
 * var earth = new Planet('Земля', [1,1]);
 * vessel.flyTo(earth);
 * @name Vessel.report
 */
//Vessel.prototype.flyTo = function (newPosition) {}
