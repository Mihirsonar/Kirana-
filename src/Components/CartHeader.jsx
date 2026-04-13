import React from "react";
import { Link } from "react-router-dom";
import { LiaCartPlusSolid } from "react-icons/lia";

const CartHeader = ({ currentStep }) => {
  const steps = ["Cart", "Address", "Payment"];

  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 dark:text-white">

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center text-xl font-bold tracking-tight"
        >
          Kirana
          <LiaCartPlusSolid className="ml-1 w-5 h-5" />
        </Link>

        {/* STEPPER */}
        <div className="flex items-center gap-4">

          {steps.map((step, index) => {
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;

            return (
              <div key={step} className="flex items-center">

                {/* STEP */}
                <div className="flex items-center gap-2">

                  {/* CIRCLE */}
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold transition ${
                      isCompleted
                        ? "bg-green-600 text-white"
                        : isActive
                        ? "bg-green-100 text-green-700 border border-green-500"
                        : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* LABEL */}
                  <span
                    className={`text-sm font-medium hidden sm:block ${
                      isActive
                        ? "text-green-600"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>

                {/* CONNECTOR LINE */}
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-12 h-[2px] mx-2 ${
                      index < currentIndex
                        ? "bg-green-600"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CartHeader;