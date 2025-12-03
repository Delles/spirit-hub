import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

/**
 * Scheduled jobs for SpiritHub.ro.
 *
 * We ensure the daily dream is persisted near midnight in RO time by running
 * an hourly job that writes the pick for the current RO date iff missing.
 * This approach covers DST changes without needing to adjust cron expressions.
 *
 * Daily number is persisted once per day at 00:00 UTC (02:00/03:00 RO time
 * depending on DST). The hourly dream job provides redundancy.
 */
const crons = cronJobs();

// Run hourly at minute 0 to ensure daily dream is persisted
crons.cron("ensure-daily-dream-persisted", "0 * * * *", internal.dreams.ensureDailyDream, {});

// Run hourly at minute 0 to ensure daily number is persisted (idempotent - checks if exists first)
// This provides redundancy and handles DST changes without adjusting cron expressions
crons.cron("ensure-daily-number-persisted", "0 * * * *", internal.numerology.ensureDailyNumber, {});

export default crons;
