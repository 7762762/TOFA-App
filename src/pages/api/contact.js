import nodemailer from 'nodemailer';

export async function post({ request }) {
  console.log('Contact form submission received');
  
  try {
    const formData = await request.formData();
    const firstName = formData.get('first-name');
    const lastName = formData.get('last-name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    console.log('Form data:', { firstName, lastName, email });
    
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ccthegymgeeks@gmail.com',
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false // Less secure but helps with some connection issues
      }
    });
    
    console.log('Created transporter with email:', 'ccthegymgeeks@gmail.com');
    
    // Email content
    const mailOptions = {
      from: 'ccthegymgeeks@gmail.com', // Changed to match auth user for better deliverability
      to: 'ccthegymgeeks@gmail.com',
      subject: `Contact Form Submission from ${firstName} ${lastName}`,
      replyTo: email,
      text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        
        Message:
        ${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
      `
    };
    
    console.log('Attempting to send email...');
    
    // Send email with a timeout
    const emailResult = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email sending timeout')), 30000)
      )
    ]);
    
    console.log('Email sent successfully:', emailResult);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Email sent successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Error sending email:', error.message);
    console.error('Error details:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to send email: ' + error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 