import axios from "axios";
import { useEffect, useState } from "react";

export function Busca() {
  const [requisicoes, setRequisicoes] = useState([]);
  useEffect(() => {
    axios
      .get("https://iachecker.com.br/api-conipa/requisicoes/lsitar.php")
      .then((response) => {
        setRequisicoes(response.data);
        console.log(requisicoes);
      });
  });
  Busca();
}
