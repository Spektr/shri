<?php
header('Content-type: application/json; charset: utf8');

switch($_REQUEST['action']){

	case "getQuestions":
		echo '{
			"status":true,
			"message":"Ok",
			"items":[
				{
				"request":"Чо за город?",
				"answerType":"text",
				"answerRegExp":false,
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
				},
			]
		}';
		
	break;
	
	default:
		echo 'хрень';
	break;

}
?>