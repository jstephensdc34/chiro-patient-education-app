
import { createRoot } from 'react-dom/client'
import { StrictMode, Suspense } from 'react'
import App from './App.tsx'
import './index.css'

// Create a more robust error handling setup
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Failed to find the root element</div>';
} else {
  const root = createRoot(rootElement);
  
  // Handle potential runtime errors during initialization
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
  });

  // Log app start and environment info
  console.log("Starting application");
  console.log("Base URL:", import.meta.env.BASE_URL);
  console.log("Environment:", import.meta.env.MODE);
  
  try {
    root.render(
      <StrictMode>
        <Suspense fallback={<div>Loading application...</div>}>
          <App />
        </Suspense>
      </StrictMode>
    );
    
    console.log("App rendering started");
  } catch (error) {
    console.error("Error rendering the application:", error);
    // Fix the style attribute to use proper React style object instead of string
    root.render(
      <div style={{color: "red", padding: "20px"}}>
        <h1>Error rendering the application</h1>
        <p>{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
}
