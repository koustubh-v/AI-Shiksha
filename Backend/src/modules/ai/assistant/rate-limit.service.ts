import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);
  
  // Map<userId, timestamp[]>
  // Sliding window: We store the timestamp of each request.
  private userRequests: Map<string, number[]> = new Map();

  // Constraints
  private readonly LIMIT = 20; // Max requests per window
  private readonly WINDOW_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Checks if the user has exceeded the rate limit.
   * Throws HttpException (429) if exceeded.
   * Records the current request timestamp if allowed.
   * 
   * NOTE: In PM2 cluster mode, this Map is per-process. 
   * Global limit will be (LIMIT * number_of_processes).
   * This is an accepted limitation for Phase 2.
   */
  checkRateLimit(userId: string): void {
    const now = Date.now();
    const windowStart = now - this.WINDOW_MS;

    let timestamps = this.userRequests.get(userId) || [];

    // 1. Sliding Window: Remove timestamps older than the window
    timestamps = timestamps.filter((t) => t > windowStart);

    // 2. Check Count
    if (timestamps.length >= this.LIMIT) {
      this.logger.warn(`Rate limit exceeded for user ${userId}`);
      throw new HttpException(
        'Too many requests. Please try again in a few minutes.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 3. Record new request
    timestamps.push(now);
    this.userRequests.set(userId, timestamps);
    
    // Cleanup optimization: 
    // Occasionally we might want to clean up users who haven't requested in a long time,
    // but for now, Map size is manageable given < 500 users.
    // Ideally, we'd use a TTL cache or run a cleanup job, but we'll keep it simple as requested.
  }
}
