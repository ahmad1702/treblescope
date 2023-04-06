import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { parse } from "csv-parse/sync";
import path from "path";
import { promises as fs } from "fs";

export type BillboardChartDatum = {
  date: Date;
  rank: number;
  song: string;
  artist: string;
  lastWeek: number;
  peakRank: number;
  weeksOnBoard: number;
};
export const chartsRouter = createTRPCRouter({
  getBillboardsChartsData: publicProcedure
    .input(
      z.object({
        startIndex: z.number().int().positive().optional(),
        endIndex: z.number().int().positive().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      let startIndex = 2
      let endIndex = 100
      if (input && input.startIndex !== undefined) {
        startIndex = input.startIndex
      }
      if (input && input.endIndex !== undefined) {
        endIndex = input.endIndex
      }
      const csvDirectory = path.join(process.cwd(), "src/data");
      const fileContent = await fs.readFile(
        csvDirectory + "/charts.csv",
        "utf8"
      );
      const headers = [
        "Date",
        "Rank",
        "Song",
        "Artist",
        "LastWeek",
        "PeakRank",
        "WeeksOnBoard",
      ];
      const numberColumns = ["Rank", "LastWeek", "PeakRank", "WeeksOnBoard"];
      try {
        const res: BillboardChartDatum[] = parse(fileContent, {
          delimiter: ",",
          columns: headers,
          from: startIndex,
          to: endIndex,
          cast: (columnValue, context) => {
            if (context.column === "Date" && typeof columnValue === "string") {
              return new Date(columnValue);
            } else if (
              typeof context.column === "string" &&
              numberColumns.includes(context.column)
            ) {
              const parsedValue = parseInt(columnValue);
              return !isNaN(parsedValue) ? parsedValue : null;
            }
            return columnValue;
          },
        }) as unknown as BillboardChartDatum[];
        return res;
      } catch (error) {
        return [];
      }
    }),
});
