<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Credenciales inválidas',
            ], 401);
        }

        $user = Auth::user();

        // Bloquea login si el correo no está verificado
        if (is_null($user->email_verified_at)) {
            return response()->json([
                'message'              => 'Debes verificar tu correo electrónico antes de iniciar sesión.',
                'error_code'           => 'email_not_verified',   // ← clave para que frontend lo detecte fácilmente
                'email'                => $user->email,          // ← útil para prellenar en verificación
            ], 403);
        }

        // Opcional: Revoca tokens anteriores (buena práctica para seguridad)
        $user->tokens()->delete();

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'company_id' => $user->company_id,
            ],
        ]);
    }
}