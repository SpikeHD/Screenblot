export function registerCtrlZ(document: Document, fn: () => void) {
  return document.addEventListener('keydown', async (e) => {
    console.log(e.key)
    console.log(e.ctrlKey)

    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      e.stopPropagation();
      
      await fn();
    }
  });
}