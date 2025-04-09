import { CoursePart } from "../types";

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`,
    );
};

const renderCoursePart = (coursePart: CoursePart) => {
    switch (coursePart.kind) {
        case "basic":
            return (
                <>
                    <h3>
                        {coursePart.name} {coursePart.exerciseCount}
                    </h3>
                    {coursePart.description && (
                        <p>
                            <em>{coursePart.description}</em>
                        </p>
                    )}
                </>
            );
        case "group":
            return (
                <>
                    <h3>
                        {coursePart.name} {coursePart.exerciseCount}
                    </h3>
                    <p>project exercises {coursePart.groupProjectCount}</p>
                </>
            );
        case "background":
            return (
                <>
                    <h3>
                        {coursePart.name} {coursePart.exerciseCount}
                    </h3>
                    {coursePart.description && (
                        <p>
                            <em>{coursePart.description}</em>
                        </p>
                    )}
                    <p>submit to {coursePart.backgroundMaterial}</p>
                </>
            );
        case "special":
            return (
                <>
                    <h3>
                        {coursePart.name} {coursePart.exerciseCount}
                    </h3>
                    {coursePart.description && (
                        <p>
                            <em>{coursePart.description}</em>
                        </p>
                    )}
                    <p>required skills: {coursePart.requirements.join(", ")}</p>
                </>
            );
        default:
            return assertNever(coursePart);
    }
};

const Part = ({ coursePart }: { coursePart: CoursePart }) => {
    return <>{renderCoursePart(coursePart)}</>;
};

export default Part;
