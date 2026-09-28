import { HttpErrorResponse } from '@angular/common/http';
import { ProblemDetails, ValidationProblemDetails } from '../models/problem-details.model';

export interface ParsedError {
  title: string;
  message: string;
}

export class ProblemDetailsParser {
  public static readonly DEFAULT_TITLE = 'Помилка';
  public static readonly DEFAULT_MESSAGE = 'Виникла неочікувана помилка';

  public static parse(errorResponse: HttpErrorResponse): ParsedError {
    const problem = errorResponse.error as ProblemDetails | ValidationProblemDetails | null;

    if (problem && typeof problem === 'object') {
      return {
        title: problem.title || ProblemDetailsParser.DEFAULT_TITLE,
        message:
          ProblemDetailsParser.validationMessage(problem) ||
          problem.detail ||
          problem['message'] ||
          ProblemDetailsParser.DEFAULT_MESSAGE,
      };
    }

    return {
      title: ProblemDetailsParser.DEFAULT_TITLE,
      message: typeof problem === 'string' ? problem : errorResponse.message || ProblemDetailsParser.DEFAULT_MESSAGE,
    };
  }

  private static validationMessage(problem: ValidationProblemDetails): string | null {
    if (!problem.errors || typeof problem.errors !== 'object') return null;
    const lines = Object.entries(problem.errors).map(([field, messages]) => {
      const text = Array.isArray(messages) ? messages.join(', ') : String(messages);
      return `${field}: ${text}`;
    });
    return lines.length > 0 ? lines.join('\n') : null;
  }
}
