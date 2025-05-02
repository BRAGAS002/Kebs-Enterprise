import { supabase } from '../../config/supabase.js'

export async function handleFormSubmission(formData) {
  try {
    // Upload files first if any
    const files = formData.getAll('attachments');
    const fileUrls = [];
    const uploadErrors = [];

    for (const file of files) {
      if (file.size > 0) {
        try {
          const result = await uploadFile(file);
          
          if (result.success) {
            fileUrls.push({
              name: file.name,
              url: result.url,
              type: file.type,
              size: file.size
            });
          } else {
            uploadErrors.push({
              fileName: file.name,
              error: result.error
            });
          }
        } catch (error) {
          uploadErrors.push({
            fileName: file.name,
            error: error.message
          });
        }
      }
    }

    // If there were any file upload errors, return them
    if (uploadErrors.length > 0) {
      return {
        success: false,
        error: 'File upload errors occurred',
        uploadErrors,
        message: 'Some files could not be uploaded. Please check the file types and sizes.'
      };
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