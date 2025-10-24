
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GeneratedContent, AlternativeTitle } from "../types";

// FIX: Initialize GoogleGenAI with API key from environment variables as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const textModel = 'gemini-2.5-flash';
const imagenModel = 'imagen-4.0-generate-001';

// FIX: Define a response schema to get structured JSON output from the model.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "Un título de video de YouTube magnético y que incite al clic, utilizando números, palabras de poder o preguntas. Longitud ideal: 60-70 caracteres.",
    },
    description: {
      type: Type.STRING,
      description: "Una descripción estratégica de más de 200 palabras, estructurada con un gancho inicial fuerte, un cuerpo detallado y placeholders explícitos como [ENLACE A RECURSO] y [ENLACE DE SUSCRIPCIÓN].",
    },
    hashtags: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "Una lista de 10 a 15 hashtags relevantes para YouTube, comenzando con #.",
    },
    keywords: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "Una lista de 30 palabras clave SEO importantes para el video, extraídas principalmente del título y la descripción.",
    },
    pinnedComment: {
        type: Type.STRING,
        description: "Un comentario para fijar en YouTube. Debe ser viral, con un gancho fuerte, relacionado con el título y la descripción, y terminar con una pregunta o llamada a la acción para fomentar la interacción de los espectadores.",
    },
  },
  required: ["title", "description", "hashtags", "keywords", "pinnedComment"],
};

export const generateSeoContent = async (videoTopic: string, customPrompt?: string): Promise<GeneratedContent> => {
  const basePrompt = `
    Eres un estratega de crecimiento de YouTube de clase mundial y un experto en copywriting.
    Tu tarea es generar un título, descripción, hashtags, palabras clave y un comentario fijado para un video de YouTube sobre el siguiente tema, con el objetivo de maximizar el alcance y la interacción.
    Sigue estas directrices estrictas:
    
    - **Título Magnético**: Crea un título irresistible que maximice los clics (CTR). Debe tener entre 60 y 70 caracteres. Utiliza elementos como números, palabras de poder (ej: Secreto, Definitivo, Increíble), preguntas que generen curiosidad o disparadores emocionales para captar la atención inmediatamente.

    - **Descripción Estratégica**: Escribe una descripción de al menos 200 palabras. Debe estructurarse en tres partes claras:
      1. **Gancho (primeras 2-3 líneas)**: Resume el valor del video de forma atractiva para que aparezca en los resultados de búsqueda.
      2. **Cuerpo Detallado**: Explica más a fondo el contenido del video, incorporando las palabras clave de forma natural.
      3. **Llamadas a la Acción y Recursos**: Incluye placeholders claros para que el creador los rellene, como \`[ENLACE A RECURSO O PRODUCTO]\`, \`[ENLACE A VIDEO RELACIONADO]\`, y termina con una llamada a la acción clara para suscribirse, como \`¡No te pierdas más contenido como este! Suscríbete aquí: [ENLACE DE SUSCRIPCIÓN]\`.

    - **Hashtags**: Genera entre 10 y 15 hashtags relevantes. Mezcla hashtags amplios con otros más específicos (de nicho).

    - **Palabras clave**: Proporciona 30 palabras clave de alto valor para SEO. La mayoría de estas palabras clave deben ser extraídas directamente del título y la descripción que has generado, combinando términos de cola larga y corta para maximizar la relevancia.

    - **Comentario Fijado Viral**: Crea un comentario corto y potente para fijar en la sección de comentarios. Debe:
      1. Empezar con un gancho que genere curiosidad o una afirmación audaz relacionada con el video.
      2. Aportar un valor extra o un pensamiento provocador que no esté directamente en la descripción.
      3. Terminar con una pregunta abierta o una llamada a la acción clara que invite a los espectadores a comentar (ej: '¿Cuál es tu opinión?', 'Cuéntame tu experiencia abajo', '¿Qué otro tema te gustaría ver?').

    Tema del video: "${videoTopic}"
  `;

  const customInstruction = (customPrompt && customPrompt.trim())
    ? `\n\n**Instrucción Adicional Importante del Usuario**: ${customPrompt.trim()}\n`
    : '';

  const prompt = `${basePrompt}${customInstruction}\nGenera el contenido estrictamente en el formato JSON solicitado.`;

  try {
    // FIX: Call the generateContent API with the model, prompt, and JSON configuration.
    const response = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    // FIX: Extract text from response and parse it as JSON, cleaning up potential markdown fences.
    const jsonString = response.text.trim();
    const cleanedJsonString = jsonString.replace(/^```json\s*|```\s*$/g, '');
    const generatedContent: GeneratedContent = JSON.parse(cleanedJsonString);
    
    return generatedContent;

  } catch (error) {
    console.error("Error generating content:", error);
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('Quota exceeded')) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw new Error("No se pudo generar el contenido. Inténtalo de nuevo.");
  }
};

