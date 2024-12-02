import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SayingSchema } from '@shared/schemas'; // From shared
import { createSaying } from '../api/sayings';
import { useNavigate } from 'react-router-dom';
import { SayingCreate } from '@shared/types';

export const CreateSaying = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SayingCreate>({
    resolver: zodResolver(SayingSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: SayingCreate) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }
      await createSaying(token, data);
      navigate('/');
    } catch (error) {
      console.error('Failed to create saying', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-xl font-bold mb-6">Create Saying</h2>
        <div className="mb-4">
          <label
            htmlFor="text"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Text
          </label>
          <input
            id="text"
            {...register('text')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text.message}</p>}
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <input
            id="description"
            {...register('description')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
