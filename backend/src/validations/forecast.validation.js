import { z } from "zod";

export const enterActualSchema = z.object({
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  actualCount: z.number().int().nonnegative(),
});

export const importHistorySchema = z.object({
  actuals: z.array(
    z.object({
      date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
      actualCount: z.number().int().nonnegative(),
    })
  ),
});

export const importCsvHistorySchema = z.object({
  source: z.enum(["tirupati_post_covid_processed.csv"]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
