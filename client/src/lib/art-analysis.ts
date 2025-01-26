export interface AnalysisResult {
  style: string;
  period: string;
  insights: string[];
  connections: {
    artists: string[];
    movements: string[];
  };
}

export async function analyzeArtwork(imageFile: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to analyze artwork');
  }

  return response.json();
}
