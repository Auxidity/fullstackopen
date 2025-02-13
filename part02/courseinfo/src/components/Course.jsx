const Course = ({ course }) => {
    const total =  course.parts.reduce((sum, part) => sum + part.exercises, 0);  
    
    return (
        <div>
            <h2> {course.name} </h2>
            {course.parts.map((item) => (
                <div key={item.id}>
                    {item.name}: {item.exercises}
                </div>
            ))}
            <div><strong>total of {total} exercises</strong></div>
        </div>
    );
}

export default Course;
