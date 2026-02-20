<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class CheckUserLimit
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        $company = $user?->company;

        if (! $company) {
            return response()->json(['error' => 'Empresa no asignada'], 403);
        }

        // ✅ Usa la relación correcta (evita conflicto con columna companies.plan)
        $plan = $company->subscriptionPlan;

        if (! $plan) {
            return response()->json(['error' => 'Plan no asignado a la empresa'], 422);
        }

        $currentUsers = User::where('company_id', $company->id)->count();

        if ($currentUsers >= (int) $plan->max_users) {
            return response()->json([
                'error' => 'Límite de usuarios alcanzado para su plan.'
            ], 403);
        }

        return $next($request);
    }
}