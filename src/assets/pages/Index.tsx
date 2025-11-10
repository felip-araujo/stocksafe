import { useAnalytics } from "@/services/hooks/analyticsFunctions";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Beneficios } from "../components/home_elements/Beneficios";
import { ComoFunciona } from "../components/home_elements/ComoFunciona";
import { ComparacaoExcel } from "../components/home_elements/Comparacao";
import { Contato } from "../components/home_elements/Contato";
import { Depoimentos } from "../components/home_elements/Depoiments";
import { FAQ } from "../components/home_elements/Faq";
import { Hero } from "../components/home_elements/Hero";
import { SubscriptionPlans } from "../components/signature/PlanosAssinatura";

export function Home() {
  useAnalytics("home");


  return (
    <>
      <Header />
      <Hero />
      <ComoFunciona />
      <ComparacaoExcel />
      <Beneficios />
      <Depoimentos />
      <SubscriptionPlans />
      <FAQ />
      <Contato></Contato>

      <Footer />
    </>
  );
}
