import { Resend } from 'resend';

//authorizing with resend to give access to you
export const resend = new Resend(process.env.RESEND_API_KEY);