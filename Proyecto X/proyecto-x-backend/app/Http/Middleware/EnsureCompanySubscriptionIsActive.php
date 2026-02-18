<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureCompanySubscriptionIsActive
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        $company = $user?->company;

        if (!$company) {
            return response()->json(['message' => 'No tienes empresa asignada.'], 403);
        }

        if (!$company->isSubscriptionActive()) {
            return response()->json([
                'message' => 'Tu plan ha expirado.',
                'expired_at' => optional($company->plan_expires_at)->toDateTimeString(),
            ], 402); // 402 Payment Required (común para suscripciones)
        }

        return $next($request);
    }
}
