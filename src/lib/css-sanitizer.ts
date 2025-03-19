/**
 * CSS Sanitizer for Lynkr
 *
 * This utility provides functions to sanitize user-provided CSS
 * to prevent injection of malicious code.
 */

/**
 * List of disallowed CSS properties that could be used for attacks
 */
const DISALLOWED_CSS_PROPERTIES = [
  // Potentially harmful properties
  "expression",
  "eval",
  "url(",
  "@import",
  "behavior",
  "binding",
  "-moz-binding",
  "javascript:",
  "position: fixed",
  "position: sticky",
  "position:fixed",
  "position:sticky",
  "z-index: 9999",
  "z-index:9999",

  // Properties that could be used to hide malicious content
  "visibility: hidden",
  "visibility:hidden",
  "display: none",
  "display:none",
  "opacity: 0",
  "opacity:0",

  // Animation properties that could cause problems
  "animation-duration: 0s",
  "animation-duration:0s",
  "animation-play-state: paused",
  "animation-play-state:paused",
  "animation: none",
  "animation:none",

  // Other potentially problematic properties
  "pointer-events: none",
  "pointer-events:none",
  "user-select: none",
  "user-select:none",
  "-webkit-user-select: none",
  "-webkit-user-select:none",
];

/**
 * List of allowed CSS selectors to restrict what users can target
 */
const ALLOWED_SELECTOR_PATTERNS = [
  // Basic element selectors
  /^h[1-6]$/,
  /^p$/,
  /^a$/,
  /^div$/,
  /^span$/,
  /^img$/,
  /^ul$/,
  /^ol$/,
  /^li$/,
  /^button$/,
  /^section$/,
  /^article$/,
  /^header$/,
  /^footer$/,
  /^main$/,
  /^nav$/,

  // Class selectors (including Tailwind/shadcn-ui classes)
  /^\.[a-zA-Z0-9_-]+$/,

  // ID selectors
  /^#[a-zA-Z0-9_-]+$/,

  // Attribute selectors
  /^\[.*\]$/,

  // Pseudo-classes and pseudo-elements
  /^:[a-zA-Z-]+$/,
  /^::[a-zA-Z-]+$/,

  // Combinations of above
  /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/,
  /^[a-zA-Z0-9_-]+#[a-zA-Z0-9_-]+$/,
  /^\.[a-zA-Z0-9_-]+:[a-zA-Z-]+$/,
  /^\.[a-zA-Z0-9_-]+::[a-zA-Z-]+$/,
];

/**
 * Sanitize CSS by removing potentially harmful properties
 */
export function sanitizeCSS(css: string): string {
  if (!css) return "";

  let sanitizedCSS = css;

  // Remove comments first (could contain hidden malicious code)
  sanitizedCSS = sanitizedCSS.replace(/\/\*[\s\S]*?\*\//g, "");

  // Check for disallowed properties
  for (const disallowedProperty of DISALLOWED_CSS_PROPERTIES) {
    sanitizedCSS = sanitizedCSS.replace(
      new RegExp(disallowedProperty, "gi"),
      "/* removed */"
    );
  }

  // Limit max-height/width (prevent extreme values)
  sanitizedCSS = sanitizedCSS.replace(
    /(max-[width|height]:\s*)([0-9]+)([a-z%]*)/gi,
    (match, property, value, unit) => {
      const numValue = parseInt(value, 10);
      if (numValue > 5000) {
        return `${property}5000${unit}`;
      }
      return match;
    }
  );

  return sanitizedCSS;
}

/**
 * Validate if the CSS is safe to use
 * Returns an error message if invalid, or null if valid
 */
export function validateCSS(css: string): string | null {
  if (!css) return null;

  // Check for potentially harmful content
  for (const disallowedProperty of DISALLOWED_CSS_PROPERTIES) {
    if (css.toLowerCase().includes(disallowedProperty.toLowerCase())) {
      return `CSS contains disallowed property: ${disallowedProperty}`;
    }
  }

  try {
    // Basic syntax validation
    const braceCount = (css.match(/{/g) || []).length;
    const closingBraceCount = (css.match(/}/g) || []).length;

    if (braceCount !== closingBraceCount) {
      return "CSS has mismatched braces";
    }

    // Check that @-rules are supported ones
    const atRuleMatches = css.match(/@[a-z-]+/g) || [];
    for (const atRule of atRuleMatches) {
      if (
        !["@media", "@keyframes", "@font-face", "@supports"].includes(atRule)
      ) {
        return `Unsupported at-rule: ${atRule}`;
      }
    }

    // Check selector validity
    // This is a simplified check and might not catch all cases
    const selectorBlocks = css.match(/[^{]+{/g) || [];
    for (const selectorBlock of selectorBlocks) {
      const selector = selectorBlock.replace("{", "").trim();

      // Skip media queries and keyframes
      if (selector.startsWith("@")) continue;

      // Check if selector is in allowed patterns
      const isAllowed = ALLOWED_SELECTOR_PATTERNS.some((pattern) =>
        pattern.test(selector)
      );

      if (!isAllowed) {
        return `Invalid selector: ${selector}`;
      }
    }

    return null;
  } catch (error) {
    return `CSS validation error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Process and sanitize CSS for user profiles
 * Returns an object with sanitized CSS and any validation errors
 */
export function processUserCSS(css: string): {
  css: string;
  error: string | null;
} {
  // First validate
  const validationError = validateCSS(css);

  // Then sanitize
  const sanitizedCSS = sanitizeCSS(css);

  return {
    css: sanitizedCSS,
    error: validationError,
  };
}
