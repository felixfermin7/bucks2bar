import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
const PORT = 3000;

// Increase the payload size limit
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(cors());


const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com', // Resend's SMTP host
    port: 587, // Resend's SMTP port
    auth: {
        user: 'resend', // Replace with your Resend SMTP username
        pass: 'your-resend-password'  // Replace with your Resend SMTP password
    }
});

app.post('/send-email', (req, res) => {
    console.log('Received request to send email:', req.body);
    const { email, image } = req.body;

    if (!email || !image) {
        return res.status(400).send('Email or image is missing.');
    }

    const mailOptions = {
            from: 'test@resend.dev', // Replace with your verified Resend test/dev email
            to: email,
            subject: 'Your Chart Image',
            html: '<p>Here is your chart image:</p>',
            attachments: [
                {
                    filename: 'chart.png',
                    content: image.split('base64,')[1],
                    encoding: 'base64'
                }
            ]
        };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Failed to send email.');
        }
        res.send('Email sent successfully!');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});