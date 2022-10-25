import { useEffect, useState } from 'react'

import './App.css';

function App() {
  const [conditions, setConditions] = useState([]);
  const [form, setForm] = useState({});
  const [logsData, setLogs] = useState({ id: "", data:[], total: '10'});

  useEffect(() => {
    readAll()
  }, [])

  function readAll(){
    fetch('https://' + window.location.host.replace('3000', '3100'), {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    }).then(async(data) => {
      let conditionsData = await data.json();
      setConditions(conditionsData)
      setLogs({ id: "", data:[], total: '10'})
    })
  }

  function create(){
    fetch('https://' + window.location.host.replace('3000', '3100'), {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(form)
    }).then(async(data) => {
      alert('Criado')
      readAll()
    })
  }

  return (
    <div className="app">
      <header className="header">
        Notification UI
      </header>
      <div className="content">
        <div className="card">
          <input type="button" onClick={() => readAll()} value="Atualizar" />
          <table className="table">
            <tbody>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Condição</th>
                <th>Preço</th>
                <th>Ativo</th>
                <th>Webhook</th>
                <th>Ação</th>
              </tr>
              {conditions.map(({
                id,
                type,
                condition,
                price,
                asset,
                webhook,
                logs
              }, index) => (
                <tr>
                  <td>{id}</td>
                  <td>{type}</td>
                  <td>{condition}</td>
                  <td>{price}</td>
                  <td>{asset}</td>
                  <td>{webhook}</td>
                  <td><input type="button"  value="Ver logs" onClick={() => {setLogs({ ...logsData, index, total: 10, id, data: logs })}} /></td>
                </tr>
              ))}
              <tr>
                <td><input required className="textInput" onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="ID" type="text" /></td>
                <td>
                  <select required onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Type">
                    <option value="" disabled selected>Selecione o Tipo</option>
                    <option value="price">Preço</option>
                  </select>
                </td>
                <td>
                  <select required  onChange={(e) => setForm({ ...form, condition: e.target.value })} placeholder="Condition">
                    <option value="" disabled selected>Selecione a Condição</option>
                    <option value="Upper than">Maior que</option>
                  </select>
                </td>
                <td><input required  className="textInput" onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Preço" type="text" /></td>
                <td>
                  <select required onChange={(e) => setForm({ ...form, asset: e.target.value })} placeholder="Asset">
                    <option value="" disabled selected>Selecione o ativo</option>
                    <option value="BTCUSDT">BTCUSDT</option>
                    <option value="ETHUSDT">ETHUSDT</option>
                  </select>
                </td>
                <td><input required  className="textInput" onChange={(e) => setForm({ ...form, webhook: e.target.value })} placeholder="Webhook" type="text" /></td>
                <td><input type="button" value="Criar / Modificar" onClick={() => create()}/></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="card">
                <b>{logsData.id || "Não definido"}</b>
                <ul>{logsData.data.length > 0 ? (
                  <>
                    Máximo de logs: <input type="text" value={logsData.total} onChange={(e) => setLogs({...logsData, total: e.target.value })}/>
                    {([...logsData.data].reverse()).slice(0, Number(logsData.total)).map(data => ( 
                      <li>{JSON.stringify(data)}</li> ))}
                  </>
                  ) : (<li>Sem dados disponíveis</li>)}
                </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
