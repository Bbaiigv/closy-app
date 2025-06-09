import { StyleScore } from '@/contexts/AppContext';

export interface StyleFilterOptions {
    minScore?: number;
    maxResults?: number;
    excludeStyles?: string[];
    includeOnlyStyles?: string[];
}

/**
 * Obtiene los estilos mejor puntuados con opciones de filtrado
 */
export const getFilteredTopStyles = (
    styleScores: StyleScore[],
    options: StyleFilterOptions = {}
): StyleScore[] => {
    const {
        minScore = 3,
        maxResults = 5,
        excludeStyles = [],
        includeOnlyStyles = []
    } = options;

    let filteredStyles = [...styleScores];

    // Filtrar por puntuación mínima
    filteredStyles = filteredStyles.filter(style => style.averageScore >= minScore);

    // Excluir estilos específicos
    if (excludeStyles.length > 0) {
        filteredStyles = filteredStyles.filter(style => !excludeStyles.includes(style.styleName));
    }

    // Incluir solo estilos específicos
    if (includeOnlyStyles.length > 0) {
        filteredStyles = filteredStyles.filter(style => includeOnlyStyles.includes(style.styleName));
    }

    // Ordenar por puntuación promedio (descendente)
    filteredStyles.sort((a, b) => b.averageScore - a.averageScore);

    // Limitar resultados
    return filteredStyles.slice(0, maxResults);
};

/**
 * Obtiene estilos por rango de puntuación
 */
export const getStylesByScoreRange = (
    styleScores: StyleScore[],
    minScore: number,
    maxScore: number
): StyleScore[] => {
    return styleScores.filter(style =>
        style.averageScore >= minScore && style.averageScore <= maxScore
    ).sort((a, b) => b.averageScore - a.averageScore);
};

/**
 * Categoriza estilos por nivel de preferencia
 */
export const categorizeStylesByPreference = (styleScores: StyleScore[]) => {
    return {
        loved: styleScores.filter(style => style.averageScore >= 4.5), // Me encanta
        liked: styleScores.filter(style => style.averageScore >= 3.5 && style.averageScore < 4.5), // Me gusta mucho
        neutral: styleScores.filter(style => style.averageScore >= 2.5 && style.averageScore < 3.5), // Me gusta
        disliked: styleScores.filter(style => style.averageScore < 2.5) // No me gusta
    };
};

/**
 * Obtiene estadísticas generales de las puntuaciones
 */
export const getScoreStatistics = (styleScores: StyleScore[]) => {
    if (styleScores.length === 0) {
        return {
            totalStyles: 0,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 0,
            totalResponses: 0
        };
    }

    const scores = styleScores.map(style => style.averageScore);
    const totalResponses = styleScores.reduce((sum, style) => sum + style.responseCount, 0);

    return {
        totalStyles: styleScores.length,
        averageScore: Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(2)),
        highestScore: Math.max(...scores),
        lowestScore: Math.min(...scores),
        totalResponses
    };
};

/**
 * Genera recomendaciones para el siguiente bloque basado en las puntuaciones
 */
export const generateNextBlockRecommendations = (styleScores: StyleScore[]) => {
    const categories = categorizeStylesByPreference(styleScores);

    return {
        // Estilos a incluir en el siguiente bloque (los que más les gustaron)
        recommendedStyles: [...categories.loved, ...categories.liked].slice(0, 6),

        // Estilos a considerar como secundarios
        secondaryStyles: categories.neutral.slice(0, 3),

        // Estilos a evitar en el siguiente bloque
        stylesToAvoid: categories.disliked,

        // Mensaje de recomendación
        recommendation: generateRecommendationMessage(categories)
    };
};

/**
 * Genera un mensaje de recomendación personalizado
 */
const generateRecommendationMessage = (categories: ReturnType<typeof categorizeStylesByPreference>): string => {
    const { loved, liked, neutral, disliked } = categories;

    if (loved.length >= 3) {
        return `¡Excelente! Tienes preferencias muy claras. Te encantan ${loved.length} estilos: ${loved.map(s => s.styleName).join(', ')}.`;
    } else if (liked.length >= 3) {
        return `Tienes buenas preferencias definidas. Te gustan especialmente: ${liked.slice(0, 3).map(s => s.styleName).join(', ')}.`;
    } else if (neutral.length >= 3) {
        return `Tu gusto es bastante equilibrado. Vamos a explorar más opciones para definir mejor tu estilo.`;
    } else {
        return `Parece que tienes un estilo muy específico. Vamos a encontrar exactamente lo que te gusta.`;
    }
};

