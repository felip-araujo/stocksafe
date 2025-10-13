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
import { EsqSenha } from "./assets/pages/EsqueciSenha";
import ResetPassword from "./assets/pages/ResetPassword";
import { CodeMail } from "./assets/pages/Code";
import { DashEmployee } from "./assets/pages/DashEmployee";
import { MaterialsCompany } from "./assets/components/company_dash/Material";
import { RequestsCompany } from "./assets/components/company_dash/Requests";
import { PerfilCompany } from "./assets/components/company_dash/PerfilCompany";
import { UserRequest } from "./assets/components/company_dash/RequestsOfUser";
import { Blog } from "./assets/pages/Blog";

function App() {
  return (
    <>
      <Routes>
        {/* Rota de Index, pagina principal */}
        <Route path="/" element={<Home></Home>}></Route> 
        <Route path="/blog" element={<Blog></Blog>}></Route> 

        {/* Rotas de Login, Auth, e recuperação de senhas */}
        <Route path="/auth" element={<LoginPage></LoginPage>}></Route>
        <Route path="/cadastro" element={<CadastroComp></CadastroComp>}></Route>
        <Route path="/esqueci-senha" element={<EsqSenha></EsqSenha>} ></Route>
        <Route path="/reset-password/:token" element={<ResetPassword></ResetPassword>} ></Route>
        <Route path="/code-insert" element={<CodeMail></CodeMail>}></Route>

        {/* Dashboards e elementos de dashboards */}
        <Route path="/dashboard" element={<DashPage></DashPage>}></Route>
        <Route path="/dash-employee" element={<DashEmployee></DashEmployee>}></Route>
        <Route path="/superdash" element={<SuperDash></SuperDash>}></Route>
        <Route path="/produtos" element={<ProdutosCompany></ProdutosCompany>}></Route>
        <Route path="/usuarios" element={<UsuariosCompany></UsuariosCompany>} ></Route>
        <Route path="/material" element={<MaterialsCompany></MaterialsCompany>} ></Route>
        <Route path="/requisicao" element={<RequestsCompany></RequestsCompany>} ></Route>
        <Route path="/config"  element={<PerfilCompany></PerfilCompany>} ></Route>
        <Route path="/user-request" element={<UserRequest></UserRequest>} ></Route>
        
        
        

      </Routes>
    </>
  );
}

export default App;
