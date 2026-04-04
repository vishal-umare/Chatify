import { Resend } from "resend";
import { resendEmail, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplaltes.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendEmail.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Chatify!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    return console.error({ error });
  }
  console.log("Welcome email send succesfully", data);
};
