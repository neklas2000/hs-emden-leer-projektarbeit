export class TitleState {
  private readonly defaultValue: string;
  name: string | null;

  constructor(defaultValue: string) {
    this.defaultValue = defaultValue;
    this.name = defaultValue;
  }

  reset(): void {
    this.name = this.defaultValue;
  }

  update(title: string | null): void {
    this.name = title;
  }
}
