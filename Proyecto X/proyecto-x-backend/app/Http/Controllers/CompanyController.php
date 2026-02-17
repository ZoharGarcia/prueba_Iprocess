<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use App\Models\Company;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompanyController extends Controller
{
    public function assignPlan(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'company_name' => 'nullable|string|max:255'
        ]);

        $user = $request->user();

        // 🔐 Si ya tiene empresa no permitir cambiar aquí
        if ($user->company_id) {
            return response()->json([
                'message' => 'Ya tiene un plan asignado.'
            ], 400);
        }

        $plan = Plan::findOrFail($request->plan_id);

        DB::beginTransaction();

        try {

            // 🏢 Determinar nombre empresa
            $companyName = $plan->type === 'business'
                ? $request->company_name
                : $user->name;

            if ($plan->type === 'business' && !$companyName) {
                return response()->json([
                    'message' => 'Debe proporcionar nombre de empresa.'
                ], 422);
            }

            // Crear empresa
            $company = Company::create([
                'name'      => $companyName,
                'slug'      => Str::slug($companyName) . '-' . uniqid(),
                'type'      => $plan->type,
                'plan_id'   => $plan->id,
                'plan'      => $plan->name, // o $plan->type según tu estructura
                'is_active' => true,
            ]);

            // Asignar empresa al usuario
            $user->update([
                'company_id' => $company->id,
                'role'       => 'owner'
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Plan asignado correctamente.',
                'company' => $company
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Error al asignar plan.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
