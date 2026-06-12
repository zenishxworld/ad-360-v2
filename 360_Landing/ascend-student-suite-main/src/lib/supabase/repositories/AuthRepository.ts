import { supabase } from '../client';
import { DEMO_MODE } from '@/config/demoMode';

export class AuthRepository {
  async signInWithGoogle() {
    if (DEMO_MODE) {
      console.log('DEMO_MODE: Mocking Google Sign In');
      return { data: { url: '/' }, error: null }; // Simulate redirect
    }

    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) throw error;
    return { data, error: null };
  }

  async signOut() {
    if (DEMO_MODE) {
      console.log('DEMO_MODE: Mocking Sign Out');
      return { error: null };
    }

    if (!supabase) throw new Error('Supabase client not initialized');

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  }

  async getSession() {
    if (DEMO_MODE) {
      return {
        data: {
          session: {
            user: {
              id: 'ST2025-000001',
              email: 'john.doe@example.com',
              user_metadata: {
                full_name: 'John Doe',
                avatar_url: ''
              }
            }
          }
        },
        error: null
      };
    }

    if (!supabase) throw new Error('Supabase client not initialized');

    return supabase.auth.getSession();
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (DEMO_MODE) {
      // Mock immediately returning a session
      callback('SIGNED_IN', {
        user: {
          id: 'ST2025-000001',
          email: 'john.doe@example.com',
          user_metadata: {
            full_name: 'John Doe',
            avatar_url: ''
          }
        }
      });
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }

    if (!supabase) throw new Error('Supabase client not initialized');

    return supabase.auth.onAuthStateChange(callback);
  }
}
