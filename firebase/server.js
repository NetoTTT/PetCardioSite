const express = require("express");
const cors = require("cors"); // Importando o cors
const admin = require("firebase-admin");
const app = express();
const port = 3000;

// Caminho para a chave do serviço do Firebase
const serviceAccount = require("./petcardio-9cabf-firebase-adminsdk-yrafq-9ab9597714.json"); // Atualize o caminho

// Inicializando o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://petcardio-9cabf-default-rtdb.firebaseio.com/",
});

// Adicionando o middleware CORS
app.use(cors()); // Isso habilita CORS para todas as rotas

// Referência para o Realtime Database
const db = admin.database();

// Rota para retornar os dados dos batimentos cardíacos
app.get("/dados", async (req, res) => {
  try {
    const ref = db.ref("batimentos_cardiacos"); // Caminho no banco de dados Firebase
    ref.once("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        res.json({ batimentos_cardiacos: data });
      } else {
        res.status(404).json({ message: "Nenhum dado encontrado" });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar dados", error: error.message });
  }
});

// Adicione um log aqui para confirmar o start
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
