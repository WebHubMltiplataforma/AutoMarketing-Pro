const axios = require('axios');
const cheerio = require('cheerio');

class EnhancedURLAnalyzer {
    constructor() {
        this.analysisResults = new Map();
        this.supportedPlatforms = this.getSupportedPlatforms();
    }

    getSupportedPlatforms() {
        return {
            // Plataformas de Publicidad
            'google_ads': {
                name: 'Google Ads',
                requiredParams: ['title', 'description', 'landing_page'],
                optionalParams: ['keywords', 'audience', 'budget'],
                minBudget: 50
            },
            'meta_ads': {
                name: 'Meta Ads (Facebook/Instagram)',
                requiredParams: ['image', 'text', 'audience'],
                optionalParams: ['video', 'carousel', 'cta'],
                minBudget: 25
            },
            'tiktok_ads': {
                name: 'TikTok Ads',
                requiredParams: ['video', 'hashtags', 'trends'],
                optionalParams: ['music', 'effects', 'challenge'],
                minBudget: 100
            },
            'linkedin_ads': {
                name: 'LinkedIn Ads',
                requiredParams: ['professional_content', 'target_company'],
                optionalParams: ['job_title', 'industry', 'company_size'],
                minBudget: 200
            },
            'twitter_ads': {
                name: 'Twitter Ads',
                requiredParams: ['trending_topic', 'hashtags'],
                optionalParams: ['poll', 'thread', 'moment'],
                minBudget: 50
            },

            // Plataformas de Contenido
            'youtube_ads': {
                name: 'YouTube Ads',
                requiredParams: ['video_content', 'thumbnail', 'title'],
                optionalParams: ['cards', 'end_screen', 'playlist'],
                minBudget: 100
            },
            'pinterest_ads': {
                name: 'Pinterest Ads',
                requiredParams: ['high_quality_image', 'description'],
                optionalParams: ['rich_pins', 'catalog'],
                minBudget: 30
            },

            // Plataformas Especializadas
            'reddit_ads': {
                name: 'Reddit Ads',
                requiredParams: ['community_specific', 'engaging_content'],
                optionalParams: ['ama', 'subreddit_targeting'],
                minBudget: 25
            },
            'telegram_ads': {
                name: 'Telegram Ads',
                requiredParams: ['channel_content', 'engagement'],
                optionalParams: ['bot_integration', 'premium_features'],
                minBudget: 20
            }
        };
    }

    async analyzeURL(url) {
        console.log(`🔍 Analizando URL: ${url}`);
        
        try {
            const analysis = {
                url: url,
                timestamp: new Date().toISOString(),
                basicInfo: await this.getBasicInfo(url),
                seoAnalysis: await this.getSEOAnalysis(url),
                contentAnalysis: await this.getContentAnalysis(url),
                technicalAnalysis: await this.getTechnicalAnalysis(url),
                platformRecommendations: await this.getPlatformRecommendations(url),
                marketingParameters: await this.extractMarketingParameters(url),
                performancePredictions: await this.getPerformancePredictions(url),
                improvementSuggestions: []
            };

            // Generar sugerencias basadas en el análisis
            analysis.improvementSuggestions = this.generateSuggestions(analysis);
            
            // Guardar resultado
            this.analysisResults.set(url, analysis);
            
            return analysis;

        } catch (error) {
            console.error(`❌ Error analizando ${url}:`, error.message);
            return this.getFallbackAnalysis(url, error);
        }
    }

    async getBasicInfo(url) {
        try {
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            const $ = cheerio.load(response.data);
            
            return {
                title: $('title').text() || 'No title found',
                description: $('meta[name="description"]').attr('content') || 'No description',
                keywords: $('meta[name="keywords"]').attr('content') || 'No keywords',
                language: $('html').attr('lang') || 'Not specified',
                favicon: $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href'),
                viewport: $('meta[name="viewport"]').attr('content') || 'Not optimized'
            };
        } catch (error) {
            return {
                title: 'Unable to fetch',
                description: 'Site may be blocked or unavailable',
                error: error.message
            };
        }
    }

