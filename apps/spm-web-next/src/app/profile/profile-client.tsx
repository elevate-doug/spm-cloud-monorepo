"use client";

import Card from "@/components/card";
import type { Session } from "@/lib/auth/session";
import { useLaborStandard } from "@/hooks/useLaborStandard";

interface ProfileClientProps {
  session: Session;
}

// Helper to compute initials from display name
function getInitials(name: string | undefined | null): string {
  if (!name || name.length === 0) {
    return "?";
  }
  if (/\s/.test(name)) {
    return name
      .split(" ")
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
  }
  return name[0].toUpperCase();
}

export default function ProfileClient({ session }: ProfileClientProps) {
  const laborStandard = useLaborStandard();

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log("Edit profile clicked");
  };

  const initials = getInitials(session.displayName);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Card extra="w-full p-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: "96px",
                  height: "96px",
                  backgroundColor: "#D6E8F7",
                  fontSize: "2.5rem",
                }}
              >
                <span style={{ color: "#1E5FA8", fontWeight: 600 }}>
                  {initials}
                </span>
              </div>

              {/* User Name */}
              <h4 className="mt-4 text-xl font-bold text-navy-700 dark:text-white">
                {session.displayName ?? "Unknown User"}
              </h4>
            </div>

            {/* Account Details */}
            <div className="mt-8 w-full space-y-4">
              <DetailRow label="Email" value="user@hospital.com" />
              <DetailRow label="Department" value={session.locationName} />
              <DetailRow label="Organization" value={session.tenantName} />
              <DetailRow label="Role" value={session.assignmentName} />
              <DetailRow label="Shift" value={session.shiftName} />
              <DetailRow
                label="Accumulated Labor Standard"
                value={laborStandard.toFixed(1)}
                last
              />
            </div>

            {/* Edit Button */}
            <button
              onClick={handleEdit}
              className="mt-8 w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: "#2E78C9" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1E5FA8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#2E78C9")
              }
            >
              Edit Profile
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper component for detail rows
function DetailRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value?: string | null;
  last?: boolean;
}) {
  return (
    <div
      className={`flex justify-between py-3 ${!last ? "border-b border-gray-200 dark:border-navy-600" : ""}`}
    >
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-navy-700 dark:text-white">
        {value ?? "—"}
      </span>
    </div>
  );
}
