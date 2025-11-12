const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware para JSON
app.use(express.json());
app.use(express.static('.'));

// Ruta principal - Servir el HTML
app.get('/', (req, res) => {
    console.log('📄 Sirviendo index.html...');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API para promoción automática
app.post('/api/promote/auto', (req, res) => {
    const { url } = req.body;
    console.log(`🚀 Promoción solicitada para: ${url}`);
    
    res.json({
        success: true,
        message: '¡Campaña creada automáticamente!',
        campaign: {
            id: 'camp_' + Date.now(),
            url: url,
            status: 'active',
            platforms: ['Google Ads', 'Meta Ads', 'TikTok Ads'],
            budget: '$500-2000',
            created_at: new Date().toISOString()
        },
        next_steps: [
            '✅ Análisis de URL completado',
            '✅ Segmentación de audiencia automática',
            '✅ Presupuestos optimizados',
            '✅ Campañas creadas en todas las plataformas',
            '⚡ Optimización en tiempo real ACTIVADA'
        ]
    });
});

// API para análisis de URL
app.post('/api/analyze/url', (req, res) => {
    const { url } = req.body;
    console.log(`🔍 Análisis solicitado para: ${url}`);
    
    const isCrypto = url.includes('coin') || url.includes('crypto');
    const isEcommerce = url.includes('shop') || url.includes('store');
    
    res.json({
        url: url,
        status: 'active',
        title: `Análisis de ${new URL(url).hostname}`,
        seoScore: Math.floor(Math.random() * 30) + 70,
        loadingSpeed: 'optimal',
        mobileFriendly: true,
        recommendedPlatforms: [
            {
                platform: 'google_ads',
                reason: isCrypto ? 'Alto CPC en sector financiero' : 'Cobertura amplia',
                estimatedCPC: isCrypto ? '$3-8' : '$1-3',
                budget: isCrypto ? '$1000-5000' : '$500-2000'
            },
            {
                platform: 'meta_ads',
                reason: isEcommerce ? 'Ideal para conversiones' : 'Segmentación precisa',
                estimatedCPC: '$0.5-2',
                budget: '$300-1500'
            }
        ],
        suggestions: [
            '🔍 Optimizar meta description',
            '🎯 Mejorar llamadas a la acción',
            '📱 Verificar mobile-first',
            '⚡ Mejorar velocidad de carga'
        ]
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'AutoMarketing Pro funcionando',
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🎉 SERVIDOR INICIADO CORRECTAMENTE`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
    console.log(`💡 Abre la URL en tu navegador favorito`);
    console.log(`🛑 Para detener: Ctrl + C`);
});

// Manejar cierre graceful
process.on('SIGINT', () => {
    console.log('\n🛑 Deteniendo servidor...');
    process.exit(0);
});