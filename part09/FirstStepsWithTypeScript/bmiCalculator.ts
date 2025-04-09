const parseArgsBmi = (args: string[]) => {
    //Note, these args don't include 0 (npm) or 1 (run {process} command on npm). Could use same parser if there was caller detail attached for args.length validation
    //
    //Technically doing a lot of conversions for no reason, but Im not sure if args: number[] behaves like args: string[].
    //In my opinion its better to do input sanitation inside the function, not outside it. This function works with both with the caveat
    //of doing excess back and forth conversions.
    if (args.length !== 2) throw new Error("Wrong amount of args given");

    for (const arg of args.slice(0)) {
        const num = Number(arg);
        if (isNaN(num)) {
            console.error("Invalid input. Every user input should be a number");
            process.exit(1);
        }
    }
};

const calculateBmi = (height: number, weight: number): string => {
    const rawArgs = [height, weight].map(String);
    parseArgsBmi(rawArgs); //Input sanitation, kills the process upon invalid input

    const heightInMeters = height / 100;
    const result = weight / (heightInMeters * heightInMeters);

    if (result < 16.0) {
        return "Underweight (severe thinness)";
    } else if (result >= 16.0 && result < 17.0) {
        return "Underweight (moderate thinness)";
    } else if (result >= 17.0 && result < 18.5) {
        return "Underweight (mild thinness)";
    } else if (result >= 18.5 && result < 25.0) {
        return "Normal range";
    } else if (result >= 25.0 && result < 30.0) {
        return "Overweight (Pre-obese)";
    } else if (result >= 30.0 && result < 35.0) {
        return "Obese (Class 1)";
    } else if (result >= 35.0 && result < 40.0) {
        return "Obese (Class 2)";
    } else {
        return "Obese (Class 3)";
    }
};

if (require.main === module) {
    const height: number = Number(process.argv[2]);

    const weight: number = Number(process.argv[3]);

    console.log(calculateBmi(height, weight));
}

export default calculateBmi;
