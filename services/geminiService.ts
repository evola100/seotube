import { GoogleGenAI, Type, Modality, GenerateContentResponse, FinishReason } from "@google/genai";
import { GeneratedContent, AlternativeTitle } from "../types";

// Fix: Corrected API key initialization to use `process.env.API_KEY` as per the coding guidelines. This resolves the TypeScript error on `import.meta.env` and aligns with the required API key handling method.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


const textModel = 'gemini-2.5-flash';
const imageModel = 'gemini-2.5-flash-image';

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
      description: "Una lista de 40 palabras clave SEO importantes para el video.",
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

    - **Palabras clave**: Proporciona 40 palabras clave de alto valor para SEO que el creador debe incluir en las etiquetas del video.

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
    const response = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text.trim();
    const cleanedJsonString = jsonString.replace(/^```json\s*|```\s*$/g, '');
    const generatedContent: GeneratedContent = JSON.parse(cleanedJsonString);
    
    return generatedContent;

  } catch (error) {
    console.error("Error generating content:", error);
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
    throw new Error("No se pudo generar títulos alternativos. Inténtalo de nuevo.");
  }
};


export const generateYouTubeThumbnail = async (options: {
  videoTopic: string;
  style: string;
  textOverlay?: string;
  customPrompt?: string;
}): Promise<string> => {
  const { videoTopic, style, textOverlay, customPrompt } = options;

  let finalPrompt: string;

  if (customPrompt && customPrompt.trim() !== '') {
    finalPrompt = customPrompt;
  } else {
    let styleDescription = '';
    switch (style) {
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
      `YouTube thumbnail for a video titled "${videoTopic}".`,
      `Visual style: ${styleDescription}.`,
      `Aspect ratio: 16:9.`
    ];

    if (textOverlay) {
      promptParts.push(`The image must feature the text "${textOverlay}".`);
      promptParts.push(`The text must be highly legible, professional, have a subtle shadow for contrast, and be fully visible without being cut off.`);
    } else {
      promptParts.push(`The image should not contain any text.`);
    }

    finalPrompt = promptParts.join(' ');
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: imageModel,
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const candidate = response.candidates?.[0];

    if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
      let reason: string = candidate.finishReason;
      if (response.promptFeedback?.blockReason) {
        reason = `${reason} (Motivo de bloqueo: ${response.promptFeedback.blockReason})`;
      }
      throw new Error(`La IA rechazó la solicitud de imagen (Razón: ${reason}). Por favor, intenta con un prompt diferente o más simple, especialmente si usas un prompt personalizado.`);
    }

    const parts = candidate?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          return part.inlineData.data;
        }
      }
    }

    throw new Error("La respuesta de la IA no contenía una imagen. Esto puede deberse a filtros de seguridad o a un prompt demasiado complejo.");

  } catch (error) {
    console.error("Error generating thumbnail:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ocurrió un error inesperado al generar la miniatura.");
  }
};