class AutoMarketingApp {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.init();
    }

    init() {
        console.log('🚀 AutoMarketing Pro iniciado');
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('promote-btn').addEventListener('click', () => {
            this.handlePromotion();
        });

        document.getElementById('analyze-btn').addEventListener('click', () => {
            this.handleAnalysis();
        });

        // Enter key support
        document.getElementById('url-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handlePromotion();
        });

        document.getElementById('demo-url').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleAnalysis();
        });
    }

    async handlePromotion() {
        const url = document.getElementById('url-input').value.trim();
        
        if (!this.isValidURL(url)) {
            this.showMessage('❌ Ingresa una URL válida', 'error');
            return;
        }

        this.showLoading('Creando campaña automática...');
        
        try {
            const response = await fetch(`${this.baseURL}/promote/auto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) throw new Error('Error del servidor');
            
            const result = await response.json();
            this.showMessage('✅ ¡Campaña creada exitosamente!', 'success');
            this.displayPromotionResult(result);
            
        } catch (error) {
            console.error('Error:', error);
            this.showMessage('⚠️ Modo demo activado - Mostrando simulación', 'info');
            this.showDemoResult(this.generateDemoPromotion(url));
        }
    }

    async handleAnalysis() {
        const url = document.getElementById('demo-url').value.trim();
        
        if (!this.isValidURL(url)) {
            this.showMessage('❌ Ingresa una URL válida para analizar', 'error');
            return;
        }

        this.showLoading('Analizando URL...');
        
        try {
            const response = await fetch(`${this.baseURL}/analyze/url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) throw new Error('Error del servidor');
            
            const analysis = await response.json();
            this.displayAnalysisResult(analysis);
            
        } catch (error) {
            console.error('Error:', error);
            this.showMessage('⚠️ Mostrando análisis de demostración', 'info');
            this.displayAnalysisResult(this.generateDemoAnalysis(url));
        }
    }

    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    showLoading(message) {
        const results = document.getElementById('results');
        results.innerHTML = `<div class="loading">${message}</div>`;
    }

    showMessage(message, type) {
        const results = document.getElementById('results');
        results.innerHTML = `<div class="${type}-message">${message}</div>`;
    }

    displayPromotionResult(result) {
        const results = document.getElementById('results');
        
        let platformsHTML = '';
        if (result.campaign && result.campaign.platforms) {
            platformsHTML = result.campaign.platforms.map(platform => `
                <div class="platform-card">
                    <h4>${platform.name.toUpperCase()} Ads</h4>
                    <p><strong>Estrategia:</strong> ${platform.strategy}</p>
                    <p><strong>Presupuesto:</strong> ${platform.budget}</p>
                </div>
            `).join('');
        }

        let stepsHTML = '';
        if (result.next_steps) {
            stepsHTML = result.next_steps.map(step => `
                <div class="result-item">${step}</div>
            `).join('');
        }

        results.innerHTML = `
            <div class="success-message">
                <h3>🎉 ¡Campaña Creada Exitosamente!</h3>
                <p><strong>URL:</strong> ${result.campaign?.url || 'N/A'}</p>
                <p><strong>ID:</strong> ${result.campaign?.id || 'N/A'}</p>
                <p><strong>Estado:</strong> <span style="color: green;">● Activa</span></p>
            </div>
            
            <h4>📊 Plataformas Activadas:</h4>
            ${platformsHTML}
            
            <h4>⚡ Progreso Automático:</h4>
            ${stepsHTML}
            
            <div class="result-item">
                <strong>📈 Monitoreo en Tiempo Real:</strong> El sistema está optimizando automáticamente la campaña
            </div>
        `;
    }

    displayAnalysisResult(analysis) {
        const results = document.getElementById('results');
        
        let platformsHTML = '';
        if (analysis.recommendedPlatforms) {
            platformsHTML = analysis.recommendedPlatforms.map(platform => `
                <div class="platform-card">
                    <h4>${platform.platform.replace('_', ' ').toUpperCase()}</h4>
                    <p><strong>Razón:</strong> ${platform.reason}</p>
                    <p><strong>CPC Estimado:</strong> ${platform.estimatedCPC}</p>
                    <p><strong>Presupuesto Recomendado:</strong> ${platform.budget}</p>
                    <p><strong>Targeting:</strong> ${platform.targeting || 'Automático'}</p>
                </div>
            `).join('');
        }

        let suggestionsHTML = '';
        if (analysis.suggestions) {
            suggestionsHTML = analysis.suggestions.map(suggestion => `
                <div class="result-item">${suggestion}</div>
            `).join('');
        }

        results.innerHTML = `
            <div class="result-item">
                <h3>🔍 Análisis Completado</h3>
                <p><strong>URL:</strong> ${analysis.url}</p>
                <p><strong>SEO Score:</strong> ${analysis.seoScore}%</p>
                <p><strong>Velocidad:</strong> ${analysis.loadingSpeed || 'Buena'}</p>
                <p><strong>Móvil:</strong> ${analysis.mobileFriendly ? '✅ Optimizado' : '⚠️ Por mejorar'}</p>
            </div>
            
            <h4>🎯 Plataformas Recomendadas:</h4>
            ${platformsHTML}
            
            <h4>💡 Sugerencias de Mejora:</h4>
            ${suggestionsHTML}
            
            ${analysis.estimatedResults ? `
            <div class="result-item">
                <h4>📈 Resultados Estimados:</h4>
                <p><strong>Impresiones Mensuales:</strong> ${analysis.estimatedResults.monthly_impressions}</p>
                <p><strong>Costo por Conversión:</strong> ${analysis.estimatedResults.cost_per_conversion}</p>
                <p><strong>ROI Estimado:</strong> ${analysis.estimatedResults.roi_estimate}</p>
            </div>
            ` : ''}
        `;
    }

    generateDemoPromotion(url) {
        return {
            success: true,
            message: '¡Campaña demo creada exitosamente!',
            campaign: {
                id: 'demo_' + Math.random().toString(36).substr(2, 8),
                url: url,
                title: `Campaña Demo - ${new URL(url).hostname}`,
                status: 'active',
                platforms: [
                    {
                        name: 'google_ads',
                        budget: '$750-1800',
                        strategy: 'Búsqueda inteligente y remarketing'
                    },
                    {
                        name: 'meta_ads',
                        budget: '$450-1200', 
                        strategy: 'Audiencias lookalike y engagement'
                    }
                ]
            },
            next_steps: [
                '✅ Análisis de competencia completado',
                '✅ Palabras clave identificadas automáticamente',
                '✅ Audiencia objetivo segmentada',
                '✅ Creativos generados por IA',
                '⚡ Optimización en tiempo real ACTIVADA'
            ]
        };
    }

    generateDemoAnalysis(url) {
        return {
            url: url,
            status: 'active',
            title: `Análisis Demo - ${new URL(url).hostname}`,
            seoScore: 78,
            loadingSpeed: 'good',
            mobileFriendly: true,
            recommendedPlatforms: [
                {
                    platform: 'google_ads',
                    reason: 'Alto potencial de conversión en este nicho',
                    estimatedCPC: '$1.50-4.00',
                    budget: '$600-2200',
                    targeting: 'Búsqueda y Display Network'
                },
                {
                    platform: 'meta_ads',
                    reason: 'Excelente para engagement y brand awareness',
                    estimatedCPC: '$0.80-2.50',
                    budget: '$400-1500',
                    targeting: 'Intereses y comportamientos'
                }
            ],
            suggestions: [
                '🔍 Mejorar meta description para aumentar CTR',
                '🎯 Agregar más llamadas a la acción',
                '📱 Optimizar experiencia móvil',
                '⚡ Reducir tiempo de carga',
                '💡 Crear contenido más valuable'
            ],
            estimatedResults: {
                monthly_impressions: '45,000 - 180,000',
                cost_per_conversion: '$18 - $52',
                roi_estimate: '280% - 650%'
            }
        };
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new AutoMarketingApp();
});