import { patch, post } from '@lib/apiClient';
import type { User } from '@types';

type UserUpdate = Partial<User> & {
  bio?: string | null;
  specialization?: string | null;
  completedAssessment?: boolean;
};

function mapUpdatesToPayload(updates: UserUpdate): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.bio !== undefined) payload.bio = updates.bio;
  if (updates.specialization !== undefined) payload.specialization = updates.specialization;
  if (updates.level !== undefined) payload.level = updates.level;
  if (updates.certificates !== undefined) payload.certificates = updates.certificates;
  if (updates.completedAssessment !== undefined) payload.completed_assessment = updates.completedAssessment;

  return payload;
}

class UserService {
  async updateProfile(userId: string, updates: UserUpdate) {
    const payload = mapUpdatesToPayload(updates);
    if (Object.keys(payload).length === 0) {
      return null;
    }
    return patch(`/users/${userId}`, payload);
  }

  async appendCertificate(userId: string, url: string) {
    return post(`/users/${userId}/certificates`, { url });
  }
}

export const userService = new UserService();
