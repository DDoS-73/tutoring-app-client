import { HttpErrorResponse } from '@angular/common/http';
import { ProblemDetails, ValidationProblemDetails } from '../models/problem-details.model';

export const DEFAULT_ERROR_TITLE = 'Помилка';
export const DEFAULT_ERROR_MESSAGE = 'Виникла неочікувана помилка';

export interface ParsedError {
  title: string;
  message: string;
}

export function parseProblemDetails(errorResponse: HttpErrorResponse): ParsedError {
  const problem = errorResponse.error as ProblemDetails | ValidationProblemDetails | null;
  let errorTitle = DEFAULT_ERROR_TITLE;
  let errorMessage = DEFAULT_ERROR_MESSAGE;

  if (problem && typeof problem === 'object') {
    // Parse RFC 7807 standard properties
    if (problem.title) {
      errorTitle = problem.title;
    }
    if (problem.detail) {
      errorMessage = problem.detail;
    } else if (problem['message']) {
      errorMessage = problem['message'];
    }

    // Parse RFC 7807 validation errors dictionary (handles any casing of properties/fields)
    const validationProblem = problem as ValidationProblemDetails;
    if (validationProblem.errors && typeof validationProblem.errors === 'object') {
      const validationList = Object.entries(validationProblem.errors).map(([field, messages]) => {
        const msgList = Array.isArray(messages) ? messages.join(', ') : String(messages);
        return `${field}: ${msgList}`;
      });

      if (validationList.length > 0) {
        errorMessage = validationList.join('\n');
      }
    }
  } else if (typeof problem === 'string') {
    errorMessage = problem;
  } else if (errorResponse.message) {
    errorMessage = errorResponse.message;
  }

  return { title: errorTitle, message: errorMessage };
}
