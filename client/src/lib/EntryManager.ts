import {CollectionReference, DocumentData, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, where, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { AnnotatedEntry, AnnotatedEntrySchema, Annotation, AssignedEntry, AssignedEntrySchema } from './Validation';

export class EntryManager{
    entries : CollectionReference<DocumentData, DocumentData>;
    constructor(){
        this.entries = collection(db, "Entries");
    }

    async AssignEntries(annotatorId: string, max : number){
        const q = query(
                        this.entries,
                        where('annotation', '==', null),
                        where('assignment', '==', null),
                        limit(max)
                    );
        const response = await getDocs(q);
        const batch = writeBatch(db);
        response.docs.forEach(docSnapshot => {
            batch.set(
                doc(this.entries, docSnapshot.id),
                {
                    assignment : {
                        annotatorId, /* stamping the annotator id on the doc */
                        timestamp : serverTimestamp()
                    },
                }, { merge : true}
            )
        });
        await batch.commit();
        return response.docs.length;
    }

    /**
     * 
     * @param entryId The id of the entry that has been annotated
     * @param annotation The annotation to submit for the entry
     * 
     * This function is used to submit the annotation for a particular entry.
     */
    async SubmitAnnotation(entryId : string, annotation : Annotation) {
        const docRef = doc(this.entries, entryId);
        await setDoc(docRef, annotation, { merge : true });
    }
    /**
     * 
     * @param annotatorId The id of the annotator
     * @returns an array of past annotated entries by the annotator with the given id.
     */
    async GetAnnotatedEntries(annotatorId : string) : Promise<AnnotatedEntry[]> {
        const q = query(this.entries,
                        where('annotation.annotatorId', '==', annotatorId));
        const response = await getDocs(q);
        const entries = response.docs.map(item => ({id : item.id, ...item.data()}));
        
        return AnnotatedEntrySchema.array().parse(entries);
    }
    /**
     * 
     * @param annotatorId The id of the annotator
     * @returns an array of past annotated entries by the annotator with the given id.
     */
    async GetAssignedEntries(annotatorId : string) : Promise<AssignedEntry[]> {
        const q = query(this.entries,
                        where('assignment.annotatorId', '==', annotatorId),
                        orderBy('assignment.timestamp'));
        const response = await getDocs(q);
        const entries = response.docs.map(item => ({id : item.id, ...item.data()}));
        // entries.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        return AssignedEntrySchema.array().parse(entries);
    }
};

export const entryManager = new EntryManager();