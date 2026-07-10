const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");

// Carrega as variáveis de ambiente
dotenv.config({ path: path.join(__dirname, "../../.env") });
dotenv.config({ path: path.join(__dirname, ".env") });

const JWT_SECRET = process.env.JWT_SECRET || "meu_segredo_super_seguro_jwt_4cs";
const CB_SECRET = process.env.WEBHOOK_SECRET_CLICKBANK || "clickbank-secret-token-gsd-2026";
const BG_SECRET = process.env.WEBHOOK_SECRET_BUYGOODS || "buygoods-secret-token-gsd-2026";
const PORT = process.env.PORT || 3001;

console.log("Iniciando script de testes de integração e webhooks...");
console.log(`Porta do Backend: ${PORT}`);
console.log(`JWT Secret: ${JWT_SECRET ? "Carregado" : "Não encontrado"}`);

// Gera token JWT de teste
const token = jwt.sign({ user: "admin-test" }, JWT_SECRET);

async function runTests() {
  const emailCb = `test.cb.${Date.now()}@example.com`;
  const emailBg = `test.bg.${Date.now()}@example.com`;

  try {
    // ==========================================
    // TESTE 1: ClickBank (Abandono -> Compra)
    // ==========================================
    console.log("\n--- TESTE 1: Fluxo ClickBank ---");

    // 1. Cadastra Lead inicial
    console.log("1. Cadastrando Lead inicial para ClickBank...");
    const resCreateCb = await fetch(`http://localhost:${PORT}/api/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        nome: "Test Lead Clickbank",
        email: emailCb,
        telefone: "+15550999",
        status: "Novo Lead",
        tags: ["teste_automatizado"]
      })
    });

    if (!resCreateCb.ok) {
      const err = await resCreateCb.text();
      throw new Error(`Falha ao cadastrar lead CB: ${err}`);
    }
    const leadCb = await resCreateCb.json();
    console.log(`Lead ClickBank criado com sucesso (ID: ${leadCb.id})`);

    // 2. Simula Abandono de Checkout ClickBank
    console.log("2. Enviando Webhook de Abandono de Checkout...");
    const resAbandonCb = await fetch(`http://localhost:${PORT}/api/webhooks/clickbank`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-clickbank-token": CB_SECRET
      },
      body: JSON.stringify({
        transactionType: "ABANDON",
        totalOrderAmount: 0,
        customer: {
          email: emailCb,
          firstName: "Test Lead Clickbank",
          phone: "+15550999"
        }
      })
    });

    if (!resAbandonCb.ok) {
      const err = await resAbandonCb.text();
      throw new Error(`Falha no webhook de abandono CB: ${err}`);
    }
    console.log("Webhook de Abandono enviado com sucesso!");

    // 3. Verifica se a tag de abandono foi inserida
    console.log("3. Verificando tags do Lead...");
    const resGetLeadsCb = await fetch(`http://localhost:${PORT}/api/leads`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const leadsListCb = await resGetLeadsCb.json();
    const updatedLeadCb = leadsListCb.find(l => l.email === emailCb);

    console.log("Tags atuais do lead ClickBank:", updatedLeadCb.tags);
    if (!updatedLeadCb.tags.includes("abandono_checkout_clickbank")) {
      throw new Error("Erro: A tag 'abandono_checkout_clickbank' não foi aplicada!");
    }
    console.log("Sucesso: Tag de abandono ClickBank aplicada com sucesso!");

    // 4. Simula Compra Concluída ClickBank
    console.log("4. Enviando Webhook de Venda Concluída...");
    const receiptCb = `CB-${Date.now().toString().substring(6)}`;
    const resSaleCb = await fetch(`http://localhost:${PORT}/api/webhooks/clickbank`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-clickbank-token": CB_SECRET
      },
      body: JSON.stringify({
        transactionType: "SALE",
        totalOrderAmount: 97.00,
        receipt: receiptCb,
        customer: {
          email: emailCb
        }
      })
    });

    if (!resSaleCb.ok) {
      const err = await resSaleCb.text();
      throw new Error(`Falha no webhook de venda CB: ${err}`);
    }
    console.log(`Webhook de Venda enviado com sucesso (Receita: ${receiptCb})`);

    // 5. Verifica se status mudou para Fechado e adicionou a tag de cliente
    console.log("5. Verificando status e tags finais do Lead...");
    const resGetLeadsCbFinal = await fetch(`http://localhost:${PORT}/api/leads`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const leadsListCbFinal = await resGetLeadsCbFinal.json();
    const finalLeadCb = leadsListCbFinal.find(l => l.email === emailCb);

    console.log("Status final:", finalLeadCb.status);
    console.log("Tags finais:", finalLeadCb.tags);

    if (finalLeadCb.status !== "Fechado") {
      throw new Error(`Erro: Status esperado 'Fechado', mas obteve '${finalLeadCb.status}'`);
    }
    if (!finalLeadCb.tags.includes("cliente_clickbank")) {
      throw new Error("Erro: A tag 'cliente_clickbank' não foi aplicada!");
    }
    console.log("Sucesso: Fluxo ClickBank validado com sucesso de ponta a ponta!");


    // ==========================================
    // TESTE 2: BuyGoods (Abandono -> Compra)
    // ==========================================
    console.log("\n--- TESTE 2: Fluxo BuyGoods ---");

    // 1. Cadastra Lead inicial
    console.log("1. Cadastrando Lead inicial para BuyGoods...");
    const resCreateBg = await fetch(`http://localhost:${PORT}/api/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        nome: "Test Lead Buygoods",
        email: emailBg,
        telefone: "+15550888",
        status: "Novo Lead",
        tags: ["teste_automatizado"]
      })
    });

    if (!resCreateBg.ok) {
      const err = await resCreateBg.text();
      throw new Error(`Falha ao cadastrar lead BG: ${err}`);
    }
    const leadBg = await resCreateBg.json();
    console.log(`Lead BuyGoods criado com sucesso (ID: ${leadBg.id})`);

    // 2. Simula Abandono de Checkout BuyGoods
    console.log("2. Enviando Webhook de Abandono de Checkout BuyGoods...");
    const resAbandonBg = await fetch(`http://localhost:${PORT}/api/webhooks/buygoods`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-buygoods-token": BG_SECRET
      },
      body: JSON.stringify({
        event_type: "cart_abandoned",
        commission: "0",
        customer_email: emailBg,
        customer_name: "Test Lead Buygoods",
        customer_phone: "+15550888"
      })
    });

    if (!resAbandonBg.ok) {
      const err = await resAbandonBg.text();
      throw new Error(`Falha no webhook de abandono BG: ${err}`);
    }
    console.log("Webhook de Abandono BuyGoods enviado com sucesso!");

    // 3. Verifica se a tag de abandono foi inserida
    console.log("3. Verificando tags do Lead BuyGoods...");
    const resGetLeadsBg = await fetch(`http://localhost:${PORT}/api/leads`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const leadsListBg = await resGetLeadsBg.json();
    const updatedLeadBg = leadsListBg.find(l => l.email === emailBg);

    console.log("Tags atuais do lead BuyGoods:", updatedLeadBg.tags);
    if (!updatedLeadBg.tags.includes("abandono_checkout_buygoods")) {
      throw new Error("Erro: A tag 'abandono_checkout_buygoods' não foi aplicada!");
    }
    console.log("Sucesso: Tag de abandono BuyGoods aplicada com sucesso!");

    // 4. Simula Compra Concluída BuyGoods
    console.log("4. Enviando Webhook de Venda Concluída BuyGoods...");
    const orderIdBg = `BG-${Date.now().toString().substring(6)}`;
    const resSaleBg = await fetch(`http://localhost:${PORT}/api/webhooks/buygoods`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-buygoods-token": BG_SECRET
      },
      body: JSON.stringify({
        event_type: "sale",
        commission: "120.00",
        order_id: orderIdBg,
        customer_email: emailBg
      })
    });

    if (!resSaleBg.ok) {
      const err = await resSaleBg.text();
      throw new Error(`Falha no webhook de venda BG: ${err}`);
    }
    console.log(`Webhook de Venda BuyGoods enviado com sucesso (Order ID: ${orderIdBg})`);

    // 5. Verifica se status mudou para Fechado e adicionou a tag de cliente
    console.log("5. Verificando status e tags finais do Lead BuyGoods...");
    const resGetLeadsBgFinal = await fetch(`http://localhost:${PORT}/api/leads`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const leadsListBgFinal = await resGetLeadsBgFinal.json();
    const finalLeadBg = leadsListBgFinal.find(l => l.email === emailBg);

    console.log("Status final:", finalLeadBg.status);
    console.log("Tags finais:", finalLeadBg.tags);

    if (finalLeadBg.status !== "Fechado") {
      throw new Error(`Erro: Status esperado 'Fechado', mas obteve '${finalLeadBg.status}'`);
    }
    if (!finalLeadBg.tags.includes("cliente_buygoods")) {
      throw new Error("Erro: A tag 'cliente_buygoods' não foi aplicada!");
    }
    console.log("Sucesso: Fluxo BuyGoods validado com sucesso de ponta a ponta!");

    console.log("\n=======================================================");
    console.log("TODOS OS TESTES DE INTEGRAÇÃO DO CRM FORAM CONCLUÍDOS COM SUCESSO!");
    console.log("=======================================================");

  } catch (error) {
    console.error("\n❌ ERRO NOS TESTES DE INTEGRAÇÃO:", error.message);
    process.exit(1);
  }
}

runTests();
