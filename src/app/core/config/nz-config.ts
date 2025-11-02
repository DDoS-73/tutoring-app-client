import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import { NZ_DATE_CONFIG } from 'ng-zorro-antd/i18n';

const nzConfig: NzConfig = {
  notification: {
    nzPlacement: 'bottom',
    nzBottom: '10px',
    nzMaxStack: 3,
    nzDuration: 4500,
    nzPauseOnHover: true,
  },
};

export default [
  provideNzConfig(nzConfig),
  {
    provide: NZ_DATE_CONFIG,
    useValue: {
      firstDayOfWeek: 1, // Monday
    },
  },
];
