import * as XLSX from "xlsx";
import api from "@/services/api/api";
import { useState } from "react";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";


interface Novo {
  name: string, 
  description: string
  group: string, 
  codigo: string
}


export function ImportarMateriais() {
  const [loading, setLoading] = useState(false);

  const normalizeKey = (key: string) => {
    const lower = key.toLowerCase().trim();
    if (lower.includes("nome")) return "name";
    if (lower.includes("descri")) return "description";
    if (lower.includes("grupo")) return "group";
    if (lower.includes("cód") || lower.includes("codigo")) return "codigo";
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
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Normaliza colunas e garante que companyId seja numérico
      const materiais = (jsonData as Novo[]).map((row) => {
        const novo: Novo = {
          name: "Sem nome",
          description: "",
          group: "",
          codigo: "",
        };

        Object.entries(row).forEach(([key, value]) => {
          const normalized = normalizeKey(key);
          if (normalized && value !== undefined) {
            novo[normalized] = String(value).trim();
          }
        });

        return novo;
      });

      try {
        const companyId = Number(localStorage.getItem("companyId"));
        if (!companyId) {
          
          toast.error("Erro: empresa não identificada. Faça login novamente.")
          setLoading(false);
          return;
        }

        const response = await api.post("/material/importar", {
          materiais,
          companyId,
        });

        
        toast.success(response.data.message || "Importação concluída com sucesso!")
        

      } catch (err) {
        console.error(err);
        
        toast.error("Erro ao importar materiais. Verifique o formato do arquivo.")
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      {/* Botão Importar */}
      <div className="relative">
        <label
          htmlFor="file-upload"
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
              Importar Planilha
            </>
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>

      {/* Aviso lateral */}
      <div className="flex items-center text-sm text-gray-600 bg-yellow-50 border border-yellow-200 px-2 py-2 rounded-sm max-w-lg">
        <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 shrink-0" />
        <p className="leading-snug">
          A planilha deve conter as colunas:{" "}
          <span className="font-medium text-gray-800">
            Nome, Descrição, Grupo, Código
          </span>
          .
        </p>
      </div>
    </div>
  );
}
