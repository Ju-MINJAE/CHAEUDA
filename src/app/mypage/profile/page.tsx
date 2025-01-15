'use client';

import ViewProfile from '../viewProfile/page';
import EditProfile from '../editProfile/page';
import { useState } from 'react';

const MyPage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <>
      {isEditing ? (
        <EditProfile handleToggle={handleToggle} />
      ) : (
        <ViewProfile handleToggle={handleToggle} />
      )}
    </>
  );
};

export default MyPage;
