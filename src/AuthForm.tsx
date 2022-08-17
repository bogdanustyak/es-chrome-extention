import { useState } from 'react';

export const AuthForm = () => {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setPassword(e.target.value);
  };

  const handleSubmit = (event: any) => {
    alert(event.target.value);
    // TODO make auth call here
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          name="name"
          value={userName}
          onChange={handleUserNameChange}
        />
      </label>
      <label>
        Password:
        <input
          type="text"
          name="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
};
