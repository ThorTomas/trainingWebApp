import smtplib
from email.mime.text import MIMEText
from flask import current_app

def send_activation_email(to_email, activation_token):
    activation_link = f"{current_app.config['FRONTEND_URL']}/complete-profile?token={activation_token}"
    subject = "Activate your account"
    body = f"""
    Hello,<br><br>
    Thank you for registering!<br>
    Please complete your profile and activate your account by clicking the link below:<br>
    <a href="{activation_link}">{activation_link}</a><br><br>
    If you did not register, please ignore this email.
    """

    msg = MIMEText(body, "html")
    msg["Subject"] = subject
    msg["From"] = current_app.config["MAIL_FROM"]
    msg["To"] = to_email

    with smtplib.SMTP_SSL(current_app.config["MAIL_SERVER"], current_app.config["MAIL_PORT"]) as server:
        if current_app.config.get("MAIL_USERNAME") and current_app.config.get("MAIL_PASSWORD"):
            server.login(current_app.config["MAIL_USERNAME"], current_app.config["MAIL_PASSWORD"])
        server.sendmail(msg["From"], [msg["To"]], msg.as_string())

def send_password_reset_email(to_email, reset_token):
    reset_link = f"{current_app.config['FRONTEND_URL']}/reset-password?token={reset_token}"
    subject = "Reset your password"
    body = f"""
    Hello,<br><br>
    We received a request to reset your password.<br>
    You can reset your password by clicking the link below:<br>
    <a href="{reset_link}">{reset_link}</a><br><br>
    If you did not request a password reset, please ignore this email.
    """

    msg = MIMEText(body, "html")
    msg["Subject"] = subject
    msg["From"] = current_app.config["MAIL_FROM"]
    msg["To"] = to_email

    with smtplib.SMTP_SSL(current_app.config["MAIL_SERVER"], current_app.config["MAIL_PORT"]) as server:
        if current_app.config.get("MAIL_USERNAME") and current_app.config.get("MAIL_PASSWORD"):
            server.login(current_app.config["MAIL_USERNAME"], current_app.config["MAIL_PASSWORD"])
        server.sendmail(msg["From"], [msg["To"]], msg.as_string())