const PlatformManager = require('./connectors/platform-manager');

class AutoDeploy {
    constructor() {
        this.deploymentHistory = [];
    }

    async deployToAllPlatforms() {
        console.log('🚀 INICIANDO DESPLIEGUE AUTOMÁTICO MULTIPLATAFORMA\n');
        
        const results = await PlatformManager.autoDeployToAll();
        
        // Guardar en historial
        this.deploymentHistory.push({
            timestamp: new Date(),
            results: results
        });
        
        // Mostrar resultados
        this.showDeploymentResults(results);
        
        return results;
    }

    showDeploymentResults(results) {
        console.log('\n📊 === RESULTADOS DE DESPLIEGUE ===');
        
        let successCount = 0;
        let failCount = 0;
        
        results.forEach(result => {
            if (result.status === 'success') {
                console.log(`✅ ${result.platform}: ${result.result.url}`);
                successCount++;
            } else {
                console.log(`❌ ${result.platform}: ${result.error}`);
                failCount++;
            }
        });
        
        console.log(`\n🎯 Total: ${successCount} exitosos, ${failCount} fallidos`);
        
        if (successCount > 0) {
            console.log('\n🌍 Tu aplicación está disponible en:');
            results.filter(r => r.status === 'success').forEach(r => {
                console.log(`• ${r.platform}: ${r.result.url}`);
            });
        }
    }

    async continuousDeploy() {
        console.log('🔁 ACTIVANDO DESPLIEGUE CONTINUO...');
        
        // Desplegar inmediatamente
        await this.deployToAllPlatforms();
        
        // Y luego cada hora
        setInterval(async () => {
            console.log('\n🕒 Despliegue automático programado...');
            await this.deployToAllPlatforms();
        }, 60 * 60 * 1000); // Cada hora
    }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
    const deployer = new AutoDeploy();
    deployer.deployToAllPlatforms().catch(console.error);
}

module.exports = AutoDeploy;