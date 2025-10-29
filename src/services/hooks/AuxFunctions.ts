 export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return phone;
  const formatted = digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  return formatted;
}

export function whatsappLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/55${digits}`;
}

export function formatCpf(cpf: string) {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return `***.***.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}