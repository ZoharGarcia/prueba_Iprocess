<?php

namespace App\Services;

use App\Models\Device;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class PlanGate
{
    public function assertCanAddIOLinkMaster(User $user): void
    {
        $company = $user->company;

        if (! $company) {
            throw ValidationException::withMessages([
                'company' => 'El usuario no tiene empresa asignada.',
            ]);
        }

        $plan = $company->subscriptionPlan;

        if (! $plan) {
            throw ValidationException::withMessages([
                'plan' => 'La empresa no tiene plan asignado.',
            ]);
        }

        $max = (int) ($plan->max_devices ?? 0);

        // Si quieres “0 = no permitido”, ok. Si quieres “0 = ilimitado”, cambia lógica.
        if ($max <= 0) {
            throw ValidationException::withMessages([
                'plan' => 'Tu plan no permite conectar dispositivos.',
            ]);
        }

        $count = Device::where('company_id', $company->id)
            ->where('type', 'iolink_master')
            ->count();

        if ($count >= $max) {
            throw ValidationException::withMessages([
                'plan' => "Límite de IO-Link Masters alcanzado ({$max}).",
            ]);
        }
    }
}