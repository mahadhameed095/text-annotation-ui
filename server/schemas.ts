import { z } from "zod";


export const JsonSchema: z.ZodType = z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.record(z.string(), z.any()),
    z.array(z.any()),
]);

export const ValueSchema = z.object({
    hateful : z.boolean(),
    islamic : z.boolean()
});

export const RoleSchema = z.enum(['ADMIN','USER']);

export const UserSchema = z.object({
    role: RoleSchema,
    id: z.number().int(),
    name: z.string(),
    email: z.string(),
    password: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const AnnotationSchema = z.object({
    id: z.number().int(),
    documentId: z.number().int(),
    value: ValueSchema.nullable(),
    annotatorId: z.number().int().nullable(),
    annotationTimestamp: z.coerce.date().nullable(),
    assignmentTimestamp: z.coerce.date().nullable(),
});
export type Annotation = z.infer<typeof AnnotationSchema>;

export const DocumentSchema = z.object({
    id: z.number().int(),
    text: z.string(),
    metadata: JsonSchema,
});
export type Document = z.infer<typeof DocumentSchema>;

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

export const ValueCountsSchema = z.object({
    total: z.coerce.number().int(),
    hateful : z.coerce.number().int(),
    non_hateful : z.coerce.number().int(),
    islamic : z.coerce.number().int(),
    non_islamic : z.coerce.number().int(),
});

export type Value = z.infer<typeof ValueSchema>;
export type ValueCounts = z.infer<typeof ValueCountsSchema>;
