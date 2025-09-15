 import z from "zod";
 const values = z.object({
  email: z.email(
    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
    "Invalid email format."
  ),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
      "Password must be at least 8 chars and include upper, lower, number, special char."
    ),
});

export default values;