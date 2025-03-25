import { Link, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";

const UsersList = ({ users }) => (
    <div>
        <h2> Users </h2>
        <Table striped>
            <thead>
                <tr>
                    <th></th>
                    <th>Blogs created</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>
                            <Link to={`/users/${user.id}`}>
                                {user.username}
                            </Link>
                        </td>
                        <td>{user.blogs?.length || 0}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </div>
);

export const User = ({ users }) => {
    const id = useParams().id;
    const user = users.find((n) => n.id === id);
    console.log(users);

    if (!user) return null;

    return (
        <div>
            <h2>{user.username}</h2>
            <h3>Blogs created: </h3>
            <ul>
                {" "}
                {user.blogs.map((blog) => (
                    <li key={blog.id}>{blog.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default UsersList;
