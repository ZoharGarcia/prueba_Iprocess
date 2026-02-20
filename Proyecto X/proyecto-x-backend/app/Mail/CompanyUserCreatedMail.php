<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CompanyUserCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public string $role,
        public string $companyName,
        public string $loginUrl,
    ) {}

    public function build()
    {
        return $this->subject("Acceso a tu cuenta - {$this->companyName}")
            ->view('emails.company_user_created');
    }
}