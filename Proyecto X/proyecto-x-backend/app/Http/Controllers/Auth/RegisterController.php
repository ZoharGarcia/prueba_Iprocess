<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeVerifyEmailMail; // ← Tu Mailable de bienvenida + código
use Carbon\Carbon;

class RegisterController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'     => ['required', 'string', 'min:2', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'], // ← Añadido 'confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // Generar código de verificación de 6 dígitos
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user = User::create([
            'name'                          => $request->name,
            'email'                         => $request->email,
            'password'                      => Hash::make($request->password),
            'email_verified_at'             => null, // No verificado aún
            'verification_code'             => $code,
            'verification_code_expires_at'  => Carbon::now()->addMinutes(15),
            'company_id'                    => null,
        ]);

        // Enviar correo de bienvenida + código de verificación
        Mail::to($user->email)->send(new WelcomeVerifyEmailMail($user->name, $code));

        return response()->json([
            'message' => 'Registro exitoso. Revisa tu correo para verificar tu cuenta.',
            'user'    => $user->only(['id', 'name', 'email']),
        ], 201);
    }
}