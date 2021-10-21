<?php

namespace App\Http\Controllers\Dinamik;

use App\Http\Controllers\Controller;

class DinamikController extends Controller
{
    public function index()
    {
        return inertia('Dinamik/Index');
    }
}
