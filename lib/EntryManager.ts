import {CollectionReference, DocumentData, Transaction, collection, doc, getDocs, limit, query, runTransaction, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import { AnnotatedEntry, AnnotatedEntrySchema, Annotation, BaseEntry, BaseEntrySchema } from './Validation';

export class EntryManager{
    entries : CollectionReference<DocumentData, DocumentData>;
    constructor(){
        this.entries = collection(db, "Entries");
    }
    /**
     * 
     * @param annotatorId The uuid of the annotator
     * @param num the number of entries to retrieve
     * @returns an array of assigned entries.
     * 
     * This function is used to pull unannotated, and unassigned/unreserved entries. The pulled entries are now assigned to the annotator with the given id.
     */
    async PullEntries(annotatorId : string, num : number) : Promise<BaseEntry[]>{
        const q = query(this.entries, 
                        where("annotation", "==", null),
                        where("assignment", "==", null), 
                        limit(num));

        /* Get all document references that satisfy the query */
        const docsRefs = (await getDocs(q)).docs.map(c => c.ref);
        
        /* Writing the transcation */
        const transaction = async (transaction : Transaction) => {            
            
            /* Get updated version of each document */
            const entries = await Promise.all(
                docsRefs.map( ref => transaction.get(ref))
            );

            /* Picking only those that are free */
            const freeEntries = entries.filter(entry => !Boolean(entry.data()?.annotation || entry.data()?.assignment)); 

            /* Writing to each free document to claim it */
            freeEntries.forEach(docSnapshot => {
                const document = doc(this.entries, docSnapshot.id);
                transaction.set(document, { 
                    assignment : {
                        annotatorId, /* stamping the annotator id on the doc */
                        timestamp : serverTimestamp()
                    },
                }, { merge : true });
            });
            return freeEntries;
        };
        const data = await runTransaction(db, transaction);
        return BaseEntrySchema.array().parse(data.map(item => ({id : item.id, ...item.data()})));
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
    async GetAnnotatedEntries(annotatorId) : Promise<AnnotatedEntry[]> {
        const q = query(this.entries,
                        where('annotation.annotatorId', '==', annotatorId));
        const response = await getDocs(q);
        const entries = response.docs.map(item => ({id : item.id, ...item.data()}));
        return AnnotatedEntrySchema.array().parse(entries);
    }
};

export const entryManager = new EntryManager();