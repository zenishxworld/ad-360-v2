import { SavedUniversityRepository } from '../repositories/SavedUniversityRepository';
import { SavedCourseRepository } from '../repositories/SavedCourseRepository';
import { Database } from '../types';

type SavedUniversityRow = Database['public']['Tables']['saved_universities']['Row'];
type SavedUniversityInsert = Database['public']['Tables']['saved_universities']['Insert'];

type SavedCourseRow = Database['public']['Tables']['saved_courses']['Row'];
type SavedCourseInsert = Database['public']['Tables']['saved_courses']['Insert'];

export class SavedItemsService {
  private universityRepository = new SavedUniversityRepository();
  private courseRepository = new SavedCourseRepository();

  async getSavedUniversities(studentId: number): Promise<SavedUniversityRow[]> {
    return this.universityRepository.getSavedUniversities(studentId);
  }

  async saveUniversity(savedUni: SavedUniversityInsert): Promise<SavedUniversityRow> {
    return this.universityRepository.saveUniversity(savedUni);
  }

  async removeUniversity(studentId: number, universityName: string): Promise<void> {
    return this.universityRepository.removeUniversity(studentId, universityName);
  }

  async getSavedCourses(studentId: number): Promise<SavedCourseRow[]> {
    return this.courseRepository.getSavedCourses(studentId);
  }

  async saveCourse(savedCourse: SavedCourseInsert): Promise<SavedCourseRow> {
    return this.courseRepository.saveCourse(savedCourse);
  }

  async removeCourse(studentId: number, courseName: string, universityName: string): Promise<void> {
    return this.courseRepository.removeCourse(studentId, courseName, universityName);
  }
}

export const savedItemsService = new SavedItemsService();
