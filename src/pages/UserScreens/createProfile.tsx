import React from "react";

import ProfileCreation from "../../components/User/myProfile";

const CreateProfile = ({ route }: { route: any }) => {
  return (
    // <DatingScreenLayout>
    <ProfileCreation route={route} />
    // </DatingScreenLayout>
  );
};

export default CreateProfile;
