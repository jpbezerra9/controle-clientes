<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index()
    {
        return response()->json(Cliente::orderBy('id', 'desc')->get());
    }

    public function show($id)
    {
        $cliente = Cliente::find($id);

        if (!$cliente) {
            return response()->json([
                'message' => 'Cliente não encontrado.'
            ], 404);
        }

        return response()->json($cliente);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'cpf_cnpj' => 'required|string|max:20|unique:clientes,cpf_cnpj',
            'email' => 'required|email|max:255|unique:clientes,email',
            'telefone' => 'nullable|string|max:20',
            'cep' => 'nullable|string|max:20',
            'rua' => 'nullable|string|max:255',
            'numero' => 'nullable|string|max:20',
            'bairro' => 'nullable|string|max:255',
            'cidade' => 'nullable|string|max:255',
            'estado' => 'nullable|string|max:100',
        ]);

        $cliente = Cliente::create($validated);

        return response()->json([
            'message' => 'Cliente cadastrado com sucesso!',
            'data' => $cliente
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $cliente = Cliente::find($id);

        if (!$cliente) {
            return response()->json([
                'message' => 'Cliente não encontrado.'
            ], 404);
        }

        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'cpf_cnpj' => 'required|string|max:20|unique:clientes,cpf_cnpj,' . $id,
            'email' => 'required|email|max:255|unique:clientes,email,' . $id,
            'telefone' => 'nullable|string|max:20',
            'cep' => 'nullable|string|max:20',
            'rua' => 'nullable|string|max:255',
            'numero' => 'nullable|string|max:20',
            'bairro' => 'nullable|string|max:255',
            'cidade' => 'nullable|string|max:255',
            'estado' => 'nullable|string|max:100',
        ]);

        $cliente->update($validated);

        return response()->json([
            'message' => 'Cliente atualizado com sucesso!',
            'data' => $cliente
        ]);
    }

    public function destroy($id)
    {
        $cliente = Cliente::find($id);

        if (!$cliente) {
            return response()->json([
                'message' => 'Cliente não encontrado.'
            ], 404);
        }

        $cliente->delete();

        return response()->json([
            'message' => 'Cliente excluído com sucesso!'
        ]);
    }
}