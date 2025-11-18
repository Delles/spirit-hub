import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

/**
 * Scheduled jobs for SpiritHub.ro.
 *
 * We ensure the daily dream is persisted near midnight in RO time by running
 * an hourly job that writes the pick for the current RO date iff missing.
 * This approach covers DST changes without needing to adjust cron expressions.
 */
const crons = cronJobs();

// Run hourly at minute 0
crons.cron("ensure-daily-dream-persisted", "0 * * * *", internal.dreams.ensureDailyDream, {});

export default crons;
