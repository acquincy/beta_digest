import { z } from "zod";

export const step1Schema = z.object({
  city: z
    .string()
    .trim()
    .min(2, "City name must be at least 2 characters.")
    .max(80, "City name is too long."),
  timezone: z
    .string()
    .trim()
    .min(3, "Please select a valid timezone."),
});

export const step2Schema = z
  .object({
    channel: z.enum(["email", "sms"], {
      message: "Select a delivery channel (Email or SMS).",
    }),
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address."),
    phone: z.string().trim().optional(),
    dialCode: z.string().default("+1"),
    dispatchTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Dispatch time must be in HH:mm format.")
      .default("06:00"),
  })
  .superRefine((data, ctx) => {
    if (data.channel === "sms") {
      if (!data.phone || data.phone.replace(/\D/g, "").length < 7) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "Please enter a valid mobile number for SMS delivery.",
        });
      }
    }
  });

export const step3Schema = z.object({
  editions: z
    .object({
      morning: z.boolean(),
      midday: z.boolean(),
      evening: z.boolean(),
    })
    .refine(
      (ed) => ed.morning || ed.midday || ed.evening,
      "Please select at least one daily edition."
    ),
  activeMetrics: z
    .array(
      z.enum([
        "high_low",
        "rain_prob",
        "commute_wind",
        "uv_index",
        "air_quality",
        "humidity",
        "sun_events",
        "hourly_breakdown",
        "three_day_forecast",
      ])
    )
    .min(1, "Select at least one weather metric to include."),
});

export const fullSignupSchema = z.intersection(
  step1Schema,
  z.intersection(step2Schema, step3Schema)
);

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type FullSignupFormData = z.infer<typeof fullSignupSchema>;
