import { useEffect, useState } from "react";
import api from "../services/api";
import "./clientes.css";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    id: "",
    nome: "",
    cpf_cnpj: "",
    email: "",
    telefone: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: ""
  });

  useEffect(() => {
    listarClientes();
  }, []);

  function listarClientes() {
    api.get("/clientes")
      .then((response) => {
        setClientes(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar clientes:", error);
      });
  }

  function formatarCpfCnpj(valor) {
    const numeros = valor.replace(/\D/g, "");

    if (numeros.length <= 11) {
      return numeros
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2")
        .slice(0, 14);
    }

    return numeros
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  }

  function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, "");

    if (numeros.length <= 10) {
      return numeros
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .slice(0, 14);
    }

    return numeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  }

  function formatarCep(valor) {
    const numeros = valor.replace(/\D/g, "");

    return numeros
      .replace(/^(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    let novoValor = value;

    if (name === "cpf_cnpj") {
      novoValor = formatarCpfCnpj(value);
    }

    if (name === "telefone") {
      novoValor = formatarTelefone(value);
    }

    if (name === "cep") {
      novoValor = formatarCep(value);
    }

    setForm({
      ...form,
      [name]: novoValor
    });
  }

  function limparFormulario() {
    setForm({
      id: "",
      nome: "",
      cpf_cnpj: "",
      email: "",
      telefone: "",
      cep: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: ""
    });
  }

  function handleEdit(cliente) {
    setForm({
      id: cliente.id || "",
      nome: cliente.nome || "",
      cpf_cnpj: cliente.cpf_cnpj || "",
      email: cliente.email || "",
      telefone: cliente.telefone || "",
      cep: cliente.cep || "",
      rua: cliente.rua || "",
      numero: cliente.numero || "",
      bairro: cliente.bairro || "",
      cidade: cliente.cidade || "",
      estado: cliente.estado || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function validarFormulario() {
    if (!form.nome.trim()) {
      alert("Informe o nome do cliente.");
      return false;
    }

    if (!form.cpf_cnpj.trim()) {
      alert("Informe o CPF ou CNPJ.");
      return false;
    }

    if (!form.email.trim()) {
      alert("Informe o e-mail.");
      return false;
    }

    if (form.cep && form.cep.replace(/\D/g, "").length !== 8) {
      alert("Informe um CEP válido.");
      return false;
    }

    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const requisicao = form.id
      ? api.put(`/clientes/${form.id}`, form)
      : api.post("/clientes", form);

    requisicao
      .then((response) => {
        alert(response.data.message);
        limparFormulario();
        listarClientes();
      })
      .catch((error) => {
      console.error("Erro ao salvar cliente:", error);

      if (error.response?.data?.errors) {
        const erros = error.response.data.errors;
        const primeiraChave = Object.keys(erros)[0];
        alert(erros[primeiraChave][0]);
        return;
      }

      if (error.response?.data?.message) {
        alert(error.response.data.message);
        return;
      }

      alert("Erro ao salvar cliente.");
    });
  }

  function handleDelete(id) {
    if (!confirm("Deseja realmente excluir este cliente?")) {
      return;
    }

    api.delete(`/clientes/${id}`)
      .then((response) => {
        alert(response.data.message);
        limparFormulario();
        listarClientes();
      })
      .catch((error) => {
        console.error("Erro ao excluir cliente:", error);
        alert("Erro ao excluir cliente.");
      });
  }

  return (
    <div className="page-clientes">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Sistema de Gestão de Clientes</h1>
          <p className="page-subtitle">
            Cadastro, edição e gerenciamento de clientes.
          </p>
        </div>

        <div className="card card-form mb-4">
          <div className="card-body">
            <h4 className="section-title">
              {form.id ? "Editar Cliente" : "Cadastrar Cliente"}
            </h4>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nome</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">CPF/CNPJ</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cpf_cnpj"
                    value={form.cpf_cnpj}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">E-mail</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="cliente@email.com"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Telefone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    placeholder="(34) 99999-9999"
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">CEP</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cep"
                    value={form.cep}
                    onChange={handleChange}
                    placeholder="00000-000"
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Rua</label>
                  <input
                    type="text"
                    className="form-control"
                    name="rua"
                    value={form.rua}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Número</label>
                  <input
                    type="text"
                    className="form-control"
                    name="numero"
                    value={form.numero}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Bairro</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bairro"
                    value={form.bairro}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Cidade</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cidade"
                    value={form.cidade}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Estado</label>
                  <input
                    type="text"
                    className="form-control"
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary-custom">
                {form.id ? "Atualizar Cliente" : "Cadastrar Cliente"}
              </button>

              {form.id && (
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={limparFormulario}
                >
                  Cancelar
                </button>
              )}
            </form>
          </div>
        </div>

        <div className="card table-card">
          <div className="card-body">
            <table className="table table-bordered table-striped mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {clientes.length > 0 ? (
                  clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.id}</td>
                      <td>{cliente.nome}</td>
                      <td>{cliente.email}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            type="button"
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(cliente)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(cliente.id)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clientes;