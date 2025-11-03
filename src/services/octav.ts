import dotenv from "dotenv";

dotenv.config();

interface PortfolioAsset {
  balance: string;
  chainContract: string;
  chainKey: string;
  contract: string;
  decimal: string;
  name: string;
  price: string;
  symbol: string;
  value: string;
}

interface Transaction {
  hash: string;
  timestamp: string;
  type: string;
  chain: {
    key: string;
    name: string;
  };
  protocol: {
    name: string;
    key: string;
  };
  fees: string;
  feesFiat: string;
  valueFiat: string;
  assetsIn: any[];
  assetsOut: any[];
}

export interface PortfolioData {
  address: string;
  networth: string;
  openPnl: string;
  closedPnl: string;
  totalAssets: number;
  topAssets: Array<{
    symbol: string;
    name: string;
    balance: string;
    value: string;
  }>;
  chains: string[];
  protocols: string[];
}

export interface TransactionData {
  totalTransactions: number;
  recentTransactions: Array<{
    type: string;
    protocol: string;
    chain: string;
    timestamp: string;
    fees: string;
  }>;
  mostUsedProtocols: string[];
  mostUsedChains: string[];
  totalFees: string;
}

export class OctavService {
  private apiKey: string;
  private baseUrl = "https://api.octav.fi/v1";

  constructor() {
    this.apiKey = `Bearer ${process.env.OCTAV_API_KEY}` || "";
    if (!this.apiKey) {
      console.warn("⚠️  OCTAV_API_KEY not set in environment variables");
    }
  }

  /**
   * Отримує портфоліо для вказаної адреси гаманця
   */
  async getPortfolio(address: string): Promise<PortfolioData> {
    try {
      const url = `${this.baseUrl}/portfolio?addresses=${address}&includeImages=false`;
      const response = await fetch(url, {
        headers: {
          Authorization: this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 400) {
          throw new Error("UNSUPPORTED_NETWORK");
        }
        if (response.status === 404) {
          throw new Error("ADDRESS_NOT_FOUND");
        }
        
        throw new Error(
          `Octav API error: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as any[];

      if (!data || data.length === 0) {
        throw new Error("No portfolio data found for this address");
      }

      const portfolio = data[0];

      // Збираємо всі асети з портфоліо
      const allAssets: PortfolioAsset[] = [];
      const protocols = new Set<string>();
      const chains = new Set<string>();

      // Обробляємо дані по протоколах
      if (portfolio.assetByProtocols) {
        Object.entries(portfolio.assetByProtocols).forEach(
          ([protocolKey, protocolData]: [string, any]) => {
            protocols.add(protocolData.name);

            if (protocolData.chains) {
              Object.entries(protocolData.chains).forEach(
                ([chainKey, chainData]: [string, any]) => {
                  chains.add(chainData.name);

                  if (chainData.protocolPositions) {
                    Object.values(chainData.protocolPositions).forEach(
                      (position: any) => {
                        if (position.assets && Array.isArray(position.assets)) {
                          allAssets.push(...position.assets);
                        }
                        // Також додаємо reward assets
                        if (
                          position.protocolPositions &&
                          Array.isArray(position.protocolPositions)
                        ) {
                          position.protocolPositions.forEach((subPos: any) => {
                            if (subPos.assets) allAssets.push(...subPos.assets);
                            if (subPos.rewardAssets)
                              allAssets.push(...subPos.rewardAssets);
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }

      // Сортуємо асети за вартістю
      const sortedAssets = allAssets
        .sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
        .slice(0, 10); // Топ 10 асетів

      return {
        address: portfolio.address,
        networth: portfolio.networth || "0",
        openPnl: portfolio.openPnl || "0",
        closedPnl: portfolio.closedPnl || "0",
        totalAssets: allAssets.length,
        topAssets: sortedAssets.map((asset) => ({
          symbol: asset.symbol.toUpperCase(),
          name: asset.name,
          balance: asset.balance,
          value: asset.value,
        })),
        chains: Array.from(chains),
        protocols: Array.from(protocols),
      };
    } catch (error: any) {
      console.error("Error fetching portfolio:", error);
      // Прокидуємо специфічні помилки далі
      if (error.message === "UNSUPPORTED_NETWORK" || error.message === "ADDRESS_NOT_FOUND") {
        throw error;
      }
      throw new Error(`Failed to fetch portfolio: ${error.message}`);
    }
  }

  /**
   * Отримує історію транзакцій для вказаної адреси
   */
  async getTransactions(
    address: string,
    limit: number = 50
  ): Promise<TransactionData> {
    try {
      const url = `${this.baseUrl}/transactions?addresses=${address}&limit=${limit}&offset=0&sort=DESC`;
      const response = await fetch(url, {
        headers: {
          Authorization: this.apiKey,
        },
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("UNSUPPORTED_NETWORK");
        }
        if (response.status === 404) {
          throw new Error("ADDRESS_NOT_FOUND");
        }
        
        throw new Error(
          `Octav API error: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as any;
      const transactions: Transaction[] = data.transactions || [];

      // Аналізуємо транзакції
      const protocolCount: Record<string, number> = {};
      const chainCount: Record<string, number> = {};
      let totalFees = 0;

      transactions.forEach((tx) => {
        // Рахуємо протоколи
        if (tx.protocol?.name) {
          protocolCount[tx.protocol.name] =
            (protocolCount[tx.protocol.name] || 0) + 1;
        }

        // Рахуємо ланцюги
        if (tx.chain?.name) {
          chainCount[tx.chain.name] = (chainCount[tx.chain.name] || 0) + 1;
        }

        // Сумуємо комісії
        if (tx.feesFiat) {
          totalFees += parseFloat(tx.feesFiat);
        }
      });

      // Найпопулярніші протоколи
      const mostUsedProtocols = Object.entries(protocolCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([protocol]) => protocol);

      // Найпопулярніші ланцюги
      const mostUsedChains = Object.entries(chainCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([chain]) => chain);

      return {
        totalTransactions: transactions.length,
        recentTransactions: transactions.slice(0, 10).map((tx) => ({
          type: tx.type,
          protocol: tx.protocol?.name || "Unknown",
          chain: tx.chain?.name || "Unknown",
          timestamp: new Date(parseInt(tx.timestamp) * 1000).toISOString(),
          fees: tx.feesFiat,
        })),
        mostUsedProtocols,
        mostUsedChains,
        totalFees: totalFees.toFixed(2),
      };
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      // Прокидуємо специфічні помилки далі
      if (error.message === "UNSUPPORTED_NETWORK" || error.message === "ADDRESS_NOT_FOUND") {
        throw error;
      }
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  }

  /**
   * Отримує повні дані для аналізу (портфоліо + транзакції)
   */
  async getWalletAnalysis(address: string) {
    const [portfolio, transactions] = await Promise.all([
      this.getPortfolio(address),
      this.getTransactions(address),
    ]);

    return {
      portfolio,
      transactions,
    };
  }
}
