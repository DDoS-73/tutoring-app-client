import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import {
  CustomField,
  CustomFieldScope,
  CustomFieldType,
  CustomFieldValueRowDto,
} from '../../shared/models/custom-field.model';
import { ApiUrl } from './api-url';
import { ApiEndpoints } from './endpoints';
import { ErrorContext } from './error-context';

export interface CreateCustomFieldDto {
  name: string;
  type: CustomFieldType;
  scope: CustomFieldScope;
  participantId: string | number | null;
  options: string[];
}

export interface UpdateCustomFieldOptionDto {
  id: string | null;
  label: string;
}

export interface UpdateCustomFieldDto {
  name: string;
  options: UpdateCustomFieldOptionDto[];
}

export interface CustomFieldValueDto {
  fieldId: string;
  value: string | null;
}

export interface SaveCustomFieldValuesDto {
  values: CustomFieldValueDto[];
}

@Injectable({ providedIn: 'root' })
export class CustomFieldApi {
  private readonly http = inject(HttpClient);

  public create(dto: CreateCustomFieldDto): Promise<void> {
    return lastValueFrom(
      this.http.post<void>(ApiUrl.of(ApiEndpoints.CustomFields.create), dto, {
        context: ErrorContext.silence(HttpStatusCode.Conflict),
      })
    );
  }

  public update(id: string, dto: UpdateCustomFieldDto): Promise<void> {
    return lastValueFrom(
      this.http.patch<void>(ApiUrl.of(ApiEndpoints.CustomFields.update(id)), dto, {
        context: ErrorContext.silence(HttpStatusCode.Conflict),
      })
    );
  }

  public delete(id: string): Promise<void> {
    return lastValueFrom(this.http.delete<void>(ApiUrl.of(ApiEndpoints.CustomFields.delete(id))));
  }

  public getValues(participantId: string | number): Promise<CustomField[]> {
    return lastValueFrom(
      this.http
        .get<CustomFieldValueRowDto[]>(ApiUrl.of(ApiEndpoints.Participants.customFieldValues(participantId)))
        .pipe(map((rows) => CustomField.fromList(rows)))
    );
  }

  public saveValues(participantId: string | number, dto: SaveCustomFieldValuesDto): Promise<void> {
    return lastValueFrom(
      this.http.put<void>(ApiUrl.of(ApiEndpoints.Participants.customFieldValues(participantId)), dto)
    );
  }
}
