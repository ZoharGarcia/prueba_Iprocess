<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();

            $table->foreignId('company_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('type', 30)->default('iolink_master'); // iolink_master|plc|gateway
            $table->string('name', 120);
            $table->string('vendor', 80)->nullable();
            $table->string('model', 80)->nullable();
            $table->string('serial', 80)->nullable();
            $table->string('area', 80)->nullable();

            $table->string('status', 20)->default('offline'); // ok|warning|fault|offline
            $table->timestamp('last_seen_at')->nullable();

            $table->timestamps();

            // Importante: serial nullable + unique compuesto (Postgres permite varios NULL)
            $table->unique(['company_id', 'serial']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};