module.exports = async (req, res) => {
  const envVars = {
    SMTP_HOST: !!process.env.SMTP_HOST,
    SMTP_PORT: !!process.env.SMTP_PORT,
    SMTP_USER: !!process.env.SMTP_USER,
    SMTP_PASS: !!process.env.SMTP_PASS,
    MAIL_TO: !!process.env.MAIL_TO
  };

  res.json({
    message: 'Environment check',
    variables: envVars,
    allPresent: Object.values(envVars).every(v => v === true)
  });
};
