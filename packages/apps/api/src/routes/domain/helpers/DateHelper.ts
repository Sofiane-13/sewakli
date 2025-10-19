export class DateHelper {
  /**
   * Normalize a date to midnight (00:00:00.000) for date-only comparisons
   */
  static normalizeToMidnight(date: Date): Date {
    const normalized = new Date(date)
    normalized.setHours(0, 0, 0, 0)
    return normalized
  }

  /**
   * Check if two dates are on the same day (ignoring time)
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    const normalized1 = this.normalizeToMidnight(date1)
    const normalized2 = this.normalizeToMidnight(date2)
    return normalized1.getTime() === normalized2.getTime()
  }
}
