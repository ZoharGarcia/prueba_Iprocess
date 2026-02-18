<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Company;
use App\Models\Plan;

class CompanyController extends Controller
{
    public function assignPlan(Request $request)
{
    $request->validate([
        'plan_id'      => 'required|exists:plans,id',
        'company_name' => 'nullable|string|max:255',
    ]);

    // Cargamos la relación company para optimizar
    $user = $request->user()->load('company');
    $plan = Plan::findOrFail($request->plan_id);

    // ✅ Configuración de Fechas (Timezone Managua)
    $tz = config('app.timezone', 'America/Managua');
    $now = Carbon::now($tz);
    
    // Expira al final del día del mes siguiente
    $expires = $now->copy()->addMonth()->endOfDay();

    DB::beginTransaction();

    try {
        // CASO 1: Usuario NUEVO (No tiene empresa) -> CREAR
        if (! $user->company) {
            
            // Determinar nombre: Si es business usa el input, si no, usa el nombre del usuario
            $companyName = $plan->type === 'business' 
                ? $request->company_name 
                : $user->name;

            // Validación estricta solo para creación
            if ($plan->type === 'business' && ! $companyName) {
                return response()->json(['message' => 'Debe proporcionar nombre de empresa para planes de negocio.'], 422);
            }

            $company = Company::create([
                'name'            => $companyName,
                'slug'            => Str::slug($companyName) . '-' . uniqid(),
                'type'            => $plan->type,
                'plan_id'         => $plan->id,
                'plan'            => $plan->name,
                'is_active'       => true,
                'plan_started_at' => $now,
                'plan_expires_at' => $expires,
            ]);

            // Asignar empresa al usuario como dueño
            $user->update([
                'company_id' => $company->id,
                'role'       => 'owner',
            ]);

            $message = 'Empresa creada y plan asignado correctamente.';
        } 
        // CASO 2: Usuario EXISTENTE (Ya tiene empresa) -> ACTUALIZAR / REACTIVAR
        else {
            $company = $user->company;

            // Opcional: Actualizar nombre si envía uno nuevo y es plan business
            if ($plan->type === 'business' && $request->company_name) {
                $company->name = $request->company_name;
                // Nota: Usualmente no cambiamos el slug para no romper enlaces SEO, 
                // pero si lo necesitas, descomenta la siguiente línea:
                // $company->slug = Str::slug($request->company_name) . '-' . uniqid();
            }

            // Actualizar datos del plan
            $company->plan_id = $plan->id;
            $company->plan    = $plan->name;
            $company->type    = $plan->type;

            // Reactivar suscripción
            $company->is_active       = true;
            $company->plan_started_at = $now;
            $company->plan_expires_at = $expires;

            $company->save();

            $message = 'Plan actualizado y reactivado correctamente.';
        }

        DB::commit();

        return response()->json([
            'message' => $message,
            'company' => $company,
        ]);

    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'message' => 'Error al procesar la asignación del plan.',
            'error'   => $e->getMessage(),
        ], 500);
    }
}
public function activatePlan(Request $request)
{
    $request->validate([
        'plan_id' => 'required|exists:plans,id',
        'company_name' => 'nullable|string|max:255',
    ]);

    $user = $request->user()->load('company');
    $plan = Plan::findOrFail($request->plan_id);

    $tz = config('app.timezone', 'America/Managua');
    $now = Carbon::now($tz);

    DB::beginTransaction();

    try {
        // 1) Si NO tiene company, creamos
        if (! $user->company) {
            $companyName = $plan->type === 'business'
                ? $request->company_name
                : $user->name;

            if ($plan->type === 'business' && ! $companyName) {
                return response()->json(['message' => 'Debe proporcionar nombre de empresa.'], 422);
            }

            $company = Company::create([
                'name'            => $companyName,
                'slug'            => Str::slug($companyName) . '-' . uniqid(),
                'type'            => $plan->type,
                'plan_id'         => $plan->id,
                'plan'            => $plan->name,
                'is_active'       => true,
                'plan_started_at' => $now,
                'plan_expires_at' => $now->copy()->addMonth()->endOfDay(),
            ]);

            $user->update([
                'company_id' => $company->id,
                'role'       => 'owner',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Plan activado.',
                'company' => $company,
            ]);
        }

        // 2) Si YA tiene company, reactivamos/cambiamos plan
        $company = $user->company;

        // Si el plan es business y mandan nombre, lo actualizamos (opcional)
        if ($plan->type === 'business' && $request->company_name) {
            $company->name = $request->company_name;
        }

        $company->plan_id         = $plan->id;
        $company->plan            = $plan->name;
        $company->type            = $plan->type;
        $company->is_active       = true;
        $company->plan_started_at = $now;
        $company->plan_expires_at = $now->copy()->addMonth()->endOfDay();

        $company->save();

        DB::commit();

        return response()->json([
            'message' => 'Plan reactivado/actualizado.',
            'company' => $company,
        ]);
    } catch (\Throwable $e) {
        DB::rollBack();

        return response()->json([
            'message' => 'Error al activar plan.',
            'error'   => $e->getMessage(),
        ], 500);
    }
}

}
