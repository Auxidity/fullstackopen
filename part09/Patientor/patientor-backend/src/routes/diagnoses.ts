import express from "express";
import diagnosisService from "../services/diagnosisService";

const router = express.Router();

router.get("/", (_req, res) => {
    const diagnoses = diagnosisService.getEntries();
    res.send(diagnoses);
});

router.post("/", (_req, res) => {
    res.send("placeholder post");
});

router.get("/:id", (req, res) => {
    const diagnosis = diagnosisService.findById(req.params.id);

    if (diagnosis) {
        res.send(diagnosis);
    } else {
        res.sendStatus(404);
    }
});

export default router;
