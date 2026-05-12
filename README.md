# Job Interview Question Generator - Technical Screen

## Security Measures Taken

In compliance with the security and privacy constraints of this screening task, the following measures have been implemented:

### 1. PII Protection & Input Sanitization
- **Client-Side Sanitization**: All user inputs are processed through a custom `sanitizeInput` utility (`src/lib/utils.ts`) before being sent to the AI. This utility:
    - Strips all HTML tags to prevent basic XSS.
    - Uses a restrictive RegEx (`/[^a-zA-Z0-9\s\-\.\(\)]/g`) to ensure only generic job title characters are accepted.
    - Automatically blocks potential PII formats like emails or specialized IDs by character restriction.
- **Generic Constraints**: The AI prompt explicitly instructs the model to avoid generating or referencing any PII, focusing solely on the behavioral requirements of the provided job title.

### 2. Secure API Key Handling
- **Environment Variables**: The Google Gemini API key is never hardcoded. It is accessed via `process.env.GEMINI_API_KEY`.
- **Runtime Injection**: In this project structure, the platform injects secrets into the runtime environment, ensuring the key remains hidden from the client-side bundle and source control.

### 3. State & Error Management
- **Graceful Failures**: A robust `try/catch` block handles API timeouts or failures, providing the user with a clear error message and a "Retry" option without leaking technical stack traces.
- **Visual Feedback**: Pulse animations and loading indicators keep the user informed during the asynchronous AI generation process.

---
Built with React, Tailwind CSS, and Google Gemini 1.5 Flash.
