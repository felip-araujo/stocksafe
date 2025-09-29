import { useEffect, useState } from "react";
import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export function CompaniesList() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    api.get('companies')
      .then(res => {
        setCompanies(res.data);
      })
      .catch(err => {
        console.error("Erro ao buscar empresas:", err);
      });
  }, []);

  return (
    <div>
      <h1>Empresas cadastradas</h1>
      <ul>
        {companies.map(c => (
          <li key={c.id}>{c.name} - {c.type} - {c.representant} -{c.cnpj}</li>
        ))}
      </ul>
    </div>
  );
}


