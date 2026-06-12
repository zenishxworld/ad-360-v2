import { supabase } from '../client';
import { DEMO_MODE } from '@/config/demoMode';

export class DocumentStorageService {
  /**
   * Uploads a file to a specific Supabase storage bucket.
   * @param bucketName The name of the bucket (e.g., 'personal', 'academic')
   * @param path The path where the file will be stored (e.g., 'student_1/resume.pdf')
   * @param file The file object (File or Blob)
   */
  async uploadFile(bucketName: string, path: string, file: File | Blob): Promise<string> {
    if (DEMO_MODE) {
      // Mock upload behavior
      return `mock-url-for-${bucketName}-${path}`;
    }

    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    
    return this.getPublicUrl(bucketName, data.path);
  }

  /**
   * Replaces an existing file in a Supabase storage bucket.
   * @param bucketName The name of the bucket
   * @param path The path of the file to replace
   * @param file The new file object
   */
  async replaceFile(bucketName: string, path: string, file: File | Blob): Promise<string> {
    if (DEMO_MODE) {
      return `mock-url-for-${bucketName}-${path}`;
    }

    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;
    
    return this.getPublicUrl(bucketName, data.path);
  }

  /**
   * Deletes a file from a Supabase storage bucket.
   * @param bucketName The name of the bucket
   * @param path The path of the file to delete
   */
  async deleteFile(bucketName: string, path: string): Promise<void> {
    if (DEMO_MODE) {
      return;
    }

    if (!supabase) throw new Error('Supabase client not initialized');

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);

    if (error) throw error;
  }

  /**
   * Retrieves the public URL for a file in a Supabase storage bucket.
   * @param bucketName The name of the bucket
   * @param path The path of the file
   */
  getPublicUrl(bucketName: string, path: string): string {
    if (DEMO_MODE) {
      return `mock-url-for-${bucketName}-${path}`;
    }

    if (!supabase) throw new Error('Supabase client not initialized');

    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);

    return data.publicUrl;
  }
}

export const documentStorageService = new DocumentStorageService();
