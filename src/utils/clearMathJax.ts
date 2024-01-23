import Logs from "./logs";

/**
 * Clear MathJax elements
 * @param element - The element to clear
 * @returns The cleared element
 */
function clearMathJax(_element: HTMLElement): HTMLElement {
  const element = _element.cloneNode(true) as HTMLElement;

  const mathJaxElements: NodeListOf<HTMLElement> =
    element.querySelectorAll(".MathJax");

  for (const mathJaxElement of mathJaxElements) {
    let scriptElement = mathJaxElement.nextElementSibling;
    if (!scriptElement) {
      // try next next sibling of parent
      scriptElement = mathJaxElement.parentElement?.nextElementSibling;
    }
    if (scriptElement) {
      // DEBUG
      Logs.info("MathJax script:", scriptElement);
      mathJaxElement.textContent = scriptElement.textContent;
      scriptElement.remove();
    } else {
      Logs.error("MathJax script not found:", mathJaxElement);
    }
  }

  return element;
}

export default clearMathJax;
