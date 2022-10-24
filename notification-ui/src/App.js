import { useEffect, useState } from 'react'

import './App.css';

function App() {

  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    fetch('https://' + window.location.host.replace('3000', '3100'), {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    }).then(async(data) => {
      setConditions(await data.json())
    })
  }, [])

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
                  <td><input type="button" value="Excluir" /></td>
                </tr>
              ))}
              <tr>
                <td><input className="textInput" type="text" /></td>
                <td>
                  <select>
                    <option>Preço</option>
                  </select>
                </td>
                <td>
                  <select>
                    <option>Maior que</option>
                  </select>
                </td>
                <td><input className="textInput" type="text" /></td>
                <td>
                  <select>
                    <option>BTCUSDT</option>
                    <option>ETHUSDT</option>
                  </select>
                </td>
                <td><input className="textInput" type="text" /></td>
                <td><input type="button" value="Criar" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