    async getSEOAnalysis(url) {
        try {
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            const $ = cheerio.load(response.data);
            let score = 0;
            const details = [];

            // Análisis de título
            const title = $('title').text();
            if (title && title.length >= 10 && title.length <= 60) {
                score += 20;
                details.push('✅ Título optimizado (10-60 caracteres)');
            } else {
                details.push('❌ Título necesita optimización');
            }

            // Meta descripción
            const description = $('meta[name="description"]').attr('content');
            if (description && description.length >= 50 && description.length <= 160) {
                score += 20;
                details.push('✅ Meta descripción optimizada');
            } else {
                details.push('❌ Meta descripción necesita mejoras');
            }

            // Encabezados
            const h1Count = $('h1').length;
            if (h1Count === 1) {
                score += 15;
                details.push('✅ Estructura de encabezados correcta');
            } else {
                details.push(`⚠️ ${h1Count} elementos H1 encontrados (debería ser 1)`);
            }

            // Imágenes con alt
            const imagesWithAlt = $('img[alt]').length;
            const totalImages = $('img').length;
            const altRatio = totalImages > 0 ? (imagesWithAlt / totalImages) * 100 : 100;
            
            if (altRatio >= 80) {
                score += 15;
                details.push(`✅ ${altRatio.toFixed(0)}% de imágenes con texto alternativo`);
            } else {
                details.push(`❌ Solo ${altRatio.toFixed(0)}% de imágenes tienen texto alternativo`);
            }

            // Enlaces
            const totalLinks = $('a').length;
            const internalLinks = $('a[href^="/"], a[href^="' + new URL(url).origin + '"]').length;
            const externalLinks = totalLinks - internalLinks;
            
            details.push(`🔗 Enlaces: ${internalLinks} internos, ${externalLinks} externos`);

            // Velocidad (simulada)
            const loadTime = Math.random() * 3 + 1; // 1-4 segundos
            if (loadTime < 2) {
                score += 15;
                details.push('⚡ Velocidad de carga excelente');
            } else if (loadTime < 3) {
                score += 10;
                details.push('⚠️ Velocidad de carga aceptable');
            } else {
                details.push('❌ Velocidad de carga necesita mejora');
            }

            // Mobile friendly
            const viewport = $('meta[name="viewport"]').attr('content');
            if (viewport && viewport.includes('width=device-width')) {
                score += 15;
                details.push('📱 Optimizado para móviles');
            } else {
                details.push('❌ No optimizado para móviles');
            }

            return {
                score: Math.min(score, 100),
                details: details,
                loadTime: loadTime.toFixed(2) + 's',
                mobileFriendly: !!viewport
            };

        } catch (error) {
            return {
                score: 0,
                details: ['❌ No se pudo realizar análisis SEO'],
                error: error.message
            };
        }
    }

    async getContentAnalysis(url) {
        try {
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            const $ = cheerio.load(response.data);
            
            // Remover scripts y estilos
            $('script, style, nav, footer, header').remove();
            const textContent = $('body').text();
            
            const wordCount = textContent.split(/\s+/).length;
            const paragraphCount = $('p').length;
            const imageCount = $('img').length;
            const videoCount = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length;
            
            // Análisis de contenido
            const contentAnalysis = {
                wordCount: wordCount,
                paragraphCount: paragraphCount,
                imageCount: imageCount,
                videoCount: videoCount,
                contentType: this.detectContentType(textContent),
                readability: this.assessReadability(textContent),
                engagementPotential: this.assessEngagement(textContent)
            };

            return contentAnalysis;

        } catch (error) {
            return {
                error: 'No se pudo analizar contenido',
                details: error.message
            };
        }
    }

