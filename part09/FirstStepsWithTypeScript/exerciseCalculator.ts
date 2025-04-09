interface ExerciseResult {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

const parseArgs = (args: string[]) => {
    //Note, these args don't include 0 (npm) or 1 (run {process} command on npm). Could use same parser if there was caller detail attached for args.length validation
    //
    //Technically doing a lot of conversions for no reason, but Im not sure if args: number[] behaves like args: string[].
    //In my opinion its better to do input sanitation inside the function, not outside it. This function works with both with the caveat
    //of doing excess back and forth conversions.
    if (args.length < 2) throw new Error("Not enough arguments given");

    for (const arg of args.slice(0)) {
        const num = Number(arg);
        if (isNaN(num)) {
            console.error("Invalid input. Every user input should be a number");
            process.exit(1);
        }
    }
};

const calculateExercises = (arr: number[], num: number) => {
    const rawArgs = [...arr, num];
    const parsedRawArgs: string[] = rawArgs.map(String);
    parseArgs(parsedRawArgs); //Input sanitation, kills the process upon invalid input

    const nonZeroes = (arr: number[]): number => {
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== 0) {
                count += 1;
            }
        }
        return count;
    };

    const average = (arr: number[]) => {
        const sum = arr.reduce((acc, current) => acc + current, 0);
        const average = sum / arr.length;
        return average;
    };

    const isSuccess = (arr: number[], target: number): boolean => {
        const compare = average(arr);
        if (compare >= target) {
            return true;
        } else {
            return false;
        }
    };

    const rating = (arr: number[], target: number) => {
        const compare = average(arr);
        if (compare < target) {
            return 1;
        } else if (compare === target) {
            return 2;
        } else {
            return 3;
        }
    };

    const ratingDescription = (arr: number[], target: number): string => {
        const innerRating = rating(arr, target);
        if (innerRating === 1) {
            return "You could do better";
        } else if (innerRating === 2) {
            return "You hit your goal!";
        } else if (innerRating === 3) {
            return "You surpassed your goal!";
        } else {
            return "You broke me?";
        }
    };

    const result: ExerciseResult = {
        periodLength: arr.length,
        trainingDays: nonZeroes(arr),
        success: isSuccess(arr, num),
        rating: rating(arr, num),
        ratingDescription: ratingDescription(arr, num),
        target: num,
        average: average(arr),
    };

    return result;
};

if (require.main === module) {
    const arr: number[] = process.argv.slice(3).map(Number);
    const target: number = Number(process.argv[2]);

    console.log(calculateExercises(arr, target));
}

export default calculateExercises;
