<?php


namespace App\Http\Controllers;

use App\Models\SystemStatus;
use Illuminate\Http\Request;

class SystemStatusController extends Controller
{
    // Obtener estado actual
    public function show()
{
    $status = \App\Models\SystemStatus::find(1);

    if (!$status) {
        $status = \App\Models\SystemStatus::create([
            'id' => 1,
            'is_active' => true
        ]);
    }

    return response()->json([
        'ok' => true,
        'is_active' => (bool) $status->is_active,
        'checked_at' => now()->toISOString(),
    ]);
}

    // Cambiar estado (toggle)
    public function toggle()
    {
        $status = SystemStatus::first();

        if (!$status) {
            $status = SystemStatus::create(['is_active' => true]);
        }

        $status->is_active = !$status->is_active;
        $status->save();

        return response()->json([
            'message' => 'Estado actualizado correctamente',
            'is_active' => $status->is_active
        ]);
    }
}