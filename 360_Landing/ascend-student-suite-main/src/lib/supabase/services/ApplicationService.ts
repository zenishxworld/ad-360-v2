import { ApplicationRepository } from '../repositories/ApplicationRepository';
import { Database } from '../types';

type ApplicationRow = Database['public']['Tables']['applications']['Row'];
type ApplicationInsert = Database['public']['Tables']['applications']['Insert'];

export class ApplicationService {
  private repository = new ApplicationRepository();

  async getApplicationsByStudent(studentId: number): Promise<ApplicationRow[]> {
    return this.repository.getApplicationsByStudent(studentId);
  }

  async createApplication(app: ApplicationInsert): Promise<ApplicationRow> {
    return this.repository.createApplication(app);
  }

  async updateStatus(id: number, status: string): Promise<void> {
    return this.repository.updateStatus(id, status);
  }

  async deleteApplication(id: number): Promise<void> {
    return this.repository.deleteApplication(id);
  }
}

export const applicationService = new ApplicationService();
