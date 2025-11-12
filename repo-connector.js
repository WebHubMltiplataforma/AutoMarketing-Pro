class RepoConnector {
    constructor() {
        this.repositories = new Map();
        this.autoSync = true;
    }

    // Conectar automáticamente a repositorios
    async autoConnectRepos() {
        console.log('🔗 Conectando a repositorios...');
        
        const repos = [
            {
                name: 'auto-marketing-pro',
                url: 'https://github.com/usuario/auto-marketing-pro',
                type: 'github',
                autoSync: true
            },
            {
                name: 'crypto-dashboard', 
                url: 'https://github.com/usuario/crypto-dashboard',
                type: 'github',
                autoSync: true
            },
            {
                name: 'marketing-templates',
                url: 'https://gitlab.com/usuario/marketing-templates',
                type: 'gitlab', 
                autoSync: true
            }
        ];

        for (const repo of repos) {
            try {
                await this.connectToRepo(repo);
                console.log(`✅ Conectado a: ${repo.name}`);
            } catch (error) {
                console.log(`❌ Error conectando a ${repo.name}:`, error.message);
            }
        }

        return this.getConnectionStatus();
    }

    async connectToRepo(repoConfig) {
        const connection = {
            ...repoConfig,
            connectedAt: new Date(),
            status: 'connecting'
        };

        try {
            // Simular conexión a repositorio
            await this.delay(1000);
            
            // Verificar si el repositorio es accesible
            const isAccessible = await this.checkRepoAccessibility(repoConfig.url);
            
            if (isAccessible) {
                connection.status = 'connected';
                connection.lastSync = new Date();
                this.repositories.set(repoConfig.name, connection);
            } else {
                throw new Error('Repositorio no accesible');
            }
            
        } catch (error) {
            connection.status = 'failed';
            connection.error = error.message;
            this.repositories.set(repoConfig.name, connection);
            throw error;
        }
    }

    async checkRepoAccessibility(url) {
        try {
            const response = await fetch(url);
            return response.status === 200 || response.status === 404;
            // 404 también es válido porque significa que el repo existe pero no tiene web
        } catch (error) {
            return false;
        }
    }

    // Sincronizar automáticamente con repositorios
    async autoSyncRepos() {
        console.log('🔄 Sincronizando repositorios...');
        
        const syncResults = [];
        
        for (const [repoName, repo] of this.repositories) {
            if (repo.autoSync && repo.status === 'connected') {
                try {
                    const result = await this.syncRepo(repoName);
                    syncResults.push({
                        repository: repoName,
                        status: 'synced',
                        result: result
                    });
                    console.log(`✅ Sincronizado: ${repoName}`);
                } catch (error) {
                    syncResults.push({
                        repository: repoName,
                        status: 'sync_failed',
                        error: error.message
                    });
                    console.log(`❌ Error sincronizando ${repoName}:`, error.message);
                }
            }
        }
        
        return syncResults;
    }

    async syncRepo(repoName) {
        const repo = this.repositories.get(repoName);
        
        // Simular sincronización
        await this.delay(2000);
        
        // Actualizar información del repositorio
        repo.lastSync = new Date();
        repo.commitCount = (repo.commitCount || 0) + 1;
        repo.lastCommit = {
            hash: 'abc123' + Date.now(),
            message: 'Auto-sync: ' + new Date().toISOString(),
            author: 'auto-marketing-bot'
        };
        
        return {
            syncTime: repo.lastSync,
            changes: Math.floor(Math.random() * 5) + 1,
            commit: repo.lastCommit
        };
    }

    // Obtener estado de todas las conexiones
    getConnectionStatus() {
        const status = {
            total: this.repositories.size,
            connected: 0,
            failed: 0,
            syncing: 0,
            repositories: {}
        };
        
        for (const [name, repo] of this.repositories) {
            status.repositories[name] = {
                status: repo.status,
                type: repo.type,
                url: repo.url,
                connectedAt: repo.connectedAt,
                lastSync: repo.lastSync
            };
            
            if (repo.status === 'connected') status.connected++;
            if (repo.status === 'failed') status.failed++;
            if (repo.autoSync) status.syncing++;
        }
        
        return status;
    }

    // Buscar repositorios relacionados automáticamente
    async discoverRelatedRepos(keywords = ['marketing', 'automation', 'crypto', 'dashboard']) {
        console.log('🔍 Buscando repositorios relacionados...');
        
        const discoveredRepos = [];
        
        for (const keyword of keywords) {
            try {
                const repos = await this.searchRepositories(keyword);
                discoveredRepos.push(...repos.slice(0, 2)); // Limitar a 2 por keyword
            } catch (error) {
                console.log(`❌ Error buscando ${keyword}:`, error.message);
            }
        }
        
        return discoveredRepos;
    }

    async searchRepositories(query) {
        // Simular búsqueda en GitHub API
        await this.delay(1500);
        
        return [
            {
                name: `${query}-automation`,
                full_name: `awesome-${query}-tools`,
                html_url: `https://github.com/awesome/${query}-tools`,
                description: `Automation tools for ${query}`,
                stars: Math.floor(Math.random() * 1000),
                forks: Math.floor(Math.random() * 100)
            },
            {
                name: `auto-${query}-system`,
                full_name: `tech-company/auto-${query}`,
                html_url: `https://github.com/tech-company/auto-${query}`,
                description: `Automatic ${query} management system`,
                stars: Math.floor(Math.random() * 500),
                forks: Math.floor(Math.random() * 50)
            }
        ];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = new RepoConnector();