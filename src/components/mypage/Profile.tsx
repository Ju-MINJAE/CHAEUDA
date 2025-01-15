'use client';

import EditProfile from './EditProfile';
import ViewProfile from './ViewProfile';

import { useState } from 'react';

const MyPage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggle = () => {
    setIsEditing(!isEditing);
  };

  return <>{isEditing ? <EditProfile /> : <ViewProfile handleToggle={handleToggle} />}</>;
};

export default MyPage;
