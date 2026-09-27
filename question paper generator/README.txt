# PaperCraft AI — Question Paper Generator

Aesthetic HTML/CSS/JavaScript question-paper generator.

## Run
1. Keep `index.html`, `style.css`, and `script.js` in the same folder.
2. Open `index.html` in Chrome/Edge.
3. Enter your syllabus.
4. Select difficulty and number of questions.
5. Click **Generate Question Paper**.

## Important
The included JavaScript contains a local demo question engine so the site works immediately.

For REAL AI-generated questions:
- Create a Node.js/Express backend.
- Send the syllabus from the browser to your backend.
- Let the backend call your chosen AI API.
- Return the generated questions to the browser.
- Do NOT expose a private AI API key inside `script.js`.

The generated output is intentionally kept concise; you can change the number of questions or prompt rules when connecting a real AI model.
