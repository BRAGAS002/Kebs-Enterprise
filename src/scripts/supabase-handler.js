import { supabase } from '../../config/supabase.js'

export async function handleFormSubmission(formData) {
  try {
    // Insert form submission into database
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          service: formData.get('service'),
          message: formData.get('message')
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