import { z } from "zod";

export const ValueSchema = z.object({
    hateful : z.boolean(),
    islamic : z.boolean()
});

export const RoleSchema = z.enum(['ADMIN','USER']);

export const DBUserSchema = z.object({
    id: z.string(),    
    role: RoleSchema,
    approved : z.boolean(),
});

export type DBUser = z.infer<typeof DBUserSchema>;

export const FirebaseUserSchema = z.object({
    uid : z.string(),
    name : z.string().optional(),
    profile : z.string().optional(),
    email : z.string().email().optional(),
    phone_number : z.string().optional()
});

export type FirebaseUser = z.infer<typeof FirebaseUserSchema>;

export const UserSchema = DBUserSchema.merge(FirebaseUserSchema.omit({ uid : true }));

export type User = z.infer<typeof UserSchema>;

export const AnnotationSchema = z.object({
    id: z.number().int(),
    documentId: z.number().int(),
    value: ValueSchema.nullable(),
    annotatorId: z.string().nullable(),
    annotationTimestamp: z.coerce.date().nullable(),
    assignmentTimestamp: z.coerce.date().nullable(),
});
export type Annotation = z.infer<typeof AnnotationSchema>;

export const DocumentSchema = z.object({
    id: z.number().int(),
    text: z.string(),
    metadata: z.any(),
});
export type Document = z.infer<typeof DocumentSchema>;

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

    /* Firebase service account key json file as environment variables */

    FIREBASE_AUTH_PROJECT_ID : z.string(),
    FIREBASE_AUTH_PRIVATE_KEY : z.string(),
    FIREBASE_AUTH_CLIENT_EMAIL : z.string(),
});

export const EnvSchemaWithTransform = z.object({
    PORT : z.string(),
    DATABASE_URL : z.string(),
    MAX_RESERVATIONS : z.coerce.number().int(),
    RESERVATION_EXPIRY_IN_HOURS : z.coerce.number(),
    NUM_ANNOTATIONS_PER_DOCUMENT : z.coerce.number().int(),

    /* Firebase service account key json file as environment variables */
    FIREBASE_AUTH_PROJECT_ID : z.string(),
    FIREBASE_AUTH_PRIVATE_KEY : z.string(),
    FIREBASE_AUTH_CLIENT_EMAIL : z.string(),
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
export const ValueCountsWithIdSchema = ValueCountsSchema.extend({ id : z.string() });

export type Value = z.infer<typeof ValueSchema>;
export type ValueCounts = z.infer<typeof ValueCountsSchema>;
export type ValueCountsWithId = z.infer<typeof ValueCountsWithIdSchema>;


export const ConflictingDocumentSchema = z.object({
    documentId : z.number(),
    conflicts : z.object({
      annotationId : z.number(),
      islamic : z.boolean()
    }).array()
});

export type ConflictingDocument = z.infer<typeof ConflictingDocumentSchema>;