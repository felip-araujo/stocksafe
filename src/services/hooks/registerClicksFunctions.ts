export async function registerClick(buttonId: string, page: string) {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/analytics/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buttonId,
        page: page || window.location.pathname,
      }),
    });
  } catch (error) {
    console.error("Erro ao registrar clique:", error);
  }
}
