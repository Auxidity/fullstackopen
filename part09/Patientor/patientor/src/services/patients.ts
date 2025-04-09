import axios from "axios";
import { Diagnosis, Entry, Patient, PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
    const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

    return data;
};

const create = async (object: PatientFormValues) => {
    const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

    return data;
};

const getOne = async (id: string) => {
    const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
    return data;
};

const getAllDiagnosisData = async () => {
    const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
    return data;
};

const createEntry = async (id: string, entry: Entry) => {
    const { data } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        entry,
    );

    return data;
};

export default {
    getAll,
    create,
    getOne,
    getAllDiagnosisData,
    createEntry,
};
