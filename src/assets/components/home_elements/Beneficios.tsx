import { CheckCircle, BarChart3, Smartphone, Bell, Settings, Users } from "lucide-react";

export function Beneficios() {
  const benefits = [
    {
      icon: <CheckCircle size={36} className="text-zinc-900" />,
      title: "Controle total em tempo real",
      desc: "Saiba o que entra, o que sai e o que ainda tem no estoque — sem depender de planilhas.",
    },
    {
      icon: <Bell size={36} className="text-zinc-900" />,
      title: "Alertas automáticos",
      desc: "Receba avisos sempre que um produto estiver acabando ou precisar de reposição.",
    },
    {
      icon: <BarChart3 size={36} className="text-zinc-900" />,
      title: "Relatórios inteligentes",
      desc: "Acompanhe o desempenho da sua empresa com gráficos e dados em tempo real.",
    },
    {
      icon: <Smartphone size={36} className="text-zinc-900" />,
      title: "Acesso de qualquer lugar",
      desc: "Gerencie tudo pelo computador, tablet ou celular — sem precisar instalar nada.",
    },
    {
      icon: <Settings size={36} className="text-zinc-900" />,
      title: "Gestão simplificada",
      desc: "Interface intuitiva e fácil de usar, mesmo pra quem nunca lidou com sistemas.",
    },
    {
      icon: <Users size={36} className="text-zinc-900" />,
      title: "Gestão de Usuários",
      desc: "Cadastre seus funcionários por departamento de forma segura e prática",
    },
  ];

  return (
    <section id="benefits" className="bg-gray-50 text-zinc-900 py-20 px-6 md:px-16">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Benefícios reais para sua Empresa
        </h2>
        <p className="text-base md:text-lg mb-12 text-zinc-900">
          Com o Stock Seguro, você tem uma visão completa e automática do seu estoque — do cadastro à venda, tudo em um só lugar.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-white/10"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-zinc-900">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
