
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
    root.render(
      <div style="color: red; padding: 20px;">
        <h1>Error rendering the application</h1>
        <p>{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
}
