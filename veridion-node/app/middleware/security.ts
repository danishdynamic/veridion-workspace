// app/middleware/security.ts
export class SecurityFilter {
  private static BANNED_PATTERNS = [
    /ignore previous instructions/i,
    /system prompt/i,
    /override compliance settings/i,
    /bypass validation/i
  ];

  public static sanitizeInput(input: string): string {
    let sanitized = input.trim();
    
    // Fixed: Corrected case-sensitivity to match static property definition
    for (const pattern of this.BANNED_PATTERNS) {
      if (pattern.test(sanitized)) {
        throw new Error("Adversarial payload vector detected. Input processing terminated.");
      }
    }
    
    // Escape basic html block entities
    return sanitized
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}