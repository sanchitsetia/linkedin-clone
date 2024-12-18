import { mailTrapClient, sender } from "../lib/mailTrap.js"
import { createWelcomeEmailTemplate } from "./emailtemplates.js";

export const sendWelcomeEmail = async (email,name,profileUrl) => {
  try {
    let response = await mailTrapClient.send({
      from: sender,
      to: [
        {
          email: email,
        },
      ],
      subject: "Welcome to Linkedin!",
      category: "welcome",
      html: createWelcomeEmailTemplate(name,profileUrl)
    })
    console.log("welcome email sent", response,email);
  } catch (error) {
    throw error;
    
  }
  
}