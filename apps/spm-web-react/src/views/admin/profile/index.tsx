import { useProfile } from "../../../hooks/useProfile";
import ProfileTemplate from "../../../components/templates/ProfileTemplate";
import type { ComponentProperties } from "../../../types/componentProperties";

const ProfileOverview: React.FC<ComponentProperties> = (props: ComponentProperties) => {
    const { currentUser, laborStandard, handleEdit } = useProfile(props.setPageTitle);

    return (
        <ProfileTemplate
            currentUser={currentUser}
            laborStandard={laborStandard}
            onEdit={handleEdit}
        />
    );
};

export default ProfileOverview;
