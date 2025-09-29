import { useEffect, useState } from "react";
import axios from "axios";


// Cria instância do axios com baseURL da variável de ambiente
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Interface para tipar os dados da API
interface Company {
  id: string;
  name: string;
  type: string;
  representant: string;
  rep_num: string;
  rep_email: string;
  cnpj: string;
  password: string;
}

export function CompaniesList() {
  // Tipando o estado como array de Company
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    api.get<Company[]>('companies')
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
          <li key={c.id}>
            {c.name} - {c.type} - {c.representant} - {c.cnpj}
          </li>
        ))}
      </ul>
    </div>
  );
}
