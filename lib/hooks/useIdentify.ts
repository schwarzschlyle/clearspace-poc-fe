import { useMutation } from '@tanstack/react-query';

export interface IdentifyAssetResponse {
  request_id: string;
  manufacturer: string;
  model: string;
  confidence_score: number;
  additional_details?: Record<string, any>;
}

export interface IdentifyAssetError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

export function useIdentify() {
  return useMutation<IdentifyAssetResponse, IdentifyAssetError, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://clearspace-ai-poc.onrender.com/identify', {
        method: 'POST',
        headers: {
          // 'Content-Type' must NOT be set when using FormData; browser will set it with boundary
          'accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch {
          error = { detail: [{ msg: 'Unknown error', type: 'unknown', loc: [] }] };
        }
        throw error;
      }

      return response.json();
    }
  });
}
