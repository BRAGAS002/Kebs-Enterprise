import { dbConfig } from '../../config/supabase.js';

// Function to handle form submissions directly to PostgreSQL
export async function submitFormToDatabase(formData) {
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
      message: 'Form submitted successfully'
    };

  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      success: false,
      error: error.message,
 