export const generateAlternativeTitles = async (videoTopic: string, originalTitle: string): Promise<AlternativeTitle[]> => {
  const alternativeTitlesSchema = {
    type: Type.OBJECT,
    properties: {
      titles: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Un título de video de YouTube alternativo para pruebas A/B.",
            },
            seoScore: {
              type: Type.INTEGER,
              description: "Una puntuación SEO del 0 al 100 para el título, evaluando el potencial de CTR y la relevancia.",
            },
          },
          required: ["title", "seoScore"],
        },
        description: "Un array de 2-3 títulos de video alternativos, cada uno con una puntuación SEO.",
      },
    },
    required: ["titles"],
  };

  const prompt = `
    Eres un experto en crecimiento de YouTube especializado en pruebas A/B de títulos de video.
    Dado un tema de video y un título original, genera 2-3 alternativas de título distintas y creativas.

    Para cada alternativa, proporciona también una "seoScore" de 0 a 100. La puntuación debe reflejar el potencial del título para lograr un alto ratio de clics (CTR) basándose en factores como la curiosidad, el beneficio claro, el uso de palabras clave y el impacto emocional.

    Cada alternativa de título debe explorar un ángulo psicológico diferente para maximizar el CTR, por ejemplo:
    - Basado en la curiosidad (ej: "El Secreto que Nadie Te Cuenta Sobre...")
    - Basado en el beneficio (ej: "Consigue [Resultado Deseado] con Este Simple Truco")
    - En formato de pregunta (ej: "¿Estás Cometiendo este Error al [Actividad]?")
    - Directo y al grano (ej: "Guía Definitiva para [Tema]")

    Mantén una longitud ideal de 60-70 caracteres para cada título.

    Tema del video: "${videoTopic}"
    Título Original: "${originalTitle}"

    Devuelve los títulos y sus puntuaciones SEO únicamente en el formato JSON solicitado, dentro de la clave "titles".
  `;

  try {
    const response = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: alternativeTitlesSchema,
      },
    });

    const jsonString = response.text.trim();
    const cleanedJsonString = jsonString.replace(/^```json\s*|```\s*$/g, '');
    const parsedResponse = JSON.parse(cleanedJsonString);
    
    if (parsedResponse.titles && Array.isArray(parsedResponse.titles)) {
      parsedResponse.titles.sort((a: AlternativeTitle, b: AlternativeTitle) => b.seoScore - a.seoScore);
    }
    
    return parsedResponse.titles || [];

  } catch (error) {
    console.error("Error generating alternative titles:", error);
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('Quota exceeded')) {
        throw new Error("QUOTA_EXCEEDED");
    }
    throw new Error("No se pudo generar títulos alternativos. Inténtalo de nuevo.");
  }
};


