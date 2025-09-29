
import { Header } from "../components/header";
import { CompaniesList } from "./Comp";


export function Home() {
  return (
    <>
      <Header></Header>

      <div className="bg-zinc-900 h-screen">.</div>
      <CompaniesList></CompaniesList>
    </>
  );
}
