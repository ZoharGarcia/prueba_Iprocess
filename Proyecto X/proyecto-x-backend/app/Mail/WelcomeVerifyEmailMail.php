<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeVerifyEmailMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $name;
    public string $code;

    public function __construct(string $name, string $code)
    {
        $this->name = $name;
        $this->code = $code;
    }

    public function build()
    {
        return $this
            ->subject('¡Bienvenido a Proyecto X! Verifica tu correo')
            ->markdown('emails.welcome-verify')
            ->with([
                'name' => $this->name,
                'code' => $this->code,
            ]);
    }
}