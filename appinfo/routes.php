<?php

return [
	'routes' => [
		['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
		['name' => 'library#index', 'url' => '/library', 'verb' => 'GET'],
		['name' => 'library#show', 'url' => '/library/{id}', 'verb' => 'GET'],
		['name' => 'library#create', 'url' => '/library', 'verb' => 'POST'],
		['name' => 'library#update', 'url' => '/library/{id}', 'verb' => 'PUT'],
		['name' => 'library#destroy', 'url' => '/library/{id}', 'verb' => 'DELETE'],
		['name' => 'export#export', 'url' => '/export', 'verb' => 'POST'],
	],
];
