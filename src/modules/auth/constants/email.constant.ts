import { EmailActionEnum } from '../enums/email-action.enum';

export const emailTemplates = {
  [EmailActionEnum.FORGOT_PASSWORD]: {
    templateName: 'forgot-password',
    subject: 'Restore password',
  },
};
