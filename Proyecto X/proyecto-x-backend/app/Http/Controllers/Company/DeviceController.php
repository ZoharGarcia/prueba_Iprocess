<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\DeviceApiKey;
use App\Services\PlanGate;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DeviceController extends Controller
{
    /**
     * Listar dispositivos de la empresa del usuario autenticado
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $devices = Device::where('company_id', $user->company_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['devices' => $devices]);
    }

    /**
     * Crear nuevo dispositivo (IO-Link Master) con límite por plan + token de ingestión
     */
    public function store(Request $request, PlanGate $gate)
    {
        $user = $request->user();

        // ✅ Chequeo por plan (por empresa / plan_id en companies)
        $gate->assertCanAddIOLinkMaster($user);

        $data = $request->validate([
            'name'   => 'required|string|max:120',
            'area'   => 'nullable|string|max:80',
            'vendor' => 'nullable|string|max:80',
            'model'  => 'nullable|string|max:80',
            'serial' => 'nullable|string|max:80',
        ]);

        $device = Device::create([
            'company_id' => $user->company_id,
            'type'       => 'iolink_master',
            'name'       => $data['name'],
            'area'       => $data['area'] ?? null,
            'vendor'     => $data['vendor'] ?? null,
            'model'      => $data['model'] ?? null,
            'serial'     => $data['serial'] ?? null,
            'status'     => 'offline',
        ]);

        // ✅ Token para ingestion (se muestra 1 sola vez)
        $plain  = Str::random(48);
        $prefix = substr($plain, 0, 12);

        DeviceApiKey::create([
            'device_id' => $device->id,
            'prefix'    => $prefix,
            'hash'      => hash('sha256', $plain),
        ]);

        return response()->json([
            'message'     => 'Dispositivo creado correctamente',
            'device'      => $device,
            'ingest_token' => $prefix . '.' . $plain,
        ], 201);
    }
}