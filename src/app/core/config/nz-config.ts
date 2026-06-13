import {
  ArrowRightOutline,
  BarChartOutline,
  CalendarOutline,
  ContainerOutline,
  CreditCardOutline,
  DeleteOutline,
  DownOutline,
  EyeInvisibleOutline,
  EyeOutline,
  LeftOutline,
  LoadingOutline,
  LockOutline,
  LogoutOutline,
  MailOutline,
  MenuOutline,
  PlusOutline,
  ReloadOutline,
  RightOutline,
  SettingOutline,
  TeamOutline,
  UserOutline,
} from '@ant-design/icons-angular/icons';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import { NZ_DATE_CONFIG } from 'ng-zorro-antd/i18n';
import { NZ_ICONS } from 'ng-zorro-antd/icon';

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
  {
    provide: NZ_ICONS,
    useValue: [
      LoadingOutline,
      LeftOutline,
      RightOutline,
      CalendarOutline,
      DownOutline,
      PlusOutline,
      UserOutline,
      SettingOutline,
      LogoutOutline,
      DeleteOutline,
      TeamOutline,
      CreditCardOutline,
      BarChartOutline,
      ContainerOutline,
      MailOutline,
      LockOutline,
      EyeOutline,
      EyeInvisibleOutline,
      ArrowRightOutline,
      ReloadOutline,
      MenuOutline,
    ],
  },
];
