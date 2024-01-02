export type ApiRoutes = {
  LOAD_ALL: string;
  /**
   * For this route the pattern "[???/]:id[/???]" is expected.
   * This could mean that either the route "projects/:id" or
   * "projects/:id/members" is provided.
   */
  LOAD: string;
  ADD: string;
};

export class BaseModel {
  public static ROUTES: ApiRoutes = {
    LOAD: '',
    LOAD_ALL: '',
    ADD: '',
  };

  [key: string]: any;
}
