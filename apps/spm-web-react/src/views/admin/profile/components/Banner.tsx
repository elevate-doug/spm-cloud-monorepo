import Card from "../../../../components/card";
import { userService } from "../../../../api/services/userService";
import type { ComponentProperties } from "../../../../types/componentProperties";
import { useEffect } from "react";
import { useLaborStandard } from "../../../../hooks/useLaborStandard";

const Banner: React.FC<ComponentProperties> = (props: ComponentProperties) => {
    const currentUser = userService.getCurrentUser();
    const laborStandard = useLaborStandard();

    useEffect(() => {
        props.setPageTitle(currentUser?.userName ?? '');
    }, [currentUser, props]);

    const handleEdit = () => {
        // TODO: Implement edit functionality
        console.log("Edit profile clicked");
    };

    return (
        <Card extra="items-center w-full h-full p-6">
            {/* Avatar */}
            <div className="flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-4xl dark:bg-brand-900/30">
                    <span className="text-brand-600 dark:text-brand-400">{currentUser?.initials}</span>
                </div>
            </div>

            {/* Name and position */}
            <div className="mt-4 flex flex-col items-center">
                <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                    {currentUser?.name}
                </h4>
            </div>

            {/* Account Information */}
            <div className="mt-6 w-full space-y-3">
                <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-navy-600">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                    <span className="text-sm font-medium text-navy-700 dark:text-white">
                        {currentUser?.email}
                    </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-navy-600">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Department</span>
                    <span className="text-sm font-medium text-navy-700 dark:text-white">
                        {currentUser?.location}
                    </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-navy-600">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Organization</span>
                    <span className="text-sm font-medium text-navy-700 dark:text-white">
                        {currentUser?.tenant}
                    </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-navy-600">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
                    <span className="text-sm font-medium text-navy-700 dark:text-white">
                        {currentUser?.assignment}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Shift</span>
                    <span className="text-sm font-medium text-navy-700 dark:text-white">
                        {currentUser?.shift}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Assignment</span>
                    <span className="text-sm font-medium text-navy-700 dark:text-white">
                        {currentUser?.location}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Accumulated Labor Standard</span>
                    <span className="text-sm font-medium text-navy-700 dark:text-white">
                        {laborStandard.toFixed(1)}
                    </span>
                </div>
            </div>

            {/* Edit Button */}
            <button
                onClick={handleEdit}
                className="mt-6 w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200">
                Edit Profile
            </button>
        </Card>
    );
};

export default Banner;
