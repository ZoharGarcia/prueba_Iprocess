<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeVerifyEmailMail;
use Carbon\Carbon;
use Exception;

class VerifyEmailController extends Controller
{
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'code'  => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'No encontramos una cuenta con ese correo'], 404);
        }

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Este correo ya está verificado'], 422);
        }

        if ($user->verification_code !== $request->code) {
            return response()->json(['message' => 'El código ingresado es incorrecto'], 422);
        }

        if (Carbon::now()->gt($user->verification_code_expires_at)) {
            return response()->json(['message' => 'El código ha expirado. Solicita uno nuevo'], 422);
        }

        $user->email_verified_at = Carbon::now();
        $user->verification_code = null;
        $user->verification_code_expires_at = null;
        $user->save();

        return response()->json(['message' => 'Correo verificado correctamente']);
    }

    public function resend(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'No encontramos una cuenta registrada con ese correo electrónico'
            ], 404);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Este correo ya está verificado. Puedes iniciar sesión directamente.'
            ], 422);
        }

        try {
            // Generar nuevo código
            $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            $user->verification_code = $code;
            $user->verification_code_expires_at = Carbon::now()->addMinutes(15);
            $user->save();

            // Enviar email
            Mail::to($user->email)->queue(new WelcomeVerifyEmailMail($user->name, $code));

            return response()->json([
                'message' => 'Código reenviado correctamente. Revisa tu bandeja de entrada y spam.'
            ]);
        } catch (Exception $e) {
            \Log::error('Error al reenviar código de verificación: ' . $e->getMessage());

            return response()->json([
                'message' => 'No pudimos enviar el código en este momento. Intenta de nuevo más tarde.'
            ], 500);
        }
    }
}