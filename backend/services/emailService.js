import nodemailer from 'nodemailer';

// Configurar el transporter de nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    debug: true,
    logger: true,
    // Opciones para evitar errores SSL en desarrollo
    tls: {
      rejectUnauthorized: false
    },
    secure: false
  });
};

// Función para enviar email de notificación de asignación de caso
export const enviarNotificacionAsignacion = async (datosCaso) => {
  try {
    console.log('📧 Iniciando envío de notificación de asignación...');
    console.log('📧 Datos del caso:', JSON.stringify(datosCaso, null, 2));
    
    const transporter = createTransporter();
    
    // Verificar conexión
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada');
    
    // Emails fijos que siempre deben recibir notificación
    // COMENTADOS PARA PRUEBAS - SOLO RESPONSABLE Y FUNCIONARIO
    const emailsFijos = [
      // 'etapia@proserpuertos.com.co',
      // 'aatapia@proserpuertos.com.co', 
      // 'itapia9@proserpuertos.com.co'
    ];
    
    // Emails adicionales (responsable y quien asigna)
    const emailsAdicionales = [];
    if (datosCaso.emailResponsable) {
      emailsAdicionales.push(datosCaso.emailResponsable);
    }
    if (datosCaso.emailQuienAsigna) {
      emailsAdicionales.push(datosCaso.emailQuienAsigna);
    }
    
         // Combinar todos los emails únicos
     const todosLosEmails = [...new Set([...emailsFijos, ...emailsAdicionales])];
     
     // Validar que haya al menos un email válido
     if (todosLosEmails.length === 0) {
       console.log('⚠️ No hay emails válidos para notificar, saltando envío');
       return {
         success: true,
         message: 'No hay emails válidos para notificar',
         emailsEnviados: []
       };
     }
     
     console.log('📧 Emails a notificar:', todosLosEmails);
    
    const mailOptions = {
      from: `"Grupo Proser - Sistema de Casos" <${process.env.EMAIL_USER}>`,
      to: todosLosEmails.join(', '),
      subject: `📋 Caso Asignado - ${datosCaso.numeroCaso}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 24px;">📋 Caso Asignado</h1>
              <p style="color: #6b7280; margin: 10px 0 0 0;">Sistema de Gestión de Casos - Grupo Proser</p>
            </div>
            
            <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">📊 Información del Caso</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">🔢 Número de Ajuste:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.numeroCaso}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">📊 Número de Siniestro:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.numeroSiniestro || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">🔧 Código Workflow:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.codigoWorkflow || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">👤 Responsable:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.nombreResponsable || 'Sin asignar'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">🏢 Aseguradora:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.aseguradora || 'No especificada'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">👥 Asegurado:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.asegurado || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">📅 Fecha de Asignación:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.fechaAsignacion || 'No especificada'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">👨‍💼 Asignado por:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.quienAsigna || 'Sistema'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">📋 Número de Póliza:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.numeroPoliza || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">🏙️ Ciudad del Siniestro:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.ciudadSiniestro || 'No especificada'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">📝 Descripción:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.descripcionSiniestro || 'No especificada'}</td>
                </tr>
              </table>
            </div>
            
            ${datosCaso.observaciones ? `
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">📝 Observaciones</h3>
              <p style="color: #78350f; margin: 0; line-height: 1.5;">${datosCaso.observaciones}</p>
            </div>
            ` : ''}
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #0369a1; margin: 0 0 15px 0; font-size: 16px;">👥 Destinatarios de esta notificación:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #0c4a6e;">
                <li>Responsable asignado: ${datosCaso.nombreResponsable || 'Sin asignar'}</li>
                <li>Persona que asignó: ${datosCaso.quienAsigna || 'Sistema'}</li>
                <li>Equipo de gestión: Elkin Tapia, Arnaldo Tapia, Iskharly Tapia</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                Este es un mensaje automático del Sistema de Gestión de Casos de Grupo Proser.<br>
                No responda a este correo. Para consultas, contacte al administrador del sistema.
              </p>
            </div>
          </div>
        </div>
      `
    };
    
    console.log('📧 Enviando notificación...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Notificación enviada exitosamente');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    
    return {
      success: true,
      messageId: info.messageId,
      emailsEnviados: todosLosEmails
    };
    
  } catch (error) {
    console.error('❌ Error enviando notificación de asignación:', error);
    throw new Error(`Error enviando notificación: ${error.message}`);
  }
};

