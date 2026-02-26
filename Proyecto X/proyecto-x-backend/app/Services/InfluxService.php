<?php

namespace App\Services;

use InfluxDB2\Client;
use InfluxDB2\Model\WritePrecision;
use InfluxDB2\Point;
use InfluxDB2\WriteOptions;
use Throwable;

class InfluxService
{
    private Client $client;
    private string $org;
    private string $bucket;

    public function __construct()
    {
        $this->org = (string) config('influx.org');
        $this->bucket = (string) config('influx.bucket');

        if ($this->org === '') {
            throw new \RuntimeException('INFLUX_ORG no está configurado.');
        }
        if ($this->bucket === '') {
            throw new \RuntimeException('INFLUX_BUCKET no está configurado.');
        }

        $this->client = new Client([
            'url' => (string) config('influx.url'),
            'token' => (string) config('influx.token'),
            'timeout' => (int) config('influx.timeout'),
        ]);
    }

    /**
     * @param array<int, array{
     *   measurement?: string,
     *   tags?: array<string, string|int>,
     *   fields: array<string, int|float|string|bool>,
     *   time?: string|int|null
     * }> $points
     */
public function writeMany(array $points): void
{
    $writeApi = $this->client->createWriteApi();

    try {
        foreach ($points as $p) {
            $measurement = $p['measurement'] ?? 'telemetry';
            $tags = $p['tags'] ?? [];
            $fields = $p['fields'];
            $time = $p['time'] ?? null;

            $tagStr = '';
            foreach ($tags as $k => $v) {
                $tagStr .= ',' . $this->escapeKey((string)$k) . '=' . $this->escapeKey((string)$v);
            }

            $fieldParts = [];
            foreach ($fields as $k => $v) {
                $fieldParts[] = $this->escapeKey((string)$k) . '=' . $this->formatFieldValue($v);
            }

            $line = $this->escapeKey($measurement) . $tagStr . ' ' . implode(',', $fieldParts);

            if ($time !== null) {
                $line .= ' ' . (string)$time; // ns
            }

            // ✅ CLAVE en 3.8.0
            $writeApi->writeRaw($line, WritePrecision::NS, $this->bucket, $this->org);
        }
    } finally {
        $writeApi->close();
    }
}

private function escapeKey(string $s): string
{
    // Escape para measurement/tag keys/tag values/field keys
    return str_replace(['\\', ' ', ',', '='], ['\\\\', '\ ', '\,', '\='], $s);
}

private function formatFieldValue($v): string
{
    if (is_bool($v)) return $v ? 'true' : 'false';
    if (is_int($v)) return $v . 'i';
    if (is_float($v)) return sprintf('%.15g', $v);

    $sv = str_replace(['\\', '"'], ['\\\\', '\"'], (string)$v);
    return '"' . $sv . '"';
}
    public function query(string $flux): array
    {
        $queryApi = $this->client->createQueryApi();
        $tables = $queryApi->query($flux, $this->org);

        $rows = [];
        foreach ($tables as $table) {
            foreach ($table->records as $record) {
                $rows[] = $record->values;
            }
        }

        return $rows;
    }
}