/**
 * Prepara datos para visualización (gráficos, charts, etc.)
 */
export const prepareDataForVisualization = (styleScores: StyleScore[]) => {
    return styleScores.map(style => ({
        name: style.styleName,
        score: style.averageScore,
        total: style.totalScore,
        responses: style.responseCount,
        percentage: Number(((style.averageScore / 5) * 100).toFixed(1))
    }));
};

/**
 * Mapeo de estilos a marcas disponibles
 */
export interface BrandsByStyle {
    [styleName: string]: string[];
}

export const STYLE_BRANDS_MAP: BrandsByStyle = {
    'Caye +20': ['Zara', 'Massimo Dutti', 'Mango', 'Scalpers', 'Sezane', 'Silbon'],
    'Caye -20': ['Renatta', 'Nicoli', 'Mango teen', 'NOON', 'The are', 'Zara'],
    'Pija': ['Zara', 'Mango', 'Silbon', 'Asos', 'Stradivarius', 'H&M'],
    'Básica': ['Zara', 'Pull & Bear', 'Ese o Ese', 'Parfois', 'H&M', 'Asos'],
    'Formal': ['Zara', 'Mango', 'Massimo Dutti', 'NA-KD', 'Sezane', 'Scalpers'],
    'Sexy': ['Zara', 'Bershka', 'Stradivarius', 'House of CB', 'Asos', 'NA-KD'],
    'Boho': ['Zara', 'Parfois', 'Sezane', 'Asos', 'H&M', 'Pull & Bear'],
    'M-ST': ['Pull & Bear', 'Bershka', 'NUDE P', 'Urban Outfitter', 'H&M', 'Asos'],
    'M-Trendy': ['Zara', 'Mango', 'Pull & Bear', 'Bershka', 'Stradivarius', 'Asos', 'H&M', 'Urban Outfitter', 'Parfois', 'Sezane', 'Massimo Dutti', 'Scalpers', 'Silbon', 'Renatta', 'Nicoli', 'NOON', 'NA-KD', 'House of CB', 'Ese o Ese', 'Mango teen', 'The are', 'NUDE P']
};

/**
 * Calcula las puntuaciones finales después del bloque 2
 * Considera tanto las respuestas del bloque 1 como las selecciones del bloque 2
 */
export const calculateFinalStyleScores = (responses: any[]): StyleScore[] => {
    const stylePoints = new Map<string, { total: number; count: number }>();

    responses.forEach(response => {
        // Extraer el nombre del estilo base (sin la ocasión)
        const baseStyleName = response.styleName.includes('(')
            ? response.styleName.split(' (')[0]
            : response.styleName;

        const current = stylePoints.get(baseStyleName) || { total: 0, count: 0 };

        // Para el bloque 2, dar más peso a las selecciones (son más específicas)
        const weight = response.questionId > 2000 ? 1.5 : 1;

        stylePoints.set(baseStyleName, {
            total: current.total + (response.response * weight),
            count: current.count + 1
        });
    });

    return Array.from(stylePoints.entries()).map(([styleName, { total, count }]) => ({
        styleName,
        totalScore: total,
        responseCount: count,
        averageScore: Number((total / count).toFixed(2))
    })).sort((a, b) => b.averageScore - a.averageScore);
};

/**
 * Obtiene los 3 estilos principales después de completar el bloque 2
 */
export const getTop3StylesForBrands = (responses: any[]): StyleScore[] => {
    const finalScores = calculateFinalStyleScores(responses);

    // Filtrar solo estilos que tengan marcas definidas y buenos puntajes
    const stylesWithBrands = finalScores.filter(style =>
        STYLE_BRANDS_MAP[style.styleName] && style.averageScore >= 2
    );

    return stylesWithBrands.slice(0, 3);
};

/**
 * Obtiene las marcas disponibles para un estilo específico
 */
export const getBrandsForStyle = (styleName: string): string[] => {
    return STYLE_BRANDS_MAP[styleName] || [];
};

/**
 * Interfaz para marcas unificadas con puntuación
 */
export interface BrandWithScore {
    brandName: string;
    frequency: number;
    score: number;
    styles: string[];
}

