import patientData from "../../data/patients";
import {
    Entry,
    NewPatientEntry,
    NonSensitivePatientEntry,
    PatientEntry,
} from "../../types";
import { v1 as uuid } from "uuid";

const getEntries = (): PatientEntry[] => {
    return patientData;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
    return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};

const addPatient = (entry: NewPatientEntry): PatientEntry => {
    const newPatientEntry = {
        id: uuid(),
        ...entry,
        entries: [],
    };

    patientData.push(newPatientEntry);
    return newPatientEntry;
};

const findById = (id: string): PatientEntry | undefined => {
    const entry = patientData.find((p) => p.id === id);
    return entry;
};

const addEntry = (id: string, content: Entry): PatientEntry | undefined => {
    const entryToAdd = content;
    const patient = patientData.find((p) => p.id === id);
    if (patient) {
        patient.entries.push(entryToAdd);
        return patient;
    }
    //Error case
    return undefined;
};

export default {
    getEntries,
    addPatient,
    getNonSensitiveEntries,
    findById,
    addEntry,
};
