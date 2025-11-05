import * as XLSX from "xlsx";
import api from "@/services/api/api";
import { useState } from "react";
import { Upload, Loader2, AlertCircle } from "lucide-react";

interface Novo {
  name: string;
  description: string;
  codigo: string;
  price: number;
  stock: number;
}

export function ImportarProdutos() {
  const [loading, setLoading] = useState(false);

  // ✅ Tipagem explícita: retorna apenas chaves válidas ou null
  const normalizeKey = (key: string): keyof Novo | null => {
    const lower = key.toLowerCase().trim();
    if (lower.includes("nome")) return "name";
    if (lower.includes("descri")) return "description";
    if (lower.includes("cód") || lower.includes("codigo")) return "codigo";
    if (lower.includes("preç")) return "price";
    if (lower.includes("estoq")) return "stock";
    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result;
      if (!result) return;

      const data = new Uint8Array(result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

      const produtos: Novo[] = jsonData.map((row) => {
        const novo: Novo = {
          name: "Sem nome",
          description: "",
          codigo: "",
          price: 0,
          stock: 0,
        };

        Object.entries(row).forEach(([key, value]) => {
          const normalized = normalizeKey(key);
          if (normalized && value !== undefined && value !== null) {
            // ✅ Cast seguro, porque normalized é keyof Novo
            (novo[normalized] as string | number) = String(value).trim();
          }
        });

        // ✅ Conversões seguras
        novo.price = parseFloat(String(novo.price)) || 0;
        novo.stock = parseInt(String(novo.stock)) || 0;

        return novo;
      });

      try {
        const companyId = Number(localStorage.getItem("companyId"));
        if (!companyId) {
          alert("Erro: empresa não identificada. Faça login novamente.");
          setLoading(false);
          return;
        }

        const response = await api.post("/product/importar", {
          produtos,
          companyId,
        });

        alert(response.data.message || "Importação concluída com sucesso!");
      } catch (err) {
        console.error(err);
        alert("Erro ao importar produtos. Verifique o formato do arquivo.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Botão Importar */}
      <div className="relative">
        <label
          htmlFor="file-upload-produto"
          className={`inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Importando...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Importar Produtos
            </>
          )}
        </label>
        <input
          id="file-upload-produto"
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>

      {/* Aviso lateral */}
      <div className="flex items-center text-sm text-gray-600 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-lg max-w-md">
        <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 shrink-0" />
        <p className="leading-snug">
          A planilha deve conter as colunas:{" "}
          <span className="font-medium text-gray-800">
            Nome, Descrição, Código, Preço, Estoque
          </span>
          .
        </p>
      </div>
    </div>
  );
}
