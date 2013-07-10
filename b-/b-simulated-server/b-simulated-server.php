<?php
header('Content-type: application/json');

switch($_REQUEST['action']){

	case "getQuestions":
		echo '{
			"status":true,
			"message":"Ok",
			"items":[
				{
				"request":"Год рождения?",
				"answerType":"text",
				"answerRegExp":"[0-9]{4}",
				"answer":"Москва"
				},
				{
				"request":"Чо за ВУЗ?",
				"answerType":"text",
				"answerRegExp":false,
				"answer":"Шолохет"
				},
				{
				"request":"Скока лет?",
				"answerType":"text",
				"answerRegExp":false,
				"answer":"26"
				}
			]
		}';
		
	break;
	
	default:
		echo 'хрень';
	break;

}
?>