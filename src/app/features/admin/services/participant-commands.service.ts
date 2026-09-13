import { inject, Injectable, signal, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ParticipantService } from '../../../core/services/participant.service';
import { ParticipantRow } from '../../../shared/models/participant-row.model';
import { AppModalService } from '../../../shared/services/app-modal.service';
import { ADMIN_PARTICIPANTS_PATH, participantPath } from '../admin.paths';

export type PostDeleteNavigation = 'if-active' | 'always';

@Injectable()
export class ParticipantCommandsService {
  private readonly participantService = inject(ParticipantService);
  private readonly modal = inject(AppModalService);
  private readonly message = inject(NzMessageService);
  private readonly router = inject(Router);

  public readonly archivingName = signal('');
  public readonly deletingName = signal('');

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
              this.message.error('Failed to archive participant. Please try again.');
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
      onError: () => this.message.error('Failed to restore participant. Please try again.'),
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
              this.message.error('Failed to delete participant. Please try again.');
              reject();
            },
          });
        }),
    });
  }

  private leaveIfActive(id: string | number): void {
    if (this.router.url.startsWith(participantPath(id))) {
      this.leave();
    }
  }

  private leave(): void {
    this.router.navigateByUrl(ADMIN_PARTICIPANTS_PATH);
  }
}
