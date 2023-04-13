export const emailSubjectResetPass = 'OTP for reset password';

export const getEmailTemplate = (otp: string) => {
  return `<div style="background-color: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px;">
    <div style="text-align: center; margin-top: 10px; margin-bottom: 10px">
      <img src="https://media.licdn.com/dms/image/C4D0BAQFBtFlLp37QoQ/company-logo_200_200/0/1646821606183?e=1689206400&v=beta&t=DsLaS_dblTiFGjItcHPGVGH0g7Zc8mDZ45dJvFtAqig" alt="logo" border="0" style="width: 100px;">
    </div>  
    <div style="text-align: center; margin-top: 20px;">
      <h1 style="font-size: 24px; font-weight: 600; color: #000;">Welcome to <span style="color: #f50057;">L</span>oc<span style="color: #f50057;">at</span>ify</h1>
      <p style="font-size: 16px; font-weight: 400; color: #000;">You recently requested to reset your password for your account. Please use the OTP below to reset your password:</p>
      <p style="font-size:24px; font-weight: 400; color: red;">OTP: ${otp}</p>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <p style="font-size: 16px; font-weight: 400; color: #000;">This OTP will expire in 5 minutes.</p>
      <p style="font-size: 16px; font-weight: 400; color: #000;">If you have any questions, please contact us at <a href="www.google.com" style="color: #f50057; text-decoration: none;">Locatify@Zvoid</a></p>
    </div>
  </div>
  </div>`;
};
