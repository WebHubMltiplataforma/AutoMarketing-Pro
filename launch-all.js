const APIConnector = require('./connectors/api-connector');
const PlatformManager = require('./connectors/platform-manager');
const RepoConnector = require('./connectors/repo-connector');

class AutoConnectLauncher {
    constructor() {
        this.connectionStatus = {
            apis: null,
            platforms: null,
            repositories: null,
            overall: 'disconnected'
        };
    }

    async launchAll() {
        console.log('🎯 INICIANDO SISTEMA AUTO-CONECTABLE...\n');
        
        try {
            // 1. Conectar a todas las APIs
            console.log('🔌 === CONECTANDO APIS ===');
            this.connectionStatus.apis = await APIConnector.autoConnectAll();
            
            // 2. Conectar a repositorios
            console.log('\n📁 === CONECTANDO REPOSITORIOS ===');
            this.connectionStatus.repositories = await RepoConnector.autoConnectRepos();
            
            // 3. Detectar plataformas de despliegue
            console.log('\n🌐 === DETECTANDO PLATAFORMAS ===');
            this.connectionStatus.platforms = await PlatformManager.detectAvailablePlatforms();
            
            // 4. Sincronizar automáticamente
            console.log('\n🔄 === SINCRONIZACIÓN AUTOMÁTICA ===');
            await this.autoSyncAll();
            
            // 5. Estado final
            this.connectionStatus.overall = 'connected';
            await this.showFinalStatus();
            
            console.log('\n🎉 SISTEMA COMPLETAMENTE CONECTADO Y OPERATIVO');
            
        } catch (error) {
            console.error('❌ Error en el lanzamiento:', error);
            this.connectionStatus.overall = 'failed';
        }
    }

    async autoSyncAll() {
        // Sincronizar repositorios
        if (RepoConnector.autoSync) {
            await RepoConnector.autoSyncRepos();
        }
        
        // Obtener datos de cripto automáticamente
        try {
            const cryptoData = await APIConnector.getCryptoData();
            console.log(`📊 Datos de cripto obtenidos: ${cryptoData.length} monedas`);
        } catch (error) {
            console.log('⚠️ No se pudieron obtener datos de cripto');
        }
        
        // Verificar despliegues automáticamente
        const deploymentStatus = await PlatformManager.monitorDeployments();
        console.log('📦 Estado de despliegues verificado');
    }

    async showFinalStatus() {
        console.log('\n📊 === ESTADO FINAL DE CONEXIONES ===');
        
        // Estado de APIs
        const apiStatus = APIConnector.getConnectionStatus();
        console.log(`🔌 APIs: ${apiStatus.connected}/${apiStatus.total} conectadas`);
        
        // Estado de Repositorios  
        const repoStatus = RepoConnector.getConnectionStatus();
        console.log(`📁 Repositorios: ${repoStatus.connected}/${repoStatus.total} conectados`);
        
        // Estado de Plataformas
        console.log(`🌐 Plataformas: ${this.connectionStatus.platforms.length} disponibles`);
        
        // URLs activas
        console.log('\n🌍 === URLs ACTIVAS ===');
        console.log('• Aplicación Principal: http://localhost:3000');
        console.log('• API Health: http://localhost:3000/api/health');
        
        if (this.connectionStatus.platforms.includes('github_pages')) {
            console.log('• GitHub Pages: https://usuario.github.io/auto-marketing-pro');
        }
        if (this.connectionStatus.platforms.includes('netlify')) {
            console.log('• Netlify: https://auto-marketing-pro.netlify.app');
        }
    }

    // Monitoreo continuo
    startContinuousMonitoring() {
        console.log('\n👁️ === INICIANDO MONITOREO CONTINUO ===');
        
        // Verificar conexiones cada 5 minutos
        setInterval(async () => {
            console.log('🔄 Verificación automática de conexiones...');
            await APIConnector.autoReconnect();
            await RepoConnector.autoSyncRepos();
        }, 5 * 60 * 1000);
        
        // Actualizar datos de cripto cada 2 minutos
        setInterval(async () => {
            try {
                await APIConnector.getCryptoData();
                console.log('💰 Datos de cripto actualizados');
            } catch (error) {
                console.log('⚠️ Error actualizando datos de cripto');
            }
        }, 2 * 60 * 1000);
    }
}

// Ejecutar automáticamente si es el archivo principal
if (require.main === module) {
    const launcher = new AutoConnectLauncher();
    
    launcher.launchAll().then(() => {
        launcher.startContinuousMonitoring();
    }).catch(console.error);
}

module.exports = AutoConnectLauncher;