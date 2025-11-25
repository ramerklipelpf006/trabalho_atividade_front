import {useState, useEffect} from 'react';
import Alerta from '../components/alerta';

const Atividade = () => {
    const [listaObj, setListaObj] = useState([]);
    const [alerta, setAlerta] = useState({status: "", message: ""});
    const [editar, setEditar] = useState(false);
    const [objeto, setObjeto] = useState({
        "idatividade": "", "nmatividade": "", "dsatividade": "", "flativo": "", "daatividade": ""
    });

    const novoObjeto = () => {
        setEditar(false);
        setAlerta({status: "", message: ""});
        setObjeto({
            "idatividade": 0,
            "nmatividade": "",
            "dsatividade": "",
            "flativo": "",
            "daatividade": new Date().toISOString().slice(0, 10)
       });
    }

    const editaObjeto = async codigo => {
        setEditar(true);
        setAlerta({status:"", message: ""});

        await fetch(`${process.env.REACT_APP_ENDERECO_API}/atividade/${codigo.idatividade}`)
            .then(response => response.json())
            .then(data => {setObjeto(data.objeto)})
            .catch(error => console.log(error));
    }

    const acaoCadastrar = async e => {
        e.preventDefault();
        const metodo = editar ? "PUT" : "POST";

        try {
            await fetch(`${process.env.REACT_APP_ENDERECO_API}/atividade`, {
                method: metodo,
                headers: {"Content-Type": "application/JSON"},
                body: JSON.stringify(objeto)
            }).then(response => response.json())
              .then( json => {
                setAlerta({status: json.status, message: json.message});
                setObjeto(json.objeto);

                if (!editar) {
                    setEditar(true)
                }
              })
        } catch (error) {
            console.log("Erro: " + error)
        }
        recuperaatividades();
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setObjeto({...objeto, [name]: value});
    }

    const Remover = async objeto => {
        if (window.confirm("Deseja remover este atividade?")) {
            try {
                await fetch (`${process.env.REACT_APP_ENDERECO_API}/atividade/${objeto.idatividade}`, 
                {
                    method: "delete"
                }).then(response => response.json())
                  .then(json => setAlerta({status: json.status, message: json.message}))

                  recuperaatividades();
            } catch (error) {
                console.log("Erro: " + error)
            }
        }
    }

    const recuperaatividades = async () => {
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/atividade`).then(Response => Response.json())
                                            .then(data => setListaObj(data.data))
                                            .catch(err => console.log('Erro: ' + err))
    };

    useEffect(() => {
        recuperaatividades();
    }, []);

    return (
        <>
            <div style={{padding: "100px"}}>
            <button type="button" className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#modalEdicao" onClick={() => novoObjeto()}>
                Novo <i className='bi bi-plus-square'></i>
            </button>
            <h1>Atividades</h1>
            <Alerta alerta={alerta} />
            {listaObj.length == 0 && <h1>Nenhum produto</h1>}
            {listaObj.length > 0 && (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Cod.</th>
                                    <th scope="col">atividade</th>
                                    <th scope="col">Descrição</th>
                                    <th scope="col">Ativo</th>
                                    <th scope="col">Ações</th>
                                    <th style={{width:"100px"}} scope="col">Data de Cadastro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaObj.map(obj => (
                                    <tr key={obj.idatividade}>
                                        <th scope="row">{obj.idatividade}</th>
                                        <td>{obj.nmatividade}</td>
                                        <td>{obj.dsatividade}</td>
                                        <td>{obj.flativo}</td>
                                        <td>{obj.daatividade}</td>
                                        <td>
                                            <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalEdicao" onClick={() => editaObjeto(obj)}><i className="bi bi-pencil-square"></i></button>
                                            <button type="button" className="btn btn-danger" onClick={() => Remover(obj)}><i className="bi bi-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="modal fade" id="modalEdicao" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Atividade</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form id="formulario" onSubmit={acaoCadastrar}>
                                        <div className="modal-body">
                                            <Alerta alerta={alerta} />
                                            <div className="form-group">
                                                <label htmlFor="txtCodigo" className="form-label">
                                                    Código
                                                </label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    className="form-control"
                                                    id="txtCodigo"
                                                    name="idatividade"
                                                    value={objeto.idatividade}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="txtNome" className="form-label">
                                                    Nome
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="txtNome"
                                                    name="nmatividade"
                                                    value={objeto.nmatividade}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="txtDescricao" className="form-label">
                                                    Descrição
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="txtDescricao"
                                                    name="dsatividade"
                                                    value={objeto.dsatividade}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div> 
                                            <div className="form-group">
                                                <label htmlFor="txtAtivo" className="form-label">
                                                    Ativo (S ou N)
                                                </label>
                                                <select 
                                                    className="form-select" 
                                                    aria-label="Default select example"
                                                    name="flativo"
                                                    value={objeto.flativo}
                                                    onChange={handleChange}
                                                >
                                                    <option selected>Selecione: </option>
                                                    <option value="S">Sim</option>
                                                    <option value="N">Não</option>
                                                </select>
                                            </div>  
                                            <div className="form-group">
                                                <label htmlFor="txtDataCadastro" className="form-label">
                                                    Data de cadastro
                                                </label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="txtDataCadastro"
                                                    name="daatividade"
                                                    value={objeto.daatividade}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>                                                                                                           
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                            <button type="submit" className="btn btn-success">
                                                Salvar  <i className="bi bi-save"></i>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Atividade;