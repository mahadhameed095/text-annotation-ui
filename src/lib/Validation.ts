import { z } from "zod";

export const stringDateSchema = z.string().datetime().transform(val => new Date(val)); 

export const LabelsSchema = z.object({
    islamic : z.boolean(),
    hateful : z.boolean()    
});
export type Labels = z.infer<typeof LabelsSchema>;

export const AnnotationSchema = z.object({
    labels : LabelsSchema,
    timestamp : stringDateSchema,
    annotatorId : z.string()
});
export type Annotation = z.infer<typeof AnnotationSchema>;

export const AssignmentSchema = z.object({
    annotatorId : z.string(),
    timestamp : stringDateSchema
});
export type Assignment = z.infer<typeof AssignmentSchema>;

export const BaseEntrySchema = z.object({
    id : z.string(),
    text : z.string()
});
export type BaseEntry = z.infer<typeof BaseEntrySchema>;

const _AnnotationWrapperSchema = z.object({
    annotation : AnnotationSchema
});
const _AssignmentWrapperSchema = z.object({
    assignment : AssignmentSchema
});
export const AnnotatedEntrySchema = z.intersection(BaseEntrySchema, _AnnotationWrapperSchema);
export type AnnotatedEntry = z.infer<typeof AnnotatedEntrySchema>;

export const AssignedEntrySchema = z.intersection(BaseEntrySchema, _AssignmentWrapperSchema);
export type AssignedEntry = z.infer<typeof AssignedEntrySchema>;

export const EntrySchema = z.intersection(BaseEntrySchema, z.union([_AnnotationWrapperSchema, _AssignmentWrapperSchema, z.object({})]));
export type Entry = z.infer<typeof EntrySchema>;

export type Nullable<T> = {
    [K in keyof T] : null | T[K]
};

export function IsAssignedEntry(entry : Entry) : entry is AssignedEntry {
    return 'assignment' in entry;
}

export function IsAnnotatedEntry(entry : Entry) : entry is AnnotatedEntry {
    return 'annotation' in entry;
}