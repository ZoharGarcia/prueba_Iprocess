<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PruebaCorreo extends Mailable
{
    use Queueable, SerializesModels;

    public string $nombre;
    public string $mensaje;

    /**
     * Create a new message instance.
     */
    public function __construct(string $nombre, string $mensaje)
    {
        $this->nombre = $nombre;
        $this->mensaje = $mensaje;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Correo de Prueba desde Laravel 🚀',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.prueba',
            with: [
                'nombre' => $this->nombre,
                'mensaje' => $this->mensaje,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
