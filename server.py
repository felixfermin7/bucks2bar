from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import base64
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SMTP configuration
SMTP_HOST = "smtp.resend.com"  # Resend's SMTP host
SMTP_PORT = 587  # Resend's SMTP port
SMTP_USER = os.getenv("SMTP_USER")  # Replace with your Resend SMTP username
SMTP_PASS = os.getenv("SMTP_PASS")  # Replace with your Resend SMTP password


class EmailRequest(BaseModel):
    email: str
    image: str


@app.post("/send-email")
async def send_email(request: EmailRequest):
    email = request.email
    image = request.image

    if not email or not image:
        raise HTTPException(status_code=400, detail="Email or image is missing.")

    try:
        # Create the email
        msg = MIMEMultipart()
        msg["From"] = "test@resend.dev"  # Replace with your verified Resend test/dev email
        msg["To"] = email
        msg["Subject"] = "Your Chart Image"

        # Email body
        msg.attach(MIMEText("<p>Here is your chart image:</p>", "html"))

        # Decode the base64 image and attach it
        image_data = base64.b64decode(image.split("base64,")[1])
        attachment = MIMEBase("application", "octet-stream")
        attachment.set_payload(image_data)
        encoders.encode_base64(attachment)
        attachment.add_header("Content-Disposition", "attachment", filename="chart.png")
        msg.attach(attachment)

        # Send the email
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(msg["From"], msg["To"], msg.as_string())

        return {"message": "Email sent successfully!"}

    except Exception as e:
        print("Error sending email:", e)
        raise HTTPException(status_code=500, detail="Failed to send email.")


if __name__ == "__main__":
    import uvicorn

    print("Server is running on http://localhost:3000")
    uvicorn.run(app, host="localhost", port=3000)