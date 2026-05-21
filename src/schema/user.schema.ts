import { z } from "zod"

export const userSchema = z.object({
  username: z
    .string()
    .min(3, "حداقل 3 کاراکتر"),

  email: z
    .string()
    .email("ایمیل معتبر نیست"),

  password: z
    .string()
    .min(8, "رمز باید حداقل 8 کاراکتر باشد"),
})

export type UserSchemaType = z.infer<typeof userSchema>