import { Route, Routes } from "react-router-dom";
import "./App.css";

// import { Home } from "./assets/pages/Index";

import { Home } from "./assets/pages/Index";
import LoginPage from "./assets/pages/Auth";
import { CadastroComp } from "./assets/pages/Cadastro";
import { DashPage } from "./assets/pages/Dashboard";
import { SuperDash } from "./assets/pages/SuperDash";
import { ProdutosCompany } from "./assets/components/company_dash/Produtos";
import { UsuariosCompany } from "./assets/components/company_dash/Users";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/auth" element={<LoginPage></LoginPage>}></Route>
        <Route path="/cadastro" element={<CadastroComp></CadastroComp>}></Route>
        <Route path="/dashboard" element={<DashPage></DashPage>}></Route>
        <Route path="/superdash" element={<SuperDash></SuperDash>}></Route>
        <Route path="/produtos" element={<ProdutosCompany></ProdutosCompany>}></Route>
        <Route path="/usuarios" element={<UsuariosCompany></UsuariosCompany>} ></Route>
      </Routes>
    </>
  );
}

export default App;