// Función para enviar email al funcionario de la aseguradora
export const enviarNotificacionAseguradora = async (datosCaso) => {
  try {
    console.log('📧 Iniciando envío de notificación a aseguradora...');
    console.log('📧 Datos del caso:', JSON.stringify(datosCaso, null, 2));
    
    const transporter = createTransporter();
    
    // Verificar conexión
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada');
    
    const mailOptions = {
      from: `"Grupo Proser - Sistema de Casos" <${process.env.EMAIL_USER}>`,
      to: datosCaso.emailFuncionarioAseguradora,
      subject: `📋 Caso Asignado - ${datosCaso.numeroCaso}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 24px;">📋 Caso Asignado</h1>
              <p style="color: #6b7280; margin: 10px 0 0 0;">Sistema de Gestión de Casos - Grupo Proser</p>
            </div>
            
            <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">📊 Información del Caso</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">🔢 Número de Ajuste:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.numeroCaso}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">📊 Número de Siniestro:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.numeroSiniestro || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">🔧 Código Workflow:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.codigoWorkflow || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">🏢 Aseguradora:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.aseguradora || 'No especificada'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">👥 Asegurado:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.asegurado || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">📅 Fecha de Asignación:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.fechaAsignacion || 'No especificada'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">📋 Número de Póliza:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.numeroPoliza || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">🏙️ Ciudad del Siniestro:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.ciudadSiniestro || 'No especificada'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">📝 Descripción:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.descripcionSiniestro || 'No especificada'}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #0369a1; margin: 0 0 15px 0; font-size: 16px;">👤 Responsable Asignado</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Nombre:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.nombreResponsable || 'Sin asignar'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.emailResponsable || 'No disponible'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Teléfono:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${datosCaso.telefonoResponsable || 'No disponible'}</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                Este es un mensaje automático del Sistema de Gestión de Casos de Grupo Proser.<br>
                No responda a este correo. Para consultas, contacte al administrador del sistema.
              </p>
            </div>
          </div>
        </div>
      `
    };
    
    console.log('📧 Enviando notificación a aseguradora...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Notificación a aseguradora enviada exitosamente');
    console.log('📧 Message ID:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      emailEnviado: datosCaso.emailFuncionarioAseguradora
    };
    
  } catch (error) {
    console.error('❌ Error enviando notificación a aseguradora:', error);
    throw new Error(`Error enviando notificación a aseguradora: ${error.message}`);
  }
};

// Función para enviar email de prueba
export const enviarEmailPrueba = async (emailDestino) => {
  try {
    console.log('🧪 Iniciando prueba de email...');
    
    const transporter = createTransporter();
    
    // Verificar conexión
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada');
    
    const mailOptions = {
      from: `"Grupo Proser - Sistema de Casos" <${process.env.EMAIL_USER}>`,
      to: emailDestino || 'danalyst@proserpuertos.com.co',
      subject: '🧪 Prueba de Email - Sistema de Casos',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🧪 Prueba de Email</h2>
          <p>Este es un email de prueba para verificar que el sistema de notificaciones funciona correctamente.</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            Este es un mensaje de prueba automático del Sistema de Gestión de Casos.
          </p>
        </div>
      `
    };
    
    console.log('📧 Enviando email de prueba...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de prueba enviado exitosamente');
    console.log('📧 Message ID:', info.messageId);
    
    return {
      success: true,
      message: "Email de prueba enviado correctamente",
      messageId: info.messageId
    };
    
  } catch (error) {
    console.error('❌ Error en prueba de email:', error);
    throw new Error(`Error enviando email de prueba: ${error.message}`);
  }
}; 