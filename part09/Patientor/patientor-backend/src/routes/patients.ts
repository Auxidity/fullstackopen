import express, { NextFunction, Request, Response } from "express";
import patientService from "../services/patientService";
import { EntrySchema, NewPatientSchema } from "../utils";
import { z } from "zod";
import { NewEntry, NewPatientEntry, PatientEntry } from "../../types";

const router = express.Router();

router.get("/", (_req, res) => {
    res.send(patientService.getNonSensitiveEntries());
});

router.get("/:id", (req, res) => {
    const patient = patientService.findById(req.params.id);

    if (patient) {
        res.send(patient);
    } else {
        res.sendStatus(404);
    }
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        NewPatientSchema.parse(req.body);
        console.log(req.body);
        next();
    } catch (error: unknown) {
        next(error);
    }
};

const newPatientEntryParser = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    try {
        EntrySchema.parse(req.body);
        console.log(req.body);
        next();
    } catch (error: unknown) {
        next(error);
    }
};

const errorMiddleware = (
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (error instanceof z.ZodError) {
        res.status(400).send({ error: error.issues });
    } else {
        next(error);
    }
};

router.post(
    "/",
    newPatientParser,
    (
        req: Request<unknown, unknown, NewPatientEntry>,
        res: Response<PatientEntry>,
    ) => {
        const addedEntry = patientService.addPatient(req.body);
        res.json(addedEntry);
    },
);

router.post(
    "/:id/entries",
    newPatientEntryParser,
    (
        req: Request<{ id: string }, unknown, NewEntry>,
        res: Response<PatientEntry>,
    ) => {
        const patient = patientService.findById(req.params.id);

        if (patient) {
            const updatedPatient = patientService.addEntry(req.params.id, req.body);
            res.send(updatedPatient);
        } else {
            res.sendStatus(404);
        }
    },
);

router.use(errorMiddleware);

export default router;
