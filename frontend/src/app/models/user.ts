import { Nullable } from '../types/nullable';
import { ApiRoutes, BaseModel } from './base-model';
import { Project } from './project';

export class User extends BaseModel {
  public static override ROUTES: ApiRoutes = {
    LOAD_ALL: 'users',
    LOAD: 'users/:id',
    ADD: 'users',
  };

  id: Nullable<string> = null;
  matriculationNumber: number = 0;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: Nullable<string> = null;
  phoneNumber: Nullable<string> = null;
  projects: Project[] = [];
}
