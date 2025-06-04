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