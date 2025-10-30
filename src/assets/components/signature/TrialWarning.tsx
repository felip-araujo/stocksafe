export function TrialWarning() {
  const fim = localStorage.getItem("fim_teste");

  if (!fim) return null; // não exibe se não houver data

  // Formata a data
  const formattedDate = new Date(fim).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <h1 className="text-gray-400 font-normal text-sm">
      Acesso expira em: <strong className="text-yellow-400/70">{formattedDate}</strong> 
    </h1>
  );
}
