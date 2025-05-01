import { supabase } from '../../config/supabase.js'

export async function handleFormSubmission(formData) {
  try {
    // Upload files first if any
    const files = formData.getAll('attachments');
    const fileUrls = [];

    for (const file of files) {
      if (file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
          .from('contact-attachments')
          .upload(filePath, file);

        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('contact-attachments')
          .getPublicUrl(filePath);
          
        fileUrls.push({
          name: file.name,
          url: publicUrl,
          type: file.type,
          size: file.size
        });
      }
    }

    // Insert form submission into database
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          service: formData.get('service'),
          message: formData.get('message'),
          attachments: fileUrls
        }
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      data: data[0],
      message: 'Thank you! Your message has been sent.'
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Sorry, there was an error sending your message.'
    };
  }
} 