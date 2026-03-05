<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('device_api_keys', function (Blueprint $table) {
            $table->id();

            $table->foreignId('device_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('prefix', 12)->index();
            $table->string('hash', 64); // sha256 hex = 64 chars
            $table->timestamp('revoked_at')->nullable();

            $table->timestamps();

            // opcional: evitar prefix duplicado (depende tu generación)
            $table->unique(['prefix']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('device_api_keys');
    }
};