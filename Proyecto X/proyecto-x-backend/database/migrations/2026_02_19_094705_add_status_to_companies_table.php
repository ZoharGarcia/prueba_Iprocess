<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->enum('status', ['trial', 'active', 'suspended'])
                  ->default('active')
                  ->after('type');

            $table->index('status');
        });

        // 🔹 Migrar estado existente basado en is_active
        DB::table('companies')
            ->where('is_active', 0)
            ->update(['status' => 'suspended']);

        DB::table('companies')
            ->where('is_active', 1)
            ->update(['status' => 'active']);
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropColumn('status');
        });
    }
};
