import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export const getAnalytics = (fastify: FastifyInstance) => async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const generateHistory = () => {
      const dates = ["01/02", "03/02", "05/02", "07/02", "09/02", "11/02", "13/02", "15/02", "17/02", "19/02", "21/02", "24/02"];
      return dates.map(d => ({
        date: d,
        value: Math.floor(Math.random() * 12000)
      }));
    };

    const overview = {
      impressoes: { value: 56400, percent: "+435%" },
      alcance: { value: 83000, percent: "+31.7%" },
      taxaEngajamento: { value: 1.22, percent: "+456%" },
      engajamento: { value: 1800, percent: "+595.4%" },
      seguidores: { value: 388900, percent: "0%" }
    };

    const data = {
      email: {
        id: "email",
        plataforma: "E-mail",
        seguidores: 17600, // 17.6K
        labelSeguidores: "inscritos",
        posts: 28,
        impressoes: 0,
        alcance: 54600,
        curtidas: 0,
        coments: 0,
        shares: 0,
        saves: 0,
        views: 0,
        cliques: 264
      },
      instagram: {
        id: "instagram",
        plataforma: "Instagram",
        seguidores: 296200, // 296.2K
        labelSeguidores: "seguidores",
        posts: 5,
        impressoes: 45400,
        alcance: 20500,
        curtidas: 901,
        coments: 463,
        shares: 318,
        saves: 500,
        views: 45400,
        cliques: 0
      },
      youtube: {
        id: "youtube",
        plataforma: "YouTube",
        seguidores: 200000,
        labelSeguidores: "seguidores",
        posts: 4,
        impressoes: 0,
        alcance: 0,
        curtidas: 0,
        coments: 0,
        shares: 0,
        saves: 0,
        views: 59,
        cliques: 0
      },
      tiktok: {
        id: "tiktok",
        plataforma: "TikTok",
        seguidores: 65600,
        labelSeguidores: "seguidores",
        posts: 5,
        impressoes: 10200,
        alcance: 7900,
        curtidas: 42,
        coments: 8,
        shares: 0,
        saves: 0,
        views: 542,
        cliques: 0
      },
      pinterest: {
        id: "pinterest",
        plataforma: "Pinterest",
        seguidores: 0, // Not explicitly shown in total, let's keep it 0 or add a mock
        labelSeguidores: "seguidores",
        posts: 51,
        impressoes: 516,
        alcance: 0,
        curtidas: 0,
        coments: 0,
        shares: 0,
        saves: 0,
        views: 0,
        cliques: 22
      }
    };

    const ranking = [
      { id: "3b3600", plataforma: "Instagram", data: "21/02/2026", impressoes: 22700, alcance: 10900, curtidas: 499, coments: 284, shares: 235 },
      { id: "3362ea", plataforma: "TikTok", data: "17/02/2026", impressoes: 9200, alcance: 7200, curtidas: 30, coments: 4, shares: 0 },
      { id: "3362dc", plataforma: "Instagram", data: "16/02/2026", impressoes: 13100, alcance: 5400, curtidas: 264, coments: 88, shares: 47 },
      { id: "370564", plataforma: "Instagram", data: "19/02/2026", impressoes: 5700, alcance: 2500, curtidas: 99, coments: 71, shares: 29 },
      { id: "3d2f31", plataforma: "Instagram", data: "22/02/2026", impressoes: 2900, alcance: 1400, curtidas: 23, coments: 12, shares: 6 }
    ];

    const calendarMatrix = [
      { day: "Dom 22/02", email: "198", whatsapp: "138", carrossel: "138", tiktok: "138", pinterest: "138", story: "", youtube: "" },
      { day: "Seg 23/02", email: "WS-e08", whatsapp: "", carrossel: "", tiktok: "", pinterest: "", story: "S03", youtube: "" },
      { day: "Ter 24/02", email: "WS-e09", whatsapp: "", carrossel: "136", tiktok: "136", pinterest: "136", story: "", youtube: "" },
      { day: "Qua 25/02", email: "WS-e10", whatsapp: "", carrossel: "", tiktok: "", pinterest: "", story: "S02", youtube: "Y" },
      { day: "Qui 26/02", email: "WS-e11", whatsapp: "", carrossel: "S01", tiktok: "S01", pinterest: "S01", story: "", youtube: "" },
      { day: "Sex 27/02", email: "WS-e12,e13", whatsapp: "", carrossel: "", tiktok: "", pinterest: "", story: "S04", youtube: "Y" },
      { day: "Sáb 28/02", email: "WS-e15", whatsapp: "", carrossel: "S05", tiktok: "S05", pinterest: "S05", story: "", youtube: "" },
      { day: "Dom 01/03", email: "139", whatsapp: "139", carrossel: "139", tiktok: "139", pinterest: "139", story: "", youtube: "" },
      { day: "Seg 02/03", email: "GDI-e01", whatsapp: "", carrossel: "", tiktok: "", pinterest: "", story: "S05", youtube: "Y" },
      { day: "Ter 03/03", email: "GDI-e02", whatsapp: "", carrossel: "S02", tiktok: "S02", pinterest: "S02", story: "", youtube: "" },
    ];

    return reply.status(200).send({ 
      success: true, 
      overview,
      platforms: data,
      chartHistory: generateHistory(),
      ranking,
      calendarMatrix
    });
  } catch (error: any) {
    fastify.log.error(error);
    return reply.status(500).send({ error: "Erro ao buscar dados de Analytics" });
  }
};
