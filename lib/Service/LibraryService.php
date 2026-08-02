<?php

declare(strict_types=1);

namespace OCA\CromQR\Service;

use OCP\Files\IAppData;
use OCP\Files\NotFoundException;

class LibraryService {
	private IAppData $appData;

	public function __construct(IAppData $appData) {
		$this->appData = $appData;
	}

	private function getUserFolder(string $userId): \OCP\Files\SimpleFS\ISimpleFolder {
		try {
			return $this->appData->getFolder($userId);
		} catch (NotFoundException $e) {
			return $this->appData->newFolder($userId);
		}
	}

	public function findAll(string $userId): array {
		$folder = $this->getUserFolder($userId);
		$entries = [];

		foreach ($folder->getDirectoryListing() as $file) {
			if (str_ends_with($file->getName(), '.json')) {
				$data = json_decode($file->getContent(), true);
				if ($data && empty($data['$deleted']) && ($data['$type'] ?? 'cromqr-entry') === 'cromqr-entry') {
					$entries[] = $data;
				}
			}
		}

		usort($entries, function ($a, $b) {
			return strcasecmp($a['name'] ?? '', $b['name'] ?? '');
		});

		return $entries;
	}

	public function findDeleted(string $userId): array {
		$folder = $this->getUserFolder($userId);
		$entries = [];

		foreach ($folder->getDirectoryListing() as $file) {
			if (str_ends_with($file->getName(), '.json')) {
				$data = json_decode($file->getContent(), true);
				if ($data && !empty($data['$deleted']) && ($data['$type'] ?? 'cromqr-entry') === 'cromqr-entry') {
					$entries[] = $data;
				}
			}
		}

		usort($entries, function ($a, $b) {
			return strcasecmp($a['name'] ?? '', $b['name'] ?? '');
		});

		return $entries;
	}

	public function emptyTrash(string $userId): int {
		$folder = $this->getUserFolder($userId);
		$count = 0;

		foreach ($folder->getDirectoryListing() as $file) {
			if (str_ends_with($file->getName(), '.json')) {
				$data = json_decode($file->getContent(), true);
				if ($data && !empty($data['$deleted']) && ($data['$type'] ?? 'cromqr-entry') === 'cromqr-entry') {
					$file->delete();
					$count++;
				}
			}
		}

		return $count;
	}

	public function findDeletedStyles(string $userId): array {
		$folder = $this->getUserFolder($userId);
		$styles = [];

		foreach ($folder->getDirectoryListing() as $file) {
			if (str_ends_with($file->getName(), '.json')) {
				$data = json_decode($file->getContent(), true);
				if ($data && !empty($data['$deleted']) && ($data['$type'] ?? '') === 'cromqr-style') {
					$styles[] = $data;
				}
			}
		}

		usort($styles, function ($a, $b) {
			return strcasecmp($a['name'] ?? '', $b['name'] ?? '');
		});

		return $styles;
	}

	public function emptyStyleTrash(string $userId): int {
		$folder = $this->getUserFolder($userId);
		$count = 0;

		foreach ($folder->getDirectoryListing() as $file) {
			if (str_ends_with($file->getName(), '.json')) {
				$data = json_decode($file->getContent(), true);
				if ($data && !empty($data['$deleted']) && ($data['$type'] ?? '') === 'cromqr-style') {
					$file->delete();
					$count++;
				}
			}
		}

		return $count;
	}

	public function find(string $id, string $userId): ?array {
		$folder = $this->getUserFolder($userId);
		try {
			$file = $folder->getFile($id . '.json');
			$data = json_decode($file->getContent(), true);
			if ($data && empty($data['$deleted'])) {
				return $data;
			}
			return null;
		} catch (NotFoundException $e) {
			return null;
		}
	}

