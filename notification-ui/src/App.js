import { useEffect, useState } from 'react'

import './App.css';

function App() {
  const [conditions, setConditions] = useState([]);
  const [form, setForm] = useState({});

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
      setConditions(await data.json())
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
              }) => (
                <tr>
                  <td>{id}</td>
                  <td>{type}</td>
                  <td>{condition}</td>
                  <td>{price}</td>
                  <td>{asset}</td>
                  <td>{webhook}</td>
                  <td></td>
                  {/* <td><input type="button"  value="Excluir" /></td> */}
                </tr>
              ))}
              <tr>
                <td><input required className="textInput" onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="ID" type="text" /></td>
                <td>
                  <select required onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Type">
                    <option value="" disabled selected>Selecione o Tipo</option>
                    <option>Preço</option>
                  </select>
                </td>
                <td>
                  <select required  onChange={(e) => setForm({ ...form, condition: e.target.value })} placeholder="Condition">
                    <option value="" disabled selected>Selecione a Condição</option>
                    <option>Maior que</option>
                  </select>
                </td>
                <td><input required  className="textInput" onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Preço" type="text" /></td>
                <td>
                  <select required onChange={(e) => setForm({ ...form, asset: e.target.value })} placeholder="Asset">
                    <option value="" disabled selected>Selecione o ativo</option>
                    <option>BTCUSDT</option>
                    <option>ETHUSDT</option>
                  </select>
                </td>
                <td><input required  className="textInput" onChange={(e) => setForm({ ...form, webhook: e.target.value })} placeholder="Webhook" type="text" /></td>
                <td><input type="button" value="Criar" onClick={() => create()}/></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