export const generateYouTubeThumbnail = async (options: {
  videoTopic: string;
  style: string;
  aspectRatio: '16:9' | '9:16';
  textOverlay?: string;
  customPrompt?: string;
}): Promise<string> => {
  const { videoTopic, style, aspectRatio, textOverlay, customPrompt } = options;

  let finalPrompt: string;

  if (customPrompt && customPrompt.trim() !== '') {
    finalPrompt = customPrompt;
  } else {
    let styleDescription = '';
    switch (style) {
      case 'viral': {
        const textForThumbnail = textOverlay || videoTopic;
        if (aspectRatio === '16:9') {
          styleDescription = `Fotomontaje para miniatura de YouTube, estilo viral, colores vibrantes y alto contraste. Composición dividida: a la izquierda, una persona con cara de sorpresa extrema (ojos y boca muy abiertos) señalando a la derecha. La persona tiene un borde de luz que la separa del fondo. A la derecha, el texto gigante "${textForThumbnail}" en fuente gruesa tipo Impact, con degradado amarillo-naranja, borde blanco y sombra roja. El fondo es oscuro y abstracto con neones morados y azules. Una flecha amarilla grande apunta hacia arriba. Fotorrealista y muy llamativo.`;
        } else { // aspectRatio === '9:16'
          styleDescription = `Fotomontaje para miniatura de YouTube Short (formato 9:16), estilo viral, colores vibrantes, alto contraste. Composición vertical: arriba, el texto gigante "${textForThumbnail}" en fuente gruesa tipo Impact, con degradado amarillo-naranja, borde blanco y sombra roja. Abajo, una persona con cara de sorpresa extrema mirando hacia el texto, con un borde de luz que la separa del fondo. El fondo es oscuro y abstracto con neones morados y azules. Fotorrealista y muy llamativo.`;
        }
        break;
      }
      case 'watercolor':
        styleDescription = "artistic watercolor painting style, soft blended colors, visible brush strokes, on a textured paper background, elegant and beautiful";
        break;
      case 'retro':
        styleDescription = "retro 80s synthwave style, neon pink and blue glowing lines, vintage computer graphics aesthetic, with film grain and a dark background";
        break;
      case 'pixel-art':
        styleDescription = "8-bit pixel art style, vibrant limited color palette, clear blocky pixels, nostalgic classic video game look, no anti-aliasing";
        break;
      case 'vibrant':
        styleDescription = "vibrant, saturated colors, high contrast";
        break;
      case 'minimalist':
        styleDescription = "clean and minimalist, simple background, one clear focal point";
        break;
      case 'photorealistic':
        styleDescription = "photorealistic, sharp and detailed professional photograph";
        break;
      case 'cinematic':
      default:
        styleDescription = "cinematic, dramatic lighting, film-like quality";
        break;
    }

    const promptParts: string[] = [
      styleDescription, // Use the detailed description from the switch case
      `High resolution, professional quality.`
    ];

    if (style !== 'viral' && textOverlay) {
        promptParts.unshift(`YouTube thumbnail for a video titled "${videoTopic}".`)
        promptParts.push(`CRITICAL INSTRUCTION: The image must prominently feature the text "${textOverlay}". The text must be perfectly centered, highly legible with strong contrast against the background, and rendered in a professional, appealing font. The entire text must be fully visible and MUST NOT be cropped or cut off by the image edges.`);
    } else if (style !== 'viral') {
      promptParts.unshift(`YouTube thumbnail for a video titled "${videoTopic}".`)
      promptParts.push(`The image should not contain any text.`);
    }

    finalPrompt = promptParts.join(' ');
  }

  try {
    const response = await ai.models.generateImages({
      model: imagenModel,
      prompt: finalPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
      const image = response.generatedImages[0];
      if (image.image?.imageBytes) {
        return image.image.imageBytes;
      }
    }

    throw new Error("La respuesta de la IA no contenía una imagen. Esto puede deberse a filtros de seguridad o a un prompt demasiado complejo. Intenta simplificar la idea.");

  } catch (error) {
    console.error("Error generating thumbnail:", error);
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('Quota exceeded')) {
      throw new Error("QUOTA_EXCEEDED");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ocurrió un error inesperado al generar la miniatura.");
  }
};