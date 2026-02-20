<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureCompanyIsActive
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        $company = $user?->company;

        if (! $company) {
            return response()->json(['error' => 'Empresa no asignada'], 403);
        }

        // administrativo
        if (! in_array($company->status, ['active', 'trial'], true)) {
            return response()->json(['error' => 'Cuenta suspendida'], 403);
        }

        return $next($request);
    }
}