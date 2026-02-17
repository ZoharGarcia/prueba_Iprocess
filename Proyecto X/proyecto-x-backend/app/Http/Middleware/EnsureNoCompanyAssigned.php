<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureNoCompanyAssigned
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->company_id) {
            return response()->json([
                'message' => 'Ya tienes una empresa asignada.'
            ], 403);
        }

        return $next($request);
    }
}