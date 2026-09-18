import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { EventParticipantType, Participant } from '../../shared/models/participant.model';
import { apiUrl } from './api-url';
import { ApiEndpoints } from './endpoints';

export interface ParticipantDto {
  name: string;
  type: EventParticipantType;
  price: number;
}

export interface BulkParticipantsDto {
  ids: string[];
}

function byName(a: Participant, b: Participant): number {
  return a.name.localeCompare(b.name);
}

@Injectable({ providedIn: 'root' })
export class ParticipantApi {
  private readonly http = inject(HttpClient);

  public getActive(): Promise<Participant[]> {
    return lastValueFrom(
      this.http.get<Participant[]>(apiUrl(ApiEndpoints.Participants.getAll)).pipe(map((ps) => ps.sort(byName)))
    );
  }

  public getArchived(): Promise<Participant[]> {
    return lastValueFrom(
      this.http
        .get<Participant[]>(apiUrl(ApiEndpoints.Participants.getAll), {
          params: new HttpParams().set('isArchived', 'true'),
        })
        .pipe(map((ps) => ps.sort(byName)))
    );
  }

  public create(dto: ParticipantDto): Promise<Participant> {
    return lastValueFrom(this.http.post<Participant>(apiUrl(ApiEndpoints.Participants.create), dto));
  }

  public update(id: string | number, dto: ParticipantDto): Promise<void> {
    return lastValueFrom(this.http.patch<void>(apiUrl(ApiEndpoints.Participants.update(id)), dto));
  }

  public archive(id: string | number): Promise<void> {
    return lastValueFrom(this.http.post<void>(apiUrl(ApiEndpoints.Participants.archive(id)), null));
  }

  public unarchive(id: string | number): Promise<void> {
    return lastValueFrom(this.http.post<void>(apiUrl(ApiEndpoints.Participants.unarchive(id)), null));
  }

  public delete(id: string | number): Promise<void> {
    return lastValueFrom(this.http.delete<void>(apiUrl(ApiEndpoints.Participants.delete(id))));
  }

  public archiveMany(ids: (string | number)[]): Promise<void> {
    return lastValueFrom(this.http.post<void>(apiUrl(ApiEndpoints.Participants.bulkArchive), toBulkDto(ids)));
  }

  public unarchiveMany(ids: (string | number)[]): Promise<void> {
    return lastValueFrom(this.http.post<void>(apiUrl(ApiEndpoints.Participants.bulkUnarchive), toBulkDto(ids)));
  }

  public deleteMany(ids: (string | number)[]): Promise<void> {
    return lastValueFrom(this.http.post<void>(apiUrl(ApiEndpoints.Participants.bulkDelete), toBulkDto(ids)));
  }
}

function toBulkDto(ids: (string | number)[]): BulkParticipantsDto {
  return { ids: ids.map(String) };
}
