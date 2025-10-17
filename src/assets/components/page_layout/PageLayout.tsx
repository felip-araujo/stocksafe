import { Footer } from "../footer";
import { Header } from "../header";



interface MyComponentProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: MyComponentProps) {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6 text-gray-800">{children}</main>
      <Footer />
    </>
  );
}
