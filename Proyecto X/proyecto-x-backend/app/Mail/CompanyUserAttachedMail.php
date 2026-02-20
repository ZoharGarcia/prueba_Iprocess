<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class CompanyUserAttachedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $name,
        public string $email,
        public string $role,
        public string $companyName,
        public string $loginUrl,
    ) {}

    public function build()
    {
        return $this->subject("Has sido agregado a {$this->companyName}")
            ->view('emails.company_user_attached');
    }
}