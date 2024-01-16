export class AnalyzingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnalyzingError';
  }
}
