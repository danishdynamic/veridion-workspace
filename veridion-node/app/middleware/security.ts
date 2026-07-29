// app/middleware/security.ts
export class SecurityFilter {
  private static BANNED_PATTERNS = [
    /ignore previous instructions/i,
    /system prompt/i,
    /override compliance settings/i,
    /bypass validation/i,
    /drop table/i
  ];

  public static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    const sanitized = input.trim();
    
    for (const pattern of this.BANNED_PATTERNS) {
      if (pattern.test(sanitized)) {
        throw new Error("Adversarial payload vector detected. Processing terminated.");
      }
    }
    
    return sanitized
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  public static sanitizeObject(obj: Record<string, any>): Record<string, any> {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        cleaned[key] = this.sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        cleaned[key] = this.sanitizeObject(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }
}