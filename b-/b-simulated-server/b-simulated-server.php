<?php
header('Content-type: application/json; charset: utf8');

switch($_REQUEST['action']){

	case "getQuestions":
		echo '{
			"status":true,
			"message":"Ok",
			"items":[
				{
				"request":"�� �� �����?",
				"answerType":"text",
				"answerRegExp":false,
				"answer":"������"
				},
				{
				"request":"�� �� ���?",
				"answerType":"text",
				"answerRegExp":false,
				"answer":"�������"
				},
				{
				"request":"����� ���?",
				"answerType":"text",
				"answerRegExp":false,
				"answer":"26"
				},
			]
		}';
		
	break;
	
	default:
		echo '�����';
	break;

}
?>