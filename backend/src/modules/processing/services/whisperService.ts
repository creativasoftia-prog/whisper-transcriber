import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const transcribeAudio = async (filePath: string, apiKey: string): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('model', 'whisper-large-v3');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API Error: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[WhisperService] Error:', error);
    throw error;
  }
};
