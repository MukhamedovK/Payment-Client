import React from "react";

const ClickForm = ({ amount, merchant_trans_id, course_id, disabled }) => {
  const handlePayment = (event) => {
    event.preventDefault();

    if (disabled) return; // Prevent the function from executing if disabled

    const service_id = "37390";
    const merchant_id = "12110";
    const transaction_param = merchant_trans_id;
    const merchant_user_id = "46320";
    const return_url = "https://markaz.norbekovgroup.uz/course-info";
    const paymentUrl = `https://my.click.uz/services/pay/?service_id=${service_id}&merchant_id=${merchant_id}&merchant_user_id=${merchant_user_id}&transaction_param=${transaction_param}&amount=${amount}&additional_param3=${course_id}&return_url=${encodeURIComponent(
      return_url
    )}`;

    console.log(transaction_param, "aaaa");
    console.log(paymentUrl, "aabaa");
    window.location.href = paymentUrl;
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled} // Disable the button when disabled is true
      className={`flex items-center justify-center cursor-pointer space-x-2 p-4 w-48 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      <img src={`click.png`} className="h-6" alt={`Click Logo`} />
    </button>
  );
};

export default ClickForm;
