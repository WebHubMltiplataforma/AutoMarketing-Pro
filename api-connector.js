// Configuración de APIs - Conexiones corregidas
class APIConnector {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.endpoints = {
            campaigns: '/campaigns',
            analytics: '/analytics',
            users: '/users'
        };
    }

    // Conexión segura a APIs externas
    async connectToAPI(endpoint, data = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error de conexión API:', error);
            this.handleConnectionError(error);
        }
    }

    // Conexión específica para datos de criptomonedas
    async getCryptoData() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false');
            
            if (!response.ok) {
                throw new Error('Error fetching crypto data');
            }
            
            const data = await response.json();
            this.updateCryptoWidget(data);
            return data;
        } catch (error) {
            console.error('Error conexión cripto:', error);
            return this.getFallbackCryptoData();
        }
    }

    // Datos de respaldo si falla la API
    getFallbackCryptoData() {
        return [
            { symbol: 'BTC', price: 45000, change: 2.5 },
            { symbol: 'ETH', price: 3000, change: 1.8 }
        ];
    }

    handleConnectionError(error) {
        // Lógica para manejar errores de conexión
        console.log('Reintentando conexión...');
        setTimeout(() => this.reconnect(), 5000);
    }
}

// Inicializar conexión
const apiConnector = new APIConnector();