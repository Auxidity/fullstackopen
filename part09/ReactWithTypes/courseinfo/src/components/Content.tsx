import Part from "./Part";

import { CoursePartsArray, CoursePart } from "../types";

const Content = (props: CoursePartsArray) => {
    return (
        <>
            {props.courseParts.map((item: CoursePart, index: number) => (
                <div key={index}>
                    <Part coursePart={item} />
                </div>
            ))}
        </>
    );
};

export default Content;
