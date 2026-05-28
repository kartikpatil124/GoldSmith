import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // Try to load from env, fallback to log if not set
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || 'Goldsmiths Jewels <no-reply@goldsmithsjewels.com>';

  if (!host || !user || !pass) {
    console.log('----------------------------------------------------');
    console.log(`[EMAIL SIMULATION] TO: ${options.to}`);
    console.log(`[EMAIL SIMULATION] SUBJECT: ${options.subject}`);
    console.log(`[EMAIL SIMULATION] BODY:\n${options.html || options.text}`);
    console.log('----------------------------------------------------');
    return { success: true, simulated: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Message sent: %s`, info.messageId);
  return info;
};
