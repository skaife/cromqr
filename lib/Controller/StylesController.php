<?php

declare(strict_types=1);

namespace OCA\CromQR\Controller;

use OCA\CromQR\AppInfo\Application;
use OCA\CromQR\Service\LibraryService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IRequest;

class StylesController extends Controller {
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
		$styles = $this->service->findAllStyles($this->userId);
		return new JSONResponse($styles);
	}

	/**
	 * @NoAdminRequired
	 */
	public function create(): JSONResponse {
		$data = $this->request->getParams();
		$data['$type'] = 'cromqr-style';
		$style = $this->service->create($data, $this->userId);
		return new JSONResponse($style, 201);
	}

	/**
	 * @NoAdminRequired
	 */
	public function update(string $id): JSONResponse {
		$data = $this->request->getParams();
		$style = $this->service->update($id, $data, $this->userId);
		if ($style === null) {
			return new JSONResponse(['error' => 'Not found'], 404);
		}
		return new JSONResponse($style);
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

	/**
	 * @NoAdminRequired
	 */
	public function deleted(): JSONResponse {
		$styles = $this->service->findDeletedStyles($this->userId);
		return new JSONResponse($styles);
	}

	/**
	 * @NoAdminRequired
	 */
	public function restore(string $id): JSONResponse {
		$entry = $this->service->restore($id, $this->userId);
		if ($entry === null) {
			return new JSONResponse(['error' => 'Not found'], 404);
		}
		return new JSONResponse($entry);
	}

	/**
	 * @NoAdminRequired
	 */
	public function emptyTrash(): JSONResponse {
		$count = $this->service->emptyStyleTrash($this->userId);
		return new JSONResponse(['status' => 'emptied', 'count' => $count]);
	}
}
