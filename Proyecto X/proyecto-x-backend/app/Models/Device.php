<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Device extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'type',
        'name',
        'vendor',
        'model',
        'serial',
        'area',
        'status',
        'last_seen_at',
    ];

    protected $casts = [
        'last_seen_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relaciones
    |--------------------------------------------------------------------------
    */

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function apiKeys()
    {
        return $this->hasMany(DeviceApiKey::class);
    }
}