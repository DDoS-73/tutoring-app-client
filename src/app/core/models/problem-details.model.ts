export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: any; // Allow for custom extension members
}

export interface ValidationProblemDetails extends ProblemDetails {
  errors?: {
    [key: string]: string[];
  };
}
