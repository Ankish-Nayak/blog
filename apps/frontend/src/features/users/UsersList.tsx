import { useGetUsersQuery } from "./usersSlice";
import { Link } from "react-router-dom";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("getUsers");

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    const renderedList = (
      <ol>
        {users.ids.map((id) => (
          <Link to={`/users/${users.entities[id]?.id}`}>
            <li key={id}>{users.entities[id]?.name}</li>
          </Link>
        ))}
      </ol>
    );
    content = (
      <section>
        <h2>Users</h2>
        {renderedList}
      </section>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }
  return content;
};

export default UsersList;
