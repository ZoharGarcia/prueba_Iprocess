<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Usa string en vez de ::class para evitar el warning de Intelephense
Route::post('/login', 'App\Http\Controllers\Auth\LoginController@login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});