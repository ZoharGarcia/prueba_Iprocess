<?php

namespace App\Services;

use InfluxDB2\Client;
use InfluxDB2\Model\WritePrecision;
use InfluxDB2\Point;
use RuntimeException;
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

        $url = (string) config('influx.url');
        $token = (string) config('influx.token');
        $timeout = (int) config('influx.timeout', 10);

        if ($url === '') throw new RuntimeException('INFLUX_URL no está configurado.');
        if ($token === '') throw new RuntimeException('INFLUX_TOKEN no está configurado.');
        if ($this->org === '') throw new RuntimeException('INFLUX_ORG no está configurado.');
        if ($this->bucket === '') throw new RuntimeException('INFLUX_BUCKET no está configurado.');

        $this->client = new Client([
            'url' => $url,
            'token' => $token,
            'timeout' => $timeout,

            // ✅ recomendado por docs: defaults en el client
            'org' => $this->org,
            'bucket' => $this->bucket,
            'precision' => WritePrecision::S,

            // ✅ debugging (ponlo en true mientras pruebas)
            'debug' => true,
            // 'logFile' => storage_path('logs/influx.log'), // opcional
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

                // 1) normaliza timestamp a epoch seconds (o null)
                $epoch = null;
                if ($time !== null) {
                    if (is_int($time)) {
                        $epoch = $time; // asume seconds
                    } else {
                        $epoch = strtotime((string) $time) ?: null; // ISO -> seconds
                    }
                }

                // 2) arma Point
                $point = Point::measurement($measurement);

                foreach ($tags as $k => $v) {
                    $point->addTag((string) $k, (string) $v);
                }
                foreach ($fields as $k => $v) {
                    $point->addField((string) $k, $v);
                }

                // 3) si no mandas time, Influx pone “server time” (ideal para test)
                if ($epoch !== null) {
                    $point->time($epoch, WritePrecision::S);
                }

                // ✅ exactamente como la guía: write(point, precision, bucket, org)
                $writeApi->write($point, WritePrecision::S, $this->bucket, $this->org);
            }
        } catch (Throwable $e) {
            // Esto te evita “silencios”
            throw $e;
        } finally {
            $writeApi->close();
        }
    }

    public function query(string $flux): array
    {
        $tables = $this->client->createQueryApi()->query($flux, $this->org);

        $rows = [];
        foreach ($tables as $table) {
            foreach ($table->records as $record) {
                $rows[] = $record->values;
            }
        }
        return $rows;
    }
}