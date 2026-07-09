import type { Job } from "./jobs";

export type JobShift = {
  dateLabel: string;
  time: string;
  rate: string;
};

export type JobDetailMeta = {
  employmentType: "W2" | "1099";
  hourlyRate: string;
  rating: number;
  reviewCount: number;
  scheduleRange: string;
  shiftTime: string;
  timezone: string;
  estimatedDailyPay: string;
  shifts: JobShift[];
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
};

const detailOverrides: Partial<Record<string, Partial<JobDetailMeta>>> = {
  "certified-nursing-assistant": {
    employmentType: "W2",
    hourlyRate: "$24.00/hr",
    rating: 4.8,
    reviewCount: 23,
    scheduleRange: "MON, JUL 14 – SUN, JUL 20",
    shiftTime: "7:00 am – 3:00 pm",
    timezone: "CT",
    estimatedDailyPay: "$192.00",
    shifts: [
      { dateLabel: "Mon, Jul 14", time: "7:00 AM – 3:00 PM", rate: "$24.00/hr" },
      { dateLabel: "Tue, Jul 15", time: "7:00 AM – 3:00 PM", rate: "$24.00/hr" },
      { dateLabel: "Wed, Jul 16", time: "7:00 AM – 3:00 PM", rate: "$24.00/hr" },
      { dateLabel: "Thu, Jul 17", time: "7:00 AM – 3:00 PM", rate: "$24.00/hr" },
      { dateLabel: "Fri, Jul 18", time: "7:00 AM – 3:00 PM", rate: "$24.00/hr" },
      { dateLabel: "Sat, Jul 19", time: "7:00 AM – 3:00 PM", rate: "$24.00/hr" },
      { dateLabel: "Sun, Jul 20", time: "7:00 AM – 3:00 PM", rate: "$24.00/hr" },
    ],
    streetAddress: "4521 Medical Pkwy",
    city: "Austin",
    state: "TX",
    zip: "78756",
    lat: 30.3376,
    lng: -97.756,
  },
  "registered-nurse-icu": {
    employmentType: "W2",
    hourlyRate: "$42.00/hr",
    rating: 4.9,
    reviewCount: 41,
    scheduleRange: "MON, JUL 14 – SUN, JUL 20",
    shiftTime: "7:00 pm – 7:00 am",
    timezone: "CT",
    estimatedDailyPay: "$504.00",
    shifts: [
      { dateLabel: "Mon, Jul 14", time: "7:00 PM – 7:00 AM", rate: "$42.00/hr" },
      { dateLabel: "Wed, Jul 16", time: "7:00 PM – 7:00 AM", rate: "$42.00/hr" },
      { dateLabel: "Fri, Jul 18", time: "7:00 PM – 7:00 AM", rate: "$42.00/hr" },
    ],
    streetAddress: "8200 Walnut Hill Ln",
    city: "Dallas",
    state: "TX",
    zip: "75231",
    lat: 32.8798,
    lng: -96.7698,
  },
  "home-health-aide": {
    employmentType: "1099",
    hourlyRate: "$19.50/hr",
    rating: 4.6,
    reviewCount: 17,
    scheduleRange: "MON, JUL 14 – SUN, JUL 20",
    shiftTime: "9:00 am – 1:00 pm",
    timezone: "CT",
    estimatedDailyPay: "$78.00",
    shifts: [
      { dateLabel: "Mon, Jul 14", time: "9:00 AM – 1:00 PM", rate: "$19.50/hr" },
      { dateLabel: "Wed, Jul 16", time: "9:00 AM – 1:00 PM", rate: "$19.50/hr" },
      { dateLabel: "Fri, Jul 18", time: "9:00 AM – 1:00 PM", rate: "$19.50/hr" },
    ],
    streetAddress: "1400 Smith St",
    city: "Houston",
    state: "TX",
    zip: "77002",
    lat: 29.7604,
    lng: -95.3698,
  },
};

function parseHourlyRate(pay: string): string {
  const match = pay.match(/\$[\d,.]+/);
  return match ? `${match[0]}/hr` : pay;
}

function defaultShifts(job: Job, rate: string): JobShift[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return days.map((day, i) => ({
    dateLabel: `${day}, Jul ${14 + i}`,
    time: job.payType === "hourly" ? "9:00 AM – 5:00 PM" : "Flexible",
    rate,
  }));
}

export function getJobDetailMeta(job: Job): JobDetailMeta {
  const hourlyRate = parseHourlyRate(job.pay);
  const [city = "Remote", state = ""] = job.location.split(",").map((s) => s.trim());

  const defaults: JobDetailMeta = {
    employmentType: job.verified ? "W2" : "1099",
    hourlyRate,
    rating: 4.5 + (job.id.charCodeAt(0) % 5) / 10,
    reviewCount: job.proposals,
    scheduleRange: "MON, JUL 14 – SUN, JUL 20",
    shiftTime: "9:00 am – 5:00 pm",
    timezone: "CT",
    estimatedDailyPay: "$160.00",
    shifts: defaultShifts(job, hourlyRate),
    streetAddress: "100 Main St",
    city,
    state,
    zip: "00000",
    lat: 30.2672,
    lng: -97.7431,
  };

  const override = detailOverrides[job.slug];
  return { ...defaults, ...override };
}

export function formatFullAddress(meta: JobDetailMeta): string {
  return `${meta.streetAddress}, ${meta.city}, ${meta.state} ${meta.zip}`;
}