/**
 * Obtiene marcas unificadas de los top 3 estilos con puntuaciones
 */
export const getUnifiedBrandsForTopStyles = (responses: any[]): BrandWithScore[] => {
    const top3Styles = getTop3StylesForBrands(responses);

    if (top3Styles.length === 0) {
        return [];
    }

    // Mapa para contar frecuencias de marcas
    const brandFrequency = new Map<string, { count: number; styles: string[] }>();

    // Recopilar todas las marcas de los top 3 estilos
    top3Styles.forEach(style => {
        const brands = STYLE_BRANDS_MAP[style.styleName] || [];
        brands.forEach(brand => {
            const current = brandFrequency.get(brand) || { count: 0, styles: [] };
            brandFrequency.set(brand, {
                count: current.count + 1,
                styles: [...current.styles, style.styleName]
            });
        });
    });

    // Convertir a array con puntuaciones
    const brandsWithScore: BrandWithScore[] = Array.from(brandFrequency.entries()).map(([brandName, { count, styles }]) => {
        // Asignar puntuación según frecuencia
        let score: number;
        if (count === 1) {
            score = 3; // Marca única
        } else if (count === 2) {
            score = 2; // Marca en 2 estilos
        } else {
            score = 1; // Marca en 3 o más estilos
        }

        return {
            brandName,
            frequency: count,
            score,
            styles: [...new Set(styles)] // Eliminar duplicados
        };
    });

    // Ordenar por puntuación (descendente) y luego alfabéticamente
    return brandsWithScore.sort((a, b) => {
        if (a.score !== b.score) {
            return b.score - a.score; // Mayor puntuación primero
        }
        return a.brandName.localeCompare(b.brandName); // Orden alfabético
    });
};

/**
 * Valida la selección de marcas unificada
 */
export const validateUnifiedBrandSelection = (selectedBrands: string[], availableBrands: BrandWithScore[]): {
    isValid: boolean;
    message: string;
} => {
    if (selectedBrands.length < 2) {
        return {
            isValid: false,
            message: 'Debes seleccionar al menos 2 marcas'
        };
    }

    if (selectedBrands.length > 5) {
        return {
            isValid: false,
            message: 'Puedes seleccionar máximo 5 marcas'
        };
    }

    const availableBrandNames = availableBrands.map(b => b.brandName);
    const invalidBrands = selectedBrands.filter(brand => !availableBrandNames.includes(brand));

    if (invalidBrands.length > 0) {
        return {
            isValid: false,
            message: `Marcas no válidas: ${invalidBrands.join(', ')}`
        };
    }

    return {
        isValid: true,
        message: 'Selección válida'
    };
};

/**
 * Calcula las puntuaciones finales de las marcas seleccionadas
 */
export const calculateBrandScores = (selectedBrands: string[], availableBrands: BrandWithScore[]): {
    brandName: string;
    finalScore: number;
    frequency: number;
    styles: string[];
}[] => {
    return selectedBrands.map(brandName => {
        const brandData = availableBrands.find(b => b.brandName === brandName);
        if (!brandData) {
            return {
                brandName,
                finalScore: 0,
                frequency: 0,
                styles: []
            };
        }

        return {
            brandName: brandData.brandName,
            finalScore: brandData.score,
            frequency: brandData.frequency,
            styles: brandData.styles
        };
    });
};

/**
 * Valida si una selección de marcas es válida (2-3 marcas, máximo 5 disponibles)
 * @deprecated Usar validateUnifiedBrandSelection en su lugar
 */
export const validateBrandSelection = (selectedBrands: string[], availableBrands: string[]): {
    isValid: boolean;
    message: string;
} => {
    if (selectedBrands.length < 2) {
        return {
            isValid: false,
            message: 'Debes seleccionar al menos 2 marcas'
        };
    }

    if (selectedBrands.length > 3) {
        return {
            isValid: false,
            message: 'Puedes seleccionar máximo 3 marcas'
        };
    }

    const invalidBrands = selectedBrands.filter(brand => !availableBrands.includes(brand));
    if (invalidBrands.length > 0) {
        return {
            isValid: false,
            message: `Marcas no válidas: ${invalidBrands.join(', ')}`
        };
    }

    return {
        isValid: true,
        message: 'Selección válida'
    };
}; 