<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = [
        'name',
        'type',
        'slug',
        'plan_id',
        'is_active',
        'plan_started_at',
        'plan_expires_at',
        'status',
    ];

    protected $casts = [
        'is_active'       => 'boolean',
        'plan_started_at' => 'datetime',
        'plan_expires_at' => 'datetime',
    ];

    // =========================
    // Relaciones
    // =========================

    public function subscriptionPlan(): BelongsTo
    {
        return $this->belongsTo(Plan::class, 'plan_id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function devices(): HasMany
    {
        return $this->hasMany(Device::class);
    }

    // =========================
    // Helpers / Lógica negocio
    // =========================

    public function isAdminActive(): bool
    {
        return in_array($this->status, ['active', 'trial'], true);
    }

    public function isActive(): bool
    {
        // Si usas status, manda status; si no, usa is_active
        if (! is_null($this->status)) {
            return $this->isAdminActive();
        }

        return (bool) $this->is_active;
    }

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

    public function getSubscriptionStatusAttribute(): string
    {
        if (! $this->plan_expires_at) return 'expired';

        $tz = config('app.timezone', 'America/Managua');
        $now = now($tz);

        return $now->lt($this->plan_expires_at->timezone($tz))
            ? 'active'
            : 'expired';
    }
}