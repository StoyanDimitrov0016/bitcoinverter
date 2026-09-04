import {
  RIVER_CUSTODY_REPORT_URL,
  UN_POPULATION_REPORT_URL,
  UBS_WEALTH_REPORT_URL,
} from "@/lib/percentile/percentile.constants";

import { reportLink } from "./rich-text.utils";

export const riverReportLink = reportLink(RIVER_CUSTODY_REPORT_URL);
export const unReportLink = reportLink(UN_POPULATION_REPORT_URL);
export const ubsReportLink = reportLink(UBS_WEALTH_REPORT_URL);
