import { inject, Injectable, signal, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ParticipantService } from '../../../core/services/participant.service';
import { ParticipantRow } from '../../../shared/models/participant-row.model';
import { AppModalService } from '../../../shared/services/app-modal.service';
import { AdminPaths } from '../admin.paths';

export type PostDeleteNavigation = 'if-active' | 'always';

@Injectable()
export class ParticipantCommandsService {
  private readonly participantService = inject(ParticipantService);
  private readonly modal = inject(AppModalService);
  private readonly notification = inject(NzNotificationService);
  private readonly router = inject(Router);

  public readonly archivingName = signal('');
  public readonly deletingName = signal('');
  public readonly bulkCount = signal(0);

  public archive(participant: ParticipantRow, content: TemplateRef<void>): void {
    const id = participant.id;
    if (id == null) return;
    this.archivingName.set(participant.name);
    this.modal.confirmDanger({
      title: 'Archive Participant?',
      content,
      okText: 'Archive',
      iconType: 'container',
      onOk: () =>
        new Promise((resolve, reject) => {
          this.participantService.archiveMutation.mutate(id, {
            onSuccess: () => {
              this.leaveIfActive(id);
              resolve(true);
            },
            onError: () => {
              this.notification.error('Error', 'Failed to archive participant. Please try again.');
              reject();
            },
          });
        }),
    });
  }

  public unarchive(participant: ParticipantRow): void {
    const id = participant.id;
    if (id == null) return;
    this.participantService.unarchiveMutation.mutate(id, {
      onSuccess: () => this.leaveIfActive(id),
      onError: () => this.notification.error('Error', 'Failed to restore participant. Please try again.'),
    });
  }

  public delete(participant: ParticipantRow, content: TemplateRef<void>, navigation: PostDeleteNavigation): void {
    const id = participant.id;
    if (id == null) return;
    this.deletingName.set(participant.name);
    this.modal.confirmDanger({
      title: 'Delete Participant?',
      content,
      okText: 'Delete',
      iconType: 'delete',
      onOk: () =>
        new Promise((resolve, reject) => {
          this.participantService.deleteMutation.mutate(id, {
            onSuccess: () => {
              if (navigation === 'always') {
                this.leave();
              } else {
                this.leaveIfActive(id);
              }
              resolve(true);
            },
            onError: () => {
              this.notification.error('Error', 'Failed to delete participant. Please try again.');
              reject();
            },
          });
        }),
    });
  }

  public archiveMany(rows: ParticipantRow[], content: TemplateRef<void>, onSuccess?: () => void): void {
    const ids = ParticipantCommandsService.toIds(rows);
    if (ids.length === 0) return;
    this.bulkCount.set(ids.length);
    this.modal.confirmDanger({
      title: 'Archive participants?',
      content,
      okText: 'Archive',
      iconType: 'container',
      onOk: () =>
        new Promise((resolve, reject) => {
          this.participantService.bulkArchiveMutation.mutate(ids, {
            onSuccess: () => {
              this.notification.success(
                'Success',
                `Archived ${ids.length} ${ParticipantCommandsService.pluralize(ids.length)}.`
              );
              this.leaveIfAnyActive(ids);
              onSuccess?.();
              resolve(true);
            },
            onError: () => {
              this.notification.error('Error', 'Failed to archive participants. Please try again.');
              reject();
            },
          });
        }),
    });
  }

  public unarchiveMany(rows: ParticipantRow[], content: TemplateRef<void>, onSuccess?: () => void): void {
    const ids = ParticipantCommandsService.toIds(rows);
    if (ids.length === 0) return;
    this.bulkCount.set(ids.length);
    this.modal.confirmDanger({
      title: 'Restore participants?',
      content,
      okText: 'Unarchive',
      iconType: 'container',
      onOk: () =>
        new Promise((resolve, reject) => {
          this.participantService.bulkUnarchiveMutation.mutate(ids, {
            onSuccess: () => {
              this.notification.success(
                'Success',
                `Restored ${ids.length} ${ParticipantCommandsService.pluralize(ids.length)}.`
              );
              this.leaveIfAnyActive(ids);
              onSuccess?.();
              resolve(true);
            },
            onError: () => {
              this.notification.error('Error', 'Failed to restore participants. Please try again.');
              reject();
            },
          });
        }),
    });
  }

  public deleteMany(rows: ParticipantRow[], content: TemplateRef<void>, onSuccess?: () => void): void {
    const ids = ParticipantCommandsService.toIds(rows);
    if (ids.length === 0) return;
    this.bulkCount.set(ids.length);
    this.modal.confirmDanger({
      title: 'Delete participants?',
      content,
      okText: 'Delete',
      iconType: 'delete',
      onOk: () =>
        new Promise((resolve, reject) => {
          this.participantService.bulkDeleteMutation.mutate(ids, {
            onSuccess: () => {
              this.notification.success(
                'Success',
                `Deleted ${ids.length} ${ParticipantCommandsService.pluralize(ids.length)}.`
              );
              this.leaveIfAnyActive(ids);
              onSuccess?.();
              resolve(true);
            },
            onError: () => {
              this.notification.error('Error', 'Failed to delete participants. Please try again.');
              reject();
            },
          });
        }),
    });
  }

  private leaveIfActive(id: string | number): void {
    if (this.router.url.startsWith(AdminPaths.participant(id))) {
      this.leave();
    }
  }

  private leaveIfAnyActive(ids: (string | number)[]): void {
    if (ids.some((id) => this.router.url.startsWith(AdminPaths.participant(id)))) {
      this.leave();
    }
  }

  private leave(): void {
    this.router.navigateByUrl(AdminPaths.participants);
  }

  private static pluralize(n: number): string {
    return n === 1 ? 'participant' : 'participants';
  }

  private static toIds(rows: ParticipantRow[]): (string | number)[] {
    return rows.map((r) => r.id).filter((id): id is string | number => id != null);
  }
}
