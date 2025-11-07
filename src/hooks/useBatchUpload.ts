import { useState, useCallback } from 'react';
import { message } from 'antd';

interface UploadProgress {
  total: number;
  completed: number;
  failed: number;
  successful: number;
  currentBatch: number;
  totalBatches: number;
  errors: Array<{ file: string; error: string }>;
}

interface BatchUploadOptions {
  batchSize?: number;
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (results: { successful: any[]; failed: any[] }) => void;
  onError?: (error: any) => void;
}

export const useBatchUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({
    total: 0,
    completed: 0,
    failed: 0,
    successful: 0,
    currentBatch: 0,
    totalBatches: 0,
    errors: []
  });

  const uploadInBatches = useCallback(async (
    files: File[],
    uploadFunction: (batch: File[]) => Promise<any>,
    options: BatchUploadOptions = {}
  ) => {
    const { batchSize = 5, onProgress, onComplete, onError } = options;
    
    if (files.length === 0) {
      message.warning('No files selected for upload');
      return;
    }

    setIsUploading(true);
    
    const totalBatches = Math.ceil(files.length / batchSize);
    const successfulUploads: any[] = [];
    const failedUploads: any[] = [];
    const errors: Array<{ file: string; error: string }> = [];

    let completed = 0;
    let successful = 0;
    let failed = 0;

    const initialProgress: UploadProgress = {
      total: files.length,
      completed: 0,
      failed: 0,
      successful: 0,
      currentBatch: 0,
      totalBatches,
      errors: []
    };

    setProgress(initialProgress);
    onProgress?.(initialProgress);

    try {
      for (let i = 0; i < totalBatches; i++) {
        const startIndex = i * batchSize;
        const endIndex = Math.min(startIndex + batchSize, files.length);
        const batch = files.slice(startIndex, endIndex);
        
        const currentBatch = i + 1;
        
        // Update progress for current batch
        const batchProgress: UploadProgress = {
          total: files.length,
          completed,
          failed,
          successful,
          currentBatch,
          totalBatches,
          errors: [...errors]
        };
        
        setProgress(batchProgress);
        onProgress?.(batchProgress);

        try {
          // Upload current batch
          const batchResult = await uploadFunction(batch);
          
          // Handle successful batch
          successfulUploads.push(batchResult);
          successful += batch.length;
          completed += batch.length;
          
          message.success(`Batch ${currentBatch}/${totalBatches} uploaded successfully (${batch.length} files)`);
          
        } catch (error: any) {
          // Handle failed batch - try individual files
          console.error(`Batch ${currentBatch} failed, trying individual files:`, error);
          
          for (const file of batch) {
            try {
              const singleResult = await uploadFunction([file]);
              successfulUploads.push(singleResult);
              successful += 1;
            } catch (singleError: any) {
              const errorMessage = singleError?.response?.data?.message || singleError?.message || 'Unknown error';
              errors.push({ 
                file: file.name, 
                error: errorMessage 
              });
              failedUploads.push({ file, error: singleError });
              failed += 1;
            }
            completed += 1;
          }
          
          if (failed > 0) {
            message.error(`Some files in batch ${currentBatch} failed to upload`);
          }
        }

        // Small delay between batches to prevent overwhelming the server
        if (i < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Final progress update
      const finalProgress: UploadProgress = {
        total: files.length,
        completed,
        failed,
        successful,
        currentBatch: totalBatches,
        totalBatches,
        errors
      };

      setProgress(finalProgress);
      onProgress?.(finalProgress);

      // Show completion message
      if (successful > 0 && failed === 0) {
        message.success(`All ${successful} files uploaded successfully!`);
      } else if (successful > 0 && failed > 0) {
        message.warning(`Upload completed: ${successful} successful, ${failed} failed`);
      } else if (failed > 0) {
        message.error(`Upload failed: ${failed} files could not be uploaded`);
      }

      onComplete?.({ successful: successfulUploads, failed: failedUploads });

    } catch (error: any) {
      console.error('Batch upload error:', error);
      message.error('Upload process failed');
      onError?.(error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({
      total: 0,
      completed: 0,
      failed: 0,
      successful: 0,
      currentBatch: 0,
      totalBatches: 0,
      errors: []
    });
  }, []);

  return {
    uploadInBatches,
    isUploading,
    progress,
    resetProgress
  };
};
