import { FormEvent, useCallback, useEffect, useState } from "react";
import patientService from "../../services/patients";
import {
    Diagnosis,
    Entry,
    EntryType,
    HealthCheckRating,
    Patient,
} from "../../types";
import { useParams } from "react-router-dom";
import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
} from "@mui/material";

//Its a mess. Should refactor honestly, but I'll leave it as is. Sorry for whoever has to read this.
//In my own opinion, these types of conditional renders should just be outright avoided and make separate components. This sort of union based types
//can be highly coupled which WILL be a pain in the butt later. But this exercise kind of asks for it so, here it is.
const IndividualPatientView = () => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [diagnoses, setDiagnoses] = useState<Diagnosis[] | null>(null);
    const id = useParams().id;
    const [error, setError] = useState<string>("");

    const ErrorComponent = () => {
        if (error === null || error === undefined || error === "") {
            return null;
        } else {
            return <div>{error}</div>;
        }
    };

    useEffect(() => {
        if (id) {
            patientService.getOne(id).then((response) => {
                if (response) {
                    setPatient(response);
                } else {
                    setPatient(null);
                }
            });
        } else {
            setPatient(null);
        }
    }, [id]);

    useEffect(() => {
        patientService.getAllDiagnosisData().then((response) => {
            if (response) {
                setDiagnoses(response);
            } else {
                setDiagnoses(null);
            }
        });
    }, []);

    if (patient === null || patient === undefined) {
        return <div>patient not found</div>;
    }

    const getDiagnosisName = (code: string) => {
        if (diagnoses) {
            const diagnosis = diagnoses.find((d: Diagnosis) => d.code === code);
            return diagnosis ? diagnosis.name : null;
        } else {
            return null;
        }
    };
    const assertNever = (value: never): never => {
        throw new Error(
            `Unhandled discriminated union member: ${JSON.stringify(value)}`,
        );
    };

    const entryStyle = {
        border: "5px solid black",
        padding: "20px",
        maginBottom: "15px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
    };
    const renderEntryDetails = (entry: Entry) => {
        switch (entry.type) {
            case "HealthCheck":
                return (
                    <div style={entryStyle}>
                        <p>
                            {entry.date} {entry.description}
                        </p>
                        <div> Service type: {entry.type} </div>
                        <div>
                            {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 ? (
                                <ul>
                                    {entry.diagnosisCodes.map((diagnosisCode) => (
                                        <li key={diagnosisCode}>
                                            {diagnosisCode} {getDiagnosisName(diagnosisCode)}
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>

                        <p> Health check rating: {entry.healthCheckRating}</p>
                        <p> diagnose by {entry.specialist}</p>
                    </div>
                );
            case "OccupationalHealthcare":
                return (
                    <div style={entryStyle}>
                        <p>
                            {entry.date} {entry.description}
                        </p>
                        <div> Service type: {entry.type} </div>
                        <div>
                            {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 ? (
                                <ul>
                                    {entry.diagnosisCodes.map((diagnosisCode) => (
                                        <li key={diagnosisCode}>
                                            {diagnosisCode} {getDiagnosisName(diagnosisCode)}
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>

                        <p>Employer: {entry.employerName}</p>
                        <div>
                            {entry.sickLeave ? (
                                <div>
                                    Sick leave from: {entry.sickLeave?.startDate} until :{" "}
                                    {entry.sickLeave?.endDate}
                                </div>
                            ) : null}
                        </div>
                        <p> diagnose by {entry.specialist}</p>
                    </div>
                );
            case "Hospital":
                return (
                    <div style={entryStyle}>
                        <p>
                            {entry.date} {entry.description}
                        </p>
                        <div> Service type: {entry.type} </div>
                        <div>
                            {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 ? (
                                <ul>
                                    {entry.diagnosisCodes.map((diagnosisCode) => (
                                        <li key={diagnosisCode}>
                                            {diagnosisCode} {getDiagnosisName(diagnosisCode)}
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>

                        <p>
                            {entry.discharge.date} {entry.discharge.criteria}
                        </p>
                        <p> diagnose by {entry.specialist}</p>
                    </div>
                );

            default:
                assertNever(entry);
        }
    };

    const AddEntryForm = () => {
        const [description, setDescription] = useState("");
        const [specialist, setSpecialist] = useState("");
        const [date, setDate] = useState("");
        const [formDiagnoses, setFormDiagnoses] = useState<string[]>([]);
        const [selectedRating, setSelectedRating] = useState<HealthCheckRating>(
            HealthCheckRating.Healthy,
        );
        const [selectedEntryType, setSelectedEntryType] =
            useState<EntryType>("HealthCheck");

        const [hospitalEntryDate, setHospitalEntryDate] = useState<string>("");
        const [hospitalEntryCriteria, setHospitalEntryCriteria] =
            useState<string>("");
        const [employerName, setEmployerName] = useState<string>("");
        const [sickLeaveStartDate, setSickLeaveStartDate] = useState<string>("");
        const [sickLeaveEndDate, setSickLeaveEndDate] = useState<string>("");

        const entryOptions: EntryType[] = [
            "HealthCheck",
            "Hospital",
            "OccupationalHealthcare",
        ];
        const handleDiagnosesChange = useCallback(
            (event: SelectChangeEvent<typeof formDiagnoses>) => {
                const { value } = event.target;
                setFormDiagnoses(typeof value === "string" ? value.split(",") : value);
            },
            [],
        );

        const handleDeleteDiagnosis = useCallback((code: string) => {
            setFormDiagnoses((prevDiagnoses) =>
                prevDiagnoses.filter((c) => c !== code),
            );
        }, []);

        const handleDescriptionChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setDescription(e.target.value);
            },
            [],
        );
        const handleSpecialistChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setSpecialist(e.target.value);
            },
            [],
        );
        const handleDateChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setDate(e.target.value);
            },
            [],
        );
        const handleHospitalEntryDateChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setHospitalEntryDate(e.target.value);
            },
            [],
        );

        const handleHospitalEntryCriteriaChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setHospitalEntryCriteria(e.target.value);
            },
            [],
        );
        const handleEmployerNameChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setEmployerName(e.target.value);
            },
            [],
        );
        const handleSickLeaveStartDate = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setSickLeaveStartDate(e.target.value);
            },
            [],
        );
        const handleSickLeaveEndDate = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setSickLeaveEndDate(e.target.value);
            },
            [],
        );

        const RenderCorrectForm = () => {
            const ITEM_HEIGHT = 48;
            const ITEM_PADDING_TOP = 8;
            const MenuProps = {
                PaperProps: {
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                        width: 250,
                    },
                },
            };

            const getStyles = (
                name: string,
                selectedDiagnoses: readonly string[],
            ) => {
                return {
                    fontWeight: selectedDiagnoses.includes(name)
                        ? "fontWeightMedium"
                        : "fontWeightRegular",
                };
            };

            const diagnosesData: Diagnosis[] = diagnoses || []; //If null, use empty

            switch (selectedEntryType) {
                case "HealthCheck":
                    return (
                        <form onSubmit={submitForm}>
                            <div>
                                <label>Description</label>
                                <input
                                    id="description"
                                    type="text"
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Specialist</label>
                                <input
                                    id="specialist"
                                    type="text"
                                    value={specialist}
                                    onChange={handleSpecialistChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Date</label>
                                <input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={handleDateChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Diagnoses</label>
                                <FormControl sx={{ m: 1, width: 300 }}>
                                    <InputLabel id="demo-multiple-chip-label">
                                        Diagnoses
                                    </InputLabel>
                                    <Select
                                        labelId="demo-multiple-chip-label"
                                        id="demo-multiple-chip"
                                        multiple
                                        value={formDiagnoses}
                                        onChange={handleDiagnosesChange}
                                        input={
                                            <OutlinedInput
                                                id="select-multiple-chip"
                                                label="Diagnoses"
                                            />
                                        }
                                        renderValue={(selected) => (
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                {selected.map((value) => {
                                                    const diagnosis = diagnosesData.find(
                                                        (d) => d.code === value,
                                                    );
                                                    return (
                                                        diagnosis && (
                                                            <Chip
                                                                key={value}
                                                                label={diagnosis.name}
                                                                onDelete={() => handleDeleteDiagnosis(value)}
                                                                onMouseDown={(event) => {
                                                                    event.stopPropagation();
                                                                }}
                                                            />
                                                        )
                                                    );
                                                })}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {diagnosesData.map((diagnosis) => (
                                            <MenuItem
                                                key={diagnosis.code}
                                                value={diagnosis.code}
                                                style={getStyles(diagnosis.code, formDiagnoses)}
                                            >
                                                {diagnosis.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div>
                                <label>Healthcheck rating</label>
                                {Object.values(HealthCheckRating)
                                    .filter(
                                        (rating): rating is HealthCheckRating =>
                                            typeof rating === "number",
                                    )
                                    .map((ratingOption) => (
                                        <label key={ratingOption}>
                                            <input
                                                type="radio"
                                                name="rating"
                                                value={ratingOption}
                                                checked={selectedRating === ratingOption}
                                                onChange={() => setSelectedRating(ratingOption)}
                                            />
                                            {HealthCheckRating[ratingOption]}
                                        </label>
                                    ))}
                            </div>

                            <button type="submit">Submit</button>
                        </form>
                    );
                case "Hospital":
                    return (
                        <form onSubmit={submitForm}>
                            <div>
                                <label>Description</label>
                                <input
                                    id="description"
                                    type="text"
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Specialist</label>
                                <input
                                    id="specialist"
                                    type="text"
                                    value={specialist}
                                    onChange={handleSpecialistChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Date</label>
                                <input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={handleDateChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Diagnoses</label>
                                <FormControl sx={{ m: 1, width: 300 }}>
                                    <InputLabel id="demo-multiple-chip-label">
                                        Diagnoses
                                    </InputLabel>
                                    <Select
                                        labelId="demo-multiple-chip-label"
                                        id="demo-multiple-chip"
                                        multiple
                                        value={formDiagnoses}
                                        onChange={handleDiagnosesChange}
                                        input={
                                            <OutlinedInput
                                                id="select-multiple-chip"
                                                label="Diagnoses"
                                            />
                                        }
                                        renderValue={(selected) => (
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                {selected.map((value) => {
                                                    const diagnosis = diagnosesData.find(
                                                        (d) => d.code === value,
                                                    );
                                                    return (
                                                        diagnosis && (
                                                            <Chip
                                                                key={value}
                                                                label={diagnosis.name}
                                                                onDelete={() => handleDeleteDiagnosis(value)}
                                                                onMouseDown={(event) => {
                                                                    event.stopPropagation();
                                                                }}
                                                            />
                                                        )
                                                    );
                                                })}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {diagnosesData.map((diagnosis) => (
                                            <MenuItem
                                                key={diagnosis.code}
                                                value={diagnosis.code}
                                                style={getStyles(diagnosis.code, formDiagnoses)}
                                            >
                                                {diagnosis.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div>
                                <label>Discharge date</label>
                                <input
                                    id="discharge date"
                                    type="date"
                                    value={hospitalEntryDate}
                                    onChange={handleHospitalEntryDateChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Discharge criteria</label>
                                <input
                                    id="discharge criteria"
                                    type="string"
                                    value={hospitalEntryCriteria}
                                    onChange={handleHospitalEntryCriteriaChange}
                                    required
                                />
                            </div>

                            <button type="submit">Submit</button>
                        </form>
                    );

                case "OccupationalHealthcare":
                    return (
                        <form onSubmit={submitForm}>
                            <div>
                                <label>Description</label>
                                <input
                                    id="description"
                                    type="text"
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Specialist</label>
                                <input
                                    id="specialist"
                                    type="text"
                                    value={specialist}
                                    onChange={handleSpecialistChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Date</label>
                                <input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={handleDateChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Diagnoses</label>
                                <FormControl sx={{ m: 1, width: 300 }}>
                                    <InputLabel id="demo-multiple-chip-label">
                                        Diagnoses
                                    </InputLabel>
                                    <Select
                                        labelId="demo-multiple-chip-label"
                                        id="demo-multiple-chip"
                                        multiple
                                        value={formDiagnoses}
                                        onChange={handleDiagnosesChange}
                                        input={
                                            <OutlinedInput
                                                id="select-multiple-chip"
                                                label="Diagnoses"
                                            />
                                        }
                                        renderValue={(selected) => (
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                {selected.map((value) => {
                                                    const diagnosis = diagnosesData.find(
                                                        (d) => d.code === value,
                                                    );
                                                    return (
                                                        diagnosis && (
                                                            <Chip
                                                                key={value}
                                                                label={diagnosis.name}
                                                                onDelete={() => handleDeleteDiagnosis(value)}
                                                                onMouseDown={(event) => {
                                                                    event.stopPropagation();
                                                                }}
                                                            />
                                                        )
                                                    );
                                                })}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {diagnosesData.map((diagnosis) => (
                                            <MenuItem
                                                key={diagnosis.code}
                                                value={diagnosis.code}
                                                style={getStyles(diagnosis.code, formDiagnoses)}
                                            >
                                                {diagnosis.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div>
                                <label>Employer</label>
                                <input
                                    id="employerName"
                                    type="string"
                                    value={employerName}
                                    onChange={handleEmployerNameChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Sick leave start date</label>
                                <input
                                    id="sickLeave startDate"
                                    type="date"
                                    value={sickLeaveStartDate}
                                    onChange={handleSickLeaveStartDate}
                                />
                            </div>
                            <div>
                                <label>Sick leave end date</label>
                                <input
                                    id="sickLeave endDate"
                                    type="date"
                                    value={sickLeaveEndDate}
                                    onChange={handleSickLeaveEndDate}
                                />
                            </div>

                            <button type="submit">Submit</button>
                        </form>
                    );
                default:
                    assertNever(selectedEntryType);
            }
        };

        const submitForm = (event: FormEvent) => {
            event.preventDefault();
            switch (selectedEntryType) {
                case "HealthCheck":
                    const healthCheckEntry: Entry = {
                        type: "HealthCheck",
                        id: (patient.entries.length + 1).toString(),
                        specialist: specialist,
                        description: description,
                        date: date,
                        diagnosisCodes: formDiagnoses,
                        healthCheckRating: selectedRating,
                    };
                    patientService
                        .createEntry(patient.id, healthCheckEntry)
                        .then((response) => {
                            console.log(response);
                            setPatient(response);
                            console.log(patient.entries.length);
                        })
                        .catch((error) => {
                            console.log(error);
                            console.log(error.response.data.error[0].message);
                            const errorMessage =
                                error.response.data.error[0].message || "Something is wonky";
                            setError(errorMessage);
                            setTimeout(() => {
                                setError("");
                            }, 5000);
                        });
                    break;

                case "Hospital":
                    const hospitalEntry: Entry = {
                        type: "Hospital",
                        id: (patient.entries.length + 1).toString(),
                        specialist: specialist,
                        description: description,
                        date: date,
                        diagnosisCodes: formDiagnoses,
                        discharge: {
                            date: hospitalEntryDate,
                            criteria: hospitalEntryCriteria,
                        },
                    };
                    patientService
                        .createEntry(patient.id, hospitalEntry)
                        .then((response) => {
                            console.log(response);
                            setPatient(response);
                            console.log(patient.entries.length);
                        })
                        .catch((error) => {
                            console.log(error);
                            console.log(error.response.data.error[0].message);
                            const errorMessage =
                                error.response.data.error[0].message || "Something is wonky";
                            setError(errorMessage);
                            setTimeout(() => {
                                setError("");
                            }, 5000);
                        });
                    break;
                case "OccupationalHealthcare":
                    if (sickLeaveStartDate !== "" && sickLeaveEndDate !== "") {
                        const occupationalHealthcareEntry: Entry = {
                            type: "OccupationalHealthcare",
                            id: (patient.entries.length + 1).toString(),
                            specialist: specialist,
                            description: description,
                            date: date,
                            diagnosisCodes: formDiagnoses,
                            employerName: employerName,
                            sickLeave: {
                                startDate: sickLeaveStartDate,
                                endDate: sickLeaveEndDate,
                            },
                        };
                        patientService
                            .createEntry(patient.id, occupationalHealthcareEntry)
                            .then((response) => {
                                console.log(response);
                                setPatient(response);
                                console.log(patient.entries.length);
                            })
                            .catch((error) => {
                                console.log(error);
                                console.log(error.response.data.error[0].message);
                                const errorMessage =
                                    error.response.data.error[0].message || "Something is wonky";
                                setError(errorMessage);
                                setTimeout(() => {
                                    setError("");
                                }, 5000);
                            });
                        break;
                    } else if (sickLeaveStartDate === "" && sickLeaveEndDate === "") {
                        const occupationalHealthcareEntry: Entry = {
                            type: "OccupationalHealthcare",
                            id: (patient.entries.length + 1).toString(),
                            specialist: specialist,
                            description: description,
                            date: date,
                            diagnosisCodes: formDiagnoses,
                            employerName: employerName,
                        };
                        patientService
                            .createEntry(patient.id, occupationalHealthcareEntry)
                            .then((response) => {
                                console.log(response);
                                setPatient(response);
                                console.log(patient.entries.length);
                            })
                            .catch((error) => {
                                console.log(error);
                                console.log(error.response.data.error[0].message);
                                const errorMessage =
                                    error.response.data.error[0].message || "Something is wonky";
                                setError(errorMessage);
                                setTimeout(() => {
                                    setError("");
                                }, 5000);
                            });
                        break;
                    } else {
                        setError(
                            "One date is missing. Did you forget to add the other one?",
                        );
                        setTimeout(() => {
                            setError("");
                        }, 5000);
                        break;
                    }

                default:
                    assertNever(selectedEntryType);
            }
        };

        return (
            <div style={entryStyle}>
                <p>New entry</p>
                <div>
                    {entryOptions.map((entryOption) => (
                        <label key={entryOption}>
                            <input
                                type="radio"
                                name="entry"
                                value={entryOption}
                                onChange={() => setSelectedEntryType(entryOption)}
                                checked={selectedEntryType === entryOption}
                            />
                            {entryOption}
                        </label>
                    ))}
                </div>
                <RenderCorrectForm />
            </div>
        );
    };

    return (
        <div className="App">
            <ErrorComponent />
            <h3>{patient.name}</h3>
            <p>Gender: {patient.gender}</p>
            <p>Occupation: {patient.occupation}</p>
            <p>ssn: {patient.ssn}</p>
            <AddEntryForm />
            <div>
                <h4>entries</h4>
                {patient.entries.map((p) => (
                    <div key={p.id}>{renderEntryDetails(p)}</div>
                ))}
            </div>
        </div>
    );
};

export default IndividualPatientView;
