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
        'status',
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

 /*
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }
*/

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
public function isAdminActive(): bool
{
    // administrativo
    return in_array($this->status, ['active', 'trial'], true);
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
    // compatibilidad: si ya existe status, manda status; si no, usa is_active
    if (!is_null($this->status)) {
        return $this->isAdminActive();
    }

    return (bool) $this->is_active;
}

    /**
     * Verifica si la suscripción es válida (activa y dentro de fecha).
     */
public function isSubscriptionActive(): bool
{
    if (! $this->is_active) return false;
    if (! $this->plan_expires_at) return false;

    $tz = config('app.timezone', 'America/Managua');
    $now = now($tz);

    return $now->lt($this->plan_expires_at->timezone($tz));
}

public function daysLeft(): ?int
{
    if (! $this->plan_expires_at) return null;

    $tz = config('app.timezone', 'America/Managua');
    $now = now($tz);

    // si querés días calendario como tu /me:
    if ($now->gte($this->plan_expires_at->timezone($tz))) return 0;

    return $now->copy()->startOfDay()
        ->diffInDays($this->plan_expires_at->copy()->timezone($tz)->startOfDay(), false);
}


public function isBusiness(): bool
{
    return $this->type === 'business';
}

public function isIndividual(): bool
{
    return $this->type === 'individual';
}


    /**
     * Retorna los días restantes o null si no hay fecha definida.
     * Puede retornar negativo si ya venció.
     */

    public function getSubscriptionStatusAttribute(): string
{
    if (! $this->plan_expires_at) {
        return 'expired';
    }

    $tz = config('app.timezone', 'America/Managua');
    $now = now($tz);

    return $now->lt($this->plan_expires_at->timezone($tz))
        ? 'active'
        : 'expired';
}

public function subscriptionPlan(): BelongsTo
{
    return $this->belongsTo(\App\Models\Plan::class, 'plan_id');
}

}