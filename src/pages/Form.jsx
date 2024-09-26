import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthData, setRoute } from "../redux/slices/AuthSlice";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import constants from "../constants/constants";
import phoneValidation from "../components/validations/phoneValidation";
import warningToastify from "../components/toastify/warningToastify";
import errorToastify from "../components/toastify/errorToastify";

export default function Form() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { route } = useParams();

  const { phoneFormats, phonePlaceholders } = constants();

  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    phonePrefix: "+998",
    phoneNumber: "",
  });

  const { formatPhoneNumber } = phoneValidation({
    formData: formData,
    phoneFormats: phoneFormats,
  });

  const containsNumber = (str) => {
    const regex = /\d/;
    return regex.test(str);
  };

  const validateForm = (e) => {
    e.preventDefault();
    const splitedName = formData.fullName.trim().split(" ");

    if (splitedName.length < 2) {
      return warningToastify("Введите полное Ф.И.О");
    }

    if (containsNumber(formData.fullName)) {
      return warningToastify("Имя не может содержать цифры");
    }

    if (formData.location.length < 25) {
      return warningToastify("Введите полный адрес проживания");
    }

    const phoneRegex = phoneFormats[formData.phonePrefix];
    const cleanedPhoneNumber = formData.phoneNumber.replace(/\s+/g, "");
    const expectedLength = String(phoneRegex)
      .match(/\d/g)
      .reduce((total, current) => total + parseInt(current), 0);

    if (cleanedPhoneNumber.length !== expectedLength) {
      return warningToastify("Введите номер телефона в правильном формате");
    }
    return handleSubmit(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/invoices`,
        {
          clientName: formData?.fullName,
          clientAddress: formData?.location,
          clientPhone: `${formData?.phonePrefix} ${formData?.phoneNumber}`,
        }
      );

      dispatch(setAuthData(response.data._id));
      dispatch(setRoute(route));
      navigate("/course-info");
    } catch (error) {
      errorToastify("Возникла ошибка при выполнении");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phonePrefix") {
      setFormData({ ...formData, phonePrefix: value, phoneNumber: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatPhoneNumber(value);
    setFormData({ ...formData, phoneNumber: formattedValue });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="w-full max-w-md bg-base-200 shadow-2xl rounded-lg overflow-hidden">
        <form onSubmit={validateForm} className="space-y-6 p-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium">
              ФИО
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="w-full px-4 py-3 bg-base-100 border-2 border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block transition duration-200 ease-in-out hover:border-blue-300"
              placeholder="Введите ФИО (Фамилия Имя Отчество)"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium">
              Адрес
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className="w-full px-4 py-3 bg-base-100 border-2 border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block transition duration-200 ease-in-out hover:border-blue-300"
              placeholder="Введите Адрес"
              required
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="flex">
            <div className="space-y-2">
              <label
                htmlFor="phonePrefix"
                className="block text-sm font-medium"
              >
                Код страны
              </label>
              <select
                id="phonePrefix"
                name="phonePrefix"
                className="w-full px-4 py-3 bg-base-100 border-2 border-gray-300 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block transition duration-200 ease-in-out hover:border-blue-300"
                value={formData.phonePrefix}
                onChange={handleChange}
              >
                {Object.keys(phoneFormats).map((prefix) => (
                  <option key={prefix} value={prefix}>
                    {prefix}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 flex-1">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium"
              >
                Номер телефона
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                className="w-full px-4 py-3 bg-base-100 border-2 border-gray-300  text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block transition duration-200 ease-in-out hover:border-blue-300"
                placeholder={phonePlaceholders[formData.phonePrefix]}
                required
                value={formData.phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-3 rounded-lg transition duration-200 ease-in-out"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-dots loading-md"></span>
            ) : (
              "Отправить"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
