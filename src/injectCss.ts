export function injectCss() {
  // Check if css is already injected
  const existingCss = document.querySelector('#canvas-strikethrough-css');
  if (existingCss) {
    return;
  }

  // Create style element
  const style = document.createElement('style');
  style.id = 'canvas-strikethrough-css';

  // Add css
  style.innerHTML = `
  #checked-todos-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .checked-todo {
    border-radius: 3px;
    margin-bottom: 3px;
    padding: 3px;
    color: white;
  }

  .checked-todo a {
    color: white;
    text-decoration: none;
    cursor: pointer;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  .checked-todo a:hover {
    text-decoration: underline;
  }

  .checked-todo button {
    padding: 3px;
    margin: 3px;
    background-color: white;
    color: black;
    border-radius: 3px;
    cursor: pointer;
    border: 1px solid black;
  }

  .disclaimer-text {
    font-style: italic;
  }
    `;

  // Append style to head
  document.head.appendChild(style);
}