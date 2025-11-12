class ParameterScanner {
    constructor() {
        this.detectedParameters = new Map();
    }

    scanAllParameters(analysis) {
        console.log('🔍 Escaneando todos los parámetros...');
        
        const allParameters = {
            // Parámetros de SEO
            seo: this.scanseoParameters(analysis.seoAnalysis),
            
            // Parámetros de Contenido
            content: this.scanContentParameters(analysis.contentAnalysis),
            
            // Parámetros Técnicos
            technical: this.scanTechnicalParameters(analysis.technicalAnalysis),
            
            // Parámetros de Marketing
            marketing: analysis.marketingParameters,
            
            // Parámetros de Performance
            performance: analysis.performancePredictions,
            
            // Parámetros de Plataformas
            platforms: this.scanPlatformParameters(analysis.platformRecommendations)
        };

        // Guardar para referencia
        this.detectedParameters.set(analysis.url, allParameters);
        
        return allParameters;
    }

    scanseoParameters(seoAnalysis) {
        return {
            score: seoAnalysis.score,
            titleLength: seoAnalysis.details.includes('Título optimizado') ? 'Óptimo' : 'Necesita mejora',
            descriptionStatus: seoAnalysis.details.includes('Meta descripción optimizada') ? 'Óptimo' : 'Necesita mejora',
            headingStructure: seoAnalysis.details.includes('Estructura de encabezados correcta') ? 'Correcta' : 'Incorrecta',
            imageOptimization: seoAnalysis.details.find(d => d.includes('imágenes con texto alternativo')) || 'No optimizado',
            mobileFriendly: seoAnalysis.mobileFriendly ? 'Sí' : 'No',
            loadTime: seoAnalysis.loadTime,
            recommendations: seoAnalysis.details.filter(d => d.includes('❌') || d.includes('⚠️'))
        };
    }

    scanContentParameters(contentAnalysis) {
        return {
            contentType: contentAnalysis.contentType,
            wordCount: contentAnalysis.wordCount,
            readability: contentAnalysis.readability,
            engagement: contentAnalysis.engagementPotential,
            mediaCount: {
                images: contentAnalysis.imageCount,
                videos: contentAnalysis.videoCount,
                paragraphs: contentAnalysis.paragraphCount
            },
            contentQuality: this.assessContentQuality(contentAnalysis)
        };
    }

    assessContentQuality(content) {
        let score = 0;
        
        if (content.wordCount >= 500) score += 2;
        if (content.imageCount >= 3) score += 1;
        if (content.videoCount >= 1) score += 2;
        if (content.readability === 'Muy fácil' || content.readability === 'Fácil') score += 1;
        if (content.engagementPotential === 'Alto') score += 2;
        
        if (score >= 6) return 'Excelente';
        if (score >= 4) return 'Buena';
        if (score >= 2) return 'Regular';
        return 'Básica';
    }

    scanTechnicalParameters(technical) {
        if (technical.error) {
            return {
                status: 'No disponible',
                error: technical.error
            };
        }

        return {
            server: technical.server,
            security: technical.security,
            technologies: technical.technologies,
            statusCode: technical.statusCode,
            overallHealth: this.assessTechnicalHealth(technical)
        };
    }

    assessTechnicalHealth(technical) {
        let issues = 0;
        
        if (!technical.security.includes('HSTS Activado')) issues++;
        if (technical.technologies.includes('Tecnologías no detectadas')) issues++;
        
        if (issues === 0) return 'Excelente';
        if (issues === 1) return 'Buena';
        return 'Necesita mejoras';
    }

    scanPlatformParameters(platforms) {
        return platforms.map(platform => ({
            platform: platform.platformName,
            suitability: this.assessPlatformSuitability(platform),
            budget: platform.budget,
            expectedROI: platform.estimatedROI,
            keyParameters: platform.requiredParams
        }));
    }

    assessPlatformSuitability(platform) {
        const scores = {
            'google_ads': 95,
            'meta_ads': 90,
            'linkedin_ads': 85,
            'tiktok_ads': 80,
            'youtube_ads': 75,
            'twitter_ads': 70,
            'pinterest_ads': 65,
            'reddit_ads': 60,
            'telegram_ads': 55
        };
        
        const score = scores[platform.platform] || 70;
        
        if (score >= 90) return 'Muy Alta';
        if (score >= 80) return 'Alta';
        if (score >= 70) return 'Media';
        return 'Baja';
    }

    generateParameterReport(analysis) {
        const parameters = this.scanAllParameters(analysis);
        
        return {
            summary: this.generateSummary(parameters),
            detailed: parameters,
            recommendations: this.generateParameterRecommendations(parameters),
            score: this.calculateOverallScore(parameters)
        };
    }

    generateSummary(parameters) {
        return {
            totalParameters: Object.keys(parameters).length,
            seoScore: parameters.seo.score,
            contentQuality: parameters.content.contentQuality,
            technicalHealth: parameters.technical.overallHealth,
            bestPlatform: parameters.platforms[0]?.platform || 'Google Ads',
            estimatedROI: parameters.platforms[0]?.expectedROI || '150-350%'
        };
    }

    generateParameterRecommendations(parameters) {
        const recommendations = [];
        
        // Recomendaciones de SEO
        if (parameters.seo.score < 70) {
            recommendations.push({
                category: 'SEO',
                priority: 'Alta',
                recommendation: 'Mejorar puntuación SEO por encima de 70',
                actions: parameters.seo.recommendations
            });
        }
        
        // Recomendaciones de Contenido
        if (parameters.content.contentQuality === 'Básica' || parameters.content.contentQuality === 'Regular') {
            recommendations.push({
                category: 'Contenido',
                priority: 'Media',
                recommendation: 'Mejorar calidad del contenido',
                actions: [
                    'Aumentar cantidad de contenido',
                    'Incluir más medios visuales',
                    'Mejorar legibilidad'
                ]
            });
        }
        
        // Recomendaciones Técnicas
        if (parameters.technical.overallHealth === 'Necesita mejoras') {
            recommendations.push({
                category: 'Técnico',
                priority: 'Alta',
                recommendation: 'Mejorar infraestructura técnica',
                actions: [
                    'Implementar headers de seguridad',
                    'Optimizar velocidad',
                    'Actualizar tecnologías'
                ]
            });
        }
        
        return recommendations;
    }

    calculateOverallScore(parameters) {
        let totalScore = 0;
        let weightCount = 0;
        
        // Peso de SEO (30%)
        if (parameters.seo.score) {
            totalScore += parameters.seo.score * 0.3;
            weightCount += 0.3;
        }
        
        // Peso de Contenido (25%)
        const contentScores = {
            'Excelente': 90,
            'Buena': 75,
            'Regular': 60,
            'Básica': 40
        };
        if (parameters.content.contentQuality) {
            totalScore += contentScores[parameters.content.contentQuality] * 0.25;
            weightCount += 0.25;
        }
        
        // Peso Técnico (20%)
        const techScores = {
            'Excelente': 95,
            'Buena': 80,
            'Necesita mejoras': 50
        };
        if (parameters.technical.overallHealth) {
            totalScore += techScores[parameters.technical.overallHealth] * 0.2;
            weightCount += 0.2;
        }
        
        // Peso de Marketing (25%)
        totalScore += 70 * 0.25; // Base score
        weightCount += 0.25;
        
        return weightCount > 0 ? Math.round(totalScore / weightCount) : 0;
    }

    // Exportar parámetros para diferentes usos
    exportParameters(analysis, format = 'detailed') {
        const parameters = this.scanAllParameters(analysis);
        
        switch (format) {
            case 'summary':
                return this.generateSummary(parameters);
                
            case 'platforms':
                return {
                    platforms: parameters.platforms,
                    recommendations: parameters.platforms.map(p => ({
                        platform: p.platform,
                        suitability: p.suitability,
                        budget: p.budget
                    }))
                };
                
            case 'technical':
                return parameters.technical;
                
            case 'marketing':
                return {
                    marketing: parameters.marketing,
                    performance: parameters.performance
                };
                
            default:
                return parameters;
        }
    }
}

module.exports = new ParameterScanner();