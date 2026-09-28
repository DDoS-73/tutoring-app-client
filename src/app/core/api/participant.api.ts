import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { BasicFieldKey, ParentContact } from '../../shared/models/basic-field.model';
import { EventParticipantType, Participant } from '../../shared/models/participant.model';
import { ApiUrl } from './api-url';
import { ApiEndpoints } from './endpoints';

export interface AdditionalInfoDto {
  dateOfBirth: string | null;
  contact: string | null;
  parentContact: ParentContact | null;
  hiddenBasicFields: BasicFieldKey[];
}

export interface ParticipantDto extends AdditionalInfoDto {
  name: string;
  type: EventParticipantType;
  price: number;
}

export interface BulkParticipantsDto {
  ids: string[];
}

@Injectable({ providedIn: 'root' })
export class ParticipantApi {
  private readonly http = inject(HttpClient);

  public getActive(): Promise<Participant[]> {
    return lastValueFrom(
      this.http
        .get<Participant[]>(ApiUrl.of(ApiEndpoints.Participants.getAll))
        .pipe(map((ps) => ps.sort(ParticipantApi.byName)))
    );
  }

  public getArchived(): Promise<Participant[]> {
    return lastValueFrom(
      this.http
        .get<Participant[]>(ApiUrl.of(ApiEndpoints.Participants.getAll), {
          params: new HttpParams().set('isArchived', 'true'),
        })
        .pipe(map((ps) => ps.sort(ParticipantApi.byName)))
    );
  }

  public create(dto: ParticipantDto): Promise<Participant> {
    return lastValueFrom(this.http.post<Participant>(ApiUrl.of(ApiEndpoints.Participants.create), dto));
  }

  public update(id: string | number, dto: ParticipantDto): Promise<void> {
    return lastValueFrom(this.http.patch<void>(ApiUrl.of(ApiEndpoints.Participants.update(id)), dto));
  }

  public archive(id: string | number): Promise<void> {
    return lastValueFrom(this.http.post<void>(ApiUrl.of(ApiEndpoints.Participants.archive(id)), null));
  }

  public unarchive(id: string | number): Promise<void> {
    return lastValueFrom(this.http.post<void>(ApiUrl.of(ApiEndpoints.Participants.unarchive(id)), null));
  }

  public delete(id: string | number): Promise<void> {
    return lastValueFrom(this.http.delete<void>(ApiUrl.of(ApiEndpoints.Participants.delete(id))));
  }

  public archiveMany(ids: (string | number)[]): Promise<void> {
    return lastValueFrom(
      this.http.post<void>(ApiUrl.of(ApiEndpoints.Participants.bulkArchive), ParticipantApi.toBulkDto(ids))
    );
  }

  public unarchiveMany(ids: (string | number)[]): Promise<void> {
    return lastValueFrom(
      this.http.post<void>(ApiUrl.of(ApiEndpoints.Participants.bulkUnarchive), ParticipantApi.toBulkDto(ids))
    );
  }

  public deleteMany(ids: (string | number)[]): Promise<void> {
    return lastValueFrom(
      this.http.post<void>(ApiUrl.of(ApiEndpoints.Participants.bulkDelete), ParticipantApi.toBulkDto(ids))
    );
  }

  private static byName(a: Participant, b: Participant): number {
    return a.name.localeCompare(b.name);
  }

  private static toBulkDto(ids: (string | number)[]): BulkParticipantsDto {
    return { ids: ids.map(String) };
  }
}
