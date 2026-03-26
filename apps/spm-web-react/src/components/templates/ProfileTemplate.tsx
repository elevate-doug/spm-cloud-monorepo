import { Button } from "@steris-spm/lingo";
import Card from "../card";
import type { ProfileUser } from "../../hooks/useProfile";

export interface ProfileTemplateProps {
    currentUser: ProfileUser | null;
    laborStandard: number;
    onEdit: () => void;
}

interface InfoRowProps {
    label: string;
    value: string | undefined;
    showBorder?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, showBorder = true }) => (
    <div className={`flex justify-between ${showBorder ? "border-b border-gray-100 pb-3 dark:border-navy-600" : ""}`}>
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-sm font-medium text-navy-700 dark:text-white">{value}</span>
    </div>
);

const ProfileTemplate: React.FC<ProfileTemplateProps> = ({
    currentUser,
    laborStandard,
    onEdit,
}) => {
    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex justify-center">
                <div className="w-full max-w-md">
                    <Card extra="items-center w-full h-full p-6">
                        {/* Avatar */}
                        <div className="flex justify-center">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-4xl dark:bg-brand-900/30">
                                <span className="text-brand-600 dark:text-brand-400">
                                    {currentUser?.initials}
                                </span>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="mt-4 flex flex-col items-center">
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                                {currentUser?.name}
                            </h4>
                        </div>

                        {/* Account Information */}
                        <div className="mt-6 w-full space-y-3">
                            <InfoRow label="Email" value={currentUser?.email} />
                            <InfoRow label="Department" value={currentUser?.location} />
                            <InfoRow label="Organization" value={currentUser?.tenant} />
                            <InfoRow label="Role" value={currentUser?.assignment} />
                            <InfoRow label="Shift" value={currentUser?.shift} showBorder={false} />
                            <InfoRow label="Assignment" value={currentUser?.location} showBorder={false} />
                            <InfoRow
                                label="Accumulated Labor Standard"
                                value={laborStandard.toFixed(1)}
                                showBorder={false}
                            />
                        </div>

                        {/* Edit Button */}
                        <div className="mt-6 w-full">
                            <Button
                                mode="contained"
                                onPress={onEdit}
                                customStyle={{ width: "100%" }}
                            >
                                Edit Profile
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfileTemplate;