	public function create(array $data, string $userId): array {
		$folder = $this->getUserFolder($userId);
		$now = (new \DateTimeImmutable())->format(\DateTimeInterface::ATOM);

		$entry = [
			'$id' => $data['$id'] ?? \OCP\Util::generateRandomBytes(16),
			'$type' => $data['$type'] ?? 'cromqr-entry',
			'$deleted' => false,
			'name' => $data['name'] ?? '',
			'folder' => $data['folder'] ?? '',
			'dataType' => $data['dataType'] ?? 'text',
			'payload' => $data['payload'] ?? '',
			'fields' => $data['fields'] ?? new \stdClass(),
			'style' => $data['style'] ?? [
				'fgColor' => '#000000',
				'bgColor' => '#ffffff',
				'logo' => null,
			],
			'createdAt' => $now,
			'updatedAt' => $now,
		];

		if ($entry['$type'] === 'cromqr-style') {
			$entry = [
				'$id' => $data['$id'] ?? \OCP\Util::generateRandomBytes(16),
				'$type' => 'cromqr-style',
				'$deleted' => false,
				'name' => $data['name'] ?? '',
				'fgColor' => $data['fgColor'] ?? '#000000',
				'bgColor' => $data['bgColor'] ?? '#ffffff',
				'logo' => $data['logo'] ?? null,
				'createdAt' => $now,
				'updatedAt' => $now,
			];
		}

		$folder->newFile(
			$entry['$id'] . '.json',
			json_encode($entry, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
		);

		return $entry;
	}

	public function update(string $id, array $data, string $userId): ?array {
		$folder = $this->getUserFolder($userId);

		try {
			$file = $folder->getFile($id . '.json');
			$existing = json_decode($file->getContent(), true);
			if (!$existing || !empty($existing['$deleted'])) {
				return null;
			}

			$now = (new \DateTimeImmutable())->format(\DateTimeInterface::ATOM);

			if (($existing['$type'] ?? 'cromqr-entry') === 'cromqr-style') {
				$updated = array_merge($existing, [
					'name' => $data['name'] ?? $existing['name'],
					'fgColor' => $data['fgColor'] ?? $existing['fgColor'],
					'bgColor' => $data['bgColor'] ?? $existing['bgColor'],
					'logo' => array_key_exists('logo', $data) ? $data['logo'] : ($existing['logo'] ?? null),
					'updatedAt' => $now,
				]);
			} else {
				$updated = array_merge($existing, [
					'name' => $data['name'] ?? $existing['name'],
					'folder' => array_key_exists('folder', $data) ? $data['folder'] : ($existing['folder'] ?? ''),
					'dataType' => $data['dataType'] ?? $existing['dataType'],
					'payload' => $data['payload'] ?? $existing['payload'],
					'fields' => $data['fields'] ?? $existing['fields'],
					'style' => $data['style'] ?? $existing['style'],
					'updatedAt' => $now,
				]);
			}

			$file->putContent(json_encode($updated, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
			return $updated;
		} catch (NotFoundException $e) {
			return null;
		}
	}

	public function softDelete(string $id, string $userId): bool {
		$folder = $this->getUserFolder($userId);

		try {
			$file = $folder->getFile($id . '.json');
			$data = json_decode($file->getContent(), true);
			if (!$data) {
				return false;
			}

			$data['$deleted'] = true;
			$data['updatedAt'] = (new \DateTimeImmutable())->format(\DateTimeInterface::ATOM);
			$file->putContent(json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
			return true;
		} catch (NotFoundException $e) {
			return false;
		}
	}

	public function restore(string $id, string $userId): ?array {
		$folder = $this->getUserFolder($userId);

		try {
			$file = $folder->getFile($id . '.json');
			$data = json_decode($file->getContent(), true);
			if (!$data || empty($data['$deleted'])) {
				return null;
			}

			$data['$deleted'] = false;
			$data['updatedAt'] = (new \DateTimeImmutable())->format(\DateTimeInterface::ATOM);
			$file->putContent(json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
			return $data;
		} catch (NotFoundException $e) {
			return null;
		}
	}

	public function findAllStyles(string $userId): array {
		$folder = $this->getUserFolder($userId);
		$styles = [];

		foreach ($folder->getDirectoryListing() as $file) {
			if (str_ends_with($file->getName(), '.json')) {
				$data = json_decode($file->getContent(), true);
				if ($data && empty($data['$deleted']) && ($data['$type'] ?? '') === 'cromqr-style') {
					$styles[] = $data;
				}
			}
		}

		usort($styles, function ($a, $b) {
			return strcasecmp($a['name'] ?? '', $b['name'] ?? '');
		});

		return $styles;
	}
}
