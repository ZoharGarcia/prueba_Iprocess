<?php

namespace App\Models;

// Importa el trait de Sanctum (importante: Laravel\Sanctum, no Passport)
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;  // ← Este es el correcto

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;  // ← Asegúrate de que esté aquí

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Opcional: casts si usas Laravel 9+
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}