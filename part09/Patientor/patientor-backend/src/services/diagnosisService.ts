import diagnosisData from "../../data/diagnoses";

import { Diagnosis } from "../../types";

const diagnoses: Diagnosis[] = diagnosisData as Diagnosis[];

const getEntries = (): Diagnosis[] => {
    return diagnoses;
};

const addDiagnosis = () => {
    return null;
};

const findById = (id: string): Diagnosis | undefined => {
    const entry = diagnosisData.find((p) => p.code === id);
    return entry;
};
export default {
    getEntries,
    addDiagnosis,
    findById,
};
