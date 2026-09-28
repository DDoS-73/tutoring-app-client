import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EventParticipantType } from '../../../../../shared/models/participant.model';
import { ParticipantAdditionalInfoComponent } from '../participant-additional-info/participant-additional-info.component';
import { ParticipantDetailService } from '../participant-detail/participant-detail.service';

@Component({
  selector: 'app-participant-general',
  templateUrl: './participant-general.component.html',
  styleUrl: './participant-general.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, ParticipantAdditionalInfoComponent],
})
export class ParticipantGeneralComponent {
  private readonly participantDetail = inject(ParticipantDetailService);

  protected readonly EventParticipantType = EventParticipantType;
  protected readonly participant = this.participantDetail.participant;
}
