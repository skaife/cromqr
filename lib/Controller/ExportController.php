<?php

declare(strict_types=1);

namespace OCA\CromQR\Controller;

use OCA\CromQR\AppInfo\Application;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\Files\IRootFolder;
use OCP\IRequest;

class ExportController extends Controller {
	private IRootFolder $rootFolder;
	private string $userId;

	public function __construct(
		IRequest $request,
		IRootFolder $rootFolder,
		?string $userId
	) {
		parent::__construct(Application::APP_ID, $request);
		$this->rootFolder = $rootFolder;
		$this->userId = $userId ?? '';
	}

	/**
	 * @NoAdminRequired
	 */
	public function export(): JSONResponse {
		$destination = $this->request->getParam('destination');
		$filename = $this->request->getParam('filename');
		$imageData = $this->request->getParam('imageData');

		if (!$destination || !$filename || !$imageData) {
			return new JSONResponse(['error' => 'Missing required fields'], 400);
		}

		try {
			$userFolder = $this->rootFolder->getUserFolder($this->userId);

			$targetPath = rtrim($destination, '/') . '/' . $filename;

			$binaryData = base64_decode(
				preg_replace('#^data:image/\w+;base64,#', '', $imageData)
			);

			if ($userFolder->nodeExists($targetPath)) {
				$file = $userFolder->get($targetPath);
				$file->putContent($binaryData);
			} else {
				if (!$userFolder->nodeExists($destination)) {
					$userFolder->newFolder($destination);
				}
				$folder = $userFolder->get($destination);
				$file = $folder->newFile($filename, $binaryData);
			}

			return new JSONResponse(['status' => 'exported', 'path' => $targetPath]);
		} catch (\Exception $e) {
			return new JSONResponse(['error' => $e->getMessage()], 500);
		}
	}
}
