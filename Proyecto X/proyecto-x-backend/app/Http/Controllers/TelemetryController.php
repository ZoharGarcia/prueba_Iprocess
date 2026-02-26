<?php

namespace App\Http\Controllers;

use App\Services\InfluxService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class TelemetryController extends Controller
{
    public function store(Request $request, InfluxService $influx)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['error' => 'No autenticado'], 401);

        $data = $request->validate([
            'device_id' => 'required|string|max:80',
            'port' => 'nullable|integer|min:1|max:32',
            'company_id' => 'nullable|integer|min:1',
            'samples' => 'required|array|min:1|max:1000',
            'samples.*.tag' => 'nullable|string|max:120',
            'samples.*.sensor' => 'required|string|max:40',
            'samples.*.value' => 'required|numeric',
            'samples.*.unit' => 'nullable|string|max:12',
            'samples.*.quality' => 'nullable|integer|min:0|max:3',
            'samples.*.ts' => 'nullable|date', // ISO
        ]);

        $companyId = $data['company_id'] ?? ($user->company_id ?? null);

        if (!$companyId) {
            throw ValidationException::withMessages(['company_id' => 'company_id requerido']);
        }

        $points = [];
        foreach ($data['samples'] as $s) {
            $tags = [
                'company_id' => (string)$companyId,
                'device_id'  => (string)$data['device_id'],
                'sensor'     => (string)$s['sensor'],
            ];

            if (!empty($data['port'])) $tags['port'] = (string)$data['port'];
            if (!empty($s['tag'])) $tags['tag'] = (string)$s['tag'];
            if (!empty($s['unit'])) $tags['unit'] = (string)$s['unit'];

            $fields = [
                'value' => (float)$s['value'],
            ];
            if (isset($s['quality'])) $fields['quality'] = (int)$s['quality'];

            $points[] = [
                'measurement' => 'telemetry',
                'tags' => $tags,
                'fields' => $fields,
                'time' => $s['ts'] ?? null,
            ];
        }

        $influx->writeMany($points);

        return response()->json(['ok' => true, 'written' => count($points)], 201);
    }
}