import express, { Request, Response, NextFunction } from "express";
import qs from "qs";
import calculateBmi from "./bmiCalculator";
import calculateExercises from "./exerciseCalculator";

const app = express();
app.use(express.json());

//If this particular error is not handled as a middleware, its going to give the long version of this particular error.
//To circumvent the any errors, we need to use the interfaces express provides.
//Only json syntax errors are responded to differently from their defaults since those are rather likely scenario.
app.use(
    (err: SyntaxError, _req: Request, res: Response, next: NextFunction) => {
        if (err instanceof SyntaxError) {
            res.status(400).json({ error: "malformatted JSON" });
        } else {
            next(err);
        }
    },
);

const isValidNumber = (value: string): boolean => {
    return /^-?\d+(\.\d+)?$/.test(value);
};

app.set("query parser", (str: string) => qs.parse(str, {}));

app.get("/hello", (_req, res) => {
    res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
    const { height, weight } = req.query;
    const heightNum = Number(height as string);
    const weightNum = Number(weight as string);

    //While parseArgs for cli does run, we dont want to kill the server if the input is invalid so we do a regex match for numbers only and early return if it fails.
    //.7 and 7. return malformatted input, 7.0 is considered a float of number seven. If any input is missing, give malformatted input aswell.
    if (
        !height ||
        !weight ||
        !isValidNumber(height as string) ||
        !isValidNumber(weight as string)
    ) {
        res.send({ error: "malformatted input" });
    } else {
        const bmi = calculateBmi(heightNum, weightNum);
        res.send({
            weight: weightNum,
            height: heightNum,
            bmi: bmi,
        });
    }
});

app.post("/exercises", (req, res) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { daily_exercises, target } = req.body;

        if (daily_exercises === undefined || target === undefined) {
            res.send({
                error: "Parameters missing",
            });
            return;
        }

        //Same logic as get(/bmi), parseArgs does run but we sanitize output before call here.
        const targetNum = Number(target as string);
        const daily_exercisesArr =
            Array.isArray(daily_exercises) &&
                daily_exercises.every((item) => typeof item === "number")
                ? daily_exercises
                : [];

        if (isValidNumber(target as string) && daily_exercisesArr.length !== 0) {
            const result = calculateExercises(daily_exercisesArr, targetNum);
            res.send(result);
            return;
        } else {
            res.send({ error: "malformatted parameters" });
            return;
        }
    } catch (error) {
        console.log(error);
        res.send({ error: "JSON parser error" });
        return;
    }
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
