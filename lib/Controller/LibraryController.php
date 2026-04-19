<?php

declare(strict_types=1);

namespace OCA\CromQR\Controller;

use OCA\CromQR\AppInfo\Application;
use OCA\CromQR\Service\LibraryService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IRequest;

class LibraryController extends Controller {
	private LibraryService $service;
	private string $userId;

	public function __construct(
		IRequest $request,
		LibraryService $service,
		?string $userId
	) {
		parent::__construct(Application::APP_ID, $request);
		$this->service = $service;
		$this->userId = $userId ?? '';
	}

	/**
	 * @NoAdminRequired
	 */
	public function index(): JSONResponse {
		$entries = $this->service->findAll($this->userId);
		return new JSONResponse($entries);
	}

	/**
	 * @NoAdminRequired
	 */
	public function show(string $id): JSONResponse {
		$entry = $this->service->find($id, $this->userId);
		if ($entry === null) {
			return new JSONResponse(['error' => 'Not found'], 404);
		}
		return new JSONResponse($entry);
	}

	/**
	 * @NoAdminRequired
	 */
	public function create(): JSONResponse {
		$data = $this->request->getParams();
		$entry = $this->service->create($data, $this->userId);
		return new JSONResponse($entry, 201);
	}

	/**
	 * @NoAdminRequired
	 */
	public function update(string $id): JSONResponse {
		$data = $this->request->getParams();
		$entry = $this->service->update($id, $data, $this->userId);
		if ($entry === null) {
			return new JSONResponse(['error' => 'Not found'], 404);
		}
		return new JSONResponse($entry);
	}

	/**
	 * @NoAdminRequired
	 */
	public function destroy(string $id): JSONResponse {
		$result = $this->service->softDelete($id, $this->userId);
		if (!$result) {
			return new JSONResponse(['error' => 'Not found'], 404);
		}
		return new JSONResponse(['status' => 'deleted']);
	}
}
