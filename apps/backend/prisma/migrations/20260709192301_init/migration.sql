-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "messenger_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'lead',
    "segmento_email" TEXT NOT NULL DEFAULT 'investigador',
    "fonte_captacao" TEXT,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultima_interacao" TIMESTAMP(3),
    "tags" TEXT[],
    "notas" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OKR" (
    "id" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OKR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultadoChave" (
    "id" TEXT NOT NULL,
    "metrica" TEXT NOT NULL,
    "meta" DOUBLE PRECISION NOT NULL,
    "atual" DOUBLE PRECISION NOT NULL,
    "unidade" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'no_prazo',
    "okr_id" TEXT NOT NULL,

    CONSTRAINT "ResultadoChave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoAfiliado" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "plataforma" TEXT NOT NULL,
    "nicho" TEXT NOT NULL,
    "comissao_media" DOUBLE PRECISION NOT NULL,
    "cpa_meta" DOUBLE PRECISION NOT NULL,
    "link_afiliado" TEXT,

    CONSTRAINT "ProdutoAfiliado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campanha" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "produto_id" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3),
    "investimento_ads_usd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "faturamento_bruto_usd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendaAfiliado" (
    "id" TEXT NOT NULL,
    "transacao_id" TEXT NOT NULL,
    "produto_id" TEXT NOT NULL,
    "valor_comissao_usd" DOUBLE PRECISION NOT NULL,
    "tipo_evento" TEXT NOT NULL,
    "email_cliente" TEXT,
    "data_venda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VendaAfiliado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailCampanha" (
    "id" TEXT NOT NULL,
    "assunto" TEXT NOT NULL,
    "data_envio" TIMESTAMP(3) NOT NULL,
    "open_rate" DOUBLE PRECISION,
    "click_rate" DOUBLE PRECISION,
    "insight_ia" TEXT,
    "campanha_id" TEXT NOT NULL,

    CONSTRAINT "EmailCampanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Funil" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Funil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EtapaFunil" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "meta_conversao" DOUBLE PRECISION NOT NULL,
    "conversao_atual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "funil_id" TEXT NOT NULL,

    CONSTRAINT "EtapaFunil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmsLog" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "enviado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmsLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadProduto" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "produto_id" TEXT NOT NULL,

    CONSTRAINT "LeadProduto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publicacao" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "plataforma" TEXT NOT NULL,
    "data_agenda" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Publicacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdsCampaign" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "plataforma" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "meta_cpl" DOUBLE PRECISION,
    "meta_roas" DOUBLE PRECISION,
    "gasto_total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "impressoes" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "conversoes" INTEGER NOT NULL DEFAULT 0,
    "receita" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdsCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdsDailyMetric" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "gasto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "impressoes" INTEGER NOT NULL DEFAULT 0,
    "alcance" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "leads" INTEGER NOT NULL DEFAULT 0,
    "vendas" INTEGER NOT NULL DEFAULT 0,
    "aplicacoes" INTEGER NOT NULL DEFAULT 0,
    "receita" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "campaign_id" TEXT NOT NULL,

    CONSTRAINT "AdsDailyMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdsCreative" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "meta_ads_id" TEXT,
    "gasto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "impressoes" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "conversoes" INTEGER NOT NULL DEFAULT 0,
    "insight_ia" TEXT,
    "campaign_id" TEXT NOT NULL,

    CONSTRAINT "AdsCreative_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VendaAfiliado_transacao_id_key" ON "VendaAfiliado"("transacao_id");

-- CreateIndex
CREATE UNIQUE INDEX "AdsDailyMetric_campaign_id_data_key" ON "AdsDailyMetric"("campaign_id", "data");

-- AddForeignKey
ALTER TABLE "ResultadoChave" ADD CONSTRAINT "ResultadoChave_okr_id_fkey" FOREIGN KEY ("okr_id") REFERENCES "OKR"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campanha" ADD CONSTRAINT "Campanha_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "ProdutoAfiliado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendaAfiliado" ADD CONSTRAINT "VendaAfiliado_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "ProdutoAfiliado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampanha" ADD CONSTRAINT "EmailCampanha_campanha_id_fkey" FOREIGN KEY ("campanha_id") REFERENCES "Campanha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EtapaFunil" ADD CONSTRAINT "EtapaFunil_funil_id_fkey" FOREIGN KEY ("funil_id") REFERENCES "Funil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmsLog" ADD CONSTRAINT "SmsLog_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadProduto" ADD CONSTRAINT "LeadProduto_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdsDailyMetric" ADD CONSTRAINT "AdsDailyMetric_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "AdsCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdsCreative" ADD CONSTRAINT "AdsCreative_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "AdsCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
