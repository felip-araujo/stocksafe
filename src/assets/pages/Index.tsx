import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Hero } from "../components/home_elements/Hero";
import { SubscriptionPlans } from "../components/signature/PlanosAssinatura";

export function Home() {
  return (
    <>
      <Header />
      <Hero />
      <SubscriptionPlans />
      <Footer />
    </>
  );
}
