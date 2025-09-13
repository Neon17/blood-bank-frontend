// Circle Stepper for showing progress in Multi Step Form
"use client";

import { Check } from "lucide-react";

interface StepperProps {
    values: string[];
    completedStep: number; // counting from 0
}

const Stepper: React.FC<StepperProps> = ({ values, completedStep }) => {
    return (
        <div className="relative flex items-start justify-between w-full max-w-4xl mx-auto px-4">
            {/* Background line (full width) */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600" />

            {/* Progress line */}
            <div
                className="absolute top-5 left-0 h-0.5 bg-red-500 transition-all duration-300"
                style={{
                    width: `${(completedStep / (values.length - 1)) * 100}%`,
                }}
            />

            {values.map((label, index) => {
                const isCompleted = index < completedStep;
                const isActive = index === completedStep;

                return (
                    <div key={index} className="flex flex-col items-center z-10">
                        {/* Circle */}
                        <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                ${isCompleted
                                    ? "bg-red-500 border-red-500 text-white"
                                    : isActive
                                        ? "bg-red-500 border-red-500 text-white"
                                        : "bg-white border-gray-300 text-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                                }`}
                        >
                            {isCompleted ? (
                                <Check className="w-5 h-5 text-white" />
                            ) : (
                                <span className="font-medium">{index + 1}</span>
                            )}
                        </div>

                        {/* Label */}
                        <span
                            className="hidden md:block mt-2 text-sm text-center text-gray-700 dark:text-gray-300 whitespace-normal break-words max-w-[6rem] md:max-w-[10rem]leading-tight">
                            {label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default Stepper;
