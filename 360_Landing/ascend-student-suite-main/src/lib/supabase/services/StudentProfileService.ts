import { StudentProfileRepository } from '../repositories/StudentProfileRepository';
import { Database } from '../types';

type StudentProfileRow = Database['public']['Tables']['student_profiles']['Row'];
type StudentProfileInsert = Database['public']['Tables']['student_profiles']['Insert'];

export class StudentProfileService {
  private repository = new StudentProfileRepository();

  async getProfile(userId: string): Promise<StudentProfileRow | null> {
    return this.repository.getProfile(userId);
  }

  async saveProfile(profile: StudentProfileInsert): Promise<StudentProfileRow> {
    return this.repository.saveProfile(profile);
  }
}

export const studentProfileService = new StudentProfileService();
