import React from 'react';
import { MdOutlinePowerSettingsNew } from 'react-icons/md';
import { useAppDispatch } from '../app/hooks';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from '../utils/firebaseConfig';
import { setUserStatus } from '../app/slices/AppSlice';

function Footer() {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth); // Cierra la sesión del usuario en Firebase
      dispatch(setUserStatus(undefined)); // Limpia el estado del usuario en la aplicación
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <footer>
      <div className="block"></div>
      <div className="data"></div>
      <div className="block">
        <MdOutlinePowerSettingsNew
          className="logout-icon"
          onClick={handleLogout} 
        />
      </div>
    </footer>
  );
}

export default Footer;
