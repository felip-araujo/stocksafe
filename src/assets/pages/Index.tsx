import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Beneficios } from "../components/home_elements/Beneficios";
import { ComoFunciona } from "../components/home_elements/ComoFunciona";
import { Hero } from "../components/home_elements/Hero";
import { SubscriptionPlans } from "../components/signature/PlanosAssinatura";

export function Home() {
  return (
    <>
      <Header />
      <Hero />
      <ComoFunciona />
      <Beneficios />
      <SubscriptionPlans />
      <Footer />
    </>
  );
}
