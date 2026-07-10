export class SystemeioService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.SYSTEMEIO_API_KEY;
  }

  // Funcao para determinar o segmento baseado em estatisticas
  private getSegment(opens: number, clicks: number): string {
    if (opens === 0) return "vazio";
    if (opens <= 3 && clicks === 0) return "investigador";
    if (opens <= 7 && clicks === 0) return "regular";
    if (opens >= 8 && clicks >= 3) return "leal";
    return "ativo";
  }

  // Simula ou busca dados reais na API
  public async fetchAndSegmentContacts(): Promise<{ email: string; nome: string; telefone: string | null; segmento: string }[]> {
    const isMock = !this.apiKey || this.apiKey.startsWith("sk-proj-placeholder");

    if (isMock) {
      // Simula delay de rede e retorna dados de teste
      await new Promise(resolve => setTimeout(resolve, 1500));
      return [
        {
          email: "john.doe@example.com",
          nome: "John Doe",
          telefone: "+15550199",
          segmento: "ativo"
        },
        {
          email: "jane.smith@example.com",
          nome: "Jane Smith",
          telefone: "+15550299",
          segmento: "leal"
        },
        {
          email: `novo.lead.${Date.now()}@example.com`,
          nome: "Novo Lead Sincronizado",
          telefone: null,
          segmento: "investigador"
        }
      ];
    }

    try {
      // Chamada HTTP real à API do Systeme.io
      const response = await fetch("https://api.systeme.io/api/contacts", {
        method: "GET",
        headers: {
          "X-API-Key": this.apiKey!
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na API do Systeme.io: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      const contacts = data.items || [];

      return contacts.map((item: any) => {
        let nome = item.first_name || "";
        let telefone = item.phone_number || null;

        // Se o Systeme.io retornar campos customizados no array fields
        if (Array.isArray(item.fields)) {
          const nameField = item.fields.find((f: any) => f.name === "first_name" || f.name === "name");
          if (nameField) nome = nameField.value;

          const phoneField = item.fields.find((f: any) => f.name === "phone_number" || f.name === "phone");
          if (phoneField) telefone = phoneField.value;
        }

        return {
          email: item.email,
          nome: nome || "Sem Nome",
          telefone: telefone,
          segmento: "ativo"
        };
      });
    } catch (error) {
      console.error("Falha ao comunicar com a API do Systeme.io. Usando fallbacks de teste:", error);
      throw error;
    }
  }

  public async inscreverEmCampanha(email: string, campanhaId: string): Promise<boolean> {
    const isMock = !this.apiKey || this.apiKey.startsWith("sk-proj-placeholder");
    if (isMock) {
      console.log(`[MOCK SYSTEME.IO] Inscrevendo email ${email} na campanha ${campanhaId}`);
      return true;
    }
    try {
      const response = await fetch(`https://api.systeme.io/api/campaigns/${campanhaId}/subscribe`, {
        method: "POST",
        headers: {
          "X-API-Key": this.apiKey!,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      return response.ok;
    } catch (error) {
      console.error(`Erro ao inscrever lead no Systeme.io na campanha ${campanhaId}:`, error);
      return false;
    }
  }
}
