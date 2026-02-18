<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Company;

class DeactivateExpiredCompanies extends Command
{
    protected $signature = 'companies:deactivate-expired';
    protected $description = 'Desactiva companies cuyo plan expiró';

    public function handle(): int
    {
        $count = Company::query()
            ->where('is_active', true)
            ->whereNotNull('plan_expires_at')
            ->where('plan_expires_at', '<=', now())
            ->update(['is_active' => false]);

        $this->info("Empresas desactivadas: {$count}");
        return self::SUCCESS;
    }
}
