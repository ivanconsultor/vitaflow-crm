export interface AdCampaign {
  id: string;
  nome: string;
  plataforma: "facebook" | "google";
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
}

const mockCampaigns: AdCampaign[] = [
  {
    id: "camp-fb-01",
    nome: "EUA - Nutraceutico Longevidade L-Threonate",
    plataforma: "facebook",
    spend: 1200.0,
    impressions: 45000,
    clicks: 1800,
    conversions: 630,
    revenue: 2400.0,
    ctr: 4.0,
    cpc: 0.67,
    cpa: 1.90,
    roas: 2.0
  },
  {
    id: "camp-fb-02",
    nome: "EUA - Colageno Hidrolisado Premium",
    plataforma: "facebook",
    spend: 850.0,
    impressions: 32000,
    clicks: 960,
    conversions: 240,
    revenue: 720.0,
    ctr: 3.0,
    cpc: 0.88,
    cpa: 3.54,
    roas: 0.85
  },
  {
    id: "camp-go-01",
    nome: "EUA - Google Search - Nutraceuticos Focus",
    plataforma: "google",
    spend: 500.0,
    impressions: 8000,
    clicks: 640,
    conversions: 128,
    revenue: 1100.0,
    ctr: 8.0,
    cpc: 0.78,
    cpa: 3.90,
    roas: 2.2
  }
];

export async function fetchAdCampaigns(): Promise<AdCampaign[]> {
  const metaAccessToken = process.env.META_ACCESS_TOKEN;
  const metaAdAccountId = process.env.META_AD_ACCOUNT_ID;
  
  let metaCampaigns: AdCampaign[] = [];

  const isMetaActive = 
    metaAccessToken && 
    !metaAccessToken.startsWith("placeholder") && 
    metaAdAccountId && 
    !metaAdAccountId.startsWith("placeholder");

  if (isMetaActive) {
    try {
      const actId = metaAdAccountId.startsWith("act_") ? metaAdAccountId : `act_${metaAdAccountId}`;
      const url = `https://graph.facebook.com/v19.0/${actId}/insights?fields=campaign_id,campaign_name,spend,impressions,clicks,actions&level=campaign&date_preset=last_30d&access_token=${metaAccessToken}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json() as any;
        const insightsList = result.data || [];
        
        metaCampaigns = insightsList.map((item: any) => {
          const spend = parseFloat(item.spend) || 0;
          const impressions = parseInt(item.impressions) || 0;
          const clicks = parseInt(item.clicks) || 0;
          
          let conversions = 0;
          if (Array.isArray(item.actions)) {
            const purchaseAction = item.actions.find((act: any) => 
              act.action_type === "purchase" || 
              act.action_type === "offsite_conversion.fb_pixel_purchase"
            );
            if (purchaseAction) {
              conversions = parseInt(purchaseAction.value) || 0;
            }
          }

          const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
          const cpc = clicks > 0 ? spend / clicks : 0;
          const cpa = conversions > 0 ? spend / conversions : 0;
          
          let revenue = 0;
          if (Array.isArray(item.actions)) {
            const valueAction = item.actions.find((act: any) => act.action_type === "purchase_value");
            if (valueAction) {
              revenue = parseFloat(valueAction.value) || 0;
            }
          }
          const roas = spend > 0 ? revenue / spend : 0;

          return {
            id: item.campaign_id,
            nome: item.campaign_name,
            plataforma: "facebook",
            spend,
            impressions,
            clicks,
            conversions,
            revenue,
            ctr: parseFloat(ctr.toFixed(2)),
            cpc: parseFloat(cpc.toFixed(2)),
            cpa: parseFloat(cpa.toFixed(2)),
            roas: parseFloat(roas.toFixed(2))
          };
        });
      }
    } catch (err) {
      console.error("Erro ao carregar campanhas da API do Meta Ads:", err);
    }
  }

  const googleClientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const googleDeveloperToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const googleRefreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
  
  let googleCampaigns: AdCampaign[] = [];

  const isGoogleActive = 
    googleClientId && 
    !googleClientId.startsWith("placeholder") && 
    googleClientSecret && 
    !googleClientSecret.startsWith("placeholder") && 
    googleRefreshToken && 
    !googleRefreshToken.startsWith("placeholder");

  if (isGoogleActive) {
    try {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: googleClientId!,
          client_secret: googleClientSecret!,
          refresh_token: googleRefreshToken!,
          grant_type: "refresh_token"
        })
      });

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json() as any;
        const accessToken = tokenData.access_token;
        
        const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID || "1234567890";
        const queryUrl = `https://googleads.googleapis.com/v17/customers/${customerId}/googleAds:search`;
        
        const queryRes = await fetch(queryUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "developer-token": googleDeveloperToken || "",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: "SELECT campaign.id, campaign.name, metrics.cost_micros, metrics.impressions, metrics.clicks, metrics.conversions, metrics.conversions_value FROM campaign WHERE segments.date DURING LAST_30_DAYS"
          })
        });

        if (queryRes.ok) {
          const queryData = await queryRes.json() as any;
          const rows = queryData.results || [];
          
          googleCampaigns = rows.map((row: any) => {
            const camp = row.campaign || {};
            const metrics = row.metrics || {};
            
            const spend = (parseFloat(metrics.costMicros) || 0) / 1000000;
            const impressions = parseInt(metrics.impressions) || 0;
            const clicks = parseInt(metrics.clicks) || 0;
            const conversions = parseFloat(metrics.conversions) || 0;
            const revenue = parseFloat(metrics.conversionsValue) || 0;
            
            const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
            const cpc = clicks > 0 ? spend / clicks : 0;
            const cpa = conversions > 0 ? spend / conversions : 0;
            const roas = spend > 0 ? revenue / spend : 0;

            return {
              id: camp.id || resourceNameToId(camp.resourceName),
              nome: camp.name,
              plataforma: "google",
              spend: parseFloat(spend.toFixed(2)),
              impressions,
              clicks,
              conversions: Math.round(conversions),
              revenue: parseFloat(revenue.toFixed(2)),
              ctr: parseFloat(ctr.toFixed(2)),
              cpc: parseFloat(cpc.toFixed(2)),
              cpa: parseFloat(cpa.toFixed(2)),
              roas: parseFloat(roas.toFixed(2))
            };
          });
        }
      }
    } catch (err) {
      console.error("Erro ao carregar campanhas do Google Ads:", err);
    }
  }

  const allCampaigns = [...metaCampaigns, ...googleCampaigns];
  
  if (allCampaigns.length === 0) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockCampaigns;
  }
  
  return allCampaigns;
}

function resourceNameToId(resourceName: string): string {
  if (!resourceName) return "";
  const parts = resourceName.split("/");
  return parts[parts.length - 1];
}
