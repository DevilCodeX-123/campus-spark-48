import emailjs from '@emailjs/browser';

const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_282i3zi';

export const sendEmail = async (templateId: string, templateParams: any) => {
  try {
    const result = await emailjs.send(SERVICE_ID, templateId, templateParams, PUBLIC_KEY);
    return result;
  } catch (error) {
    console.error('EmailJS Error:', error);
    throw error;
  }
};

export const TEMPLATES = {
  VERIFY: 'template_verify',
  CONFIRM: 'template_confirm',
  HOLD: 'template_hold',
  APPROVED: 'template_approved',
  REJECTED: 'template_rejected',
  ROLE_CHANGE: 'template_role_change'
};
