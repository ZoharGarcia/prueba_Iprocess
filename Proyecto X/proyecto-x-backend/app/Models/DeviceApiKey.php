<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DeviceApiKey extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_id',
        'prefix',
        'hash',
        'revoked_at',
    ];

    protected $casts = [
        'revoked_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relaciones
    |--------------------------------------------------------------------------
    */

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function isActive(): bool
    {
        return is_null($this->revoked_at);
    }
}