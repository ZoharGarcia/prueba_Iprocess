<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    /**
     * Los atributos que son asignables en masa.
     */
    protected $fillable = [
        'name',
        'type',
        'slug',
        'plan',            // Nota: Cuidado con conflictos de nombre con la relación 'plan()'
        'plan_id',
        'is_active',
        'plan_started_at', // Agregado del segundo código
        'plan_expires_at', // Agregado del segundo código
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     */
    protected $casts = [
        'is_active' => 'boolean',
        'plan_started_at' => 'datetime',
        'plan_expires_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relaciones
    |--------------------------------------------------------------------------
    */

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function devices(): HasMany
    {
        return $this->hasMany(Device::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers SaaS & Lógica de Negocio
    |--------------------------------------------------------------------------
    */

    /**
     * Verifica si la compañía está marcada como activa (flag simple).
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Verifica si la suscripción es válida (activa y dentro de fecha).
     */
    public function isSubscriptionActive(): bool
    {
        // 1. Debe estar activa manualmente
        if (! $this->is_active) {
            return false;
        }

        // 2. Debe tener fecha de expiración
        if (! $this->plan_expires_at) {
            return false;
        }

        // 3. La fecha actual debe ser menor que la de expiración
        return now()->lt($this->plan_expires_at);
    }

    public function isBusiness(): bool
    {
        return $this->plan === 'business';
    }

    public function isIndividual(): bool
    {
        return $this->plan === 'individual';
    }

    /**
     * Retorna los días restantes o null si no hay fecha definida.
     * Puede retornar negativo si ya venció.
     */
    public function daysLeft(): ?int
    {
        if (! $this->plan_expires_at) {
            return null;
        }

        // 'false' como 2do argumento para no obtener valor absoluto (permite negativos)
        return now()->diffInDays($this->plan_expires_at, false);
    }
}