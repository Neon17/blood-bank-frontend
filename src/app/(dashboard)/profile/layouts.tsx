// layouts.tsx
import { ReactNode } from 'react';

interface ProfileLayoutProps {
  children: ReactNode;
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  return (
    <div className="w-full h-full">
      <div className="max-w-sm mx-auto w-full flex flex-col gap-8 bg-white p-4 rounded-md">
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
