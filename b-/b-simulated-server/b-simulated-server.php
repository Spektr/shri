<?php
header('Content-type: application/json; charset: utf8');

switch($_REQUEST['action']){

	case "showQuestions":
		echo '{
			"status":true,
			"message":"Ok",
			"items":[
				{
				"request":"�� �� �����?",
				"answerType":"text",
				"answer":"������"
				},
				{
				"request":"�� �� ���?",
				"answerType":"text",
				"answer":"�������"
				},
				{
				"request":"����� ���?",
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