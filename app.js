const express = require("express");
const { expr } = require("jquery");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});


// <!-- * Inicializar o assistente quando a página carregar -->
var returnObj = initializeAssistant();
const assistant = returnObj.assistant;
const thread = returnObj.thread;





const app = express();
app.use(bodyParser.json());

app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.post("/processString", (req, res) => {
  console.log(req.body);
  let result = interaction(req.body.baseStrOut)
  .then(() => {
    console.log(result);
  });
  

  res.json({ result: result });
});

app.listen(5000, () => {
  console.log("Listening on port " + 5000);
});

// <!-- ! ====================================== -->
// <!-- ! script interagindo com a api da openAI -->
// <!-- ! ====================================== -->



// acho que isso funciona? n manjo mt de JS 🍵
async function askQuestion(question) {
  return new Promise((resolve, reject) => {
    (answer) => resolve(answer);
  });
}

// Inicializa o assistente (para assistant e thread serem globais no escopo da página)
var _assistant, _thread;
async function initializeAssistant() {
  try {
    // Criar o asssitente
    _assistant = await openai.beta.assistants.create({
        name: "Assistente para professores",
        instructions:
          "Você faz o papel de um assistente para professores. Use dados reais e fontes com credibilidade.",
        model: "gpt-3.5-turbo",
    });

    // Criar thread de trabalho
    _thread = await openai.beta.threads.create();
    console.log(_thread);
  } catch (error) {
    console.log(error);
  } finally {
    return { assistant: _assistant, thread: _thread };
  }
}

// Comunicação com o chat. Recebe a pergunta, e retorna a resposta.
async function interaction(textInput) {
  try {
    // A pergunta é recebida pela função, vinda da página web
    const userQuestion = textInput;

    await openai.beta.threads.messages.create(_thread.id, {
      role: "user",
      content: userQuestion,
    });

    // Com 'runs', esperar e recuperar a resposta do assistente
    const run = await openai.beta.threads.runs.create(_thread.id, {
      assistant_id: _assistant.id,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(_thread.id, run.id);

    // Checagem até que runStatus esteja completo
    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 500));
      runStatus = await openai.beta.threads.runs.retrieve(_thread.id, run.id);
    }

    // Obter a última mensagem do assistente
    const messages = await openai.beta.threads.messages.list(_thread.id);

    // Encontrar a última mensagem da 'run' atual
    const lastMessageForRun = messages.data
      .filter(
        (message) => message.run_id === run.id && message.role === "assistant"
      )
      .pop();

    // Encontrando uma mensagem do assistente, retornar o conteúdo
    if (lastMessageForRun) {
      return lastMessageForRun.content[0].text.value;
    }
  } catch (error) {
    console.log(error);
  }
}
