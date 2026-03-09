import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().trim(),
  email: Joi.string().email().required().trim().lowercase(),
  company: Joi.string().max(200).optional().trim(),
  budget: Joi.string()
    .valid("< $10k", "$10k - $50k", "$50k - $100k", "$100k+", "Not sure yet")
    .required(),
  project: Joi.string()
    .valid(
      "Web Development",
      "Mobile App",
      "UI/UX Design",
      "Consulting",
      "Other",
    )
    .required(),
  message: Joi.string().min(10).max(1000).required().trim(),
});

export const validateContact = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = contactSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};
