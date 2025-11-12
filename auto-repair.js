class AutoRepairSystem {
    constructor() {
        this.retryCount = 0;
        this.maxRetries = 5;
        this.repairStrategies = new Map();
        this.initRepairStrategies();
    }

    initRepairStrategies() {
        // Estrategias para errores comunes
        this.repairStrategies.set('DATABASE_CONNECTION_ERROR', {
            priority: 'HIGH',
            actions: [
                'restart_database_connection',
                'check_database_credentials', 
                'use_fallback_database',
                'switch_to_local_storage'
            ],
            autoExecute: true
        });

        this.repairStrategies.set('API_RATE_LIMIT', {
            priority: 'MEDIUM',
            actions: [
                'switch_to_alternative_api',
                'implement_exponential_backoff',
                'use_cached_data',
                'queue_requests'
            ],
            autoExecute: true
        });

        this.repairStrategies.set('NETWORK_ERROR', {
            priority: 'HIGH',
            actions: [
                'check_internet_connection',
                'switch_network_interface',
                'use_offline_mode',
                'retry_with_delay'
            ],
            autoExecute: true
        });
    }

    async handleError(error, context = 'unknown') {
        console.log(`🛠️ Sistema Auto-Reparación activado: ${error.message}`);
        
        const errorType = this.classifyError(error);
        const strategy = this.repairStrategies.get(errorType);
        
        if (strategy && strategy.autoExecute) {
            return await this.executeRepairStrategy(strategy, error, context);
        }
        
        return await this.genericRepair(error, context);
    }

    classifyError(error) {
        if (error.code === 'ECONNREFUSED') return 'DATABASE_CONNECTION_ERROR';
        if (error.code === 'ETIMEDOUT') return 'NETWORK_ERROR';
        if (error.status === 429) return 'API_RATE_LIMIT';
        if (error.message.includes('database')) return 'DATABASE_CONNECTION_ERROR';
        if (error.message.includes('network')) return 'NETWORK_ERROR';
        return 'UNKNOWN_ERROR';
    }

    async executeRepairStrategy(strategy, error, context) {
        console.log(`🔧 Ejecutando estrategia de reparación: ${strategy.actions[0]}`);
        
        for (const action of strategy.actions) {
            try {
                const result = await this.executeRepairAction(action, error, context);
                if (result.success) {
                    console.log(`✅ Reparación exitosa con: ${action}`);
                    return result;
                }
            } catch (actionError) {
                console.log(`❌ Falló acción ${action}:`, actionError.message);
                continue;
            }
        }
        
        return await this.emergencyFallback(error, context);
    }

    async executeRepairAction(action, error, context) {
        switch (action) {
            case 'restart_database_connection':
                return await this.restartDatabaseConnection();
                
            case 'use_fallback_database':
                return await this.switchToFallbackDatabase();
                
            case 'switch_to_alternative_api':
                return await this.switchToAlternativeAPI();
                
            case 'use_cached_data':
                return await this.useCachedData();
                
            case 'check_internet_connection':
                return await this.checkInternetConnection();
                
            default:
                return await this.genericRepair(error, context);
        }
    }

    async restartDatabaseConnection() {
        const { db } = require('../config/database');
        try {
            await db.end();
            await new Promise(resolve => setTimeout(resolve, 2000));
            await db.connect();
            return { success: true, message: 'Conexión a BD reiniciada' };
        } catch (error) {
            throw new Error(`Failed to restart DB: ${error.message}`);
        }
    }

    async switchToFallbackDatabase() {
        // Cambiar a base de datos local SQLite como respaldo
        const sqlite3 = require('sqlite3').verbose();
        const fallbackDB = new sqlite3.Database('./fallback.db');
        
        global.fallbackDatabase = fallbackDB;
        global.useFallbackDB = true;
        
        return { 
            success: true, 
            message: 'Cambiado a base de datos de respaldo',
            database: 'fallback'
        };
    }

    async switchToAlternativeAPI() {
        // Rotar entre diferentes APIs
        const apis = [
            'https://api.coingecko.com/api/v3',
            'https://api.coincap.io/v2',
            'https://api.binance.com/api/v3'
        ];
        
        const currentAPI = process.env.CRYPTO_API_URL;
        const nextAPI = apis.find(api => api !== currentAPI) || apis[0];
        
        process.env.CRYPTO_API_URL = nextAPI;
        return { 
            success: true, 
            message: `Cambiado a API: ${nextAPI}`,
            api: nextAPI
        };
    }

    async useCachedData() {
        // Usar datos en caché cuando las APIs fallen
        const cache = require('./cache-system');
        const cachedData = await cache.get('last_successful_data');
        
        if (cachedData) {
            return {
                success: true,
                message: 'Usando datos en caché',
                data: cachedData,
                fromCache: true
            };
        }
        
        throw new Error('No hay datos en caché disponibles');
    }

    async checkInternetConnection() {
        try {
            const axios = require('axios');
            await axios.get('https://www.google.com', { timeout: 5000 });
            return { success: true, message: 'Conexión a internet estable' };
        } catch (error) {
            throw new Error('Sin conexión a internet');
        }
    }

    async genericRepair(error, context) {
        console.log(`🔧 Reparación genérica para: ${error.message}`);
        
        // Estrategias genéricas de reparación
        const strategies = [
            () => this.retryWithBackoff(error, context),
            () => this.degradeGracefully(error, context),
            () => this.useMockData(error, context)
        ];
        
        for (const strategy of strategies) {
            try {
                const result = await strategy();
                if (result.success) return result;
            } catch (e) {
                continue;
            }
        }
        
        return await this.emergencyFallback(error, context);
    }

    async retryWithBackoff(error, context, attempt = 1) {
        if (attempt > this.maxRetries) {
            throw new Error('Máximo de reintentos alcanzado');
        }
        
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        console.log(`🔄 Reintento ${attempt} en ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        try {
            // Reintentar la operación original
            const result = await this.retryOriginalOperation(context);
            return { success: true, message: `Reintento exitoso en intento ${attempt}`, result };
        } catch (retryError) {
            return await this.retryWithBackoff(error, context, attempt + 1);
        }
    }

    async degradeGracefully(error, context) {
        console.log('🔄 Degradación elegante activada');
        
        // Reducir funcionalidades pero mantener el servicio
        return {
            success: true,
            message: 'Sistema operando en modo degradado',
            degraded: true,
            features: {
                realTimeData: false,
                autoOptimization: false,
                externalAPIs: false,
                basicFunctionality: true
            }
        };
    }

    async useMockData(error, context) {
        console.log('🎭 Usando datos de simulación');
        
        // Datos mock para mantener el sistema funcionando
        const mockData = {
            campaigns: [
                {
                    id: 'mock_1',
                    name: 'Campaña Simulada',
                    status: 'active',
                    performance: {
                        impressions: 1000,
                        clicks: 50,
                        conversions: 5,
                        spend: 25.50
                    }
                }
            ],
            analytics: {
                totalImpressions: 5000,
                totalClicks: 250,
                totalConversions: 25,
                totalSpend: 127.50
            }
        };
        
        return {
            success: true,
            message: 'Usando datos de simulación',
            data: mockData,
            isMock: true
        };
    }

    async emergencyFallback(error, context) {
        console.log('🚨 Activando modo emergencia');
        
        // Último recurso - mantener lo básico funcionando
        return {
            success: true,
            message: 'Sistema en modo emergencia',
            emergency: true,
            functionality: 'basic_only',
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = new AutoRepairSystem();