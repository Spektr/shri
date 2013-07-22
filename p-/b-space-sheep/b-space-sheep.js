var allBodies = [];
function SpaceObject(spaceParams){
	var type=false,
		name=spaceParams['name']||"Инкогнито",
		position = spaceParams['position']||[0,0],
		capacity = spaceParams['capacity']||-1,
		loadLevel = spaceParams['loadLevel']||0,
		
		/** getters & setters */
		getName = function(){return name;},
		getType = function(){return type;},
		setType = function(typeName){if((typeof typeName=='string') && !type){type=typeName;};},
		getPosition = function(){return position;},
		setPosition = function(x,y){position=[x,y];},
		getFreeSpace = function(){return (capacity>0)?capacity-loadLevel:0;},
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
        unloadCargoFrom = function(SpaceObject, cargoWeight){ //разгружает объект
            if(!SpaceObject['getAvailableAmountOfCargo'] || cargoWeight<0){
                return false;
            }else if(cargoWeight>loadLevel){
                if(!confirm("Вы реально желаете забрать все товары?")){return false;};
                loadLevel= SpaceObject.loadCargoTo(this, loadLevel);
            }else{
                loadLevel-=SpaceObject.loadCargoTo(this, cargoWeight);
            };
            return (typeof loadLevel == "number")?true:false;
        },
		loadCargoTo = function(SpaceObject, cargoWeight){ //загружает
			if(!SpaceObject['getAvailableAmountOfCargo'] || cargoWeight<0){
                return false;
            }else if(cargoWeight>getFreeSpace()){
                if(!confirm("Вы реально желаете загрузиться по полной?")){return false;};
                var rests = getFreeSpace();
                loadLevel=capacity;
                return rests;
            }else{
                loadLevel+=cargoWeight;
                return cargoWeight;
            };
		},

		
		/** Возвращаемый godlike объект с кучей методов */
		obj = {
			'getType':getType,
			'setType':setType,
			'report':report,
			'getAvailableAmountOfCargo':getAvailableAmountOfCargo,
			'loadCargoTo':loadCargoTo,
			'unloadCargoFrom':unloadCargoFrom,
			'getFreeSpace':getFreeSpace,
			'getOccupiedSpace':getOccupiedSpace,
			'getPosition':getPosition,
			'setPosition':setPosition,
			'getName':getName
		};
	
	allBodies.push(obj);
	return obj
}

function Vessel(){
	arguments[0]['loadLevel']=0;
    var me = SpaceObject(arguments[0]);
	me.setType("Грузовой корабль");
    me.flyTo=function(){

    }
	
    me.constructor = arguments.callee;
    return me;
}

function Planet(){
	arguments[0]['capacity']=-1;
	var me = SpaceObject(arguments[0]);
	me.setType("Планета");
	me.setPosition = function(){}; /** Если это солнце и оно не движется */

    me.constructor = arguments.callee;
    return me;
}


var yambler = Vessel({'name':"Злокорабль",'position':[80,30], 'capacity':1500});
var yambler2 = Vessel({'name':"Злокорабль 2",'position':[100,100], 'capacity':200});
var yambler3 = Vessel({'name':"Злокорабль 3",'position':[100,150], 'capacity':1000});
var earth = Planet({'name':"Земля",'position':[100,100], 'loadLevel':9000});
var mars = Planet({'name':"Марс",'position':[100,150], 'loadLevel':800});
yambler.report();
yambler2.report();
yambler3.report();
earth.report();
mars.report();
earth.unloadCargoFrom(yambler, 9001);
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

/**
 * Загружает на корабль заданное количество груза.
 * 
 * Перед загрузкой корабль должен приземлиться на планету.
 * @param {Vessel} vessel Загружаемый корабль.
 * @param {Number} cargoWeight Вес загружаемого груза.
 * @name Vessel.loadCargoTo
 */
//Planet.prototype.loadCargoTo = function (vessel, cargoWeight) {}

/**
 * Выгружает с корабля заданное количество груза.
 * 
 * Перед выгрузкой корабль должен приземлиться на планету.
 * @param {Vessel} vessel Разгружаемый корабль.
 * @param {Number} cargoWeight Вес выгружаемого груза.
 * @name Vessel.unloadCargoFrom
 */
//Planet.prototype.unloadCargoFrom = function (vessel, cargoWeight) {}




