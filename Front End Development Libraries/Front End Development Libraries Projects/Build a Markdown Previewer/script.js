// Load the marked library
const markedScript = document.createElement('script');
markedScript.src = "https://cdnjs.cloudflare.com/ajax/libs/marked/2.0.0/marked.min.js";
document.head.appendChild(markedScript);

markedScript.onload = () => {
  const editor = document.getElementById('editor');
  const preview = document.getElementById('preview');

  // Set options for marked
  marked.setOptions({
    breaks: true, // Enable line breaks
  });

  // Default markdown content
  const defaultMarkdown = `# Welcome to my Markdown Previewer!
  
  ## This is a sub-heading
  
  [Learn more about Markdown](https://www.markdownguide.org/)
  
  Here is some inline code: \`console.log('Hello, World!')\`
  
  \`\`\`
  // A code block
  function hello() {
    console.log('Hello, World!');
  }
  \`\`\`
  
  - Item 1
  - Item 2
  
  > This is a blockquote.
  
  ![Image](https://via.placeholder.com/150)
  
  **This is bold text**
  
  Line 1  
  Line 2
  `;

  // Set default markdown in the editor
  editor.value = defaultMarkdown;
  preview.innerHTML = marked(defaultMarkdown);

  // Update preview as you type
  editor.addEventListener('input', () => {
    preview.innerHTML = marked(editor.value);
  });
};
