import React from "react";
import { Link } from "react-router-dom";
import { LiaCartPlusSolid } from "react-icons/lia";

const CartHeader = ({ currentStep }) => {
  const steps = ["Cart", "Address", "Payment"];

  return (
    <div className="w-full bg-white shadow-md py-3 px-8 md:px-12 flex items-center justify-between">
      {/* Left: Local+ Icon */}
      <Link to="/home" className="flex items-center text-2xl font-bold">
          Local <LiaCartPlusSolid className="ml-1 w-6 h-6" />
      </Link>

      {/* Center: Steps */}
      <div className="flex items-center justify-center gap-5 md:gap-6">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <span
              className={`text-sm md:text-lg font-semibold ${
                currentStep === step ? "text-purple-600" : "text-gray-400"
              }`}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <span className="mx-2 px-3 text-gray-400"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartHeader;