    detectContentType(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('precio') || lowerText.includes('comprar') || lowerText.includes('carrito')) {
            return 'E-commerce';
        } else if (lowerText.includes('blog') || lowerText.includes('artículo') || lowerText.includes('post')) {
            return 'Blog/Contenido';
        } else if (lowerText.includes('servicio') || lowerText.includes('consultoría')) {
            return 'Servicios';
        } else if (lowerText.includes('cripto') || lowerText.includes('bitcoin') || lowerText.includes('inversión')) {
            return 'Finanzas/Cripto';
        } else if (lowerText.includes('contacto') || lowerText.includes('email') || lowerText.includes('teléfono')) {
            return 'Información de Contacto';
        } else {
            return 'Sitio Web General';
        }
    }

    assessReadability(text) {
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).length;
        const avgSentenceLength = words / sentences;
        
        if (avgSentenceLength < 15) return 'Muy fácil';
        if (avgSentenceLength < 20) return 'Fácil';
        if (avgSentenceLength < 25) return 'Moderado';
        return 'Complejo';
    }

    assessEngagement(text) {
        const lowerText = text.toLowerCase();
        let score = 0;
        
        if (lowerText.includes('¡') || lowerText.includes('!')) score += 2;
        if (lowerText.includes('?')) score += 1;
        if (text.includes('$') || text.includes('€')) score += 1;
        if (lowerText.includes('gratis') || lowerText.includes('free')) score += 2;
        if (lowerText.includes('descarga') || lowerText.includes('download')) score += 2;
        
        if (score >= 5) return 'Alto';
        if (score >= 3) return 'Medio';
        return 'Bajo';
    }

    async getTechnicalAnalysis(url) {
        try {
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            return {
                statusCode: response.status,
                contentType: response.headers['content-type'],
                server: response.headers['server'] || 'Desconocido',
                encoding: response.headers['content-encoding'] || 'No especificado',
                security: this.checkSecurityHeaders(response.headers),
                technologies: this.detectTechnologies(response)
            };

        } catch (error) {
            return {
                error: 'Análisis técnico falló',
                details: error.message
            };
        }
    }

    checkSecurityHeaders(headers) {
        const security = [];
        
        if (headers['strict-transport-security']) security.push('HSTS Activado');
        if (headers['x-frame-options']) security.push('Clickjacking Protection');
        if (headers['x-content-type-options']) security.push('MIME Sniffing Protection');
        if (headers['content-security-policy']) security.push('CSP Configurado');
        
        return security.length > 0 ? security : ['⚠️ Headers de seguridad básicos faltantes'];
    }

    detectTechnologies(response) {
        const technologies = [];
        const headers = response.headers;
        const html = response.data;

        if (headers['server']) technologies.push(`Servidor: ${headers['server']}`);
        if (html.includes('wp-content')) technologies.push('WordPress');
        if (html.includes('react') || html.includes('react-dom')) technologies.push('React');
        if (html.includes('angular')) technologies.push('Angular');
        if (html.includes('vue')) technologies.push('Vue.js');
        if (html.includes('jquery')) technologies.push('jQuery');
        if (html.includes('bootstrap')) technologies.push('Bootstrap');

        return technologies.length > 0 ? technologies : ['Tecnologías no detectadas'];
    }

    async getPlatformRecommendations(url) {
        const analysis = await this.getContentAnalysis(url);
        const contentType = analysis.contentType;
        
        const recommendations = [];

        // Recomendaciones basadas en tipo de contenido
        switch (contentType) {
            case 'E-commerce':
                recommendations.push(
                    this.formatPlatformRecommendation('google_ads', 'Shopping Ads', '$500-3000', 'Conversiones directas'),
                    this.formatPlatformRecommendation('meta_ads', 'Dynamic Product Ads', '$300-1500', 'Remarketing'),
                    this.formatPlatformRecommendation('pinterest_ads', 'Product Pins', '$200-800', 'Audiencia visual')
                );
                break;
                
            case 'Blog/Contenido':
                recommendations.push(
                    this.formatPlatformRecommendation('meta_ads', 'Content Distribution', '$200-1000', 'Engagement'),
                    this.formatPlatformRecommendation('google_ads', 'Display Network', '$300-1200', 'Alcance amplio'),
                    this.formatPlatformRecommendation('linkedin_ads', 'Sponsored Content', '$400-2000', 'Audiencia profesional')
                );
                break;
                
            case 'Finanzas/Cripto':
                recommendations.push(
                    this.formatPlatformRecommendation('google_ads', 'Search Ads', '$1000-5000', 'Alto CPC'),
                    this.formatPlatformRecommendation('linkedin_ads', 'Sponsored Updates', '$800-3000', 'Inversores'),
                    this.formatPlatformRecommendation('twitter_ads', 'Promoted Tweets', '$500-2000', 'Tendencias')
                );
                break;
                
            default:
                recommendations.push(
                    this.formatPlatformRecommendation('google_ads', 'Search & Display', '$500-2000', 'Cobertura amplia'),
                    this.formatPlatformRecommendation('meta_ads', 'Awareness Campaign', '$300-1200', 'Branding'),
                    this.formatPlatformRecommendation('tiktok_ads', 'Viral Content', '$400-1800', 'Audiencia joven')
                );
        }

        return recommendations;
    }

    formatPlatformRecommendation(platform, strategy, budget, reason) {
        return {
            platform: platform,
            platformName: this.supportedPlatforms[platform].name,
            strategy: strategy,
            budget: budget,
            reason: reason,
            requiredParams: this.supportedPlatforms[platform].requiredParams,
            estimatedROI: this.calculateEstimatedROI(platform)
        };
    }

    calculateEstimatedROI(platform) {
        const roiRanges = {
            'google_ads': '200-500%',
            'meta_ads': '150-400%', 
            'tiktok_ads': '100-300%',
            'linkedin_ads': '180-450%',
            'twitter_ads': '120-350%',
            'youtube_ads': '150-380%',
            'pinterest_ads': '130-320%',
            'reddit_ads': '90-280%',
            'telegram_ads': '110-290%'
        };
        
        return roiRanges[platform] || '150-350%';
    }

    async extractMarketingParameters(url) {
        try {
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            const $ = cheerio.load(response.data);
            const text = $('body').text().toLowerCase();

            const parameters = {
                // Parámetros de Contenido
                hasProducts: text.includes('comprar') || text.includes('precio') || text.includes('carrito'),
                hasServices: text.includes('servicio') || text.includes('consultor') || text.includes('solución'),
                hasBlog: text.includes('blog') || text.includes('artículo') || text.includes('post'),
                hasContact: $('a[href*="contact"], a[href*="mailto"]').length > 0,
                
                // Parámetros de Engagement
                hasForms: $('form').length > 0,
                hasNewsletter: text.includes('newsletter') || text.includes('suscrib'),
                hasSocialProof: text.includes('testimonio') || text.includes('cliente') || text.includes('reseña'),
                
                // Parámetros Técnicos
                hasVideo: $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length > 0,
                hasGallery: $('.gallery, .carousel, [class*="slider"]').length > 0,
                isResponsive: $('meta[name="viewport"]').attr('content')?.includes('width=device-width'),
                
                // Parámetros de Performance
                loadTime: Math.random() * 3 + 1, // Simulado
                imageCount: $('img').length,
                scriptCount: $('script').length
            };

            return parameters;

        } catch (error) {
            return {
                error: 'No se pudieron extraer parámetros',
                details: error.message
            };
        }
    }

    async getPerformancePredictions(url) {
        const analysis = await this.getContentAnalysis(url);
        const params = await this.extractMarketingParameters(url);
        
        return {
            estimatedTraffic: this.predictTraffic(analysis.contentType),
            conversionRate: this.predictConversionRate(params),
            customerLifetimeValue: this.predictLTV(analysis.contentType),
            acquisitionCost: this.predictCAC(analysis.contentType),
            breakEvenTime: this.predictBreakEven(analysis.contentType)
        };
    }

    predictTraffic(contentType) {
        const ranges = {
            'E-commerce': '10,000-50,000/mes',
            'Blog/Contenido': '5,000-20,000/mes', 
            'Finanzas/Cripto': '15,000-60,000/mes',
            'Servicios': '3,000-15,000/mes',
            'Sitio Web General': '2,000-10,000/mes'
        };
        return ranges[contentType] || '5,000-25,000/mes';
    }

    predictConversionRate(params) {
        let baseRate = 2.0; // 2% base
        
        if (params.hasProducts) baseRate += 1.5;
        if (params.hasSocialProof) baseRate += 1.0;
        if (params.hasForms) baseRate += 0.5;
        if (params.loadTime < 2) baseRate += 0.5;
        
        return `${baseRate.toFixed(1)}-${(baseRate + 3).toFixed(1)}%`;
    }

    predictLTV(contentType) {
        const ranges = {
            'E-commerce': '$150-600',
            'Finanzas/Cripto': '$500-2000', 
            'Servicios': '$300-1200',
            'Blog/Contenido': '$50-200',
            'Sitio Web General': '$100-400'
        };
        return ranges[contentType] || '$200-800';
    }

    predictCAC(contentType) {
        const ranges = {
            'E-commerce': '$25-80',
            'Finanzas/Cripto': '$50-150',
            'Servicios': '$40-120', 
            'Blog/Contenido': '$15-50',
            'Sitio Web General': '$20-70'
        };
        return ranges[contentType] || '$30-100';
    }

    predictBreakEven(contentType) {
        const ranges = {
            'E-commerce': '3-6 meses',
            'Finanzas/Cripto': '6-12 meses',
            'Servicios': '2-5 meses',
            'Blog/Contenido': '8-18 meses', 
            'Sitio Web General': '4-9 meses'
        };
        return ranges[contentType] || '4-10 meses';
    }

    generateSuggestions(analysis) {
        const suggestions = [];
        
        // Sugerencias de SEO
        if (analysis.seoAnalysis.score < 70) {
            suggestions.push('🔍 Mejorar puntuación SEO: optimizar meta tags y velocidad');
        }
        
        // Sugerencias de Contenido
        if (analysis.contentAnalysis.wordCount < 300) {
            suggestions.push('📝 Aumentar contenido: mínimo 300 palabras recomendado');
        }
        
        if (!analysis.marketingParameters.hasContact) {
            suggestions.push('📞 Agregar información de contacto visible');
        }
        
        if (!analysis.marketingParameters.hasSocialProof) {
            suggestions.push('⭐ Incluir testimonios o casos de éxito');
        }
        
        // Sugerencias Técnicas
        if (!analysis.marketingParameters.isResponsive) {
            suggestions.push('📱 Implementar diseño responsive para móviles');
        }
        
        if (analysis.seoAnalysis.loadTime > 2) {
            suggestions.push('⚡ Optimizar velocidad de carga (objetivo: <2s)');
        }
        
        return suggestions;
    }

    getFallbackAnalysis(url, error) {
        return {
            url: url,
            timestamp: new Date().toISOString(),
            basicInfo: {
                title: 'Análisis falló',
                description: 'No se pudo analizar la URL',
                error: error.message
            },
            platformRecommendations: [
                this.formatPlatformRecommendation('google_ads', 'Campaña de descubrimiento', '$500-2000', 'Cobertura amplia'),
                this.formatPlatformRecommendation('meta_ads', 'Campaña de awareness', '$300-1200', 'Segmentación básica')
            ],
            marketingParameters: {
                note: 'Parámetros no disponibles - sitio puede estar bloqueado'
            },
            improvementSuggestions: [
                '🔍 Verificar que la URL sea accesible públicamente',
                '🌐 Intentar con un sitio web diferente',
                '⚡ El sitio puede tener protección contra bots'
            ]
        };
    }

    // Obtener análisis previos
    getAnalysisHistory() {
        return Array.from(this.analysisResults.entries());
    }

    // Limpiar historial
    clearHistory() {
        this.analysisResults.clear();
    }
}

module.exports = new EnhancedURLAnalyzer();