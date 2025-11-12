const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');

class IndestructibleLaunchSystem {
    constructor() {
        this.maxLaunchAttempts = 10;
        this.healthCheckInterval = 30000; // 30 segundos
        this.isSystemHealthy = false;
    }

    async launch() {
        console.log('🚀 INICIANDO SISTEMA AUTO-ROBUSTO...');
        
        try {
            // 1. Verificar pre-requisitos automáticamente
            await this.autoCheckPrerequisites();
            
            // 2. Instalar dependencias automáticamente
            await this.autoInstallDependencies();
            
            // 3. Configurar sistema automáticamente
            await this.autoConfigureSystem();
            
            // 4. Iniciar servicios con supervisión
            await this.launchWithSupervision();
            
            // 5. Iniciar monitoreo de salud
            this.startHealthMonitoring();
            
            console.log('✅ SISTEMA INICIADO Y AUTO-SUPERVISADO');
            
        } catch (error) {
            console.error('❌ Error en lanzamiento:', error);
            await this.emergencyRecovery();
        }
    }

    async autoCheckPrerequisites() {
        console.log('🔍 Verificando pre-requisitos automáticamente...');
        
        const checks = [
            { name: 'Node.js', check: () => process.version },
            { name: 'NPM', check: () => this.checkNPM() },
            { name: 'MySQL', check: () => this.checkMySQL() },
            { name: 'Directories', check: () => this.checkDirectories() },
            { name: 'Permissions', check: () => this.checkPermissions() }
        ];

        for (const check of checks) {
            try {
                await check.check();
                console.log(`✅ ${check.name}: OK`);
            } catch (error) {
                console.log(`❌ ${check.name}: FALLÓ - ${error.message}`);
                await this.autoFixPrerequisite(check.name, error);
            }
        }
    }

    async autoFixPrerequisite(prerequisite, error) {
        console.log(`🔧 Auto-reparando: ${prerequisite}`);
        
        const fixStrategies = {
            'Node.js': () => this.installNodeJS(),
            'NPM': () => this.installNPM(),
            'MySQL': () => this.setupMySQL(),
            'Directories': () => this.createDirectories(),
            'Permissions': () => this.fixPermissions()
        };

        if (fixStrategies[prerequisite]) {
            await fixStrategies[prerequisite]();
        } else {
            throw new Error(`No se puede auto-reparar: ${prerequisite}`);
        }
    }

    async autoInstallDependencies() {
        console.log('📦 Instalando dependencias automáticamente...');
        
        const packages = [
            'express', 'cors', 'helmet', 'compression',
            'mysql2', 'axios', 'bcryptjs', 'jsonwebtoken',
            'nodemailer', 'cheerio', 'node-cron'
        ];

        for (const pkg of packages) {
            try {
                await this.installPackage(pkg);
                console.log(`✅ ${pkg}: Instalado`);
            } catch (error) {
                console.log(`⚠️ ${pkg}: Error instalación - Usando fallback`);
                await this.usePackageFallback(pkg);
            }
        }
    }

    async autoConfigureSystem() {
        console.log('⚙️ Configurando sistema automáticamente...');
        
        // Crear archivos de configuración automáticamente
        const configs = [
            { file: '.env', template: this.generateEnvTemplate() },
            { file: 'config/database.json', template: this.generateDBConfig() },
            { file: 'config/apis.json', template: this.generateAPIsConfig() }
        ];

        for (const config of configs) {
            if (!fs.existsSync(config.file)) {
                fs.writeFileSync(config.file, config.template);
                console.log(`✅ ${config.file}: Creado automáticamente`);
            }
        }
    }

    async launchWithSupervision() {
        console.log('👁️ Iniciando con supervisión automática...');
        
        let attempts = 0;
        
        while (attempts < this.maxLaunchAttempts) {
            try {
                attempts++;
                console.log(`🚀 Intento de lanzamiento ${attempts}/${this.maxLaunchAttempts}`);
                
                await this.startBackendServer();
                await this.startFrontendServer();
                await this.startBots();
                
                // Verificar que todo esté funcionando
                await this.verifySystemHealth();
                
                this.isSystemHealthy = true;
                console.log('🎉 SISTEMA COMPLETAMENTE OPERATIVO');
                break;
                
            } catch (error) {
                console.log(`❌ Intento ${attempts} falló:`, error.message);
                
                if (attempts < this.maxLaunchAttempts) {
                    await this.performRecoveryActions();
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } else {
                    throw new Error('Máximos intentos de lanzamiento alcanzados');
                }
            }
        }
    }

    async startBackendServer() {
        return new Promise((resolve, reject) => {
            console.log('🔧 Iniciando servidor backend...');
            
            const backendProcess = spawn('node', ['backend/server.js'], {
                stdio: 'inherit',
                detached: true
            });

            backendProcess.on('error', reject);
            
            // Esperar a que el servidor esté listo
            setTimeout(() => {
                this.checkBackendHealth()
                    .then(resolve)
                    .catch(reject);
            }, 5000);
        });
    }

