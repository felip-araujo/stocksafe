import { Route, Routes } from "react-router-dom";
import "./App.css";

// import { Home } from "./assets/pages/Index";

import { Home } from "./assets/pages/Index";
import LoginPage from "./assets/pages/Auth";
import { CadastroComp } from "./assets/pages/Cadastro";



function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/auth" element={<LoginPage></LoginPage>}></Route>
        <Route path="/cadastro" element={<CadastroComp></CadastroComp>} ></Route>
      </Routes>
    </>
  );
}

export default App;
