import type { ComponentProperties } from "../../../types/componentProperties";
import Banner from "./components/Banner";

const ProfileOverview: React.FC<ComponentProperties> = (props: ComponentProperties) => {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Header */}

      <div className="flex justify-center">
        <div className="w-full max-w-md">
            <Banner {...props} />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
