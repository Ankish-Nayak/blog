import { useGetUsersQuery } from "./usersSlice";
import { Link } from "react-router-dom";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = (
      <ol>
        {users.ids.map((id) => (
          <Link to={`/users/${id}`}>
            <li key={id}>{users.entities[id]?.name}</li>
          </Link>
        ))}
      </ol>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }
  return <section>{content}</section>;
};

export default UsersList;
