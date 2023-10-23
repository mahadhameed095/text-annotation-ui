import { z } from "zod";
import { AnnotationSchema, DocumentSchema, UserSchema } from "./prisma/generated/zod";

export * from "./prisma/generated/zod";

export const UserWithoutPasswordSchema = UserSchema.omit({ password : true});
export type UserWithoutPassword = z.infer<typeof UserWithoutPasswordSchema>;

export const DocumentWithoutIdSchema = DocumentSchema.omit({ id : true });
export type DocumentWithoutId = z.infer<typeof DocumentWithoutIdSchema>;

export const AssignedAnnotationSchema = z.object({
    id : AnnotationSchema.shape.id,
    assignmentTimestamp : AnnotationSchema.shape.assignmentTimestamp,
    document : DocumentSchema
});
export type AssignedAnnotation = z.infer<typeof AssignedAnnotationSchema>;

export const EnvSchema = z.object({
    PORT : z.string(),
    DATABASE_URL : z.string(),
    MAX_RESERVATIONS : z.string(),
    RESERVATION_EXPIRY_IN_HOURS : z.string(),
    NUM_ANNOTATIONS_PER_DOCUMENT : z.string(),
    ACCESS_TOKEN_SECRET : z.string()
});

export const EnvSchemaWithTransform = z.object({
    PORT : z.string(),
    DATABASE_URL : z.string(),
    MAX_RESERVATIONS : z.coerce.number().int(),
    RESERVATION_EXPIRY_IN_HOURS : z.coerce.number(),
    NUM_ANNOTATIONS_PER_DOCUMENT : z.coerce.number().int(),
    ACCESS_TOKEN_SECRET : z.string()
});

export type Env = z.infer<typeof EnvSchema>;
export type EnvTransformed = z.infer<typeof EnvSchemaWithTransform>;

export const ValueSchema = z.object({
    hateful : z.boolean(),
    islamic : z.boolean()
});

export const ValueCountsSchema = z.object({
    hateful : z.coerce.number().int(),
    non_hateful : z.coerce.number().int(),
    islamic : z.coerce.number().int(),
    non_islamic : z.coerce.number().int(),
});

export type Value = z.infer<typeof ValueSchema>;
export type ValueCounts = z.infer<typeof ValueCountsSchema>;