    async checkBackendHealth() {
        const axios = require('axios');
        try {
            const response = await axios.get('http://localhost:3000/api/health', {
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            throw new Error(`Backend health check failed: ${error.message}`);
        }
    }

    async startFrontendServer() {
        console.log('🌐 Iniciando servidor frontend...');
        // El frontend se sirve desde el backend en este caso
        return Promise.resolve();
    }

    async startBots() {
        console.log('🤖 Iniciando bots autónomos...');
        
        const bots = [
            'bots/campaign-bot.js',
            'bots/monitoring-bot.js', 
            'bots/repair-bot.js'
        ];

        for (const bot of bots) {
            try {
                require(`./${bot}`).start();
                console.log(`✅ ${bot}: Iniciado`);
            } catch (error) {
                console.log(`⚠️ ${bot}: Error al iniciar - Continuando sin él`);
            }
        }
    }

    async verifySystemHealth() {
        console.log('❤️ Verificando salud del sistema...');
        
        const healthChecks = [
            () => this.checkBackendHealth(),
            () => this.checkDatabaseConnection(),
            () => this.checkExternalAPIs(),
            () => this.checkDiskSpace()
        ];

        for (const check of healthChecks) {
            try {
                await check();
            } catch (error) {
                throw new Error(`Health check failed: ${error.message}`);
            }
        }
    }

    startHealthMonitoring() {
        console.log('📊 Iniciando monitoreo de salud automático...');
        
        setInterval(async () => {
            try {
                await this.verifySystemHealth();
                this.isSystemHealthy = true;
            } catch (error) {
                console.log('⚠️ Problema de salud detectado:', error.message);
                this.isSystemHealthy = false;
                await this.autoHealSystem();
            }
        }, this.healthCheckInterval);
    }

    async autoHealSystem() {
        console.log('🩺 Ejecutando auto-curación del sistema...');
        
        const healingActions = [
            () => this.restartBackendServer(),
            () => this.clearTempFiles(),
            () => this.resetConnections(),
            () => this.activateEmergencyMode()
        ];

        for (const action of healingActions) {
            try {
                await action();
                console.log('✅ Auto-curación exitosa');
                return;
            } catch (error) {
                console.log(`❌ Acción de curación falló:`, error.message);
                continue;
            }
        }
        
        console.log('🚨 TODAS LAS ACCIONES DE CURACIÓN FALLARON');
    }

    async emergencyRecovery() {
        console.log('🚨 ACTIVANDO MODO EMERGENCIA...');
        
        // Estrategias de último recurso
        const emergencyActions = [
            () => this.startMinimalServer(),
            () => this.activateReadOnlyMode(),
            () => this.notifyAdministrator()
        ];

        for (const action of emergencyActions) {
            try {
                await action();
                console.log('✅ Modo emergencia activado');
                break;
            } catch (error) {
                console.log('❌ Acción de emergencia falló:', error.message);
            }
        }
    }

    // Métodos de utilidad auxiliares
    checkNPM() { return new Promise((resolve) => exec('npm --version', resolve)); }
    checkMySQL() { return new Promise((resolve) => exec('mysql --version', resolve)); }
    
    checkDirectories() {
        const requiredDirs = ['backend', 'frontend', 'config', 'logs'];
        requiredDirs.forEach(dir => {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        });
    }
    
    checkPermissions() {
        // Verificar permisos de escritura
        const testFile = 'test_write.permission';
        try {
            fs.writeFileSync(testFile, 'test');
            fs.unlinkSync(testFile);
        } catch (error) {
            throw new Error('Sin permisos de escritura');
        }
    }

    generateEnvTemplate() {
        return `# Configuración Auto-Generada
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=auto_marketing
JWT_SECRET=auto_generated_secret_${Math.random().toString(36).substring(2)}
`;
    }

    installPackage(pkg) {
        return new Promise((resolve, reject) => {
            exec(`npm install ${pkg} --save`, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }

    async restartBackendServer() {
        console.log('🔄 Reiniciando servidor backend...');
        process.exit(0); // El proceso supervisor reiniciará
    }
}

// Ejecutar automáticamente
const launcher = new IndestructibleLaunchSystem();
launcher.launch().catch(console.error);

// Manejar cierre graceful
process.on('SIGINT', async () => {
    console.log('🛑 Cerrando sistema gracefulmente...');
    process.exit(0);
});

process.on('uncaughtException', async (error) => {
    console.error('💥 Excepción no capturada:', error);
    await launcher.emergencyRecovery();
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('💥 Promesa rechazada no manejada:', reason);
    await launcher.autoHealSystem();
});