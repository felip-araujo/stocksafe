import * as React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

export default function LoginPage() {
  const [re, setRe] = React.useState("");
  const [senha, setSenha] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // impede reload da página
    console.log("RE:", re);
    console.log("Senha:", senha);

    try {
      const response = await axios.post(
        "https://iachecker.com.br/api-conipa/auth/login.php",
        {
          re,
          senha,
        }
      );
      console.log("Login response:", response.data);
      window.location.href = "/";
    } catch (error) {
      console.error("Login error", error);
      alert("Cadastre-se");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300 }}
      >
        <Typography variant="h5" textAlign="center">
          Login
        </Typography>

        <TextField
          label="RE"
          type="number"
          value={re}
          onChange={(e) => setRe(e.target.value)}
          required
        />

        <TextField
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <Button type="submit" variant="contained" color="primary">
          Entrar
        </Button>
      </Box>
    </Box>
  );
}
