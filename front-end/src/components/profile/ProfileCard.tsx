import { Calendar, Mail, User as UserIcon } from "lucide-react";
import type { User } from "../../types";
import { formatActivityDate, getInitials } from "../../utils/format";

interface ProfileCardProps {
  user: User;
  projectCount: number;
}

export default function ProfileCard({ user, projectCount }: ProfileCardProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-surface-card p-6 md:p-8">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent/20 text-2xl font-bold text-accent">
          {getInitials(user.full_name)}
        </div>

        <div className="mt-4 flex-1 sm:mt-0">
          <h2 className="text-xl font-bold text-white">{user.full_name}</h2>
          <p className="mt-1 text-sm text-gray-400">SkillSphere member</p>

          <dl className="mt-5 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 shrink-0 text-gray-500" />
              <dt className="sr-only">Email</dt>
              <dd className="text-gray-300">{user.email}</dd>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <UserIcon className="h-4 w-4 shrink-0 text-gray-500" />
              <dt className="sr-only">User ID</dt>
              <dd className="text-gray-300">ID #{user.id}</dd>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 shrink-0 text-gray-500" />
              <dt className="sr-only">Member since</dt>
              <dd className="text-gray-300">
                Member since {formatActivityDate(user.created_at)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-800 pt-6 sm:grid-cols-3">
        <div className="rounded-lg bg-surface-elevated px-4 py-3 text-center">
          <p className="text-2xl font-bold text-white">{projectCount}</p>
          <p className="text-xs text-gray-400">Projects uploaded</p>
        </div>
        <div className="rounded-lg bg-surface-elevated px-4 py-3 text-center">
          <p className="text-2xl font-bold text-white">{user.id}</p>
          <p className="text-xs text-gray-400">Account ID</p>
        </div>
        <div className="col-span-2 rounded-lg bg-surface-elevated px-4 py-3 text-center sm:col-span-1">
          <p className="truncate text-sm font-medium text-accent">
            {user.email.split("@")[0]}
          </p>
          <p className="text-xs text-gray-400">Username</p>
        </div>
      </div>
    </div>
  );
}
