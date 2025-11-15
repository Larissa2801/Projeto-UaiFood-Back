// backend/src/schemas/validationSchemas.js

const { z } = require("zod");

// --- 1. USER SCHEMAS ---
const userCreateSchema = z.object({
  email: z
    .string()
    .email("O campo email deve ser um e-mail válido.")
    .min(1, "O campo email é obrigatório."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  name: z.string().min(1, "O campo nome é obrigatório."),
  phone: z
    .string()
    .regex(/^[0-9]{11}$/, "O telefone deve ter 11 dígitos numéricos."),
  userType: z.enum(["CLIENT", "ADMIN"]).optional().default("CLIENT"), // NOVO: Campo de Consentimento obrigatório e deve ser true

  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: "O consentimento dos termos é obrigatório para o cadastro.",
    })
    .optional(), // <--- SINTAXE CORRIGIDA: Adicionado )
});

const userUpdateSchema = z
  .object({
    email: z.string().email().optional(),

    password: z
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres.")
      .optional(),
    name: z.string().min(1).optional(),
    phone: z
      .string()
      .regex(/^[0-9]{11}$/, "O telefone deve ter 11 dígitos numéricos.")
      .optional(),
    userType: z.enum(["CLIENT", "ADMIN"]).optional(),
  })
  .strip(); // Removido strict().optional() que não eram necessários aqui

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// --- 2. CATEGORY SCHEMAS ---
const categoryCreateSchema = z.object({
  description: z
    .string()
    .min(
      3,
      "A descrição da categoria é obrigatória e deve ter pelo menos 3 caracteres."
    ),
});

const categoryUpdateSchema = z.object({
  description: z
    .string()
    .min(3, "A descrição deve ter pelo menos 3 caracteres.")
    .optional(),
});

// --- 3. ITEM SCHEMAS ---
const itemCreateSchema = z.object({
  description: z.string().min(3, "A descrição do item é obrigatória."),
  unitPrice: z.coerce
    .number()
    .positive("O preço unitário deve ser um valor positivo."),
  categoryId: z
    .string()
    .regex(
      /^[1-9]\d*$/,
      "O ID da categoria é obrigatório e deve ser um número válido."
    ),
});

const itemUpdateSchema = z.object({
  description: z.string().min(3).optional(),
  unitPrice: z.coerce.number().positive().optional(),
  categoryId: z
    .string()
    .regex(/^[1-9]\d*$/, "O ID da categoria deve ser um número válido.")
    .optional(),
});

// --- 4. ADDRESS SCHEMAS ---
const addressUpsertSchema = z.object({
  street: z.string().min(3, "A rua é obrigatória."),
  number: z.string().min(1, "O número é obrigatório."),
  district: z.string().min(3, "O bairro é obrigatório."),
  city: z.string().min(3, "A cidade é obrigatória."),
  state: z.string().length(2, "O estado deve ter 2 letras."),
  zipCode: z
    .string()
    .regex(/^[0-9]{8}$/, "O CEP deve ter 8 dígitos numéricos."),
});

// --- 5. ORDER SCHEMAS ---
const orderItemSchema = z.object({
  itemId: z.string().regex(/^[1-9]\d*$/, "O ID do item é obrigatório."),
  quantity: z.coerce.number().int().min(1, "A quantidade mínima é 1."),
});

const orderCreateSchema = z.object({
  userClient: z
    .string()
    .regex(/^[1-9]\d*$/, "O ID do cliente é obrigatório e deve ser numérico."),
  paymentMethod: z.enum(["CASH", "DEBIT", "CREDIT", "PIX"]),
  items: z
    .array(orderItemSchema)
    .min(1, "Um pedido deve ter pelo menos um item."),
});

const orderUpdateStatusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"]),
});

module.exports = {
  userCreateSchema,
  userUpdateSchema,
  loginSchema,
  categoryCreateSchema,
  categoryUpdateSchema,
  itemCreateSchema,
  itemUpdateSchema,
  addressUpsertSchema,
  orderCreateSchema,
  orderUpdateStatusSchema,
};
