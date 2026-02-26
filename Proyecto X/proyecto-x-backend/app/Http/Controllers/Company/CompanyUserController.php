<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Mail\CompanyUserAttachedMail;
use App\Mail\CompanyUserCreatedMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class CompanyUserController extends Controller
{
    public function attachExisting(Request $request)
    {
        $authUser = Auth::user();
        $company  = $authUser?->company;

        if (! $company) {
            return response()->json(['error' => 'Empresa no asignada.'], 403);
        }

        if (! in_array($company->status, ['active', 'trial'], true)) {
            return response()->json(['error' => 'Cuenta suspendida.'], 403);
        }

        if (! in_array($authUser->role, ['owner', 'admin'], true)) {
            return response()->json(['error' => 'No tiene permisos.'], 403);
        }

        if ($company->type === 'individual') {
            return response()->json(['error' => 'El plan individual no permite múltiples usuarios.'], 403);
        }

        // ✅ Plan (usa la misma relación que tu middleware)
      //  $plan = $company->plan;
        $plan = $company->subscriptionPlan;

        if (! $plan) {
            return response()->json(['error' => 'Plan no asignado a la empresa.'], 422);
        }

        $currentUsers = User::where('company_id', $company->id)->count();

        if ($currentUsers >= (int) $plan->max_users) {
            return response()->json(['error' => 'Límite de usuarios alcanzado para su plan.'], 403);
        }

        $validated = $request->validate([
            'email' => ['required', 'email'],
            'role'  => ['required', Rule::in(['user', 'admin'])],
            // opcional: si ya está en tu empresa, igual enviar correo
            'send_email_if_already_member' => ['nullable', 'boolean'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            return response()->json(['error' => 'No existe un usuario con ese correo.'], 404);
        }

        if ($user->company_id && $user->company_id !== $company->id) {
            return response()->json(['error' => 'Este usuario ya pertenece a otra empresa.'], 409);
        }

        $emailSent = false;

        // ✅ Si ya estaba en tu empresa
        if ($user->company_id === $company->id) {

            $sendIfAlready = (bool) ($validated['send_email_if_already_member'] ?? false);

            if ($sendIfAlready) {
                $emailSent = $this->sendAttachedEmail($user, $company);
            }

            return response()->json([
                'message' => 'El usuario ya pertenece a tu empresa.',
                'user' => $user->only(['id', 'name', 'email', 'role', 'company_id']),
                'email_sent' => $emailSent,
            ], 200);
        }

        // ✅ Adjuntar a empresa
        $user->company_id = $company->id;
        $user->role = $validated['role'];
        $user->save();

        // ✅ Enviar correo
        $emailSent = $this->sendAttachedEmail($user, $company);

        return response()->json([
            'message' => 'Usuario agregado al plan correctamente.',
            'user' => $user->only(['id', 'name', 'email', 'role', 'company_id']),
            'email_sent' => $emailSent,
        ], 200);
    }

    public function store(Request $request)
    {
        $authUser = Auth::user();
        $company  = $authUser?->company;

        if (! $company) {
            return response()->json(['error' => 'Empresa no asignada.'], 403);
        }

        if (! in_array($company->status, ['active', 'trial'], true)) {
            return response()->json(['error' => 'Cuenta suspendida. Contacte administración.'], 403);
        }

        if (! in_array($authUser->role, ['owner', 'admin'], true)) {
            return response()->json(['error' => 'No tiene permisos para crear usuarios.'], 403);
        }

        if ($company->type === 'individual') {
            return response()->json(['error' => 'El plan individual no permite múltiples usuarios.'], 403);
        }

$plan = $company->subscriptionPlan;

if (! $plan) {
  return response()->json(['error' => 'Plan no asignado a la empresa.'], 422);
}

$currentUsers = User::where('company_id', $company->id)->count();

if ($currentUsers >= (int) $plan->max_users) {
  return response()->json(['error' => 'Límite de usuarios alcanzado para su plan.'], 403);
}

        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|string|min:6',
            'role'       => ['required', Rule::in(['user', 'admin'])],
            'send_email' => 'nullable|boolean',
        ]);

        $rawPassword = $validated['password'];

        $user = User::create([
            'name'       => $validated['name'],
            'email'      => $validated['email'],
            'password'   => Hash::make($validated['password']),
            'role'       => $validated['role'],
            'company_id' => $company->id,
        ]);

        $sendEmail = (bool) ($validated['send_email'] ?? true);
        $emailSent = false;

        if ($sendEmail) {
            $emailSent = $this->sendCreatedEmail($user, $company, $rawPassword);
        }

        return response()->json([
            'message'    => 'Usuario creado correctamente.',
            'user'       => $user->only(['id', 'name', 'email', 'role', 'company_id', 'created_at']),
            'email_sent' => $emailSent,
        ], 201);
    }

    public function index()
    {
        $authUser = Auth::user();
        $company  = $authUser?->company;

        if (! $company) {
            return response()->json(['error' => 'Empresa no asignada.'], 403);
        }

        if (! in_array($company->status, ['active', 'trial'], true)) {
            return response()->json(['error' => 'Cuenta suspendida.'], 403);
        }

        $users = User::where('company_id', $company->id)
            ->select('id', 'name', 'email', 'role', 'created_at')
            ->paginate(10);

        return response()->json($users);
    }

    private function frontendLoginUrl(): string
    {
        return rtrim(
            config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173')),
            '/'
        ) . '/login';
    }

    private function sendAttachedEmail(User $user, $company): bool
    {
        try {
            Mail::to($user->email)->send(new CompanyUserAttachedMail(
                name: $user->name,
                email: $user->email,
                role: $user->role,
                companyName: $company->name ?? 'Tu empresa',
                loginUrl: $this->frontendLoginUrl(),
            ));
            return true;
        } catch (\Throwable $e) {
            \Log::error('CompanyUserAttachedMail failed', [
                'to' => $user->email,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    private function sendCreatedEmail(User $user, $company, string $rawPassword): bool
    {
        try {
            Mail::to($user->email)->send(new CompanyUserCreatedMail(
                name: $user->name,
                email: $user->email,
                password: $rawPassword,
                role: $user->role,
                companyName: $company->name ?? 'Tu empresa',
                loginUrl: $this->frontendLoginUrl(),
            ));
            return true;
        } catch (\Throwable $e) {
            \Log::error('CompanyUserCreatedMail failed', [
                'to' => $user->email,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }
}