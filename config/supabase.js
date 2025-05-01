import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://nrrpljbprqiobcxbyuok.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycnBsamJwcnFpb2JjeGJ5dW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwOTM4MjAsImV4cCI6MjA2MTY2OTgyMH0.uDJsM_mzz9lVvPp92Z7JGWKUVOn7a4qkg8HDHAaQXjM'

// Direct database connection details
export const dbConfig = {
  host: 'db.nrrpljbprqiobcxbyuok.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  // NOTE: Replace [YOUR-PASSWORD] with the actual database password
  password: '[YOUR-PASSWORD]',
  ssl: true
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Function to save form data to local storage
export function saveFormData(formData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    service: formData.get('service'),
    message: formData.get('message')
  }
  localStorage.setItem('savedFormData', JSON.stringify(data))
}

// Function to load form data from local storage
export function loadFormData() {
  const savedData = localStorage.getItem('savedFormData')
  return savedData ? JSON.parse(savedData) : null
}

// Function to clear saved form data
export function clearFormData() {
  localStorage.removeItem('savedFormData')
}

// Function to submit form data to Supabase
export async function submitFormToSupabase(formData) {
  try {
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
      .select()

    if (error) throw error

    // Clear saved form data after successful submission
    clearFormData()
    return { success: true, data }
  } catch (error) {
    console.error('Error submitting form:', error)
    return { success: false, error: error.message }
  }
}

// Function to handle file uploads
export async function uploadFile(file) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error } = await supabase.storage
      .from('contact-attachments')
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('contact-attachments')
      .getPublicUrl(filePath)

    return {
      success: true,
      url: publicUrl,
      name: file.name,
      type: file.type,
      size: file.size
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { success: false, error: error.message }
  }
} 