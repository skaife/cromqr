<?php

return [
	'routes' => [
		['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
		['name' => 'library#index', 'url' => '/library', 'verb' => 'GET'],
		['name' => 'library#create', 'url' => '/library', 'verb' => 'POST'],
		['name' => 'library#deleted', 'url' => '/library/deleted', 'verb' => 'GET'],
		['name' => 'library#emptyTrash', 'url' => '/library/empty-trash', 'verb' => 'POST'],
		['name' => 'library#show', 'url' => '/library/{id}', 'verb' => 'GET'],
		['name' => 'library#update', 'url' => '/library/{id}', 'verb' => 'PUT'],
		['name' => 'library#destroy', 'url' => '/library/{id}', 'verb' => 'DELETE'],
		['name' => 'library#restore', 'url' => '/library/{id}/restore', 'verb' => 'POST'],
		['name' => 'styles#index', 'url' => '/styles', 'verb' => 'GET'],
		['name' => 'styles#create', 'url' => '/styles', 'verb' => 'POST'],
		['name' => 'styles#deleted', 'url' => '/styles/deleted', 'verb' => 'GET'],
		['name' => 'styles#emptyTrash', 'url' => '/styles/empty-trash', 'verb' => 'POST'],
		['name' => 'styles#update', 'url' => '/styles/{id}', 'verb' => 'PUT'],
		['name' => 'styles#destroy', 'url' => '/styles/{id}', 'verb' => 'DELETE'],
		['name' => 'styles#restore', 'url' => '/styles/{id}/restore', 'verb' => 'POST'],
		['name' => 'export#export', 'url' => '/export', 'verb' => 'POST'],
	],
];
