import { EmailActionEnum } from '../enums/email-action.enum';

export const emailTemplates = {
  [EmailActionEnum.FORGOT_PASSWORD]: {
    templateName: 'forgot-password',
    subject: 'Restore password',
  },
  [EmailActionEnum.REPORT]: {
    templateName: 'report',
    subject: 'Report brand and model',
  },
  [ EmailActionEnum.VOCABULARY]: {
    templateName: 'vocabulary',
    subject: 'Report vocabulary',
  },
};
