<?php
header('Content-type: application/json; charset: utf8');

switch($_REQUEST['action']){

	case "showQuestions":
		echo '{
			"status":true,
			"message":"Ok",
			"items":[
				{
				"request":"Чо за город?",
				"answerType":"text",
				"answer":"Москва"
				},
				{
				"request":"Чо за ВУЗ?",
				"answerType":"text",
				"answer":"Шолохет"
				},
				{
				"request":"Скока лет?",
				"answerType":"text",
				"answer":"26"
				},
			]
		}';
		
	break;
	
	default:
		
	break;

}
?>