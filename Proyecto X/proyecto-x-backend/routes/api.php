<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Http\Request;
use App\Models\User;

// Rutas públicas
Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);

// Validación de correo (sin login)
Route::post('/check-email', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
    ]);

    return response()->json([
        'exists' => User::where('email', $request->email)->exists(),
    ]);
});

// Rutas protegidas
Route::middleware('auth:sanctum')->get('/email/verify', function () {
    return response()->json(['message' => 'Email verificado']);
})->middleware('verified');

Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard', function () {
    return response()->json(['ok' => true]);
});
